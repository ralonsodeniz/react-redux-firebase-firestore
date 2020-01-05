import { createSelector } from "reselect";

export const selectChallengesTemplates = state =>
  state.firestore.data.challengesTemplates;
// const selectChallengesTemplatesOrdered = state =>
//   state.firestore.ordered.challengesTemplates;

export const selectChallengesTemplatesCategories = createSelector(
  [selectChallengesTemplates],
  challengesTemplates =>
    challengesTemplates ? Object.keys(challengesTemplates) : []
);

export const selectChallengesTemplatesAreLoading = createSelector(
  state => state.firestore.status.requesting,
  requesting => requesting.challengesTemplates
);

export const selectChallengesTemplatesCategory = category =>
  createSelector([selectChallengesTemplates], challengesTemplates =>
    challengesTemplates
      ? category === "all"
        ? Object.values(challengesTemplates).reduce((accumulator, category) => {
            Object.values(category).forEach(challenge => {
              accumulator[challenge.challengeTemplateId] = challenge;
            });
            return accumulator;
          }, {})
        : challengesTemplates[category]
      : {}
  );

// this is also a selector that gets arguments, appart from state, but declared in a different way that he one before.
// here we do not use curried function but compose
export const selectChallengeTemplateFromCategoryAndId = createSelector(
  [selectChallengesTemplates, (_, category, id) => ({ category, id })],
  (challengesTemplates, { category, id }) =>
    challengesTemplates ? challengesTemplates[category][id] : {}
);

export const selectProofUrlFromChallengeTemplateWithCategoryAndId = createSelector(
  [selectChallengeTemplateFromCategoryAndId],
  challengeTemplate => (challengeTemplate ? challengeTemplate.proofUrl : "")
);

export const selectNameFromChallengeTemplateWithCategoryAndId = createSelector(
  [selectChallengeTemplateFromCategoryAndId],
  challengeTemplate => (challengeTemplate ? challengeTemplate.name : "")
);

export const selectCategoryFromChallengeTemplateWithCategoryAndId = createSelector(
  [selectChallengeTemplateFromCategoryAndId],
  challengeTemplate => (challengeTemplate ? challengeTemplate.category : "")
);

export const selectProofFileTypeFromChallengeTemplateWithCategoryAndId = createSelector(
  [selectChallengeTemplateFromCategoryAndId],
  challengeTemplate =>
    challengeTemplate ? challengeTemplate.proofFileType : ""
);

export const selectChallengeTemplateFromId = createSelector(
  [selectChallengesTemplates, (_, challengeTemplateId) => challengeTemplateId],
  (challengesTemplates, challengeTemplateId) => {
    if (challengesTemplates && challengeTemplateId) {
      const challengeTemplateCategory = Object.values(
        challengesTemplates
      ).find(category => category.hasOwnProperty(challengeTemplateId));
      return challengeTemplateCategory[challengeTemplateId];
    } else return {};
  }
);

export const selectProofUrlFromChallengeTemplate = createSelector(
  [selectChallengeTemplateFromId],
  challengeTemplate => (challengeTemplate ? challengeTemplate.proofUrl : "")
);

export const selectNameFromChallengeTemplate = createSelector(
  [selectChallengeTemplateFromId],
  challengeTemplate => (challengeTemplate ? challengeTemplate.name : "")
);

export const selectCategoryFromChallengeTemplate = createSelector(
  [selectChallengeTemplateFromId],
  challengeTemplate => (challengeTemplate ? challengeTemplate.category : "")
);

export const selectProofFileTypeFromChallengeTemplate = createSelector(
  [selectChallengeTemplateFromId],
  challengeTemplate =>
    challengeTemplate ? challengeTemplate.proofFileType : ""
);
