import styled from "styled-components";

export const TemplateProofsRankingContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 70vh;
  width: 70vh;
  overflow-x: hidden;
  overflow-y: auto;

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

export const TemplateProofsRankingVideoFrame = styled.video`
  border: 0;
  height: 13vh;
  width: 13vw;
`;

export const TemplateProofsRankingImageContainer = styled.div`
  position: relative;
`;

export const TemplateProofsRankingImageFrame = styled.img`
  border: 0;
  height: 13vh;
  width: 13vw;
`;

export const TemplateProofsRankingContender = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

export const TemplateProofsRankingName = styled.span`
  font-weight: 200;
  cursor: pointer;
  margin-right: auto;
  margin-bottom: 5px;
`;

export const TemplateProofsRankingLikeDislikeContainer = styled.span`
  display: flex;
  justify-content: space-evenly;
  margin-right: auto;
  marging-top: 5px;
`;

export const TemplateProofsRankingLikeDislike = styled.span`
  font-weight: 200;
  margin-right: 10px;
`;
