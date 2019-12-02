import React from "react";
import PropTypes from "prop-types";

import {
  FormDropdownReference,
  FormDropdownContainer,
  FormDropdownLabel,
  FormDropdownOption
} from "./form-dropdown.styles";

const FormDropdown = ({ handleChange, label, options, ...otherProps }) => (
  <FormDropdownReference>
    <FormDropdownContainer
      defaultValue={"selectCategory"}
      onChange={handleChange}
      {...otherProps}
    >
      <FormDropdownOption disabled value="selectCategory">
        Select a category
      </FormDropdownOption>
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
