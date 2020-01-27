const functions = require("firebase-functions");
const admin = require("firebase-admin");
const os = require("os");
const path = require("path");
const fs = require("fs");
// const spawn = require("child-process-promise").spawn;
const { Storage } = require("@google-cloud/storage");
const { CloudTasksClient } = require("@google-cloud/tasks");
const uuidv4 = require("uuid/v4");
const sharp = require("sharp");
const ffmpeg = require("fluent-ffmpeg");
const ffmpeg_static = require("ffmpeg-static");
const serviceAccount = require("./react-redux-firebase-fir-2fc76-firebase-adminsdk-rbbm3-ee479e30b4.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://react-redux-firebase-fir-2fc76.firebaseio.com",
  storageBucket: "react-redux-firebase-fir-2fc76.appspot.com"
});
const fbId = "react-redux-firebase-fir-2fc76";
const gcs = new Storage();
const firestore = admin.firestore();

const runtimeOpts = {
  timeoutSeconds: 540,
  memory: "2GB"
};

// Makes an ffmpeg command return a promise.
const promisifyCommand = command => {
  return new Promise((resolve, reject) => {
    command
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
};

// exports.onFileUpload = functions.storage.object().onFinalize(async object => {
//   const bucket = object.bucket;
//   const contentType = object.contentType;
//   const filePath = object.name;
//   const fileName = path.basename(filePath);
//   const uuid = fileName.slice(fileName.length - 38, fileName.length);
//   const destBucket = gcs.bucket(bucket);
//   const tmpFilePath = path.join(os.tmpdir(), fileName);
//   const newTmpFilePath = path.join(os.tmpdir(), "converted@" + fileName);
//   let convertedFileMetadata = {};
//   const convertedFileName = path.basename(newTmpFilePath);
//   const convertedFilePath = path.join(
//     path.dirname(filePath),
//     convertedFileName
//   );

//   if (fileName.includes("converted@")) {
//     console.log("File already converted");
//     return null;
//   }

//   await destBucket.file(filePath).download({
//     destination: tmpFilePath
//   });

//   if (contentType.includes("video")) {
//     convertedFileMetadata = {
//       contentType: "video/mp4",
//       metadata: {
//         firebaseStorageDownloadTokens: uuid
//       }
//     };

//     const command = ffmpeg(tmpFilePath)
//       .setFfmpegPath(ffmpeg_static)
//       .videoCodec("libx264")
//       //.noAudio()
//       .audioCodec("libmp3lame")
//       //  .size("640x360")
//       .size("320x240")
//       // .videoBitrate("1024k")
//       //  .audioBitrate("128k")
//       //.fps(30)
//       .format("mp4")
//       .output(newTmpFilePath);

//     await promisifyCommand(command);
//   } else if (contentType.includes("image")) {
//     const imageWidth = fileName.includes("avatar") ? 200 : 1500;
//     const imageHeight = fileName.includes("avatar") ? 200 : 1500;
//     convertedFileMetadata = {
//       contentType: "image/webp",
//       metadata: {
//         firebaseStorageDownloadTokens: uuid
//       }
//     };

//     await sharp(tmpFilePath)
//       .webp()
//       .resize({
//         width: imageWidth,
//         height: imageHeight,
//         fit: "inside"
//       })
//       .toFile(newTmpFilePath);
//   }

//   await destBucket.upload(newTmpFilePath, {
//     gzip: true,
//     destination: convertedFilePath,
//     metadata: convertedFileMetadata
//   });

//   await destBucket.file(filePath).delete();

//   fs.unlinkSync(tmpFilePath);
//   fs.unlinkSync(newTmpFilePath);
// });

exports.uploadFile = functions
  .runWith(runtimeOpts)
  .https.onCall(async (data, context) => {
    const { directory, fileName, oldFileName } = data;
    const bucket = gcs.bucket(`${fbId}.appspot.com`);
    const uuid = uuidv4();

    const tmpFilePath = path.join(os.tmpdir(), fileName);
    const newTmpFilePath = path.join(os.tmpdir(), "converted@" + fileName);
    let posterTmpFilePath = path.join(
      os.tmpdir(),
      "poster@" + fileName + ".webp"
    );

    const inputFilePath = directory + "/" + fileName;
    const convertedFileName = path.basename(newTmpFilePath);
    const convertedFilePath = path.join(directory, convertedFileName);
    const posterFileName = "poster@" + fileName + ".webp";
    const posterFilePath = path.join(directory, posterFileName);
    const fileMetadata = await bucket.file(inputFilePath).getMetadata();

    let convertedFileMetadata = {};
    let posterUrl = "";
    let convertedUrl = "";

    try {
      if (oldFileName !== "") {
        const oldFileNamePath = `${directory}/${oldFileName}`;
        await bucket.file(oldFileNamePath).delete();
        if (fileMetadata[0].contentType.includes("video")) {
          const oldPosterPath = `${directory}/${oldFileName.replace(
            "converted@",
            "poster@"
          ) + ".webp"}`;
          await bucket.file(oldPosterPath).delete();
        }
      }

      await bucket.file(inputFilePath).download({
        destination: tmpFilePath
      });

      if (fileMetadata[0].contentType.includes("video")) {
        convertedFileMetadata = {
          contentType: "video/mp4",
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        };

        const videoCommand = ffmpeg(tmpFilePath)
          .setFfmpegPath(ffmpeg_static)
          .size("?x240")
          .audioChannels(1)
          .audioFrequency(16000)
          .videoCodec("libx264")
          .audioCodec("libmp3lame")
          .videoBitrate(512)
          .audioBitrate(64)
          .fps(29.7)
          .format("mp4")
          .output(newTmpFilePath);

        await promisifyCommand(videoCommand);

        try {
          const posterCommand = ffmpeg(tmpFilePath)
            .setFfmpegPath(ffmpeg_static)
            .seekInput(0)
            .size("?x240")
            .frames(1)
            .output(posterTmpFilePath);

          await promisifyCommand(posterCommand);
        } catch (error) {
          fs.unlinkSync(newTmpFilePath);
          throw new Error(error.message);
        }

        try {
          await bucket.upload(posterTmpFilePath, {
            resumable: false,
            gzip: true,
            destination: posterFilePath,
            metadata: {
              contentType: "image/webp",
              metadata: {
                firebaseStorageDownloadTokens: uuid
              }
            }
          });

          posterUrl =
            "https://firebasestorage.googleapis.com/v0/b/" +
            bucket.name +
            "/o/" +
            encodeURIComponent(posterFilePath) +
            "?alt=media&token=" +
            uuid;
        } catch (error) {
          fs.unlinkSync(posterTmpFilePath);
          throw new Error(error.message);
        }
      } else if (fileMetadata[0].contentType.includes("image")) {
        const imageWidth = fileName.includes("avatar") ? 200 : 1500;
        const imageHeight = fileName.includes("avatar") ? 200 : 1500;
        convertedFileMetadata = {
          contentType: "image/webp",
          metadata: {
            firebaseStorageDownloadTokens: uuid
          }
        };

        await sharp(tmpFilePath)
          .webp()
          .resize({
            width: imageWidth,
            height: imageHeight,
            fit: "inside"
          })
          .toFile(newTmpFilePath);
      }

      try {
        await bucket.upload(newTmpFilePath, {
          resumable: false,
          gzip: true,
          destination: convertedFilePath,
          metadata: convertedFileMetadata
        });

        convertedUrl =
          "https://firebasestorage.googleapis.com/v0/b/" +
          bucket.name +
          "/o/" +
          encodeURIComponent(convertedFilePath) +
          "?alt=media&token=" +
          uuid;
      } catch (error) {
        if (fileMetadata[0].contentType.includes("video")) {
          await bucket.file(posterFilePath).delete();
          fs.unlinkSync(posterTmpFilePath);
        }
        fs.unlinkSync(newTmpFilePath);
        throw new Error(error.message);
      }

      await bucket.file(inputFilePath).delete();

      fs.unlinkSync(tmpFilePath);
      fs.unlinkSync(newTmpFilePath);
      if (fileMetadata[0].contentType.includes("video")) {
        fs.unlinkSync(posterTmpFilePath);
      }

      return Promise.resolve({ convertedUrl, posterUrl });
    } catch (error) {
      await bucket.file(inputFilePath).delete();
      fs.unlinkSync(tmpFilePath);
      return Promise.resolve({ convertedUrl: "", posterUrl: "" });
    }
  });

exports.onCreateInstance = functions.firestore
  .document("challengesInstances/{instance}")
  .onCreate(async (snapshot, context) => {
    // first we get the expiring date
    const snapshotData = snapshot.data();
    const { administrator, contenders } = snapshotData;
    const administratorContender = contenders.find(
      contender => contender.id === administrator
    );
    const { expiresAt } = administratorContender;
    // we need the expiration expressed in epoch seconds, js internally stores dates as epoch ms so we / 1000
    const expiresAtInSeconds = expiresAt.toDate().getTime() / 1000;

    // now we config the task queue
    const project = "react-redux-firebase-fir-2fc76";
    const functionLocation = "us-central1";
    const taskLocation = "europe-west1";
    const queue = "cancelifexpired";
    // we create the new instance of the task
    const taskClient = new CloudTasksClient();
    const queuePath = taskClient.queuePath(project, taskLocation, queue);
    // we need the url of the callback function to execute when the task is triggered
    const url = `https://${functionLocation}-${project}.cloudfunctions.net/cancelIfExpired`;
    // we generate the payload we are sending to the callback function
    const instancePath = snapshot.ref.path;
    const userId = administrator;
    const payload = { instancePath, userId };
    // we build up the configuration for the cloud task
    const task = {
      httpRequest: {
        httpMethod: "POST",
        url,
        body: Buffer.from(JSON.stringify(payload)).toString("base64"),
        headers: {
          "Content-Type": "application/json"
        }
      },
      scheduleTime: {
        seconds: expiresAtInSeconds
      }
    };
    // we enqueue the task in the queue I created earlier
    // we get the task id from the response that returns the createtask, inside the name property
    const [response] = await taskClient.createTask({ parent: queuePath, task });
    const expirationTask = response.name;

    // we create the new contenders property to update it in the challenge instance
    const newContenders = contenders.map(contender =>
      contender.id === administrator
        ? { ...contender, expirationTask }
        : contender
    );
    await snapshot.ref.update({ contenders: newContenders });
  });

exports.createTask = functions.https.onCall(async (data, context) => {
  const { instanceId, userId } = data;
  const instanceRef = firestore.doc(`challengesInstances/${instanceId}`);
  const instanceSnapshot = await instanceRef.get();
  const instanceData = instanceSnapshot.data();
  const { contenders } = instanceData;
  const userContender = contenders.find(contender => contender.id === userId);
  const { expiresAt } = userContender;
  const expiresAtInSeconds = expiresAt.toDate().getTime() / 1000;

  const project = "react-redux-firebase-fir-2fc76";
  const functionLocation = "us-central1";
  const taskLocation = "europe-west1";
  const queue = "cancelifexpired";
  const taskClient = new CloudTasksClient();
  const queuePath = taskClient.queuePath(project, taskLocation, queue);
  const url = `https://${functionLocation}-${project}.cloudfunctions.net/cancelIfExpired`;
  const instancePath = `challengesInstances/${instanceId}`;
  const payload = { instancePath, userId };

  const task = {
    httpRequest: {
      httpMethod: "POST",
      url,
      body: Buffer.from(JSON.stringify(payload)).toString("base64"),
      headers: {
        "Content-Type": "application/json"
      }
    },
    scheduleTime: {
      seconds: expiresAtInSeconds
    }
  };

  const [response] = await taskClient.createTask({ parent: queuePath, task });
  const expirationTask = response.name;
  const newContenders = contenders.map(contender =>
    contender.id === userId ? { ...contender, expirationTask } : contender
  );
  await instanceRef.update({ contenders: newContenders });
});

exports.removeTask = functions.https.onCall(async (data, context) => {
  const { instanceId, userId } = data;
  const instanceRef = firestore.doc(`challengesInstances/${instanceId}`);
  const instanceSnapshot = await instanceRef.get();
  const instanceData = instanceSnapshot.data();
  const { contenders } = instanceData;
  const userContender = contenders.find(contender => contender.id === userId);
  const { expirationTask } = userContender;
  const newUserContender = userContender;
  delete newUserContender["expirationTask"];
  const newContenders = contenders.map(contender =>
    contender.id === userId ? newUserContender : contender
  );
  const tasksClient = new CloudTasksClient();
  await tasksClient.deleteTask({ name: expirationTask });
  await instanceRef.update({
    contenders: newContenders
  });
});

exports.cancelIfExpired = functions.https.onRequest(async (req, res) => {
  const payload = req.body;
  const { instancePath, userId } = payload;
  try {
    const userSnapshot = await firestore.doc(instancePath).get();
    const userData = userSnapshot.data();
    const { contenders } = userData;
    const userContender = contenders.find(contender => contender.id === userId);
    let newUserContender = {};
    if (userContender.proof.state === "Pending") {
      const newExpiresAt = new Date();
      newExpiresAt.setDate(newExpiresAt.getDate() + 1);
      const newExpiresAtInSeconds = newExpiresAt.getTime() / 1000;

      const project = "react-redux-firebase-fir-2fc76";
      const functionLocation = "us-central1";
      const taskLocation = "europe-west1";
      const queue = "cancelifexpired";
      const taskClient = new CloudTasksClient();
      const queuePath = taskClient.queuePath(project, taskLocation, queue);
      const url = `https://${functionLocation}-${project}.cloudfunctions.net/cancelIfExpired`;
      const payload = { instancePath, userId };

      const task = {
        httpRequest: {
          httpMethod: "POST",
          url,
          body: Buffer.from(JSON.stringify(payload)).toString("base64"),
          headers: {
            "Content-Type": "application/json"
          }
        },
        scheduleTime: {
          seconds: newExpiresAtInSeconds
        }
      };

      const [response] = await taskClient.createTask({
        parent: queuePath,
        task
      });
      const expirationTask = response.name;

      newUserContender = {
        ...userContender,
        expirationTask,
        expiresAt: newExpiresAt
      };
    } else if (
      userContender.status !== "Cancelled" &&
      userContender.status !== "Completed"
    ) {
      newUserContender = {
        ...userContender,
        status: "Cancelled",
        proof: {
          ...userContender.proof,
          state: "Cancelled"
        }
      };
    }

    const newContenders = contenders.map(contender =>
      contender.id === userId ? newUserContender : contender
    );

    await firestore.doc(instancePath).update({ contenders: newContenders });
    res.send(200);
  } catch (error) {
    console.log("Error", error);
    res.status(500).send(error);
  }
});
