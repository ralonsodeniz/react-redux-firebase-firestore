import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

import { createRandomId, assignNewIdToItem } from "../utils/utils";

// firebase config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
};

let redirectUrl = "";
if (process.env.NODE_ENV === "development") {
  redirectUrl = process.env.REACT_APP_LOCALHOST;
} else {
  redirectUrl = process.env.REACT_APP_DEPLOY_URL;
}

export const actionCodeSettings = {
  url: redirectUrl
};

// firebase util functions
export const checkUserProfileDocumentInFS = async (user, additionalData) => {
  if (!user) throw new Error("Credentials not provided");
  const userRef = firestore.doc(`users/${user.uid}`);
  try {
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      const { displayName, email, photoURL, providerData, uid } = user;
      const createdAt = new Date();
      const providerId = providerData[0].providerId;
      const challengesInstances = {
        ability: [],
        foodie: []
      };
      const statics = {
        ability: 0,
        foodie: 0,
        globalRanking: 0
      };
      const friends = {
        accepted: [],
        pending: []
      };
      const instancesToValidate = [];
      try {
        await userRef.set({
          displayName,
          email,
          photoURL: photoURL ? photoURL : "",
          providerId,
          uid,
          createdAt,
          gender: additionalData ? additionalData.gender : "",
          age: additionalData ? parseInt(additionalData.age) : 0,
          country: additionalData ? additionalData.country : "",
          challengesInstances,
          statics,
          friends,
          instancesToValidate
        });
      } catch (error) {
        console.log("error while checking user", error);
        throw new Error("Ooops something happened while creating the user");
      }
    }
  } catch (error) {
    console.log("error checking user", error);
    throw new Error("Ooops something happened while checking the user");
  }
  return userRef;
};

// not needed replaced by state.firebase. auth and profile
// export const getCurrentUserFromAuth = () => {
//   try {
//     return new Promise((resolve, reject) => {
//       const unsubscribe = auth.onAuthStateChanged(user => {
//         unsubscribe();
//         resolve(user);
//       }, reject);
//     });
//   } catch (error) {
//     console.log("error checking if there is an user authenticated", error);
//     throw new Error("Ooops something happened while checking users");
//   }
// };

export const uploadFileToStorage = (
  directory,
  fileName,
  file,
  setProgress,
  setLoading,
  setFile,
  urlAction,
  additionalAction
) => {
  try {
    const storageRef = storage.ref(`${directory}`); // we create the storage reference object seting the name of the folder where we want to save our
    const documentFile = storageRef.child(`${fileName}`); // we create the file
    const uploadTask = documentFile.put(file); // we create a task (function) to upload the image to the file. it returns an object that can be used to monitor and manage the upload (an observable)
    const unsubscribe = uploadTask.on("state_changed", {
      // we start an observable that has one event listener, on state_changed of the task and 3 functions, one while it is in progress, one when an error happens and the last when the upload is finished
      next: snapshot => {
        // this is if we want to present a progress bar
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percent);
        setLoading(true);
      },
      error: error => {
        console.log(error);
        unsubscribe(); // we close the observable connection once there is an error or the upload is finished
      },
      complete: async () => {
        await documentFile.getDownloadURL().then(url => urlAction(url));
        if (additionalAction) additionalAction();
        setLoading(false);
        setFile(null);
        unsubscribe();
      }
    });
  } catch (error) {
    throw new Error("Ooops error while uploading your file");
  }
};

export const updateAvatarInFS = async url => {
  const userId = auth.currentUser.uid;
  try {
    const userRef = firestore.doc(`users/${userId}`);
    await userRef.update({ photoURL: url });
  } catch (error) {
    console.log("error updating avatar url", error);
    throw new Error("Ooops something happened while updating your avatar");
  }
};

export const addNewChallengeTemplateInFs = async challengeData => {
  const { category } = challengeData;
  try {
    const challengesTemplatesCategoryRef = firestore.doc(
      `challengesTemplates/${category}`
    );
    const challengesTemplatesCategorySnapshot = await challengesTemplatesCategoryRef.get();
    const challengesTemplatesCategorySnapshotData = challengesTemplatesCategorySnapshot.data();
    const id = assignNewIdToItem(
      challengesTemplatesCategorySnapshotData,
      createRandomId,
      28
    );
    // set second argument is setOptions. merge:true option allows us to add new keys to the challenge category document without overwriting the previous without having to use .update()
    // we want to use set because we need to create the category document if it does not exists
    await challengesTemplatesCategoryRef.set(
      {
        [id]: {
          ...challengeData,
          challengeTemplateId: id,
          approved: false,
          ranking: [],
          rating: 0,
          timesCompleted: 0,
          difficulty: "",
          daysToComplete: ""
        }
      },
      { merge: true }
    );
  } catch (error) {
    console.log("Error while adding new challenge");
    throw new Error("Ooops something happened while adding the challenge");
  }
};

export const addNewChallengeInstanceInFs = async (
  challengeData,
  instanceData,
  userProfileDisplayName,
  userProfileId
) => {
  try {
    const challengeInstanceRef = firestore
      .collection("challengesInstances")
      .doc();
    const challengeInstanceRefId = challengeInstanceRef.id;
    const administrator = { userProfileDisplayName, userProfileId };
    const { contenders, validators } = instanceData;
    const defaultContenderProps = {
      proof: {
        url: "",
        dateUploaded: null,
        state: "No proof provided"
      },
      rating: 0,
      public: false,
      expiresAt: null
    };
    let enhancedContenders = contenders.map(contender => ({
      ...contender,
      status: "Pending",
      ...defaultContenderProps
    }));
    enhancedContenders.push({
      id: userProfileId,
      name: userProfileDisplayName,
      status: "Accepted",
      ...defaultContenderProps
    });
    const comments = [];
    const likes = 0;
    const { category, challengeTemplateId } = challengeData;
    await challengeInstanceRef.set({
      challengeInstanceId: challengeInstanceRefId,
      challengeTemplateId,
      administrator,
      contenders: enhancedContenders,
      validators,
      comments,
      likes
    });

    enhancedContenders.forEach(async contender => {
      const { id } = contender;
      const contenderUserRef = firestore.doc(`users/${id}`);
      const contenderUserSnapshot = await contenderUserRef.get();
      const challengesInstancesCategoriesData = contenderUserSnapshot.data();
      const challengesInstancesCategoryData =
        challengesInstancesCategoriesData.challengesInstances[category];

      if (!challengesInstancesCategoryData) {
        await contenderUserRef.set(
          {
            challengesInstances: {
              [category]: [challengeInstanceRefId]
            }
          },
          { merge: true }
        );
      } else {
        await contenderUserRef.set(
          {
            challengesInstances: {
              [category]: [
                ...challengesInstancesCategoryData,
                challengeInstanceRefId
              ]
            }
          },
          { merge: true }
        );
      }
    });

    // we use this if we want to have a separate array for pending to accept challenges from the accepted ones
    // const authorUserRef = firestore.doc(`users/${userProfileId}`);
    // const authorUserSnapshot = await authorUserRef.get();
    // const challengesInstancesCategoryData = authorUserSnapshot.data()
    //   .challengesInstances[category];
    // await authorUserRef.set(
    //   {
    //     challengesInstances: {
    //       [category]: [
    //         ...challengesInstancesCategoryData,
    //         challengeInstanceRefId
    //       ]
    //     }
    //   },
    //   { merge: true }
    // );
    // if (contenders !== []) {
    //   contenders.map(async contender => {
    //     const { id } = contender;
    //     const contenderUserRef = firestore.doc(`users/${id}`);
    //     const contendersUserSnapshot = await contenderUserRef.get();
    //     const {
    //       pendingChallengeInstancesInvites
    //     } = contendersUserSnapshot.data();
    //     await contenderUserRef.update({
    //       pendingChallengeInstancesInvites: [
    //         ...pendingChallengeInstancesInvites,
    //         challengeInstanceRefId
    //       ]
    //     });
    //   });
    // }

    if (validators !== []) {
      validators.forEach(async validator => {
        const { id } = validator;
        const validatorUserRef = firestore.doc(`users/${id}`);
        const validatorUserSnapshot = await validatorUserRef.get();
        const instancesToValidateData = validatorUserSnapshot.data()
          .instancesToValidate;
        await validatorUserRef.set(
          {
            instancesToValidate: [
              ...instancesToValidateData,
              challengeInstanceRefId
            ]
          },
          { merge: true }
        );
      });
    }
  } catch (error) {
    console.log("Error while adding new challenge instance");
    throw new Error(
      "Ooops something happened while creating the new challenge instance"
    );
  }
};

// firebase init
firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
firebase.auth();
export const firestore = firebase.firestore();
firebase.firestore();
export const storage = firebase.storage();
firebase.storage();

// google auth config
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: "select_account" });

export default firebase;
