import { takeLatest, put, call, all } from "redux-saga/effects";

import { CHALLENGES } from "./types";
import { openModal } from "../../modal/actions";
import { addNewChallengeTemplateInFs } from "../../../firebase/firebase.utils";

// add new challenge to templates
export function* onAddNewChallengeStart() {
  yield takeLatest(CHALLENGES.ADD_NEW_CHALLENGE_START, addNewChallenge);
}

export function* addNewChallenge({ payload }) {
  try {
    yield call(addNewChallengeTemplateInFs, payload);
    const addNewChallengeSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "New challenge added and pending to be approved"
      }
    };
    yield put(openModal(addNewChallengeSuccessModalData));
  } catch (error) {
    const addNewChallengeFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(addNewChallengeFailureModalData));
  }
}

// root saga creator for challenges templates
export function* challengesTemplatesSagas() {
  yield all([call(onAddNewChallengeStart)]);
}
