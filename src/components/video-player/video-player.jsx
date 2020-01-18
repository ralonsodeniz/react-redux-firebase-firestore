import React from "react";
import PropTypes from "prop-types";

import { VideoFrame } from "./video-player.styles";

const VideoPlayer = ({ videoUrl, videoPoster }) => {
  return (
    <VideoFrame
      src={videoUrl}
      controls
      controlsList="nodownload"
      preload="none"
      poster={videoPoster}
    />
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired
};

export default VideoPlayer;
