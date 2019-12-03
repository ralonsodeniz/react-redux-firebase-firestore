import React, { useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserProfilePhotoURL,
  selectUserProfileId
} from "../../redux/user/selectors";
import { updateAvatarStart } from "../../redux/user/actions";

import ClippedImage from "../clipped-image/clipped-image";
import FileUploader from "../file-uplader/file-uploader";
import { ReactComponent as UserIcon } from "../../assets/user.svg";

import { UserAvatarContainer, AvatarContainer } from "./user.styles";

const selectUserAvatarData = createStructuredSelector({
  userPhotoURL: selectUserProfilePhotoURL,
  userId: selectUserProfileId
});

const UserAvatar = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserAvatarData, shallowEqual);
  const { userPhotoURL, userId } = userData;
  const directory = `users/${userId}/userPhoto`;
  const dispatchedUpdateAvatarStart = useCallback(
    url => dispatch(updateAvatarStart(url)),
    [dispatch]
  );

  return (
    <UserAvatarContainer>
      {console.log("AVATAR RENDER")}
      {userPhotoURL !== "" ? (
        <ClippedImage url={userPhotoURL} alt={"User Avatar"} />
      ) : (
        <AvatarContainer>
          <UserIcon />
        </AvatarContainer>
      )}
      <FileUploader
        fileType="image"
        directory={directory}
        fileName="avatar"
        urlAction={dispatchedUpdateAvatarStart}
        labelText="Choose your profile image"
        submitText="Upload image"
      />
    </UserAvatarContainer>
  );
};

export default UserAvatar;