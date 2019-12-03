import styled, { css } from "styled-components";

const ChallengeTemplateDataStyles = css`
  h4 {
    font-weight: 400;
  }
  span {
    font-weight: 100;
  }
`;

export const ChallengeTemplateContainer = styled.div`
  width: 52vw;
  height: 37vh;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin: 50px auto;
  padding: 16px 32px;
  display: grid;
  justify-content: space-evenly;
  grid-template: 2fr 1fr / auto;
  grid-template-areas:
    "proof ranking"
    "challengeData ranking"
    "buttons buttons";
`;

export const ChallengeTemplateVideoPlayer = styled.video`
  grid-area: proof;
  border: 0;
  height: 12vh;
  width: 100%;
  left: 0;
  top: 0;
  border: 1px solid black;
`;

export const ChallengeTemplateDataContainer = styled.div`
  grid-area: challengeData;
  display: flex;
  justify-content: space-evenly;
`;

export const ChallengeTemplateData = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  ${ChallengeTemplateDataStyles}
`;

export const ChallengeTemplateRanking = styled.div`
  grid-area: ranking;
  display: flex;
  flex-direction: column;
  ${ChallengeTemplateDataStyles}
`;

export const ChallengeTemplateButtonsContainer = styled.div`
  grid-area: buttons;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;
