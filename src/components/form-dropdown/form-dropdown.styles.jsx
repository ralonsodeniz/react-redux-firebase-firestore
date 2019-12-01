import styled from "styled-components";
const subColor = "grey";
const mainColor = "black";

export const FormDropdownReference = styled.div`
  position: relative;
  margin: 5px 0px 15px;
`;

export const FormDropdownContainer = styled.select`
  background: none;
  background-color: transparent;
  color: ${subColor};
  font-size: 16px;
  padding: 10px 10px 10px 5px;
  display: block;
  width: 100%;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid ${subColor};

  &:focus {
    outline: none;
  }
`;

export const FormDropdownOption = styled.option`
  color: ${subColor};
  font-size: 16px;
  display: block;
  background-color: #fafafa;
`;

export const FormDropdownLabel = styled.label`
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  transition: 300ms ease all;
  top: -14px;
  font-size: 12px;
  color: ${mainColor};
`;
