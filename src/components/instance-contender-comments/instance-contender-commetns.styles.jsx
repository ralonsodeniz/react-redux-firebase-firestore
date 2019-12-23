import styled from "styled-components";

export const InstanceContenderCommentsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InstanceContenderCommentsScroll = styled.div`
  width: 52vw;
  height: 23vh;
  background-color: #fafafa;
  display: flex;
  flex-direction: column;
  /* align-items: center;
  justify-content: center; */
  overflow-x: hidden;
  overflow-y: auto;
  margin-bottom: 20px;

  /* overflow */
  ::-webkit-scrollbar {
    height: 12px;
    display: inline-block;
  }

  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    -webkit-border-radius: 10px;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-border-radius: 10px;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.4);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  }
`;

export const InstanceContenderCommentContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const InstanceContenderCommentsTitle = styled.h4`
  font-weight: 400;
`;

export const InstanceContenderCommentsText = styled.span`
  font-weight: 100;
`;

export const InstanceContenderCommentEmojiContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: min-content;
  margin-left: auto;
`;

export const InstanceContenderCommentEmoji = styled.span`
  cursor: pointer;
`;
