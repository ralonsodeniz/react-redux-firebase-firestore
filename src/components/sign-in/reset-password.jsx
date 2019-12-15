import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { resetUserPasswordStarts } from "../../redux/user/actions";

import FormInput from "../form-input/form-input";
import CustomButton from "../custom-button/custom-button";

import { SignInContainer, SignInText } from "./sign-in.styles";

const ResetPassword = () => {
  const [userEmail, setUserEmail] = useState("");

  const dispatch = useDispatch();

  const handleChange = useCallback(event => {
    const { value } = event.target;
    setUserEmail(value);
  }, []);

  const handleResetPassword = useCallback(
    event => {
      event.preventDefault();
      dispatch(resetUserPasswordStarts(userEmail));
      setUserEmail("");
    },
    [dispatch, userEmail]
  );

  return (
    <SignInContainer>
      <SignInText>Reset user password</SignInText>
      <form onSubmit={handleResetPassword}>
        <FormInput
          type="email"
          id="email"
          name="email"
          value={userEmail}
          handleChange={handleChange}
          label="Email"
          required
        />
        <CustomButton text={"Reset user password"} type={"submit"} />
      </form>
    </SignInContainer>
  );
};

export default ResetPassword;
