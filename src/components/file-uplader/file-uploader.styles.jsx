import styled from "styled-components";

export const UploadFileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`;

export const CircularProgressContainer = styled.div`
  width: 150px;
  height: 150px;
`;

export const UpdateFileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 150px;
  justify-content: center;
`;

export const InputFileContainer = styled.input`
  border: 0;
  clip-path: rect(0, 0, 0, 0);
  height: 0.1px;
  width: 0.1px;
  overflow: hidden;
  padding: 0;
  position: absolute !important;
  white-space: nowrap;
  opacity: 0;
`;

export const LabelFileContainer = styled.label`
  width: max-content;
  padding: 5px;
  text-align: center;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  background-color: white;
  color: #807a7a;
  font-weight: 500;
  font-size: 13px;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  margin: 5px;

  &:active {
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.15);
  }
`;
