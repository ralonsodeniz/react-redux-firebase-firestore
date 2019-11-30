import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserProfileDisplayName,
  selectUserProfileAge,
  selectUserProfileEmail,
  selectUserProfileCountry,
  selectUserProfileGender
} from "../../redux/user/selectors";

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

const userDataSelector = createStructuredSelector({
  displayName: selectUserProfileDisplayName,
  age: selectUserProfileAge,
  email: selectUserProfileEmail,
  country: selectUserProfileCountry,
  gender: selectUserProfileGender
});

const UserData = () => {
  const selectUserData = useSelector(userDataSelector, shallowEqual);
  const { displayName, age, email, country, gender } = selectUserData;

  return (
    <UserDataContainer>
      {console.log("USERDATA RENDER")}
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
