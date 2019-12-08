import styled from "styled-components";
const subColor = "grey";
const mainColor = "black";

export const FormRadioReference = styled.div`
  position: relative;
  margin: 25px 0px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

export const FormRadioAndTextContainer = styled.div`
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  margin: 5px;
`;

export const FormRadioContainer = styled.input`
  background: none;
  background-color: transparent;
  color: ${subColor};
  font-size: 16px;
  /* padding: 10px 10px 10px 5px; */
  display: block;
  width: min-content;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid ${subColor};
  margin: 0px;

  &:focus {
    outline: none;
  }
`;

export const FormRadioLabel = styled.label`
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  transition: 300ms ease all;
  top: -14px;
  font-size: 12px;
  color: ${mainColor};
`;
