import React from "react";
import PropTypes from "prop-types";

import {
  FormRadioReference,
  FormRadioContainer,
  FormRadioLabel,
  FormRadioAndTextContainer
} from "./form-radio.styles";

const FormRadio = ({ handleChange, label, options, name, ...otherProps }) => {
  return (
    <FormRadioReference>
      {options.map((option, optionIndex) => (
        <FormRadioAndTextContainer key={optionIndex}>
          <span>{option.text}</span>
          <FormRadioContainer
            onChange={handleChange}
            type="radio"
            name={name}
            value={option.value}
            key={optionIndex}
            id={`${name}${optionIndex}`}
            {...otherProps}
          />
        </FormRadioAndTextContainer>
      ))}
      {label ? <FormRadioLabel>{label}</FormRadioLabel> : null}
    </FormRadioReference>
  );
};

FormRadio.propTypes = {
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  options: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  otherProps: PropTypes.object
};

export default FormRadio;
