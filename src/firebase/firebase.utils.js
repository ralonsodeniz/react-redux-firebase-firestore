import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import "firebase/functions";

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
      const globalValidator = {
        status: "no validator",
        instancesValidated: 0
      };

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
          instancesToValidate,
          globalValidator
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
  oldFileName,
  file,
  setProgress,
  setLoading,
  setFile,
  urlAction,
  additionalAction
) => {
  // const uuid = assignNewIdToItem({}, createRandomId, 38);
  // const enhancedFilename = fileName + uuid;
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
        // await documentFile.getDownloadURL().then(url => urlAction(url));
        const { data:{convertedUrl, posterUrl} } = await cloudUploadFile({
          directory,
          fileName,
          oldFileName
        });
        // console.log("cloudUrl",data)
        urlAction(convertedUrl);
        console.log("posterUrl", posterUrl)
        // const fbId = "react-redux-firebase-fir-2fc76.appspot.com";
        // const url =
        //   "https://firebasestorage.googleapis.com/v0/b/" +
        //   fbId +
        //   "/o/" +
        //   encodeURIComponent(directory + "/converted@" + enhancedFilename) +
        //   "?alt=media&token=" +
        //   uuid;
        // urlAction(url);
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
          rating: {
            usersThatRated: [],
            ratingAverage: 0
          },
          timesCompleted: 0,
          difficulty: "",
          daysToComplete: 0
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
  userProfileId,
  selfValidation
) => {
  try {
    const challengeInstanceRef = firestore
      .collection("challengesInstances")
      .doc();
    const challengeInstanceRefId = challengeInstanceRef.id;
    const administrator = userProfileId;
    const { contenders, validators } = instanceData;
    const { category, challengeTemplateId } = challengeData;
    let { daysToComplete } = challengeData;

    const defaultContenderProps = {
      proof: {
        url: "",
        dateUploaded: null,
        state: "No proof provided",
        validatedBy: {
          id: "",
          reported: false
        }
      },
      rating: {
        likes: 0,
        usersThatLiked: [],
        dislikes: 0,
        usersThatDisliked: []
      },
      public: false,
      comments: []
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
      selfValidation
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
            url,
            validatedBy: {
              id: "",
              reported: false
            }
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

export const validateProofInFs = async (
  userToValidateId,
  instanceId,
  globalValidation
) => {
  const userId = auth.currentUser.uid;

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
            state: "Accepted",
            validatedBy: {
              ...contender.proof.validatedBy,
              id: userId
            }
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

    if (globalValidation) {
      const userRef = firestore.doc(`users/${userId}`);
      const userSnapshot = await userRef.get();
      const userGlobalValidatorData = userSnapshot.data().globalValidator;

      await userRef.update({
        globalValidator: {
          ...userGlobalValidatorData,
          instancesValidated: userGlobalValidatorData.instancesValidated + 1
        }
      });
    }
  } catch (error) {
    console.log("Error while validating proof", error);
    throw new Error("Ooops something happened while validating proof");
  }
};

export const invalidateProofInFs = async (
  userToInvalidateId,
  instanceId,
  globalValidation
) => {
  const userId = auth.currentUser.uid;

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
            state: "Cancelled",
            validatedBy: {
              ...contender.proof.validatedBy,
              id: userId
            }
          }
        };
      } else {
        return contender;
      }
    });
    await challengeInstanceRef.update({
      contenders: updatedContenders
    });

    if (globalValidation) {
      const userRef = firestore.doc(`users/${userId}`);
      const userSnapshot = await userRef.get();
      const userGlobalValidatorData = userSnapshot.data().globalValidator;

      await userRef.update({
        globalValidator: {
          ...userGlobalValidatorData,
          instancesValidated: userGlobalValidatorData.instancesValidated + 1
        }
      });
    }
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

export const deleteUserInFs = async (
  userCredentials,
  userAcceptedFriends,
  userProviderId
) => {
  try {
    const { email, password } = userCredentials;

    const user = auth.currentUser;

    const userId = user.uid;

    if (userProviderId === "password") {
      const credentials = firebase.auth.EmailAuthProvider.credential(
        email,
        password
      );
      await user.reauthenticateWithCredential(credentials);
    } else {
      await user.reauthenticateWithPopup(googleAuthProvider);
    }

    await firestore.doc(`users/${userId}`).delete();
    await user.delete();
    await auth.signOut();

    userAcceptedFriends.forEach(async friend => {
      const friendRef = firestore.doc(`users/${friend}`);
      const friendSnapshot = await friendRef.get();
      const friendPendingFriends = friendSnapshot.data().friends.pending;
      const friendAcceptedFriends = friendSnapshot.data().friends.accepted;
      const updatedFriendAcceptedFriends = friendAcceptedFriends.filter(
        friend => friend !== userId
      );

      await friendRef.update({
        friends: {
          accepted: updatedFriendAcceptedFriends,
          pending: friendPendingFriends
        }
      });
    });
  } catch (error) {
    console.log("Error while deleting user", error);
    throw new Error("Ooops something happened while deleting user");
  }
};

export const updateUserPasswordInFs = async (newPassword, password) => {
  try {
    const user = auth.currentUser;
    const userEmail = user.email;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      userEmail,
      password
    );
    await user.reauthenticateWithCredential(credentials);
    await user.updatePassword(newPassword);
  } catch (error) {
    console.log("Error while updating user password", error);
    throw new Error("Ooops something happened while updating user password");
  }
};

export const resetUserPasswordFromFB = async email => {
  try {
    await auth.sendPasswordResetEmail(email, actionCodeSettings);
  } catch (error) {
    console.log("Error while reseting user password", error);
    throw new Error("Ooops something happened while reseting user password");
  }
};

export const resendVerificationEmailFromFB = async userCredentials => {
  const { email, password } = userCredentials;
  let alreadyVerified = false;
  try {
    const { user } = await auth.signInWithEmailAndPassword(email, password);

    if (
      !user.emailVerified &&
      user.providerData
        .map(provider => provider.providerId)
        .includes("password")
    ) {
      await auth.currentUser.sendEmailVerification(actionCodeSettings);
    } else {
      alreadyVerified = true;
    }
  } catch (error) {
    console.log("Error while resending verification email", error);
    throw new Error(
      "Ooops something happened while resending verification email"
    );
  }
  await auth.signOut();
  return alreadyVerified;
};

export const acceptFriendRequestInFs = async friendId => {
  const userId = auth.currentUser.uid;

  try {
    const userRef = firestore.doc(`users/${userId}`);

    const userAcceptedFriends = (await userRef.get()).data().friends.accepted;

    const userPendingFriends = (await userRef.get()).data().friends.pending;

    const newUserAcceptedFriends = [...userAcceptedFriends, friendId];

    const newUserPendingFriends = userPendingFriends.filter(
      friend => friend !== friendId
    );

    await userRef.update({
      friends: {
        accepted: newUserAcceptedFriends,
        pending: newUserPendingFriends
      }
    });

    const friendRef = firestore.doc(`users/${friendId}`);

    const friendAcceptedFriends = (await friendRef.get()).data().friends
      .accepted;

    const friendPendingFriends = (await friendRef.get()).data().friends.pending;

    const newFriendAcceptedFriends = [...friendAcceptedFriends, userId];

    await friendRef.update({
      friends: {
        accepted: newFriendAcceptedFriends,
        pending: friendPendingFriends
      }
    });
  } catch (error) {
    console.log("Error while accepting friend request", error);
    throw new Error("Ooops something happened while accepting friend request");
  }
};

export const declineFriendRequestInFs = async friendId => {
  const userId = auth.currentUser.uid;

  try {
    const userRef = firestore.doc(`users/${userId}`);

    const userAcceptedFriends = (await userRef.get()).data().friends.accepted;

    const userPendingFriends = (await userRef.get()).data().friends.pending;

    const newUserPendingFriends = userPendingFriends.filter(
      friend => friend !== friendId
    );

    await userRef.update({
      friends: {
        accepted: userAcceptedFriends,
        pending: newUserPendingFriends
      }
    });
  } catch (error) {
    console.log("Error while declining friend request", error);
    throw new Error("Ooops something happened while declining friend request");
  }
};

export const deleteFriendInFs = async friendId => {
  const userId = auth.currentUser.uid;

  try {
    const userRef = firestore.doc(`users/${userId}`);

    const userAcceptedFriends = (await userRef.get()).data().friends.accepted;

    const userPendingFriends = (await userRef.get()).data().friends.pending;

    const newUserAcceptedFriends = userAcceptedFriends.filter(
      friend => friend !== friendId
    );

    await userRef.update({
      friends: {
        accepted: newUserAcceptedFriends,
        pending: userPendingFriends
      }
    });

    const friendRef = firestore.doc(`users/${friendId}`);

    const friendAcceptedFriends = (await friendRef.get()).data().friends
      .accepted;

    const friendPendingFriends = (await friendRef.get()).data().friends.pending;

    const newFriendAcceptedFriends = friendAcceptedFriends.filter(
      friend => friend !== userId
    );

    await friendRef.update({
      friends: {
        accepted: newFriendAcceptedFriends,
        pending: friendPendingFriends
      }
    });
  } catch (error) {
    console.log("Error while deleting friend", error);
    throw new Error("Ooops something happened while deleting friend");
  }
};

export const sendFriendRequestInFs = async friendId => {
  const userId = auth.currentUser.uid;

  try {
    const friendRef = firestore.doc(`users/${friendId}`);

    const friendAcceptedFriends = (await friendRef.get()).data().friends
      .accepted;

    const friendPendingFriends = (await friendRef.get()).data().friends.pending;

    const newFriendPendingFriends = [...friendPendingFriends, userId];

    await friendRef.update({
      friends: {
        accepted: friendAcceptedFriends,
        pending: newFriendPendingFriends
      }
    });
  } catch (error) {
    console.log("Error while sending friend request", error);
    throw new Error("Ooops something happened while sending friend request");
  }
};

export const addLikeToProofInFs = async (
  contenderId,
  instanceId,
  hasUserDisliked
) => {
  const userId = auth.currentUser.uid;

  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const challengeInstanceContenders = challengeInstanceSnapshot.data()
      .contenders;
    const newChallengeInstanceContenders = challengeInstanceContenders.reduce(
      (accumulator, contender) => {
        if (contender.id === contenderId) {
          if (hasUserDisliked) {
            const newUsersThatDisliked = contender.rating.usersThatDisliked.filter(
              user => user !== userId
            );

            accumulator.push({
              ...contender,
              rating: {
                likes: contender.rating.likes + 1,
                usersThatLiked: [...contender.rating.usersThatLiked, userId],
                dislikes: contender.rating.dislikes - 1,
                usersThatDisliked: newUsersThatDisliked
              }
            });
          } else {
            accumulator.push({
              ...contender,
              rating: {
                ...contender.rating,
                likes: contender.rating.likes + 1,
                usersThatLiked: [...contender.rating.usersThatLiked, userId]
              }
            });
          }
        } else {
          accumulator.push(contender);
        }
        return accumulator;
      },
      []
    );

    await challengeInstanceRef.update({
      contenders: newChallengeInstanceContenders
    });
  } catch (error) {
    console.log("Error while liking the instance proof", error);
    throw new Error("Ooops something happened while liking the instance proof");
  }
};

export const addDislikeToProofInFs = async (
  contenderId,
  instanceId,
  hasUserLiked
) => {
  const userId = auth.currentUser.uid;

  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const challengeInstanceContenders = challengeInstanceSnapshot.data()
      .contenders;
    const newChallengeInstanceContenders = challengeInstanceContenders.reduce(
      (accumulator, contender) => {
        if (contender.id === contenderId) {
          if (hasUserLiked) {
            const newUsersThatLiked = contender.rating.usersThatLiked.filter(
              user => user !== userId
            );

            accumulator.push({
              ...contender,
              rating: {
                ...contender.rating,
                likes: contender.rating.likes - 1,
                usersThatLiked: newUsersThatLiked,
                dislikes: contender.rating.dislikes + 1,
                usersThatDisliked: [
                  ...contender.rating.usersThatDisliked,
                  userId
                ]
              }
            });
          } else {
            accumulator.push({
              ...contender,
              rating: {
                ...contender.rating,
                dislikes: contender.rating.dislikes + 1,
                usersThatDisliked: [
                  ...contender.rating.usersThatDisliked,
                  userId
                ]
              }
            });
          }
        } else {
          accumulator.push(contender);
        }
        return accumulator;
      },
      []
    );

    await challengeInstanceRef.update({
      contenders: newChallengeInstanceContenders
    });
  } catch (error) {
    console.log("Error while disliking the instance proof", error);
    throw new Error(
      "Ooops something happened while disliking the instance proof"
    );
  }
};

export const addCommentToProofInFs = async (contenderId, instanceId, text) => {
  const userId = auth.currentUser.uid;

  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const challengeInstanceContenders = challengeInstanceSnapshot.data()
      .contenders;
    const challengeInstanceContender = challengeInstanceContenders.find(
      contender => contender.id === contenderId
    );
    const challengeInstanceContenderComments =
      challengeInstanceContender.comments;
    const commentsIdsObj = challengeInstanceContenderComments.reduce(
      (accumulator, comment) => ({ ...accumulator, [comment.id]: comment.id }),
      {}
    );
    const id = assignNewIdToItem(commentsIdsObj, createRandomId, 28);
    const newChallengeInstanceContenders = challengeInstanceContenders.reduce(
      (accumulator, contender) => {
        if (contender.id === contenderId) {
          accumulator.push({
            ...contender,
            comments: [
              ...contender.comments,
              {
                dateOfPost: new Date(),
                posterId: userId,
                reportAbuse: false,
                text,
                commentId: id
              }
            ]
          });
        } else {
          accumulator.push(contender);
        }
        return accumulator;
      },
      []
    );

    await challengeInstanceRef.update({
      contenders: newChallengeInstanceContenders
    });
  } catch (error) {
    console.log("Error while adding new comment to the instance proof", error);
    throw new Error(
      "Ooops something happened while adding new comment to the instance proof"
    );
  }
};

export const editCommentAtProofInFs = async (
  contenderId,
  instanceId,
  text,
  commentId
) => {
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const challengeInstanceContenders = challengeInstanceSnapshot.data()
      .contenders;

    const newChallengeInstanceContenders = challengeInstanceContenders.reduce(
      (accumulator, contender) => {
        if (contender.id === contenderId) {
          const newContenderComments = contender.comments.reduce(
            (accumulator, comment) => {
              if (comment.commentId === commentId) {
                accumulator.push({
                  ...comment,
                  dateOfPost: new Date(),
                  text
                });
              } else {
                accumulator.push(comment);
              }
              return accumulator;
            },
            []
          );

          accumulator.push({
            ...contender,
            comments: newContenderComments
          });
        } else {
          accumulator.push(contender);
        }
        return accumulator;
      },
      []
    );

    await challengeInstanceRef.update({
      contenders: newChallengeInstanceContenders
    });
  } catch (error) {
    console.log("Error while editing comment at instance proof", error);
    throw new Error(
      "Ooops something happened while editing comment at instance proof"
    );
  }
};

export const deleteCommentFromProofInFs = async (
  contenderId,
  instanceId,
  commentId
) => {
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const challengeInstanceContenders = challengeInstanceSnapshot.data()
      .contenders;
    const newChallengeInstanceContenders = challengeInstanceContenders.reduce(
      (accumulator, contender) => {
        if (contender.id === contenderId) {
          const newComments = contender.comments.filter(
            comment => comment.commentId !== commentId
          );
          accumulator.push({
            ...contender,
            comments: newComments
          });
        } else {
          accumulator.push(contender);
        }
        return accumulator;
      },
      []
    );

    await challengeInstanceRef.update({
      contenders: newChallengeInstanceContenders
    });
  } catch (error) {
    console.log("Error while deleting comment from the instance proof", error);
    throw new Error(
      "Ooops something happened while deleting comment from the instance proof"
    );
  }
};

export const reportCommentAbuseAtProofInFs = async (
  contenderId,
  instanceId,
  commentId
) => {
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceSnapshot = await challengeInstanceRef.get();
    const challengeInstanceContenders = challengeInstanceSnapshot.data()
      .contenders;

    const newChallengeInstanceContenders = challengeInstanceContenders.reduce(
      (accumulator, contender) => {
        if (contender.id === contenderId) {
          const newContenderComments = contender.comments.reduce(
            (accumulator, comment) => {
              if (comment.commentId === commentId) {
                accumulator.push({
                  ...comment,
                  reportAbuse: true
                });
              } else {
                accumulator.push(comment);
              }
              return accumulator;
            },
            []
          );

          accumulator.push({
            ...contender,
            comments: newContenderComments
          });
        } else {
          accumulator.push(contender);
        }
        return accumulator;
      },
      []
    );

    await challengeInstanceRef.update({
      contenders: newChallengeInstanceContenders
    });
  } catch (error) {
    console.log("Error while reporting comment abuse at instance proof", error);
    throw new Error(
      "Ooops something happened while reporting comment abuse at instance proof"
    );
  }
};

export const submitChallengeRatingInFs = async (
  starsSelected,
  templateId,
  category,
  userProfileId
) => {
  try {
    const challengesTemplatesCategoryRef = firestore.doc(
      `challengesTemplates/${category}`
    );
    const challengesTemplatesCategorySnapshot = await challengesTemplatesCategoryRef.get();
    const challengesTemplatesCategorySnapshotData = challengesTemplatesCategorySnapshot.data();
    const challengeTemplateData =
      challengesTemplatesCategorySnapshotData[templateId];
    const challengeTemplateRating = challengeTemplateData.rating;
    const hasUserRated = challengeTemplateRating.usersThatRated.some(
      user => user.userId === userProfileId
    );
    const newRatingUsersThatRated = hasUserRated
      ? challengeTemplateRating.usersThatRated.reduce((accumulator, user) => {
          if (user.userId === userProfileId) {
            accumulator.push({
              ...user,
              userRating: starsSelected
            });
          } else {
            accumulator.push(user);
          }
          return accumulator;
        }, [])
      : [
          ...challengeTemplateRating.usersThatRated,
          {
            userId: userProfileId,
            userRating: starsSelected
          }
        ];
    const newRatingAverage = newRatingUsersThatRated.reduce(
      (accumulator, user, userIndex, userArray) => {
        if (userIndex !== userArray.length - 1) {
          accumulator = accumulator + user.userRating;
        } else if (userIndex === userArray.length - 1) {
          accumulator = (accumulator + user.userRating) / userArray.length;
        }
        return accumulator;
      },
      0
    );

    await challengesTemplatesCategoryRef.set(
      {
        [templateId]: {
          ...challengeTemplateData,
          rating: {
            usersThatRated: newRatingUsersThatRated,
            ratingAverage: newRatingAverage
          }
        }
      },
      { merge: true }
    );
  } catch (error) {
    console.log("Error while submitting challenge rating", error);
    throw new Error(
      "Ooops something happened while submitting challenge rating"
    );
  }
};

export const reportGlobalValidatorsInFs = async (instanceId, contenderId) => {
  try {
    const challengeInstanceRef = firestore.doc(
      `challengesInstances/${instanceId}`
    );
    const challengeInstanceData = (await challengeInstanceRef.get()).data();
    const newChallengeInstanceContenders = challengeInstanceData.contenders.reduce(
      (accumulator, contender) => {
        if (contender.id === contenderId) {
          accumulator.push({
            ...contender,
            proof: {
              ...contender.proof,
              validatedBy: {
                ...contender.proof.validatedBy,
                reported: true
              }
            }
          });
        } else {
          accumulator.push(contender);
        }
        return accumulator;
      },
      []
    );

    await challengeInstanceRef.update({
      contenders: newChallengeInstanceContenders
    });
  } catch (error) {
    console.log("Error while reporting global validator", error);
    throw new Error(
      "Ooops something happened while reporting global validator"
    );
  }
};

export const toggleUserGlobalValidatorInFs = async () => {
  const userId = auth.currentUser.uid;
  try {
    const userRef = firestore.doc(`users/${userId}`);
    const userSnapshot = await userRef.get();
    const userGlobalValidatorData = userSnapshot.data().globalValidator;
    const newUserGlobalValidatorData = {
      ...userGlobalValidatorData,
      status:
        userGlobalValidatorData.status === "no validator"
          ? "junior validator"
          : "no validator"
    };

    await userRef.update({
      globalValidator: newUserGlobalValidatorData
    });
  } catch (error) {
    console.log("Error while updating global validator status", error);
    throw new Error(
      "Ooops something happened while updating global validator status"
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
export const functions = firebase.functions();
firebase.functions();

// google auth config
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: "select_account" });

export default firebase;

// firebase https callable functions
export const cloudUploadFile = functions.httpsCallable("uploadFile");
