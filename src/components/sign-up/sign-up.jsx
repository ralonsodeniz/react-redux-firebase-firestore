import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { signUpStart } from "../../redux/user/actions";
import { openModal } from "../../redux/modal/actions";
import { countryOptions } from "../../utils/options";

import CustomButton from "../custom-button/custom-button";

import {
  SignUpContainer,
  SignUpText,
  SignUpButtonsContainer
} from "./sign-up.styles";
import FormInput from "../form-input/form-input";
import FormRadio from "../form-radio/form-radio";
import FormDropdown from "../form-dropdown/form-dropdown";

const SignUp = () => {
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    country: ""
  });

  const { displayName, email, password, age } = userData;

  const dispatch = useDispatch();

  const handleChange = useCallback(
    event => {
      const { value, name } = event.target;
      setUserData({
        ...userData,
        [name]: value
      });
    },
    [userData]
  );

  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      if (Object.values(userData).some(value => value === "")) {
        const emptyValueModalData = {
          modalType: "SYSTEM_MESSAGE",
          modalProps: {
            text: "Please fill all the form entries"
          }
        };
        dispatch(openModal(emptyValueModalData));
        return;
      } else {
        dispatch(signUpStart(userData));
        setUserData({
          displayName: "",
          email: "",
          password: "",
          age: "",
          gender: "",
          country: ""
        });
      }
    },
    [dispatch, userData]
  );

  const genderOptions = [
    {
      value: "Male",
      text: "Male"
    },
    {
      value: "Female",
      text: "Female"
    }
  ];

  return (
    <SignUpContainer>
      <SignUpText>Create a new account</SignUpText>
      <form onSubmit={handleSubmit}>
        <FormInput
          type="text"
          id="displayName"
          name="displayName"
          value={displayName}
          handleChange={handleChange}
          label={"Display name"}
          required
        />
        <FormInput
          type="email"
          id="email"
          name="email"
          value={email}
          handleChange={handleChange}
          label={"Email"}
          required
        />
        <FormInput
          type="password"
          id="password"
          name="password"
          value={password}
          handleChange={handleChange}
          label={"Password"}
          required
        />
        <FormInput
          type="number"
          id="age"
          name="age"
          value={age}
          handleChange={handleChange}
          label={"Age"}
          required
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
        <SignUpButtonsContainer>
          <CustomButton type={"submit"} text={"Register"} />
        </SignUpButtonsContainer>
      </form>
    </SignUpContainer>
  );
};

export default SignUp;
