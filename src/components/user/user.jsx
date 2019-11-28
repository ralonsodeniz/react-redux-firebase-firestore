import React, { useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useFirestoreConnect } from "react-redux-firebase";

import { signOutStart } from "../../redux/user/actions";
import {
  selectUserProfileIsEmpty,
  selectUserAuthId
} from "../../redux/user/selectors";

import CustomButton from "../custom-button/custom-button";
import UserAvatar from "./user-avatar";
import UserData from "./user-data";
import Spinner from "../spinner/spinner";

import { UserContainer, LogOutButtonContainer } from "./user.styles";

const userDataSelector = createStructuredSelector({
  userProfileIsEmpty: selectUserProfileIsEmpty,
  userAuthId: selectUserAuthId
});

const User = () => {
  const userData = useSelector(userDataSelector, shallowEqual);
  const { userProfileIsEmpty, userAuthId } = userData;
  const query = {
    collection: `users`,
    where: ["uid", "==", userAuthId]
  };
  useFirestoreConnect([query]);
  const dispatch = useDispatch();
  const handleSignOut = useCallback(() => {
    dispatch(signOutStart());
  }, [dispatch]);
  return (
    <UserContainer>
      {console.log("USER RENDER")}
      <LogOutButtonContainer>
        <CustomButton type="button" text="Sign out" onClick={handleSignOut} />
      </LogOutButtonContainer>
      {!userProfileIsEmpty ? (
        <div>
          <UserAvatar />
          <UserData uid={userAuthId} />
        </div>
      ) : (
        <Spinner />
      )}
    </UserContainer>
  );
};

export default User;
