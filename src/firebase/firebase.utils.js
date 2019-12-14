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
      let challengesInstances = {};
      let statistics = {};

      const challengesTemplatesSnapshot = await firestore
        .collection(`challengesTemplates`)
        .get();

      challengesTemplatesSnapshot.docs.forEach(category => {
        challengesInstances[category.id] = [];
        statistics[category.id] = 0;
      });

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
          statistics,
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
    console.log("Error while uploading your file", error);
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
    console.log("Error while adding new challenge", error);
    throw new Error("Ooops something happened while adding the challenge");
  }
};

export const addNewChallengeInstanceInFs = async (
  challengeData,
  instanceData,
  userProfileId
) => {
  try {
    const challengeInstanceRef = firestore
      .collection("challengesInstances")
      .doc();
    const challengeInstanceRefId = challengeInstanceRef.id;
    const administrator = userProfileId;
    const { contenders, validators } = instanceData;
    const comments = [];
    const likes = 0;
    const { category, challengeTemplateId, daysToComplete } = challengeData;
    const defaultContenderProps = {
      proof: {
        url: "",
        dateUploaded: null,
        state: "No proof provided"
      },
      rating: 0,
      public: false
    };
    let enhancedContenders = contenders.map(contender => ({
      id: contender,
      status: "Pending",
      expiresAt: null,
      ...defaultContenderProps
    }));
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(daysToComplete));
    enhancedContenders.push({
      id: userProfileId,
      status: "Accepted",
      expiresAt,
      ...defaultContenderProps
    });
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
        const validatorUserRef = firestore.doc(`users/${validator}`);
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
    console.log("Error while adding new challenge instance", error);
    throw new Error(
      "Ooops something happened while creating the new challenge instance"
    );
  }
};

export const acceptInstanceInFs = async (
  userProfileId,
  instanceId,
  daysToComplete
) => {
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const contenders = challengeInstanceSnapshot.data().contenders;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + parseInt(daysToComplete));
    const updatedContenders = contenders.map(contender => {
      if (contender.id === userProfileId) {
        return {
          ...contender,
          status: "Accepted",
          expiresAt
        };
      } else {
        return contender;
      }
    });
    await challengeInstanceRef.update({
      contenders: updatedContenders
    });
  } catch (error) {
    console.log("Error while accepting challenge instance", error);
    throw new Error(
      "Ooops something happened while accepting challenge instance"
    );
  }
};

export const cancelInstanceInFs = async (userProfileId, instanceId) => {
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const contenders = challengeInstanceSnapshot.data().contenders;
    const updatedContenders = contenders.map(contender => {
      if (contender.id === userProfileId) {
        return {
          ...contender,
          status: "Cancelled",
          expiresAt: null,
          proof: {
            ...contender.proof,
            state: "Cancelled"
          }
        };
      } else {
        return contender;
      }
    });
    await challengeInstanceRef.update({
      contenders: updatedContenders
    });
  } catch (error) {
    console.log("Error while cancelling challenge instance", error);
    throw new Error(
      "Ooops something happened while cancelling challenge instance"
    );
  }
};

export const updateProofInFs = async (userProfileId, instanceId, url) => {
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const contenders = challengeInstanceSnapshot.data().contenders;
    const dateUploaded = new Date();
    const updatedContenders = contenders.map(contender => {
      if (contender.id === userProfileId) {
        return {
          ...contender,
          proof: {
            dateUploaded,
            state: "Pending",
            url
          }
        };
      } else {
        return contender;
      }
    });
    await challengeInstanceRef.update({
      contenders: updatedContenders
    });
  } catch (error) {
    console.log("Error while updating challenge instance proof", error);
    throw new Error(
      "Ooops something happened while updating challenge instance proof"
    );
  }
};

export const toggleProofPublicPrivateInFs = async (
  userProfileId,
  instanceId
) => {
  let proofPublicOrPrivate = "";
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const contenders = challengeInstanceSnapshot.data().contenders;
    const updatedContenders = contenders.map(contender => {
      if (contender.id === userProfileId) {
        // we ask for the negate because we are going to toggle it in the function
        if (!contender.public) {
          proofPublicOrPrivate = "public";
        } else {
          proofPublicOrPrivate = "private";
        }
        return {
          ...contender,
          public: !contender.public
        };
      } else {
        return contender;
      }
    });
    await challengeInstanceRef.update({
      contenders: updatedContenders
    });
  } catch (error) {
    console.log("Error while updating challenge proof", error);
    throw new Error(
      "Ooops something happened while updating challenge instance proof"
    );
  }
  return proofPublicOrPrivate;
};

export const validateProofInFs = async (userToValidateId, instanceId) => {
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const contenders = challengeInstanceSnapshot.data().contenders;
    const updatedContenders = contenders.map(contender => {
      if (contender.id === userToValidateId) {
        return {
          ...contender,
          proof: {
            ...contender.proof,
            state: "Accepted"
          },
          status: "Completed",
          expiresAt: null
        };
      } else {
        return contender;
      }
    });
    await challengeInstanceRef.update({
      contenders: updatedContenders
    });
  } catch (error) {
    console.log("Error while validating proof", error);
    throw new Error("Ooops something happened while validating proof");
  }
};

export const invalidateProofInFs = async (userToInvalidateId, instanceId) => {
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const contenders = challengeInstanceSnapshot.data().contenders;
    const updatedContenders = contenders.map(contender => {
      if (contender.id === userToInvalidateId) {
        return {
          ...contender,
          proof: {
            ...contender.proof,
            state: "Cancelled"
          }
        };
      } else {
        return contender;
      }
    });
    await challengeInstanceRef.update({
      contenders: updatedContenders
    });
  } catch (error) {
    console.log("Error while invalidating proof", error);
    throw new Error("Ooops something happened while invalidating proof");
  }
};

export const updateUserDataInFs = async userData => {
  try {
    const { displayName, age, gender, country } = userData;
    const userProfileId = auth.currentUser.uid;
    const userRef = firestore.doc(`users/${userProfileId}`);
    const userSnapshot = await userRef.get();
    const userStoredData = userSnapshot.data();
    const storedDisplayname = userStoredData.displayName;
    const storedAge = userStoredData.age;
    const storedGender = userStoredData.gender;
    const storedCountry = userStoredData.country;

    await userRef.update({
      displayName: displayName ? displayName : storedDisplayname,
      age: age ? age : storedAge,
      gender: gender ? gender : storedGender,
      country: country ? country : storedCountry
    });
  } catch (error) {
    console.log("Error while updating user data", error);
    throw new Error("Ooops something happened while updating user data");
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
