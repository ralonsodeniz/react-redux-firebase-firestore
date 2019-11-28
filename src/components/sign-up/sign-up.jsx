import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { signUpStart } from "../../redux/user/actions";

import CustomButton from "../custom-button/custom-button";

import {
  SignUpContainer,
  SignUpText,
  SignUpButtonsContainer
} from "./sign-up.styles";
import FormInput from "../form-input/form-input";

const SignUp = () => {
  const [userData, setUserData] = useState({
    displayName: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    country: ""
  });
  const { displayName, email, password, age, gender, country } = userData;
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
      dispatch(signUpStart(userData));
      setUserData({
        displayName: "",
        email: "",
        password: "",
        age: "",
        gender: "",
        country: ""
      });
    },
    [dispatch, userData]
  );

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
        <FormInput
          type="text"
          id="gender"
          name="gender"
          value={gender}
          handleChange={handleChange}
          label={"Gender"}
          required
        />
        <FormInput
          type="text"
          id="country"
          name="country"
          value={country}
          handleChange={handleChange}
          label={"Country"}
          required
        />
        <SignUpButtonsContainer>
          <CustomButton type={"submit"} text={"Register"} />
        </SignUpButtonsContainer>
      </form>
    </SignUpContainer>
  );
};

export default SignUp;
