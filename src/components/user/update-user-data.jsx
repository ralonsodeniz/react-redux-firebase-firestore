import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { updateUserDataStarts } from "../../redux/user/actions";
import { countryOptions, genderOptions } from "../../utils/options";

import CustomButton from "../custom-button/custom-button";
import FormInput from "../form-input/form-input";
import FormRadio from "../form-radio/form-radio";
import FormDropdown from "../form-dropdown/form-dropdown";

import { UpdateUserDataContainer, UpdateUserDataTitle } from "./user.styles";

const UpdateUserData = () => {
  const [userData, setUserData] = useState({
    displayName: "",
    age: "",
    gender: "",
    country: ""
  });

  const { displayName, age } = userData;

  const dispatch = useDispatch();

  const handleChange = useCallback(
    event => {
      const { name, value } = event.target;
      setUserData({
        ...userData,
        [name]: value
      });
      setUserData({
        displayName: "",
        age: "",
        gender: "",
        country: ""
      });
    },
    [userData]
  );

  const handleUpdateUserData = useCallback(
    event => {
      event.preventDefault();
      dispatch(updateUserDataStarts(userData));
      setUserData({
        displayName: "",
        age: "",
        gender: "",
        country: ""
      });
    },
    [dispatch, userData]
  );

  return (
    <UpdateUserDataContainer>
      <UpdateUserDataTitle>Update user data</UpdateUserDataTitle>
      <form onSubmit={handleUpdateUserData}>
        <FormInput
          type="text"
          id="displayName"
          name="displayName"
          value={displayName}
          handleChange={handleChange}
          label={"Display name"}
        />
        <FormInput
          type="number"
          id="age"
          name="age"
          value={age}
          handleChange={handleChange}
          label={"Age"}
        />
        <FormRadio
          name="gender"
          label="Gender"
          options={genderOptions}
          handleChange={handleChange}
        />
        <FormDropdown
          type="text"
          id="country"
          name="country"
          multiple={false}
          label="Country"
          handleChange={handleChange}
          require
          options={countryOptions}
          size={4}
        />
        <CustomButton type={"submit"} text={"Update"} />
      </form>
    </UpdateUserDataContainer>
  );
};

export default UpdateUserData;
