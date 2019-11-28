import React, { useState, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserProfilePhotoURL,
  selectUserProfileId
} from "../../redux/user/selectors";
import { openModal } from "../../redux/modal/actions";
import { uploadFileToStorage } from "../../firebase/firebase.utils";
import { updateAvatarStart } from "../../redux/user/actions";

import CustomButton from "../custom-button/custom-button";
import CircularProgress from "../circular-progress/circular-progress";
import ClippedImage from "../clipped-image/clipped-image";
import { ReactComponent as UserIcon } from "../../assets/user.svg";

import {
  UserAvatarContainer,
  AvatarContainer,
  CircularProgressContainer,
  UpdateAvatarContainer,
  InputFileContainer,
  LabelFileContainer
} from "./user.styles";

const selectUserAvatarData = createStructuredSelector({
  userPhotoURL: selectUserProfilePhotoURL,
  userId: selectUserProfileId
});

const UserAvatar = () => {
  const dispatch = useDispatch();
  const userData = useSelector(selectUserAvatarData, shallowEqual);
  const { userPhotoURL, userId } = userData;
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = useCallback(
    event => {
      if (event.target.files.length > 1) {
        const invalidNumberOfFilesModalData = {
          modalType: "SYSTEM_MESSAGE",
          modalProps: {
            text: "Please choose only one file"
          }
        };
        return dispatch(openModal(invalidNumberOfFilesModalData));
      }
      setImage(event.target.files[0]);
    },
    [dispatch]
  );

  const handleFileUpload = useCallback(() => {
    if (image) {
      if (/\.(jpe?g|png|gif)$/i.test(image.name)) {
        const imageSize = image.size / 1024 / 1024;
        if (imageSize > 1) {
          const invalidImageSizeModalData = {
            modalType: "SYSTEM_MESSAGE",
            modalProps: {
              text: `Avatar file is ${imageSize.toFixed(
                2
              )} MB and the maximun file size is 1 MB`
            }
          };
          return dispatch(openModal(invalidImageSizeModalData));
        }
        const directory = `${userId}/userPhoto`;
        const fileName = `avatar`;
        const action = url => dispatch(updateAvatarStart(url));
        uploadFileToStorage(
          directory,
          fileName,
          image,
          setProgress,
          setLoading,
          setImage,
          action
        );
      } else {
        const invalidImageTypeModalData = {
          modalType: "SYSTEM_MESSAGE",
          modalProps: {
            text: "Image file type is not supported"
          }
        };
        dispatch(openModal(invalidImageTypeModalData));
      }
    } else {
      const notFileSelectedModalData = {
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text: "Please select an image first"
        }
      };
      dispatch(openModal(notFileSelectedModalData));
    }
  }, [dispatch, image, userId]);

  return (
    <UserAvatarContainer>
      {console.log("AVATAR RENDER")}
      <AvatarContainer>
        {loading ? (
          <CircularProgressContainer>
            <CircularProgress
              radius={34}
              progress={progress}
              color={"black"}
              backgroundColor={"transparent"}
            />
          </CircularProgressContainer>
        ) : userPhotoURL !== "" ? (
          <ClippedImage url={userPhotoURL} alt={"User Avatar"} />
        ) : (
          <UserIcon />
        )}
      </AvatarContainer>
      <UpdateAvatarContainer>
        <InputFileContainer
          type="file"
          id="file"
          name="file"
          onChange={handleFileChange}
        />
        <LabelFileContainer htmlFor="file">
          Choose your profile image
        </LabelFileContainer>
        <CustomButton
          type="button"
          text="Upload image"
          onClick={handleFileUpload}
        />
      </UpdateAvatarContainer>
    </UserAvatarContainer>
  );
};

export default UserAvatar;
