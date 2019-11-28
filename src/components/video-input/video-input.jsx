import React, { useState, useCallback } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { updateUrl } from "../../redux/video/actions";
import { openModal } from "../../redux/modal/actions";
import { selectVideoUrl } from "../../redux/video/selectors";

import CustomButton from "../custom-button/custom-button";
import FormInput from "../form-input/form-input";

import { VideoInputContainer, VideoInputForm } from "./video-input.styles";

const VideoInput = () => {
  const [url, setUrl] = useState("");
  const videoUrl = useSelector(selectVideoUrl, shallowEqual);
  const videoPlayerData = {
    modalType: "VIDEO_PLAYER",
    modalProps: {}
  };
  const videoUrlEmptyData = {
    modalType: "SYSTEM_MESSAGE",
    modalProps: {
      text: "Video url cannot be empty"
    }
  };
  const dispatch = useDispatch();
  const getVideoUrl = useCallback(
    url => {
      if (url !== "") {
        dispatch(updateUrl(url));
        setUrl("");
      } else {
        dispatch(openModal(videoUrlEmptyData));
      }
    },
    [dispatch, videoUrlEmptyData]
  );
  const openVideoInModal = useCallback(() => {
    if (videoUrl !== "") {
      dispatch(openModal(videoPlayerData));
    } else {
      dispatch(openModal(videoUrlEmptyData));
    }
  }, [dispatch, videoPlayerData, videoUrl, videoUrlEmptyData]);
  const handleChange = event => {
    setUrl(event.target.value);
  };

  return (
    <VideoInputContainer>
      <VideoInputForm>
        <FormInput
          type="text"
          id="videoUrl"
          value={url}
          name="videoUrl"
          handleChange={handleChange}
          required
          label="Video URL"
        />
        <CustomButton text={"Submit url"} onClick={() => getVideoUrl(url)} />
      </VideoInputForm>
      <CustomButton text={"Open video"} onClick={openVideoInModal} />
    </VideoInputContainer>
  );
};

export default VideoInput;
