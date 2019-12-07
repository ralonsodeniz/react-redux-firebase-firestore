import { all, call } from "redux-saga/effects";

import { userSagas } from "./user/sagas";
import { challengesTemplatesSagas } from "./firestore/challenges-templates/sagas";
import { challengesInstancesSagas } from "./firestore/challenges-instances/sagas";

export default function* rootSaga() {
  yield all([
    call(userSagas),
    call(challengesTemplatesSagas),
    call(challengesInstancesSagas)
  ]);
}
