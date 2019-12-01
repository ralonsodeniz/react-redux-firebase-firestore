import { CHALLENGES } from "./types";

export const addNewChallengeStart = challengeData => ({
  type: CHALLENGES.ADD_NEW_CHALLENGE_START,
  payload: challengeData
});
