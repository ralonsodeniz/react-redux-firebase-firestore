import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import {
  googleSignInStarts,
  emailAndPasswordSignInStart
} from "../../redux/user/actions";

import FormInput from "../form-input/form-input";
import CustomButton from "../custom-button/custom-button";

import {
  SignInContainer,
  SignInText,
  SignInButtonsContainer
} from "./sign-in.styles";

const SignIn = () => {
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
  const handleSignInWithEmailAndPassword = useCallback(
    event => {
      event.preventDefault();
      dispatch(emailAndPasswordSignInStart(userCredentials));
      setUserCredentials({ email: "", password: "" });
    },
    [dispatch, userCredentials]
  );
  const handleSignInWithGoogle = useCallback(
    () => dispatch(googleSignInStarts()),
    [dispatch]
  );

  return (
    <SignInContainer>
      <SignInText>Sign in with your email and password</SignInText>
      <form onSubmit={handleSignInWithEmailAndPassword}>
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
        <SignInButtonsContainer>
          <CustomButton text={"Sign in"} type={"submit"} />
          <CustomButton
            text={"Sign in with Google"}
            type={"button"}
            onClick={handleSignInWithGoogle}
          />
        </SignInButtonsContainer>
      </form>
    </SignInContainer>
  );
};

export default SignIn;
