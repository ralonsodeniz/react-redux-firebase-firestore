import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

import modalReducer from "./modal/reducer";
// import userReducer from "./user/reducer"; deprecated by firebase reducer

const rootReducer = combineReducers({
  modal: modalReducer,
  // user: userReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

export default rootReducer;
