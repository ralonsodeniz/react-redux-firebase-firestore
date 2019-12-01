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

export const selectFirestoreRequesting = () =>
  createSelector([selectFirestore, (_, uid) => uid], (firestore, uid) =>
    firestore.data.users === null || firestore.data.users === undefined
      ? true
      : firestore.data.users.hasOwnProperty(uid)
      ? false
      : true
  );
