import { INSTANCES } from "./types";

export const addNewInstanceStart = (
  challengeData,
  instanceData,
  userProfileDisplayName,
  userProfileId
) => ({
  type: INSTANCES.ADD_NEW_INSTANCE_START,
  payload: {
    challengeData,
    instanceData,
    userProfileDisplayName,
    userProfileId
  }
});
