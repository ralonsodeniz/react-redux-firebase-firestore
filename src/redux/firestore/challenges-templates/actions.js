import { CHALLENGES } from "./types";

export const addNewChallengeStarts = challengeData => ({
  type: CHALLENGES.ADD_NEW_CHALLENGE_STARTS,
  payload: challengeData
});
