import { takeLatest, call, put, all } from "redux-saga/effects";

import { INSTANCES } from "./types";
import { openModal } from "../../modal/actions";
import {
  addNewChallengeInstanceInFs,
  acceptInstanceInFs,
  cancelInstanceInFs,
  updateProofInFs,
  toggleProofPublicPrivateInFs,
  validateProofInFs,
  invalidateProofInFs
} from "../../../firebase/firebase.utils";

// add new challenge to instances
export function* onAddNewInstanceStarts() {
  yield takeLatest(INSTANCES.ADD_NEW_INSTANCE_STARTS, addNewInstance);
}

export function* addNewInstance({ payload }) {
  const { challengeData, instanceData, userProfileId } = payload;
  try {
    yield call(
      addNewChallengeInstanceInFs,
      challengeData,
      instanceData,
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

// accept challenge instance invitation
export function* onAcceptInstanceStarts() {
  yield takeLatest(INSTANCES.ACCEPT_INSTANCE_STARTS, acceptInstance);
}

export function* acceptInstance({ payload }) {
  const { userProfileId, instanceId, daysToComplete } = payload;
  try {
    yield call(acceptInstanceInFs, userProfileId, instanceId, daysToComplete);
    const acceptInstanceSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Challenge instance accepted"
      }
    };
    yield put(openModal(acceptInstanceSuccessModalData));
  } catch (error) {
    const acceptInstanceFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(acceptInstanceFailureModalData));
  }
}

// cancel challenge instance
export function* onCancelInstanceStarts() {
  yield takeLatest(INSTANCES.CANCEL_INSTANCE_STARTS, cancelInstance);
}

export function* cancelInstance({ payload }) {
  const { userProfileId, instanceId } = payload;
  try {
    yield call(cancelInstanceInFs, userProfileId, instanceId);
    const cancelInstanceSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Challenge instance cancelled"
      }
    };
    yield put(openModal(cancelInstanceSuccessModalData));
  } catch (error) {
    const cancelInstanceFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(cancelInstanceFailureModalData));
  }
}

// update proof
export function* onUploadProofStarts() {
  yield takeLatest(INSTANCES.UPLOAD_PROOF_STARTS, updateProof);
}

export function* updateProof({ payload }) {
  const { instanceId, userProfileId, url } = payload;
  try {
    yield call(updateProofInFs, userProfileId, instanceId, url);
    const updateProofInFSSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Challenge instance proof updated"
      }
    };
    yield put(openModal(updateProofInFSSuccessModalData));
  } catch (error) {
    const updateProofInFSFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(updateProofInFSFailureModalData));
  }
}

// make proof public
export function* onToggleProofPublicPrivateStarts() {
  yield takeLatest(
    INSTANCES.TOGGLE_PROOF_PUBLIC_PRIVATE_STARTS,
    toggleProofPublicPrivate
  );
}

export function* toggleProofPublicPrivate({ payload }) {
  try {
    const { userProfileId, instanceId } = payload;
    const proofPublicOrPrivate = yield call(
      toggleProofPublicPrivateInFs,
      userProfileId,
      instanceId
    );
    const toggleProofPublicPrivateInFSSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Your proof is now ${proofPublicOrPrivate}`
      }
    };
    yield put(openModal(toggleProofPublicPrivateInFSSuccessModalData));
  } catch (error) {
    const toggleProofPublicPrivateInFSFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(toggleProofPublicPrivateInFSFailureModalData));
  }
}

// validate proof
export function* onValidateProofStarts() {
  yield takeLatest(INSTANCES.VALIDATE_PROOF_STARTS, validateProof);
}

export function* validateProof({ payload }) {
  try {
    const { userToValidateId, instanceId } = payload;
    yield call(validateProofInFs, userToValidateId, instanceId);
    const validateProofInFSSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Proof validated`
      }
    };
    yield put(openModal(validateProofInFSSuccessModalData));
  } catch (error) {
    const validateProofInFSFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(validateProofInFSFailureModalData));
  }
}

// invalidate proof
export function* onInvalidateProofStarts() {
  yield takeLatest(INSTANCES.INVALIDATE_PROOF_STARTS, invalidateProof);
}

export function* invalidateProof({ payload }) {
  try {
    const { userToInvalidateId, instanceId } = payload;
    yield call(invalidateProofInFs, userToInvalidateId, instanceId);
    const invalidateProofInFSSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Proof invalidated`
      }
    };
    yield put(openModal(invalidateProofInFSSuccessModalData));
  } catch (error) {
    const invalidateProofInFSFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(invalidateProofInFSFailureModalData));
  }
}

// root saga creator for challenges instances
export function* challengesInstancesSagas() {
  yield all([
    call(onAddNewInstanceStarts),
    call(onAcceptInstanceStarts),
    call(onCancelInstanceStarts),
    call(onUploadProofStarts),
    call(onToggleProofPublicPrivateStarts),
    call(onValidateProofStarts),
    call(onInvalidateProofStarts)
  ]);
}
