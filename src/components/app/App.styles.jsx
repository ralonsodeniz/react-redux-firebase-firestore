import styled from "styled-components";

import { ReactComponent as Logo } from "../../assets/belt1.svg";

export const AppContainer = styled.div`
  width: 50vw;
  height: auto;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 32px;
  margin: 64px auto 0;
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AppLogo = styled(Logo)`
  width: 30vw;
`;
