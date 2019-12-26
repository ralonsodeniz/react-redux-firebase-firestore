import React from "react";
import PropTypes from "prop-types";

import { ImageFrame } from "./image-viewer.styles";

const ImageViewer = ({ imageUrl }) => {
  return <ImageFrame src={imageUrl} alt="contender image proof" />;
};

ImageViewer.propTypes = {
  imageUrl: PropTypes.string.isRequired
};

export default ImageViewer;
