import { USER } from "./types";

export const googleSignInStarts = () => ({
  type: USER.GOOGLE_SIGN_IN_STARTS
});

export const emailAndPasswordSignInStarts = credentials => ({
  type: USER.EMAIL_PASSWORD_SIGN_IN_STARTS,
  payload: credentials
});

// export const signInSuccess = user => ({
//   type: USER.SIGN_IN_SUCCESS,
//   payload: user
// });

// export const signInFailure = error => ({
//   type: USER.SIGN_IN_FAILURE,
//   payload: error
// });

// not longer needed deprecated by state.firebase.auth and profile
// export const checkUserSessionStart = () => ({
//   type: USER.CHECK_USER_SESSION_START
// });

// export const checkUserSessionEnd = () => ({
//   type: USER.CHECK_USER_SESSION_END
// });

export const signOutStarts = () => ({
  type: USER.SIGN_OUT_STARTS
});

// export const signOutSuccess = () => ({
//   type: USER.SIGN_OUT_SUCCESS
// });

// export const signOutFailure = error => ({
//   type: USER.SIGN_OUT_FAILURE,
//   payload: error
// });

export const signUpStarts = userData => ({
  type: USER.SIGN_UP_STARTS,
  payload: userData
});

// export const signUpSuccess = () => ({
//   type: USER.SIGN_UP_SUCCESS
// });

// export const signUpFailure = error => ({
//   type: USER.SIGN_UP_FAILURE,
//   payload: error
// });

export const updateAvatarStarts = url => ({
  type: USER.UPDATE_AVATAR_STARTS,
  payload: url
});

// export const updateAvatarSuccess = url => ({
//   type: USER.UPDATE_AVATAR_SUCCESS,
//   payload: url
// });

// export const updateAvatarFailure = error => ({
//   type: USER.UPDATE_AVATAR_FAILURE,
//   payload: error
// });

export const updateUserDataStarts = userData => ({
  type: USER.UPDATE_USER_DATA_STARTS,
  payload: userData
});

export const deleteUserStarts = (
  userCredentials,
  userAcceptedFriends,
  userProviderId
) => ({
  type: USER.DELETE_USER_STARTS,
  payload: { userCredentials, userAcceptedFriends, userProviderId }
});

export const updateUserPasswordStarts = (newPassword, password) => ({
  type: USER.UPDATE_USER_PASSWORD_STARTS,
  payload: {
    newPassword,
    password
  }
});

export const resetUserPasswordStarts = email => ({
  type: USER.RESET_USER_PASSWORD_STARTS,
  payload: email
});

export const resendVerificationEmailStarts = userCredentials => ({
  type: USER.RESEND_VERIFICATION_EMAIL_STARTS,
  payload: userCredentials
});

export const acceptFriendRequestStarts = friendId => ({
  type: USER.ACCEPT_FRIEND_REQUEST_STARTS,
  payload: friendId
});

export const declineFriendRequestStarts = friendId => ({
  type: USER.DECLINE_FRIEND_REQUEST_STARTS,
  payload: friendId
});

export const deleteFriendStarts = friendId => ({
  type: USER.DELETE_FRIEND_STARTS,
  payload: friendId
});

export const sendFriendRequestStarts = friendId => ({
  type: USER.SEND_FRIEND_REQUEST_STARTS,
  payload: friendId
});

export const toggleUserGlobalValidatorStarts = () => ({
  type: USER.TOGGLE_USER_GLOBAL_VALIDATOR_STARTS
});
