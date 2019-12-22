import { INSTANCES } from "./types";

export const addNewInstanceStarts = (
  challengeData,
  instanceData,
  userProfileId
) => ({
  type: INSTANCES.ADD_NEW_INSTANCE_STARTS,
  payload: {
    challengeData,
    instanceData,
    userProfileId
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
  type: INSTANCES.CANCEL_INSTANCE_START,
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

export const validateProofStarts = (userToValidateId, instanceId) => ({
  type: INSTANCES.VALIDATE_PROOF_STARTS,
  payload: {
    userToValidateId,
    instanceId
  }
});

export const invalidateProofStarts = (userToInvalidateId, instanceId) => ({
  type: INSTANCES.INVALIDATE_PROOF_STARTS,
  payload: {
    userToInvalidateId,
    instanceId
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
