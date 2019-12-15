import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { resendVerificationEmailStarts } from "../../redux/user/actions";

import FormInput from "../form-input/form-input";
import CustomButton from "../custom-button/custom-button";

import { SignInContainer, SignInText } from "./sign-in.styles";

const ResendVerificationEmail = () => {
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: ""
  });

  const { email, password } = userCredentials;

  const dispatch = useDispatch();

  const handleChange = useCallback(
    event => {
      const { value, name } = event.target;
      setUserCredentials({
        ...userCredentials,
        [name]: value
      });
    },
    [userCredentials]
  );

  const handleResendVerificationEmail = useCallback(
    event => {
      event.preventDefault();
      dispatch(resendVerificationEmailStarts(userCredentials));
      setUserCredentials({ email: "", password: "" });
    },
    [dispatch, userCredentials]
  );

  return (
    <SignInContainer>
      <SignInText>Resend verification email</SignInText>
      <form onSubmit={handleResendVerificationEmail}>
        <FormInput
          type="email"
          id="email"
          name="email"
          value={email}
          handleChange={handleChange}
          label="Email"
          required
        />
        <FormInput
          type="password"
          id="password"
          name="password"
          value={password}
          handleChange={handleChange}
          label="Password"
          required
        />
        <CustomButton text={"Resend verification email"} type={"submit"} />
      </form>
    </SignInContainer>
  );
};

export default ResendVerificationEmail;
