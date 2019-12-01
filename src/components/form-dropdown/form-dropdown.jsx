import React from "react";
import PropTypes from "prop-types";

import {
  FormDropdownReference,
  FormDropdownContainer,
  FormDropdownLabel,
  FormDropdownOption
} from "./form-dropdown.styles";

const FormDropdown = ({
  handleChange,
  label,
  options,
  defaultValue,
  ...otherProps
}) => (
  <FormDropdownReference>
    <FormDropdownContainer
      defaultValue={defaultValue}
      onChange={handleChange}
      {...otherProps}
    >
      {options.map(option => (
        <FormDropdownOption key={option.key} value={option.value}>
          {option.text}
        </FormDropdownOption>
      ))}
    </FormDropdownContainer>
    {label ? <FormDropdownLabel>{label}</FormDropdownLabel> : null}
  </FormDropdownReference>
);

FormDropdown.propTypes = {
  handleChange: PropTypes.func,
  label: PropTypes.string,
  options: PropTypes.array,
  defaultValue: PropTypes.string,
  otherProps: PropTypes.object
};

export default FormDropdown;
