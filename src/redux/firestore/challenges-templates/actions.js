import { CHALLENGES } from "./types";

export const addNewChallengeStarts = challengeData => ({
  type: CHALLENGES.ADD_NEW_CHALLENGE_STARTS,
  payload: challengeData
});

export const submitChallengeRatingStarts = (
  starsSelected,
  templateId,
  category,
  userProfileId
) => ({
  type: CHALLENGES.SUBMIT_CHALLENGE_RATING_STARTS,
  payload: {
    starsSelected,
    templateId,
    category,
    userProfileId
  }
});
