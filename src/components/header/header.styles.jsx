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
  justify-content: space-evenly;
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
  height: 7vh;
`;

export const HeaderStatisticsContainer = styled.div`
  width: 23vw;
  height: 4vh;
  background-color: #fafafa;
  box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  margin: 20px auto 10px;
  padding: 7px 13px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  /* align-items: center; */
`;

export const HeaderStatisticsInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  /* align-items: center; */
  height: 100%;
`;

export const HeaderStatisticsStatContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  /* align-items: center; */
`;

export const HeaderStatisticsTitle = styled.h4`
  font-weight: 400;
  margin: 0px;
`;

export const HeaderStatisticsText = styled.span`
  font-weight: 100;
  margin: 0px;
`;

export const HeaderStatisticsTitlePointer = styled(HeaderStatisticsTitle)`
  cursor: pointer;
`;
