import { all, call } from "redux-saga/effects";

import { userSagas } from "./user/sagas";
import { challengesTemplatesSagas } from "./firestore/challenges-templates/sagas";

export default function* rootSaga() {
  yield all([call(userSagas), call(challengesTemplatesSagas)]);
}
