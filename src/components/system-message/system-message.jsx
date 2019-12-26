import React from "react";
import PropTypes from "prop-types";

import { SystemMessageContainer } from "./system-message.styles";

const SystemMessage = ({ text }) => (
  <SystemMessageContainer>
    <span>{text}</span>
  </SystemMessageContainer>
);

SystemMessage.propTypes = {
  text: PropTypes.string.isRequired
};

export default SystemMessage;
