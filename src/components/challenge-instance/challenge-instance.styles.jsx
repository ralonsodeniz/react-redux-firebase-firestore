import styled, { css } from "styled-components";

const ChallengeInstanceDataStyles = css`
  h4 {
    font-weight: 400;
  }
  span {
    font-weight: 100;
  }
`;

export const ChallengeInstanceContainer = styled.div`
  width: 52vw;
  height: 610px;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin: 50px auto;
  padding: 16px 32px;
  display: grid;
  justify-content: space-evenly;
  grid-template: 1fr 1fr / auto;
  grid-template-areas:
    "templateProof instanceData"
    "templateData instanceData"
    "buttons buttons";
`;

export const ChallengeInstanceVideoPlayer = styled.video`
  grid-area: templateProof;
  border: 0;
  height: 12vh;
  width: 24vw;
  left: 0;
  top: 0;
  border: 1px solid black;
`;

export const ChallengeInstanceTemplateDataContainer = styled.div`
  grid-area: templateData;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

export const ChallengeInstanceTemplateData = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  ${ChallengeInstanceDataStyles};
  width: 16vw;
`;

export const ChallengeInstanceData = styled.div`
  grid-area: instanceData;
  display: flex;
  flex-direction: column;
`;

export const ChallengeInstanceButtonsContainer = styled.div`
  grid-area: buttons;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;
