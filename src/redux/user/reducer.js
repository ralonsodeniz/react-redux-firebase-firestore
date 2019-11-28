// not longer needed we using the info from firebase reducer
// import { USER } from "./types";

// const INITIAL_STATE = {
//   currentUser: null,
//   error: null,
//   isChecking: true
// };

// const userReducer = (state = INITIAL_STATE, action) => {
//   switch (action.type) {
//     case USER.GOOGLE_SIGN_IN_START:
//     case USER.EMAIL_PASSWORD_SIGN_IN_START:
//     case USER.CHECK_USER_SESSION_START:
//       return {
//         ...state,
//         isChecking: true
//       };
//     case USER.SIGN_IN_SUCCESS:
//       return {
//         ...state,
//         currentUser: action.payload,
//         error: null,
//         isChecking: false
//       };
//     case USER.SIGN_IN_FAILURE:
//     case USER.SIGN_OUT_FAILURE:
//     case USER.SIGN_UP_FAILURE:
//       return {
//         ...state,
//         error: action.payload,
//         isChecking: false
//       };
//     case USER.SIGN_OUT_SUCCESS:
//       return {
//         ...state,
//         currentUser: null,
//         error: null
//       };
//     case USER.CHECK_USER_SESSION_END:
//       return {
//         ...state,
//         isChecking: false
//       };
//     case USER.UPDATE_AVATAR_SUCCESS:
//       return {
//         ...state,
//         currentUser: {
//           ...state.currentUser,
//           photoURL: action.payload
//         }
//       };
//     case USER.UPDATE_AVATAR_FAILURE:
//       return {
//         ...state,
//         error: action.payload
//       };
//     default:
//       return state;
//   }
// };

// export default userReducer;
