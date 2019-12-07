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
  ...otherProps
}) => (
  <FormDropdownReference>
    <FormDropdownContainer
      defaultValue={multiple ? null : "default"}
      onChange={handleChange}
      multiple
      {...otherProps}
    >
      <FormDropdownOption disabled value="default">
        {multiple
          ? `select one or more using ctrl / cmd`
          : `select your option`}
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
  otherProps: PropTypes.object,
  multiple: PropTypes.bool
};

export default FormDropdown;
