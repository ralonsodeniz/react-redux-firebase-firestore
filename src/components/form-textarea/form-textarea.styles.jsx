import styled from "styled-components";
const subColor = "grey";
const mainColor = "black";

export const FormTextareaReference = styled.div`
  position: relative;
  margin: 5px 0px 15px;
`;

export const FormTextareaContainer = styled.textarea`
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

export const FormTextareaLabel = styled.label`
  font-weight: normal;
  position: absolute;
  pointer-events: none;
  left: 5px;
  transition: 300ms ease all;
  top: -14px;
  font-size: 12px;
  color: ${mainColor};
`;
