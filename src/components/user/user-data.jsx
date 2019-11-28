import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

// import {
//   selectUserProfileDisplayName,
//   selectUserProfileAge,
//   selectUserProfileEmail,
//   selectUserProfileCountry,
//   selectUserProfileGender,
//   selectUserProfileId
// } from "../../redux/user/selectors";
import {
  selectFirestoreUserData,
  selectFirestoreRequesting
} from "../../redux/firestore/user-selectors";

import Spinner from "../spinner/spinner";

import {
  UserDataContainer,
  UserDataTextTitle,
  UserDataText,
  DisplayNameContainer,
  AgeContainer,
  EmailContainer,
  CountryContainer,
  GenderContainer
} from "./user.styles";

// const userDataSelector = createStructuredSelector({
//   displayName: selectUserProfileDisplayName,
//   age: selectUserProfileAge,
//   email: selectUserProfileEmail,
//   country: selectUserProfileCountry,
//   gender: selectUserProfileGender,
//   id: selectUserProfileId
// });

const firestoreUserDataSelector = createStructuredSelector({
  firestoreUserData: selectFirestoreUserData,
  firestoreRequesting: selectFirestoreRequesting
});

const UserData = ({ uid }) => {
  // const selectUserData = useSelector(userDataSelector, shallowEqual);
  // const { displayName, age, email, country, gender, id } = selectUserData;
  const selectFirestoreUserData = useSelector(
    firestoreUserDataSelector,
    shallowEqual
  );
  const { firestoreUserData, firestoreRequesting } = selectFirestoreUserData;

  return !firestoreRequesting && firestoreUserData !== null ? (
    <UserDataContainer>
      {console.log("USERDATA RENDER")}
      <DisplayNameContainer>
        <UserDataTextTitle>Display name:</UserDataTextTitle>
        <UserDataText>{firestoreUserData[uid].displayName}</UserDataText>
      </DisplayNameContainer>
      <AgeContainer>
        <UserDataTextTitle>Age:</UserDataTextTitle>
        <UserDataText>{firestoreUserData[uid].age}</UserDataText>
      </AgeContainer>
      <EmailContainer>
        <UserDataTextTitle>Email:</UserDataTextTitle>
        <UserDataText>{firestoreUserData[uid].email}</UserDataText>
      </EmailContainer>
      <CountryContainer>
        <UserDataTextTitle>Country:</UserDataTextTitle>
        <UserDataText>{firestoreUserData[uid].country}</UserDataText>
      </CountryContainer>
      <GenderContainer>
        <UserDataTextTitle>Gender:</UserDataTextTitle>
        <UserDataText>{firestoreUserData[uid].gender}</UserDataText>
      </GenderContainer>
    </UserDataContainer>
  ) : (
    <UserDataContainer>
      <Spinner />
    </UserDataContainer>
  );
};

export default UserData;
