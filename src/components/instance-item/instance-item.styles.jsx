import styled from "styled-components";
import CustomButton from "../custom-button/custom-button";

export const InstanceItemContainer = styled.div`
  width: 24vw;
  height: max-content;
  background-color: #fafafa;
  box-shadow: 0 0 16px 4px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin: 23px auto;
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */
`;

export const InstanceItemVideoPlayer = styled.video`
  border: 0;
  height: 12vh;
  width: 100%;
  left: 0;
  top: 0;
`;

export const InstanceItemStatusText = styled.span`
  ${({ status }) =>
    status === "Pending"
      ? `color:orange`
      : status === "Completed"
      ? `color:green`
      : status === "Accepted"
      ? `color:blue`
      : status === "Cancelled"
      ? `color:red`
      : ""}
`;

export const InstanceCustomButton = styled(CustomButton)`
  justify-self: center;
`;
