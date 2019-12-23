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
    "templateProof instanceData"
    "templateData instanceData"
    "comments comments"
    "buttons buttons";
`;

export const ChallengeInstanceVideoPlayer = styled.video`
  grid-area: templateProof;
  height: 13vh;
  width: 23vw;
  border: 1px solid black;
`;

export const ChallengeInstanceImageContainer = styled.img`
  grid-area: templateProof;
  height: 13vh;
  width: 23vw;
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
  margin-top: 10px;
`;

export const ChallengeInstanceButtonsGroup = styled.div`
  grid-area: buttons;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

export const ChallengeInstanceContenderDropdownContainer = styled.div`
  margin-left: auto;
`;

export const ChallengeInstanceComments = styled.div`
  grid-area: comments;
  display: flex;
  flex-direction: column;
`;
