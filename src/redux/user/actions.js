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
