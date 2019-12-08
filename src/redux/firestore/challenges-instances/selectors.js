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
