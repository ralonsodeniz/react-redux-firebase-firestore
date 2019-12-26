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
  height: auto;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin: 50px auto;
  padding: 16px 32px;
  display: grid;
  justify-content: space-evenly;
  grid-template: auto / 1fr 1fr;
  grid-template-areas:
    "proof ranking"
    "challengeData ranking"
    "buttons buttons";
`;

export const ChallengeTemplateVideoPlayer = styled.video`
  grid-area: proof;
  height: 12vh;
  width: 24vw;
  border: 1px solid black;
`;

export const ChallengeTemplateImageContainer = styled.div`
  position: relative;
`;

export const ChallengeTemplateImageFrame = styled.img`
  grid-area: proof;
  height: 12vh;
  width: 24vw;
  border: 1px solid black;
`;

export const ChallengeTemplateDataContainer = styled.div`
  grid-area: challengeData;
  display: flex;
  justify-content: space-evenly;
  width: 100%;
`;

export const ChallengeTemplateData = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
  ${ChallengeTemplateDataStyles};
  width: 16vw;
`;

export const ChallengeTemplateRanking = styled.div`
  grid-area: ranking;
  display: flex;
  flex-direction: column;
`;

export const ChallengeTemplateRankingContender = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-bottom: 1px solid black;
  margin-bottom: 5px;
`;

export const ChallengeTemplateRankingName = styled.span`
  font-weight: 200;
  cursor: pointer;
  margin-right: auto;
`;

export const ChallengeTemplateRankingLikeDislikeContainer = styled.span`
  display: flex;
  justify-content: space-evenly;
  margin-right: auto;
`;

export const ChallengeTemplateRankingLikeDislike = styled.span`
  font-weight: 200;
  margin-right: 10px;
`;

export const ChallengeTemplateButtonsContainer = styled.div`
  grid-area: buttons;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const ShowAllProofsContainer = styled.span`
  justify-self: center;
  align-self: center;
  cursor: pointer;
  font-weight: 300;
`;
