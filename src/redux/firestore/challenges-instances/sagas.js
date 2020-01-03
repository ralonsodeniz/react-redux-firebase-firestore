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
  invalidateProofInFs,
  addLikeToProofInFs,
  addDislikeToProofInFs,
  addCommentToProofInFs,
  editCommentAtProofInFs,
  deleteCommentFromProofInFs,
  reportCommentAbuseAtProofInFs,
  reportGlobalValidatorsInFs
} from "../../../firebase/firebase.utils";

// add new challenge to instances
export function* onAddNewInstanceStarts() {
  yield takeLatest(INSTANCES.ADD_NEW_INSTANCE_STARTS, addNewInstance);
}

export function* addNewInstance({ payload }) {
  const {
    challengeData,
    instanceData,
    userProfileId,
    selfValidation
  } = payload;
  try {
    yield call(
      addNewChallengeInstanceInFs,
      challengeData,
      instanceData,
      userProfileId,
      selfValidation
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
    const { userToValidateId, instanceId, globalValidation } = payload;
    yield call(
      validateProofInFs,
      userToValidateId,
      instanceId,
      globalValidation
    );
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
    const { userToInvalidateId, instanceId, globalValidation } = payload;
    yield call(
      invalidateProofInFs,
      userToInvalidateId,
      instanceId,
      globalValidation
    );
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

// add like to a proof
export function* onAddLikeToProofStarts() {
  yield takeLatest(INSTANCES.ADD_LIKE_TO_PROOF_STARTS, addLikeToProof);
}

export function* addLikeToProof({ payload }) {
  const { contenderId, instanceId, hasUserDisliked } = payload;
  try {
    yield call(addLikeToProofInFs, contenderId, instanceId, hasUserDisliked);
    const addLikeToProofSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Proof liked`
      }
    };
    yield put(openModal(addLikeToProofSuccessModalData));
  } catch (error) {
    const addLikeToProofFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(addLikeToProofFailureModalData));
  }
}

// add dislike to a proof
export function* onAddDislikeToProofStarts() {
  yield takeLatest(INSTANCES.ADD_DISLIKE_TO_PROOF_STARTS, addDislikeToProof);
}

export function* addDislikeToProof({ payload }) {
  const { contenderId, instanceId, hasUserLiked } = payload;
  try {
    yield call(addDislikeToProofInFs, contenderId, instanceId, hasUserLiked);
    const addDislikeToProofSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Proof disliked`
      }
    };
    yield put(openModal(addDislikeToProofSuccessModalData));
  } catch (error) {
    const addDislikeToProofFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(addDislikeToProofFailureModalData));
  }
}

// add new comment to challenge instance proof
export function* onAddCommentToProofStarts() {
  yield takeLatest(INSTANCES.ADD_COMMENT_TO_PROOF_STARTS, addCommentToProof);
}

export function* addCommentToProof({ payload }) {
  const { contenderId, instanceId, text } = payload;
  try {
    yield call(addCommentToProofInFs, contenderId, instanceId, text);
    const addCommentToProofSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Added comment to proof`
      }
    };
    yield put(openModal(addCommentToProofSuccessModalData));
  } catch (error) {
    const addCommentToProofFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(addCommentToProofFailureModalData));
  }
}

// edit comment at challenge instance proof
export function* onEditCommentAtProofStarts() {
  yield takeLatest(INSTANCES.EDIT_COMMENT_AT_PROOF_STARTS, editCommentAtProof);
}

export function* editCommentAtProof({ payload }) {
  const { contenderId, instanceId, text, commentId } = payload;
  try {
    yield call(
      editCommentAtProofInFs,
      contenderId,
      instanceId,
      text,
      commentId
    );
    const editCommentAtProofSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Edited comment at proof`
      }
    };
    yield put(openModal(editCommentAtProofSuccessModalData));
  } catch (error) {
    const editCommentAtProofFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(editCommentAtProofFailureModalData));
  }
}

// delete comment from challenge instance proof
export function* onDeleteCommentFromProofStarts() {
  yield takeLatest(
    INSTANCES.DELETE_COMMENT_FROM_PROOF_STARTS,
    deleteCommentFromProof
  );
}

export function* deleteCommentFromProof({ payload }) {
  const { contenderId, instanceId, commentId } = payload;
  try {
    yield call(deleteCommentFromProofInFs, contenderId, instanceId, commentId);
    const deleteCommentFromProofSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Deleted comment from proof`
      }
    };
    yield put(openModal(deleteCommentFromProofSuccessModalData));
  } catch (error) {
    const deleteCommentFromProofFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(deleteCommentFromProofFailureModalData));
  }
}

// delete comment from challenge instance proof
export function* onReportCommentAbuseAtProofStarts() {
  yield takeLatest(
    INSTANCES.REPORT_COMMENT_ABUSE_AT_PROOF_STARTS,
    reportCommentAbuseAtProof
  );
}

export function* reportCommentAbuseAtProof({ payload }) {
  const { contenderId, instanceId, commentId } = payload;
  try {
    yield call(
      reportCommentAbuseAtProofInFs,
      contenderId,
      instanceId,
      commentId
    );
    const reportCommentAbuseAtProofSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Reported comment abuse at proof`
      }
    };
    yield put(openModal(reportCommentAbuseAtProofSuccessModalData));
  } catch (error) {
    const reportCommentAbuseAtProofFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(reportCommentAbuseAtProofFailureModalData));
  }
}

// report global validator at challenge instance proof
export function* onReportGlobalValidationStarts() {
  yield takeLatest(
    INSTANCES.REPORT_GLOBAL_VALIDATOR_STARTS,
    reportGlobalValidators
  );
}

export function* reportGlobalValidators({ payload }) {
  const { contenderId, instanceId } = payload;
  try {
    yield call(reportGlobalValidatorsInFs, instanceId, contenderId);
    const reportGlobalValidatorsSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: `Reported comment abuse at proof`
      }
    };
    yield put(openModal(reportGlobalValidatorsSuccessModalData));
  } catch (error) {
    const reportGlobalValidatorsFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(reportGlobalValidatorsFailureModalData));
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
    call(onInvalidateProofStarts),
    call(onAddLikeToProofStarts),
    call(onAddDislikeToProofStarts),
    call(onAddCommentToProofStarts),
    call(onEditCommentAtProofStarts),
    call(onDeleteCommentFromProofStarts),
    call(onReportCommentAbuseAtProofStarts),
    call(onReportGlobalValidationStarts)
  ]);
}
