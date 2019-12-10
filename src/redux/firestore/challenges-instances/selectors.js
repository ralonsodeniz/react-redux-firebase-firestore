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
  [selectChallengesInstances, (_, instanceId) => instanceId],
  (challengesInstances, instanceId) =>
    challengesInstances && instanceId ? challengesInstances[instanceId] : {}
);

export const selectInstanceTemplateId = createSelector(
  [selectInstanceFromId],
  challengeInstance =>
    challengeInstance ? challengeInstance.challengeTemplateId : ""
);
