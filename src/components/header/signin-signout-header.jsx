import React, { useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link } from "react-router-dom";

import { signOutStarts } from "../../redux/user/actions";
import {
  selectUserAuthIsLoaded,
  selectUserAuthIsEmpty
} from "../../redux/user/selectors";

import Spinner from "../spinner/spinner";

import {
  HeaderSigninSignOutContainer,
  HeaderSigninSignOutSpan,
  HeaderSigninSignupContainer,
  HeaderAccountContainer
} from "./header.styles";

const authDataSelector = createStructuredSelector({
  userAuthIsLoaded: selectUserAuthIsLoaded,
  userAuthIsEmpty: selectUserAuthIsEmpty
});

const SigninSignOutHeader = () => {
  const authData = useSelector(authDataSelector, shallowEqual);
  const { userAuthIsLoaded, userAuthIsEmpty } = authData;
  const dispatch = useDispatch();
  const handleSignOut = useCallback(() => dispatch(signOutStarts()), [
    dispatch
  ]);

  return (
    <HeaderSigninSignOutContainer>
      {userAuthIsLoaded ? (
        userAuthIsEmpty ? (
          <HeaderSigninSignupContainer>
            <Link to="/signin">Sign in</Link>
            or
            <Link to="/signup">Sign up</Link>
          </HeaderSigninSignupContainer>
        ) : (
          <HeaderAccountContainer>
            <Link to="/playground">Playground</Link>
            <Link to="/account">Account</Link>
            <HeaderSigninSignOutSpan onClick={handleSignOut}>
              Sign out
            </HeaderSigninSignOutSpan>
          </HeaderAccountContainer>
        )
      ) : (
        <Spinner />
      )}
    </HeaderSigninSignOutContainer>
  );
};

export default SigninSignOutHeader;
