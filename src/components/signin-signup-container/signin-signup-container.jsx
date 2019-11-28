import React, { useState, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";

import { selectUserAuthIsEmpty } from "../../redux/user/selectors";

import SignIn from "../sign-in/sign-in";
import SignUp from "../sign-up/sign-up";

import {
  SignInAndSignUpFrame,
  OptionTextContainer,
  OptionText
} from "./signin-signup-container.styles";

const SignInSignUpContainer = () => {
  const [route, setRoute] = useState("signin");
  const userIsAuthEmpty = useSelector(selectUserAuthIsEmpty, shallowEqual);
  const handleClick = useCallback(newRoute => setRoute(newRoute), []);

  return userIsAuthEmpty ? (
    route === "signin" ? (
      <SignInAndSignUpFrame>
        <SignIn />
        <OptionTextContainer>
          <OptionText onClick={() => handleClick("signup")}>
            Register an account
          </OptionText>
        </OptionTextContainer>
      </SignInAndSignUpFrame>
    ) : (
      <SignInAndSignUpFrame>
        <SignUp />
        <OptionTextContainer>
          <OptionText onClick={() => handleClick("signin")}>
            Go to sign in
          </OptionText>
        </OptionTextContainer>
      </SignInAndSignUpFrame>
    )
  ) : null;
};

export default SignInSignUpContainer;
