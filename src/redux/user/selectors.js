import { createSelector } from "reselect";

// input selector
const selectUserAuth = state => state.firebase.auth;
const selectUserProfile = state => state.firebase.profile;

// output selector
export const selectUserAuthIsLoaded = createSelector(
  [selectUserAuth],
  auth => auth.isLoaded
);

export const selectUserAuthIsEmpty = createSelector(
  [selectUserAuth],
  auth => auth.isEmpty
);

export const selectUserProfileIsLoaded = createSelector(
  [selectUserProfile, selectUserAuthIsLoaded],
  (profile, authIsLoaded) =>
    authIsLoaded ? (profile.isLoaded ? true : false) : false
);

export const selectUserProfileIsEmpty = createSelector(
  [selectUserProfile, selectUserAuthIsLoaded],
  (profile, authIsLoaded) =>
    authIsLoaded
      ? profile.isLoaded
        ? profile.isEmpty
          ? true
          : false
        : true
      : true
);

export const selectUserProfilePhotoURL = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? profile.photoURL
      : ""
);

export const selectUserProfileId = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty ? profile.uid : ""
);

export const selectUserProfileDisplayName = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? profile.displayName
      : ""
);

export const selectUserProfileAge = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty ? profile.age : 0
);

export const selectUserProfileEmail = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty ? profile.email : ""
);

export const selectUserProfileCountry = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty ? profile.country : ""
);

export const selectUserProfileGender = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty ? profile.gender : ""
);

export const selectUserEmailVerified = createSelector(
  [selectUserAuth],
  auth => auth.emailVerified
);

export const selectUserAcceptedFriends = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? profile.friends.accepted
      : []
);

export const selectUserAcceptedInstancesByCategory = category =>
  createSelector([selectUserProfile, selectUserAuth], (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? category === "all"
        ? Object.values(profile.challengesInstances).reduce(
            (accumulator, challengeInstance) => {
              accumulator = [...accumulator, ...challengeInstance];
              return accumulator;
            },
            []
          )
        : profile.challengesInstances[category]
        ? profile.challengesInstances[category]
        : []
      : []
  );

export const selectUserIntancesToValidate = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? profile.instancesToValidate
        ? profile.instancesToValidate
        : []
      : []
);
