import React, { useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserProfileIsEmpty,
  selectUserProviderId
} from "../../redux/user/selectors";
import { openModal } from "../../redux/modal/actions";

import UserAvatar from "./user-avatar";
import UserData from "./user-data";
import Spinner from "../spinner/spinner";
import CustomButton from "../custom-button/custom-button";

import { UserContainer, UserButtonsContainer } from "./user.styles";

const userDataSelector = createStructuredSelector({
  userProfileIsEmpty: selectUserProfileIsEmpty,
  userProviderId: selectUserProviderId
});

const User = () => {
  const userData = useSelector(userDataSelector, shallowEqual);

  const dispatch = useDispatch();

  const { userProfileIsEmpty, userProviderId } = userData;

  const updateUserDataModalData = {
    modalType: "UPDATE_USER_DATA",
    modalProps: {}
  };

  const deleteUserModalData = {
    modalType: "DELETE_USER",
    modalProps: {}
  };

  const updateUserPasswordModalData = {
    modalType: "UPDATE_USER_PASSWORD",
    modalProps: {}
  };

  const handleOpenUpdateUserData = useCallback(
    () => dispatch(openModal(updateUserDataModalData)),
    [dispatch, updateUserDataModalData]
  );

  const handleOpenDeleteUser = useCallback(
    () => dispatch(openModal(deleteUserModalData)),
    [dispatch, deleteUserModalData]
  );

  const handleOpenUpdateUserPassword = useCallback(
    () => dispatch(openModal(updateUserPasswordModalData)),
    [dispatch, updateUserPasswordModalData]
  );

  return !userProfileIsEmpty ? (
    <UserContainer>
      {console.log("USER RENDER")}
      <UserAvatar />
      <UserData />
      <UserButtonsContainer>
        <CustomButton
          text="Update user data"
          type="button"
          onClick={handleOpenUpdateUserData}
        />
        <CustomButton
          text="Delete user"
          type="button"
          onClick={handleOpenDeleteUser}
        />
        {userProviderId === "password" && (
          <CustomButton
            text="Update user password"
            type="button"
            onClick={handleOpenUpdateUserPassword}
          />
        )}
      </UserButtonsContainer>
    </UserContainer>
  ) : (
    <UserContainer>
      <Spinner />
    </UserContainer>
  );
};

export default User;
