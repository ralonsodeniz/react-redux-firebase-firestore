import React from "react";
import PropTypes from "prop-types";

import { CustomButtonContainer } from "./custom-button.styles";

const CustomButton = props => (
  <CustomButtonContainer {...props}>
    <span>{props.text}</span>
  </CustomButtonContainer>
);

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  large: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.string
};

CustomButton.defaultProps = {
  text: "This is a custom button",
  large: false,
  onClick: () => {},
  type: "button"
};

export default CustomButton;
