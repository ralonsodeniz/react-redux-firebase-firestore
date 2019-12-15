import React, { useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { updateUserPasswordStarts } from "../../redux/user/actions";
import { openModal } from "../../redux/modal/actions";

import FormInput from "../form-input/form-input";
import CustomButton from "../custom-button/custom-button";

import { UpdateUserDataContainer, UpdateUserDataTitle } from "./user.styles";

const UpdateUserPassword = () => {
  const dispatch = useDispatch();

  const [userCredentials, setUserCredentials] = useState({
    newPassword: "",
    confirmPassword: "",
    password: ""
  });

  const { newPassword, confirmPassword, password } = userCredentials;

  const handleUpdateUserPassword = useCallback(
    event => {
      event.preventDefault();
      if (newPassword !== confirmPassword) {
        const passwordsDoNotMatchModalData = {
          modalType: "SYSTEM_MESSAGE",
          modalProps: {
            text: "Passwords do not match"
          }
        };
        dispatch(openModal(passwordsDoNotMatchModalData));
        return;
      } else {
        dispatch(updateUserPasswordStarts(newPassword, password));
        setUserCredentials({
          newPassword: "",
          confirmPassword: "",
          password: ""
        });
      }
    },
    [dispatch, newPassword, confirmPassword, password]
  );

  const handleChange = useCallback(
    event => {
      const { name, value } = event.target;
      setUserCredentials({
        ...userCredentials,
        [name]: value
      });
    },
    [userCredentials]
  );

  return (
    <UpdateUserDataContainer>
      <UpdateUserDataTitle>Update password</UpdateUserDataTitle>
      <form onSubmit={handleUpdateUserPassword}>
        <FormInput
          type="password"
          name="newPassword"
          value={newPassword}
          handleChange={handleChange}
          label="New password"
          required
        />
        <FormInput
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          handleChange={handleChange}
          label="Confirm new password"
          required
        />
        <FormInput
          type="password"
          name="password"
          value={password}
          handleChange={handleChange}
          label="Current password"
          required
        />
        <CustomButton type="submit" text="Update password" />
      </form>
    </UpdateUserDataContainer>
  );
};

export default UpdateUserPassword;
