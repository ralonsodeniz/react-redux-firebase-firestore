import React from "react";
import { Route, useRouteMatch, Link } from "react-router-dom";

import SignIn from "../../components/sign-in/sign-in";
import ResetPassword from "../../components/sign-in/reset-password";
import ResendVerificationEmail from "../../components/sign-in/resend-verification-email";

import { SigninContainer, SigninNavigationContainer } from "./signin.styles";

const SigninPage = () => {
  const { path } = useRouteMatch();

  return (
    <SigninContainer>
      <SigninNavigationContainer>
        <Link to={`/signin`}>Sign in</Link>
        <Link to={`/signin/resetPassword`}>Reset password</Link>
        <Link to={`/signin/resendVerificationEmail`}>
          Resend verification email
        </Link>
      </SigninNavigationContainer>
      <Route exact path={path} component={SignIn} />
      <Route exact path={`${path}/resetPassword`} component={ResetPassword} />
      <Route
        exact
        path={`${path}/resendVerificationEmail`}
        component={ResendVerificationEmail}
      />
    </SigninContainer>
  );
};

export default SigninPage;
