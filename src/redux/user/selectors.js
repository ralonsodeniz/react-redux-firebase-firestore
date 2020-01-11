import { createSelector } from "reselect";

// input selector
const selectUserAuth = state => state.firebase.auth;
const selectUserProfile = state => state.firebase.profile;
const selectUsers = state => state.firestore.data.users;

// Selectors for auth and profile reducers
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

export const selectUserProviderId = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? profile.providerId
      : ""
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

export const selectUserPendingFriends = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? profile.friends.pending
      : []
);

export const selectUserGlobalValidator = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? profile.globalValidator
      : {}
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

export const selectAllUserAcceptedInstances = createSelector(
  [selectUserProfile, selectUserAuth],
  (profile, auth) =>
    profile.isLoaded && !profile.isEmpty && !auth.isEmpty
      ? profile.challengesInstances
      : {}
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

// selectors for users reducer

export const selectUsersAreLoading = createSelector(
  state => state.firestore.status.requesting,
  requesting => requesting.users
);

export const selectUsersDisplayNamesById = createSelector(
  [selectUsers, selectUsersAreLoading, (_, usersArray) => usersArray],
  (users, usersAreLoading, usersArray) =>
    !usersAreLoading && users && usersArray
      ? !Array.isArray(usersArray)
        ? users[usersArray]
          ? users[usersArray].displayName
          : "User not found"
        : usersArray.map(user =>
            users[user] ? users[user].displayName : "User not found"
          )
      : []
);

export const selectAllUsersId = createSelector(
  [selectUsers, selectUsersAreLoading],
  (users, usersAreLoading) =>
    !usersAreLoading && users ? Object.keys(users) : []
);

export const selectUserProfilePhotoUrlById = createSelector(
  [selectUsers, selectUsersAreLoading, (_, userId) => userId],
  (users, usersAreLoading, userId) => {
    return users && !usersAreLoading && userId
      ? users[userId]
        ? users[userId].photoURL
        : "user not found"
      : "";
  }
);

export const selectUserProfileDisplayNameById = createSelector(
  [selectUsers, selectUsersAreLoading, (_, userId) => userId],
  (users, usersAreLoading, userId) => {
    return users && !usersAreLoading && userId
      ? users[userId]
        ? users[userId].displayName
        : "user not found"
      : "";
  }
);

export const selectUserProfileIdById = createSelector(
  [selectUsers, selectUsersAreLoading, (_, userId) => userId],
  (users, usersAreLoading, userId) => {
    return users && !usersAreLoading && userId
      ? users[userId]
        ? users[userId].uid
        : "user not found"
      : "";
  }
);

export const selectAllUserAcceptedInstancesById = createSelector(
  [selectUsers, selectUsersAreLoading, (_, userId) => userId],
  (users, usersAreLoading, userId) => {
    return users && !usersAreLoading && userId
      ? users[userId]
        ? users[userId].challengesInstances
        : {}
      : {};
  }
);

export const selectUserPendingFriendsById = createSelector(
  [selectUsers, selectUsersAreLoading, (_, userId) => userId],
  (users, usersAreLoading, userId) => {
    return users && !usersAreLoading && userId
      ? users[userId]
        ? users[userId].friends.pending
        : []
      : [];
  }
);
