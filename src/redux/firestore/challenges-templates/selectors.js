import { createSelector } from "reselect";

const selectChallengesTemplates = state =>
  state.firestore.data.challengesTemplates;
// const selectChallengesTemplatesOrdered = state =>
//   state.firestore.ordered.challengesTemplates;

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

export const selectChallengesTemplatesCategory = category =>
  createSelector([selectChallengesTemplates], challengesTemplates =>
    challengesTemplates ? challengesTemplates[category] : {}
  );

// this is also a selector rhat gets arguments, appart from state, but declared in a different way that he one before.
// here we do not use curried function but compose
export const selectChallengeTemplateFromCategory = createSelector(
  [selectChallengesTemplates, (_, category, id) => ({ category, id })],
  (challengesTemplates, { category, id }) =>
    challengesTemplates ? challengesTemplates[category][id] : {}
);
