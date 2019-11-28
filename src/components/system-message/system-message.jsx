import React from "react";

import { SystemMessageContainer } from "./system-message.styles";

const SystemMessage = ({ text }) => (
  <SystemMessageContainer>
    <span>{text}</span>
  </SystemMessageContainer>
);

export default SystemMessage;
