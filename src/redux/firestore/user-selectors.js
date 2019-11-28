import { createSelector } from "reselect";

const selectFirestore = state => state.firestore;

export const selectFirestoreUserData = createSelector(
  [selectFirestore],
  firestore => firestore.data.users
);

export const selectFirestoreUserOrderedData = createSelector(
  [selectFirestore],
  firestore => firestore.ordered
);

export const selectFirestoreRequesting = createSelector(
  [selectFirestore],
  firestore =>
    firestore.data !== {}
      ? Object.values(firestore.status.requesting).includes(true)
      : true
);
