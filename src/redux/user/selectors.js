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
  [selectUserProfile],
  profile => profile.isLoaded
);

export const selectUserProfileIsEmpty = createSelector(
  [selectUserProfile],
  profile => profile.isEmpty
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
      ? profile.challengesInstances[category]
      : []
  );

export const selectUserIntancesToValidate = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? profile.instancesToValidate
      : []
);
