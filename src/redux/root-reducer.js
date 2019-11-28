import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";

import counterReducer from "./counter/reducer";
import videoReducer from "./video/reducer";
import modalReducer from "./modal/reducer";
// import userReducer from "./user/reducer"; deprecated by firebase reducer

const rootReducer = combineReducers({
  counter: counterReducer,
  video: videoReducer,
  modal: modalReducer,
  // user: userReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer
});

export default rootReducer;
