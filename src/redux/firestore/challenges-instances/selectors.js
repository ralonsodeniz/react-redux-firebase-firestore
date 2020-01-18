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
              if (contender.public && contender.status === "Completed") {
                accumulator.push({
                  id: contender.id,
                  proofUrl: contender.proof.url,
                  poster: contender.poster,
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

export const selectCompletedTemplatesFromUserInstancesObject = createSelector(
  [
    selectChallengesInstances,
    selectChallengesInstancesAreLoading,
    (_, instances, userProfileId) => ({ instances, userProfileId })
  ],
  (
    challengesInstances,
    challengesInstancesAreLoading,
    { instances, userProfileId }
  ) => {
    return challengesInstances &&
      !challengesInstancesAreLoading &&
      instances &&
      userProfileId
      ? Object.entries(instances).reduce((accumulator, category) => {
          const [key, value] = category;
          accumulator[key] = [];
          value.forEach(instance => {
            const duplicatedInstance = accumulator[key].find(
              storedInstance =>
                storedInstance.templateId ===
                challengesInstances[instance].challengeTemplateId
            );

            const duplicatedInstanceIndex = accumulator[key].indexOf(
              duplicatedInstance
            );

            const contender = challengesInstances[instance].contenders.find(
              challengeContender => challengeContender.id === userProfileId
            );

            if (contender.status === "Completed") {
              let rankingPosition = null;
              if (contender.public) {
                const instancesFromTemplateArray = Object.values(
                  challengesInstances
                ).filter(
                  challenge =>
                    challenge.challengeTemplateId ===
                    challengesInstances[instance].challengeTemplateId
                );

                const templateRankingArray = instancesFromTemplateArray.reduce(
                  (accumulator, instance) => {
                    const contendersAndRankingFromInstance = instance.contenders.reduce(
                      (accumulator, instanceContender) => {
                        if (
                          instanceContender.public &&
                          instanceContender.status === "Completed"
                        ) {
                          accumulator.push({
                            id: instanceContender.id,
                            rating: instanceContender.rating,
                            instanceId: instance.challengeInstanceId
                          });
                        }
                        return accumulator;
                      },
                      []
                    );
                    accumulator = [
                      ...accumulator,
                      ...contendersAndRankingFromInstance
                    ];
                    return accumulator;
                  },
                  []
                );

                const sortedTemplateRankingArray = templateRankingArray.sort(
                  (a, b) =>
                    a.rating.likes > b.rating.likes
                      ? -1
                      : a.rating.likes === b.rating.likes
                      ? a.dislikes > b.dislikes
                        ? 1
                        : -1
                      : 1
                );

                const userObject = sortedTemplateRankingArray.find(
                  user =>
                    user.id === userProfileId &&
                    user.instanceId ===
                      challengesInstances[instance].challengeInstanceId
                );

                rankingPosition =
                  sortedTemplateRankingArray.indexOf(userObject) + 1;
              }

              if (duplicatedInstance) {
                if (duplicatedInstance.rating.likes > contender.rating.likes) {
                  return accumulator;
                } else if (
                  duplicatedInstance.rating.likes < contender.rating.likes
                ) {
                  accumulator[key].splice(duplicatedInstanceIndex, 1, {
                    instanceId: instance,
                    templateId:
                      challengesInstances[instance].challengeTemplateId,
                    public: contender.proof.public,
                    rating: contender.rating,
                    rankingPosition
                  });
                } else if (
                  duplicatedInstance.rating.likes === contender.rating.likes
                ) {
                  if (
                    duplicatedInstance.rating.dislikes >
                    contender.rating.dislikes
                  ) {
                    accumulator[key].splice(duplicatedInstanceIndex, 1, {
                      instanceId: instance,
                      templateId:
                        challengesInstances[instance].challengeTemplateId,
                      public: contender.proof.public,
                      rating: contender.rating,
                      rankingPosition
                    });
                  } else return accumulator;
                }
                // }
              } else {
                accumulator[key] = [
                  ...accumulator[key],
                  {
                    instanceId: instance,
                    templateId:
                      challengesInstances[instance].challengeTemplateId,
                    public: contender.public,
                    rating: contender.rating,
                    rankingPosition
                  }
                ];
              }
            }
          });
          return accumulator;
        }, {})
      : {};
  }
);
