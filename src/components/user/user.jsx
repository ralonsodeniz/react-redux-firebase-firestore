import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserProfileIsEmpty } from "../../redux/user/selectors";

import UserAvatar from "./user-avatar";
import UserData from "./user-data";
import Spinner from "../spinner/spinner";

import { UserContainer } from "./user.styles";

const userDataSelector = createStructuredSelector({
  userProfileIsEmpty: selectUserProfileIsEmpty
});

const User = () => {
  const userData = useSelector(userDataSelector, shallowEqual);
  const { userProfileIsEmpty } = userData;
  return (
    <UserContainer>
      {console.log("USER RENDER")}
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
