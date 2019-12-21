import React from "react";
import PropTypes from "prop-types";

import {
  FormTextareaReference,
  FormTextareaContainer,
  FormTextareaLabel
} from "./form-textarea.styles";

const FormTextarea = ({ handleChange, label, maxLength, ...otherProps }) => (
  <FormTextareaReference>
    <FormTextareaContainer
      onChange={handleChange}
      {...otherProps}
      maxLength={maxLength}
    />
    {label ? <FormTextareaLabel>{label}</FormTextareaLabel> : null}
  </FormTextareaReference>
);

FormTextarea.propTypes = {
  handleChange: PropTypes.func,
  label: PropTypes.string,
  otherProps: PropTypes.object,
  maxLength: PropTypes.number
};

export default FormTextarea;
