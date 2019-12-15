import React, { useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserProviderId,
  selectUserAcceptedFriends
} from "../../redux/user/selectors";
import { deleteUserStarts } from "../../redux/user/actions";

import FormInput from "../form-input/form-input";

import { UpdateUserDataContainer, UpdateUserDataTitle } from "./user.styles";
import CustomButton from "../custom-button/custom-button";

const selectDeleteUserData = createStructuredSelector({
  userProviderId: selectUserProviderId,
  userAcceptedFriends: selectUserAcceptedFriends
});

const DeleteUSer = () => {
  const dispatch = useDispatch();

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: ""
  });

  const { email, password } = userCredentials;

  const { userProviderId, userAcceptedFriends } = useSelector(
    selectDeleteUserData,
    shallowEqual
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

  const handleDeleteUser = useCallback(
    event => {
      event.preventDefault();
      dispatch(
        deleteUserStarts(userCredentials, userAcceptedFriends, userProviderId)
      );
      setUserCredentials({
        email: "",
        password: ""
      });
    },
    [dispatch, userCredentials, userAcceptedFriends, userProviderId]
  );

  return (
    <UpdateUserDataContainer>
      <UpdateUserDataTitle>Delete user</UpdateUserDataTitle>
      <form onSubmit={handleDeleteUser}>
        {userProviderId === "password" && (
          <div>
            <FormInput
              type="email"
              name="email"
              value={email}
              handleChange={handleChange}
              label="Email"
              required
            />
            <FormInput
              type="password"
              name="password"
              value={password}
              handleChange={handleChange}
              label="Password"
              required
            />
          </div>
        )}
        <CustomButton text={"Confirm delete user"} type={"submit"} />
      </form>
    </UpdateUserDataContainer>
  );
};

export default DeleteUSer;
