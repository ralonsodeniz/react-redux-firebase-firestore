import React, { useCallback } from "react";
import PropTypes from "prop-types";

import { ImageFrame, ImageContainer } from "./image-viewer.styles";

const ImageViewer = ({ imageUrl }) => {
  const handleImageFullScreen = useCallback(() => {
    const image = document.getElementById("imageProof");
    if (image.requestFullscreen) {
      image.requestFullscreen();
    } else if (image.mozRequestFullScreen) {
      image.mozRequestFullScreen();
    } else if (image.webkitRequestFullscreen) {
      image.webkitRequestFullscreen();
    } else if (image.msRequestFullscreen) {
      image.msRequestFullscreen();
    }
  }, []);

  const fullScreenEmojisStyles = {
    position: "absolute",
    top: "47vh",
    left: "47vw",
    cursor: "pointer"
  };

  return (
    <ImageContainer>
      <ImageFrame src={imageUrl} alt="contender image proof" id="imageProof" />
      <span
        role="img"
        aria-label="like"
        aria-labelledby="like"
        onClick={handleImageFullScreen}
        style={fullScreenEmojisStyles}
      >
        &#128306;
      </span>
    </ImageContainer>
  );
};

ImageViewer.propTypes = {
  imageUrl: PropTypes.string.isRequired
};

export default ImageViewer;
