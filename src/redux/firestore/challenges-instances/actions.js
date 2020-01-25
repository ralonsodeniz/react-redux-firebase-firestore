import { INSTANCES } from "./types";

export const addNewInstanceStarts = (
  challengeData,
  instanceData,
  userProfileId,
  selfValidation
) => ({
  type: INSTANCES.ADD_NEW_INSTANCE_STARTS,
  payload: {
    challengeData,
    instanceData,
    userProfileId,
    selfValidation
  }
});

export const acceptInstanceStarts = (
  userProfileId,
  instanceId,
  daysToComplete
) => ({
  type: INSTANCES.ACCEPT_INSTANCE_STARTS,
  payload: {
    userProfileId,
    instanceId,
    daysToComplete
  }
});

export const cancelInstanceStarts = (userProfileId, instanceId) => ({
  type: INSTANCES.CANCEL_INSTANCE_STARTS,
  payload: {
    userProfileId,
    instanceId
  }
});

export const uploadProofStarts = uploadProofData => ({
  type: INSTANCES.UPLOAD_PROOF_STARTS,
  payload: uploadProofData
});

export const toggleProofPublicPrivateStarts = (userProfileId, instanceId) => ({
  type: INSTANCES.TOGGLE_PROOF_PUBLIC_PRIVATE_STARTS,
  payload: { userProfileId, instanceId }
});

export const validateProofStarts = (
  userToValidateId,
  instanceId,
  globalValidation
) => ({
  type: INSTANCES.VALIDATE_PROOF_STARTS,
  payload: {
    userToValidateId,
    instanceId,
    globalValidation
  }
});

export const invalidateProofStarts = (
  userToInvalidateId,
  instanceId,
  globalValidation
) => ({
  type: INSTANCES.INVALIDATE_PROOF_STARTS,
  payload: {
    userToInvalidateId,
    instanceId,
    globalValidation
  }
});

export const addLikeToProofStarts = (
  contenderId,
  instanceId,
  hasUserDisliked
) => ({
  type: INSTANCES.ADD_LIKE_TO_PROOF_STARTS,
  payload: {
    contenderId,
    instanceId,
    hasUserDisliked
  }
});

export const addDislikeToProofStarts = (
  contenderId,
  instanceId,
  hasUserLiked
) => ({
  type: INSTANCES.ADD_DISLIKE_TO_PROOF_STARTS,
  payload: {
    contenderId,
    instanceId,
    hasUserLiked
  }
});

export const addCommentToProofStarts = (contenderId, instanceId, text) => ({
  type: INSTANCES.ADD_COMMENT_TO_PROOF_STARTS,
  payload: {
    contenderId,
    instanceId,
    text
  }
});

export const editCommentAtProofStarts = (
  contenderId,
  instanceId,
  text,
  commentId
) => ({
  type: INSTANCES.EDIT_COMMENT_AT_PROOF_STARTS,
  payload: {
    contenderId,
    instanceId,
    text,
    commentId
  }
});

export const deleteCommentFromProofStarts = (
  contenderId,
  instanceId,
  commentId
) => ({
  type: INSTANCES.DELETE_COMMENT_FROM_PROOF_STARTS,
  payload: {
    contenderId,
    instanceId,
    commentId
  }
});

export const reportCommentAbuseAtProofStarts = (
  contenderId,
  instanceId,
  commentId
) => ({
  type: INSTANCES.REPORT_COMMENT_ABUSE_AT_PROOF_STARTS,
  payload: {
    contenderId,
    instanceId,
    commentId
  }
});

export const reportGlobalValidatorStarts = (instanceId, contenderId) => ({
  type: INSTANCES.REPORT_GLOBAL_VALIDATOR_STARTS,
  payload: {
    instanceId,
    contenderId
  }
});
