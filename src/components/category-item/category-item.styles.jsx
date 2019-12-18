import styled from "styled-components";

export const CategoryItemContainer = styled.div`
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

export const CategoryItemVideoPlayer = styled.video`
  border: 0;
  height: 12vh;
  width: 100%;
  left: 0;
  top: 0;
`;

export const CategoryItemImageContainer = styled.img`
  border: 0;
  height: 12vh;
  width: 100%;
  left: 0;
  top: 0;
`;