import styled, { css } from "styled-components";

const largeButtonStyles = css`
  min-width: 100px;
  height: 50px;
  font-weight: 300;
  font-size: inherit;
`;

export const CustomButtonContainer = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  background-color: white;
  color: #807a7a;
  font-weight: 500;
  box-shadow: 1px 2px 4px 0 rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 4px;
  outline: none;
  cursor: pointer;
  margin: 5px;

  &:active {
    box-shadow: 1px 1px 2px 0 rgba(0, 0, 0, 0.15);
  }

  ${({ large }) => (large ? largeButtonStyles : "")}
`;
