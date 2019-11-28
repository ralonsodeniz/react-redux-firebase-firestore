import styled from "styled-components";

export const SignInAndSignUpFrame = styled.div`
  width: 30vw;
  height: auto;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 32px;
  margin: 20px auto 50px;
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const OptionTextContainer = styled.div`
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-self: flex-start;
  color: #807a7a;
  font-size: 13px;
`;

export const OptionText = styled.span`
  cursor: pointer;

  &:hover {
    color: #4285f4;
  }
`;
