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
  grid-template: 2fr 1fr / auto;
  grid-template-areas:
    "proof ranking"
    "challengeData ranking"
    "buttons buttons";
`;

export const ChallengeInstanceVideoPlayer = styled.video`
  grid-area: proof;
  border: 0;
  height: 12vh;
  width: 24vw;
  left: 0;
  top: 0;
  border: 1px solid black;
`;

export const ChallengeInstanceDataContainer = styled.div`
  grid-area: challengeData;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

export const ChallengeInstanceData = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  ${ChallengeInstanceDataStyles};
  width: 16vw;
`;

export const ChallengeInstanceRanking = styled.div`
  grid-area: ranking;
  display: flex;
  flex-direction: column;
  ${ChallengeInstanceDataStyles}
`;

export const ChallengeInstanceButtonsContainer = styled.div`
  grid-area: buttons;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;
