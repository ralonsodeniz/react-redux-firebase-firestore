import React, { useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserProfileIsEmpty } from "../../redux/user/selectors";
import { openModal } from "../../redux/modal/actions";

import UserAvatar from "./user-avatar";
import UserData from "./user-data";
import Spinner from "../spinner/spinner";
import CustomButton from "../custom-button/custom-button";

import { UserContainer, UserButtonsContainer } from "./user.styles";

const userDataSelector = createStructuredSelector({
  userProfileIsEmpty: selectUserProfileIsEmpty
});

const User = () => {
  const userData = useSelector(userDataSelector, shallowEqual);

  const dispatch = useDispatch();

  const { userProfileIsEmpty } = userData;

  const updateUserDataModalData = {
    modalType: "UPDATE_USER_DATA",
    modalProps: {}
  };

  const handleOpenUpdateUserData = useCallback(
    () => dispatch(openModal(updateUserDataModalData)),
    [dispatch, updateUserDataModalData]
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
      </UserButtonsContainer>
    </UserContainer>
  ) : (
    <UserContainer>
      <Spinner />
    </UserContainer>
  );
};

export default User;
