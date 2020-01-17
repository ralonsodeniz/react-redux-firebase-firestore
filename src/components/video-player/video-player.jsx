import React from "react";
import PropTypes from "prop-types";

import { VideoFrame } from "./video-player.styles";

const VideoPlayer = ({ videoUrl }) => {
  return (
    <VideoFrame
      src={videoUrl}
      controls
      controlsList="nodownload"
      preload="none"
    />
  );
};

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired
};

export default VideoPlayer;
