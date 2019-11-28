import React, { useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import { signOutStart } from "../../redux/user/actions";
import { selectUserProfileIsEmpty } from "../../redux/user/selectors";

import CustomButton from "../custom-button/custom-button";
import UserAvatar from "./user-avatar";
import UserData from "./user-data";
import Spinner from "../spinner/spinner";

import { UserContainer, LogOutButtonContainer } from "./user.styles";

const userDataSelector = createStructuredSelector({
  userProfileIsEmpty: selectUserProfileIsEmpty
});

const User = () => {
  const userData = useSelector(userDataSelector, shallowEqual);
  const { userProfileIsEmpty } = userData;
  const dispatch = useDispatch();
  const handleSignOut = useCallback(() => {
    dispatch(signOutStart());
  }, [dispatch]);
  return (
    <UserContainer>
      <LogOutButtonContainer>
        <CustomButton type="button" text="Sign out" onClick={handleSignOut} />
      </LogOutButtonContainer>
      {!userProfileIsEmpty ? (
        <div>
          <UserAvatar />
          <UserData />
        </div>
      ) : (
        <Spinner />
      )}
    </UserContainer>
  );
};

export default User;
