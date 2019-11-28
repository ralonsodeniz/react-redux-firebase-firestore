import React from "react";
import PropTypes from "prop-types";

import {
  FormInputReference,
  FormInputContainer,
  FormInputLabel
} from "./form-input.styles";

const FormInput = ({ handleChange, label, ...otherProps }) => (
  <FormInputReference>
    <FormInputContainer onChange={handleChange} {...otherProps} />
    {label ? (
      <FormInputLabel shrink={otherProps.value.length}>{label}</FormInputLabel>
    ) : null}
  </FormInputReference>
);

FormInput.propTypes = {
  handleChange: PropTypes.func,
  label: PropTypes.string,
  otherProps: PropTypes.object
};

FormInput.defaultProps = {
  handleChange: () => {},
  label: undefined,
  otherProps: {}
};

export default FormInput;
