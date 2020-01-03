import { createSelector } from "reselect";

const selectChallengesInstances = state =>
  state.firestore.data.challengesInstances;

export const selectChallengesInstancesAreLoading = createSelector(
  state => state.firestore.status.requesting,
  requesting => requesting.challengesInstances
);

export const selectUserAcceptedInstancesArray = arrayOfInstances =>
  createSelector([selectChallengesInstances], challengesInstances =>
    challengesInstances
      ? arrayOfInstances.map(instance => challengesInstances[instance])
      : []
  );

export const selectUserInstancesToValidateArray = arrayOfInstancesToValidate =>
  createSelector([selectChallengesInstances], challengesInstances =>
    challengesInstances
      ? arrayOfInstancesToValidate.map(
          instance => challengesInstances[instance]
        )
      : []
  );

export const selectInstanceFromId = createSelector(
  [
    selectChallengesInstances,
    selectChallengesInstancesAreLoading,
    (_, instanceId) => instanceId
  ],
  (challengesInstances, challengesInstancesAreLoading, instanceId) =>
    challengesInstances && instanceId && !challengesInstancesAreLoading
      ? challengesInstances[instanceId]
      : null
);

export const selectInstanceTemplateId = createSelector(
  [selectInstanceFromId],
  challengeInstance =>
    challengeInstance ? challengeInstance.challengeTemplateId : ""
);

export const selectInstanceContenders = createSelector(
  [selectInstanceFromId],
  challengeInstance => (challengeInstance ? challengeInstance.contenders : [])
);

export const selectInstanceValidators = createSelector(
  [selectInstanceFromId],
  challengeInstance => (challengeInstance ? challengeInstance.validators : [])
);

export const selectInstanceSelfValidation = createSelector(
  [selectInstanceFromId],
  challengeInstance =>
    challengeInstance ? challengeInstance.selfValidation : false
);

export const selectAllChallengesInstancesFromTemplateId = createSelector(
  [
    selectChallengesInstances,
    selectChallengesInstancesAreLoading,
    (_, templateId) => templateId
  ],
  (challengesInstances, challengesInstancesAreLoading, templateId) =>
    challengesInstances && templateId && !challengesInstancesAreLoading
      ? Object.values(challengesInstances).filter(
          challengeInstance =>
            challengeInstance.challengeTemplateId === templateId
        )
      : null
);

export const selectAllChallengeInstancesNotSelfValidated = createSelector(
  [selectChallengesInstances, selectChallengesInstancesAreLoading],
  (challengesInstances, challengesInstancesAreLoading) =>
    challengesInstances && !challengesInstancesAreLoading
      ? Object.values(challengesInstances).filter(
          challengeInstance => !challengeInstance.selfValidation
        )
      : null
);

export const selectInfoForRankingFromAllInstancesFromTemplateId = createSelector(
  [selectAllChallengesInstancesFromTemplateId],
  challengesInstancesFromTemplateId => {
    if (challengesInstancesFromTemplateId) {
      const contendersAndRatingsArray = challengesInstancesFromTemplateId.reduce(
        (accumulator, challengeInstance) => {
          const contendersWithRatingArray = challengeInstance.contenders.reduce(
            (accumulator, contender) => {
              if (
                contender.public &&
                contender.proof.state !== "No proof provided"
              ) {
                accumulator.push({
                  id: contender.id,
                  proofUrl: contender.proof.url,
                  likes: contender.rating.likes,
                  dislikes: contender.rating.dislikes,
                  dateUploaded: contender.proof.dateUploaded,
                  challengeInstanceId: challengeInstance.challengeInstanceId,
                  usersThatLiked: contender.rating.usersThatLiked,
                  usersThatDisliked: contender.rating.usersThatDisliked
                });
              }
              return accumulator;
            },
            []
          );
          accumulator.push(...contendersWithRatingArray);
          return accumulator;
        },
        []
      );
      return contendersAndRatingsArray;
    } else {
      return [];
    }
  }
);
