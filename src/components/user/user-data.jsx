import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserProfileDisplayName,
  selectUserProfileAge,
  selectUserProfileEmail,
  selectUserProfileCountry,
  selectUserProfileGender,
  selectUserProfileId
} from "../../redux/user/selectors";

import {
  UserDataContainer,
  UserDataTextTitle,
  UserDataText,
  DisplayNameContainer,
  AgeContainer,
  EmailContainer,
  CountryContainer,
  GenderContainer,
  UserIdContainer
} from "./user.styles";

const userDataSelector = createStructuredSelector({
  displayName: selectUserProfileDisplayName,
  age: selectUserProfileAge,
  email: selectUserProfileEmail,
  country: selectUserProfileCountry,
  gender: selectUserProfileGender,
  userId: selectUserProfileId
});

const UserData = () => {
  const selectUserData = useSelector(userDataSelector, shallowEqual);
  const { displayName, age, email, country, gender, userId } = selectUserData;

  return (
    <UserDataContainer>
      <DisplayNameContainer>
        <UserDataTextTitle>Display name:</UserDataTextTitle>
        <UserDataText>{displayName}</UserDataText>
      </DisplayNameContainer>
      <AgeContainer>
        <UserDataTextTitle>Age:</UserDataTextTitle>
        <UserDataText>{age}</UserDataText>
      </AgeContainer>
      <EmailContainer>
        <UserDataTextTitle>Email:</UserDataTextTitle>
        <UserDataText>{email}</UserDataText>
      </EmailContainer>
      <UserIdContainer>
        <UserDataTextTitle>User Id:</UserDataTextTitle>
        <UserDataText>{userId}</UserDataText>
      </UserIdContainer>
      <CountryContainer>
        <UserDataTextTitle>Country:</UserDataTextTitle>
        <UserDataText>{country}</UserDataText>
      </CountryContainer>
      <GenderContainer>
        <UserDataTextTitle>Gender:</UserDataTextTitle>
        <UserDataText>{gender}</UserDataText>
      </GenderContainer>
    </UserDataContainer>
  );
};

export default UserData;
