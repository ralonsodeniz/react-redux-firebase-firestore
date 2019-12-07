import { takeLatest, call, put, all } from "redux-saga/effects";

import { INSTANCES } from "./types";
import { openModal } from "../../modal/actions";
import { addNewChallengeInstanceInFs } from "../../../firebase/firebase.utils";

// add new challenge to instances
export function* onAddNewInstanceStart() {
  yield takeLatest(INSTANCES.ADD_NEW_INSTANCE_START, addNewInstance);
}

export function* addNewInstance({ payload }) {
  const {
    challengeData,
    instanceData,
    userProfileDisplayName,
    userProfileId
  } = payload;
  try {
    yield call(
      addNewChallengeInstanceInFs,
      challengeData,
      instanceData,
      userProfileDisplayName,
      userProfileId
    );
    const addNewInstanceSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "New challenge instance created"
      }
    };
    yield put(openModal(addNewInstanceSuccessModalData));
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

// root saga creator for challenges instances
export function* challengesInstancesSagas() {
  yield all([call(onAddNewInstanceStart)]);
}
