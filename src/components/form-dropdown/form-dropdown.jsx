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
  multiple,
  size,
  defaultValue,
  ...otherProps
}) => (
  <FormDropdownReference>
    <FormDropdownContainer
      defaultValue={multiple ? null : defaultValue}
      onChange={handleChange}
      multiple={multiple}
      {...otherProps}
      size={size}
    >
      <FormDropdownOption
        disabled
        value={defaultValue ? defaultValue : "default"}
      >
        {multiple
          ? `select one or more using ctrl / cmd`
          : `select your option`}
      </FormDropdownOption>
      {options.map((option, optionIndex) => (
        <FormDropdownOption key={optionIndex} value={option.value}>
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
  otherProps: PropTypes.object,
  multiple: PropTypes.bool,
  size: PropTypes.number.isRequired
};

export default FormDropdown;
