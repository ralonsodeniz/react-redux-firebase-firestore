import { createSelector } from "reselect";

const selectChallengesTemplates = state =>
  state.firestore.data.challengesTemplates;
const selectChallengesTemplatesOrdered = state =>
  state.firestore.ordered.challengesTemplates;

export const selectChallengesTemplatesCategories = createSelector(
  [selectChallengesTemplates],
  challengesTemplates =>
    challengesTemplates
      ? Object.keys(challengesTemplates).map(category => category)
      : []
);

export const selectChallengesTemplatesAreLoading = createSelector(
  state => state.firestore.status.requesting,
  requesting => requesting.challengesTemplates
);
