import { takeLatest, put, call, all } from "redux-saga/effects";

import { USER } from "./types";
// import
// signInSuccess,
// signInFailure,
// signUpFailure,
// checkUserSessionEnd,
// signOutSuccess,
// signOutFailure,
// updateAvatarSuccess,
// updateAvatarFailure
// from
// "./actions";
import { openModal } from "../modal/actions";
import {
  auth,
  googleAuthProvider,
  checkUserProfileDocumentInFS,
  actionCodeSettings,
  // getCurrentUserFromAuth,
  updateAvatarInFS,
  updateUserDataInFs,
  deleteUserInFs,
  updateUserPasswordInFs,
  resetUserPasswordFromFB,
  resendVerificationEmailFromFB,
  acceptFriendRequestInFs,
  declineFriendRequestInFs,
  deleteFriendInFs,
  sendFriendRequestInFs,
  toggleUserGlobalValidatorInFs
} from "../../firebase/firebase.utils";

// sign up with email and password
export function* onSignUpStarts() {
  yield takeLatest(USER.SIGN_UP_STARTS, signUp);
}

export function* signUp({ payload }) {
  const { email, password, displayName, ...aditionalData } = payload;
  try {
    const { user } = yield auth.createUserWithEmailAndPassword(email, password);
    // we send the user a verification email
    yield auth.currentUser.sendEmailVerification(actionCodeSettings);
    yield user.updateProfile({ displayName });
    yield call(checkUserProfileDocumentInFS, user, aditionalData);
    yield auth.signOut();
    const checkEmailForVerificationModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Please look in your inbox to verify the email before signing in"
      }
    };
    yield put(openModal(checkEmailForVerificationModalData));
  } catch (error) {
    // yield put(signUpFailure(error));
    const signUpFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(signUpFailureModalData));
    yield auth.signOut();
  }
}

// google sign in sagas
export function* onGoogleSignInStarts() {
  yield takeLatest(USER.GOOGLE_SIGN_IN_STARTS, signInWithGoogle);
}

export function* signInWithGoogle() {
  try {
    const { user } = yield auth.signInWithPopup(googleAuthProvider);
    yield call(checkUserProfileDocumentInFS, user);
    const signInSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Welcome back ${user.displayName}`
      }
    };
    yield put(openModal(signInSuccessModalData));
  } catch (error) {
    // yield put(signInFailure(error));
    const sigInFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(sigInFailureModalData));
    yield auth.signOut();
  }
}

// email signin
export function* onEmailSignInStarts() {
  yield takeLatest(USER.EMAIL_PASSWORD_SIGN_IN_STARTS, signInWithEmail);
}

export function* signInWithEmail({ payload }) {
  const { email, password } = payload;
  try {
    const { user } = yield auth.signInWithEmailAndPassword(email, password);
    // we check if the user has the email verified before signin
    if (
      !user.emailVerified &&
      user.providerData
        .map(provider => provider.providerId)
        .includes("password")
    ) {
      yield auth.signOut();
      const emailNotVerifiedModalData = {
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text:
            "Please look in your inbox to verify the email before signing in"
        }
      };
      yield put(openModal(emailNotVerifiedModalData));
    } else {
      const signInSuccessModalData = {
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text: `Welcome back ${user.displayName}`
        }
      };
      yield put(openModal(signInSuccessModalData));
    }
  } catch (error) {
    // yield put(signInFailure(error));
    const emailSignInFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(emailSignInFailureModalData));
    yield auth.signOut();
  }
}

// not longer needed replaced by state.firebase. auth and profile
// check if user is loged in at app refresh
// export function* onCheckUserSessionStart() {
//   yield takeLatest(USER.CHECK_USER_SESSION_START, isUserAuthenticated);
// }

// export function* isUserAuthenticated() {
//   try {
//     const user = yield getCurrentUserFromAuth(); // there is no need to call because this getCurrentUserFromFB is a Promise
//     if (!user) {
//       yield put(checkUserSessionEnd());
//       return;
//     }
//     yield call(getSnapshotFromUserAuth, user);
//   } catch (error) {
//     yield put(signInFailure(error));
//     const checkUserSessionFailureModalData = {
//       modalType: "SYSTEM_MESSAGE",
//       modalProps: {
//         text: error.message
//       }
//     };
//     yield put(openModal(checkUserSessionFailureModalData));
//   }
// }

// sign out
export function* onSignOutStarts() {
  yield takeLatest(USER.SIGN_OUT_STARTS, signOut);
}

export function* signOut() {
  try {
    // yield put(signOutSuccess());
    yield auth.signOut();
    const signOutSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Successfully signed out"
      }
    };
    yield put(openModal(signOutSuccessModalData));
  } catch (error) {
    // yield put(signOutFailure(error));
    const signOutFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(signOutFailureModalData));
  }
}

// update user avatar
export function* onUpdateAvatarStarts() {
  yield takeLatest(USER.UPDATE_AVATAR_STARTS, updateAvatar);
}

export function* updateAvatar({ payload }) {
  try {
    yield call(updateAvatarInFS, payload);
    // yield put(updateAvatarSuccess(payload));
  } catch (error) {
    // yield put(updateAvatarFailure(error));
    const updateAvatarFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(updateAvatarFailureModalData));
  }
}

// update user data
export function* onUpdateUserDataStarts() {
  yield takeLatest(USER.UPDATE_USER_DATA_STARTS, updateUserData);
}

export function* updateUserData({ payload }) {
  try {
    yield call(updateUserDataInFs, payload);
    const updateUserDataSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "User data updated"
      }
    };
    yield put(openModal(updateUserDataSuccessModalData));
  } catch (error) {
    const updateUserDataFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(updateUserDataFailureModalData));
  }
}

// delete user
export function* onDeleteUserStarts() {
  yield takeLatest(USER.DELETE_USER_STARTS, deleteUser);
}

export function* deleteUser({ payload }) {
  const { userCredentials, userAcceptedFriends, userProviderId } = payload;
  try {
    yield call(
      deleteUserInFs,
      userCredentials,
      userAcceptedFriends,
      userProviderId
    );
    const deleteUserSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "User deleted"
      }
    };
    yield put(openModal(deleteUserSuccessModalData));
  } catch (error) {
    const deleteUserFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(deleteUserFailureModalData));
  }
}

// update user password
export function* onUpdateUserPasswordStarts() {
  yield takeLatest(USER.UPDATE_USER_PASSWORD_STARTS, updateUserPassword);
}

export function* updateUserPassword({ payload }) {
  const { newPassword, password } = payload;
  try {
    yield call(updateUserPasswordInFs, newPassword, password);
    const updateUserPasswordSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "User password updated"
      }
    };
    yield put(openModal(updateUserPasswordSuccessModalData));
  } catch (error) {
    const updateUserPasswordFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(updateUserPasswordFailureModalData));
  }
}

// reset user password
export function* onResetUserPasswordStarts() {
  yield takeLatest(USER.RESET_USER_PASSWORD_STARTS, resetUserPassword);
}

export function* resetUserPassword({ payload }) {
  try {
    yield call(resetUserPasswordFromFB, payload);
    const resetUserPasswordSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "An email with a password reset link has been sent to you"
      }
    };
    yield put(openModal(resetUserPasswordSuccessModalData));
  } catch (error) {
    const resetUserPasswordFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(resetUserPasswordFailureModalData));
  }
}

// resend verification email
export function* onResendVerificationEmailStarts() {
  yield takeLatest(
    USER.RESEND_VERIFICATION_EMAIL_STARTS,
    resendVerificationEmail
  );
}

export function* resendVerificationEmail({ payload }) {
  try {
    const alreadyVerified = yield call(resendVerificationEmailFromFB, payload);

    if (alreadyVerified) {
      const resendVerificationEmailSuccessModalData = {
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text: "Your email is already verified"
        }
      };
      yield put(openModal(resendVerificationEmailSuccessModalData));
    } else {
      const resendVerificationEmailSuccessModalData = {
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text: "Verification email resent"
        }
      };
      yield put(openModal(resendVerificationEmailSuccessModalData));
    }
  } catch (error) {
    const resendVerificationEmailFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(resendVerificationEmailFailureModalData));
  }
}

// accepte friend request
export function* onAcceptFriendRequestStarts() {
  yield takeLatest(USER.ACCEPT_FRIEND_REQUEST_STARTS, acceptFriendRequest);
}

export function* acceptFriendRequest({ payload }) {
  try {
    yield call(acceptFriendRequestInFs, payload);
    const acceptFriendRequestSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Friend request accepted"
      }
    };
    yield put(openModal(acceptFriendRequestSuccessModalData));
  } catch (error) {
    const acceptFriendRequestFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(acceptFriendRequestFailureModalData));
  }
}

// decline friend request
export function* onDeclineFriendRequestStarts() {
  yield takeLatest(USER.DECLINE_FRIEND_REQUEST_STARTS, declineFriendRequest);
}

export function* declineFriendRequest({ payload }) {
  try {
    yield call(declineFriendRequestInFs, payload);
    const declineFriendRequestSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Friend request declined"
      }
    };
    yield put(openModal(declineFriendRequestSuccessModalData));
  } catch (error) {
    const declineFriendRequestFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(declineFriendRequestFailureModalData));
  }
}

// delete friend
export function* onDeleteFriendStarts() {
  yield takeLatest(USER.DELETE_FRIEND_STARTS, deleteFriend);
}

export function* deleteFriend({ payload }) {
  try {
    yield call(deleteFriendInFs, payload);
    const deleteFriendSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Friend deleted"
      }
    };
    yield put(openModal(deleteFriendSuccessModalData));
  } catch (error) {
    const deleteFriendFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(deleteFriendFailureModalData));
  }
}

// send friend request
export function* onSendFriendRequestStarts() {
  yield takeLatest(USER.SEND_FRIEND_REQUEST_STARTS, sendFriendRequest);
}

export function* sendFriendRequest({ payload }) {
  try {
    yield call(sendFriendRequestInFs, payload);
    const sendFriendRequestSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Friend request sent"
      }
    };
    yield put(openModal(sendFriendRequestSuccessModalData));
  } catch (error) {
    const sendFriendRequestFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(sendFriendRequestFailureModalData));
  }
}

// toogle global validator status
export function* onToggleUserGlobalValidatorStarts() {
  yield takeLatest(
    USER.TOGGLE_USER_GLOBAL_VALIDATOR_STARTS,
    toggleUserGlobalValidator
  );
}

export function* toggleUserGlobalValidator() {
  try {
    yield call(toggleUserGlobalValidatorInFs);
    const toggleUserGlobalValidatorSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Updated global validator status"
      }
    };
    yield put(openModal(toggleUserGlobalValidatorSuccessModalData));
  } catch (error) {
    const toggleUserGlobalValidatorFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(toggleUserGlobalValidatorFailureModalData));
  }
}

// root saga creator for users with all the tiggering generation functions of the saga
export function* userSagas() {
  yield all([
    call(onGoogleSignInStarts),
    call(onEmailSignInStarts),
    call(onSignUpStarts),
    // call(onCheckUserSessionStart),
    call(onSignOutStarts),
    call(onUpdateAvatarStarts),
    call(onUpdateUserDataStarts),
    call(onDeleteUserStarts),
    call(onUpdateUserPasswordStarts),
    call(onResetUserPasswordStarts),
    call(onResendVerificationEmailStarts),
    call(onAcceptFriendRequestStarts),
    call(onDeclineFriendRequestStarts),
    call(onDeleteFriendStarts),
    call(onSendFriendRequestStarts),
    call(onToggleUserGlobalValidatorStarts)
  ]);
}
