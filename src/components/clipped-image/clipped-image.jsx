import React from "react";
import PropTypes from "prop-types";

import {
  ClippedImageContainer,
  ClippedImageContainerBorder
} from "./clipped-image.styles";

const ClippedImage = ({ url, alt }) => (
  <ClippedImageContainerBorder>
    <ClippedImageContainer src={url} alt={alt} />
  </ClippedImageContainerBorder>
);

ClippedImage.propTypes = {
  url: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired
};

ClippedImage.defaultProps = {
  url: "",
  alt: "avatar image"
};

export default ClippedImage;
