import React from "react";
import PropTypes from "prop-types";

import { StarContainer } from "./star-rating.styles";

const Star = ({ color, selected, onClick, interactive }) => {
  return (
    <StarContainer
      color={color}
      selected={selected}
      onClick={onClick}
      interactive={interactive}
    />
  );
};

Star.propTypes = {
  color: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  interactive: PropTypes.bool.isRequired
};

export default Star;
