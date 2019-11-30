import styled from "styled-components";

import { ReactComponent as Logo } from "../../assets/belt1.svg";

export const HeaderContainer = styled.div`
  width: 61vw;
  height: 7vh;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 32px;
  margin: 20px auto 10px;
  padding: 16px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HeaderSigninSignOutContainer = styled.div`
  color: #2f8e89;
`;

export const HeaderSigninSignupContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 130px;
`;

export const HeaderAccountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 230px;
`;

export const HeaderSigninSignOutSpan = styled.span`
  cursor: pointer;
`;

export const HeaderLogo = styled(Logo)`
  width: 18vw;
  height: 100%;
`;
