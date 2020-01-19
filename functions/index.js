const functions = require("firebase-functions");
const admin = require("firebase-admin");
const os = require("os");
const path = require("path");
const fs = require("fs");
// const spawn = require("child-process-promise").spawn;
const { Storage } = require("@google-cloud/storage");
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

// exports.generateMonoAudio = functions.storage
//   .object()
//   .onFinalize(async object => {
//     const fileBucket = object.bucket; // The Storage bucket that contains the file.
//     const filePath = object.name; // File path in the bucket.
//     const contentType = object.contentType; // File content type.

//     // Exit if this is triggered on a file that is not an audio.
//     if (!contentType.startsWith("video/")) {
//       console.log("This is not a video.");
//       return null;
//     }

//     // Get the file name.
//     const fileName = path.basename(filePath);
//     // Exit if the audio is already converted.
//     if (fileName.endsWith("_output.mp4")) {
//       console.log("Already a converted video.");
//       return null;
//     }

//     // Download file from bucket.
//     const gcs = new Storage();
//     const bucket = gcs.bucket(fileBucket);
//     const tempFilePath = path.join(os.tmpdir(), fileName);
//     // We add a '_output.flac' suffix to target audio file name. That's where we'll upload the converted audio.
//     const targetTempFileName =
//       fileName.replace(/\.[^/.]+$/, "") + "_output.mp4";
//     const targetTempFilePath = path.join(os.tmpdir(), targetTempFileName);
//     const targetStorageFilePath = path.join(
//       path.dirname(filePath),
//       targetTempFileName
//     );

//     await bucket.file(filePath).download({ destination: tempFilePath });
//     console.log("Audio downloaded locally to", tempFilePath);
//     // Convert the audio to mono channel using FFMPEG.

//     let command = ffmpeg(tempFilePath)
//       .setFfmpegPath(ffmpeg_static)
//       .videoCodec("libx264")
//       .noAudio()
//       .size("320x240")
//       .format("mp4")
//       .output(targetTempFilePath);

//     await promisifyCommand(command);
//     console.log("Output audio created at", targetTempFilePath);
//     // Uploading the audio.
//     await bucket.upload(targetTempFilePath, {
//       destination: targetStorageFilePath
//     });
//     console.log("Output audio uploaded to", targetStorageFilePath);

//     // Once the audio has been uploaded delete the local file to free up disk space.
//     fs.unlinkSync(tempFilePath);
//     fs.unlinkSync(targetTempFilePath);

//     return console.log("Temporary files removed.", targetTempFilePath);
//   });
