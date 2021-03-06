import styled from "styled-components";

export const InstanceContenderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InstanceContenderInfoTitle = styled.h4`
  font-weight: 400;
`;

export const InstanceContenderInfoText = styled.span`
  font-weight: 100;
`;

export const InstanceContenderInfoTextPointer = styled(
  InstanceContenderInfoText
)`
  cursor: pointer;
`;

export const InstanceContenderInfoStatusText = styled.span`
  font-weight: 100;
  ${({ status }) =>
    status === "Pending"
      ? "color:orange"
      : status === "Completed"
      ? "color:green"
      : status === "Accepted"
      ? "color:blue"
      : status === "Cancelled"
      ? "color:red"
      : ""}
`;

export const InstanceContenderInfoStateText = styled.span`
  font-weight: 100;
  ${({ state }) =>
    state === "Pending"
      ? "color:orange"
      : state === "Accepted"
      ? "color:green"
      : state === "Cancelled"
      ? "color:red"
      : ""}
`;

export const InstanceContenderInfoVideoPlayer = styled.video`
  grid-area: templateProof;
  height: 9vh;
  width: 16vw;
  border: 1px solid black;
`;

export const InstanceContenderInfoImageContainer = styled.div`
  position: relative;
`;

export const InstanceContenderInfoImageFrame = styled.img`
  grid-area: templateProof;
  height: 9vh;
  width: 16vw;
  border: 1px solid black;
`;

export const InstanceContenderInfoButtonsContainer = styled.div`
  grid-area: buttons;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const InstanceContenderInfoRankingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 5px;
  align-items: center;
`;

export const InstanceContenderValidatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;
