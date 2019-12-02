import styled from "styled-components";

export const CategoryOverviewContainer = styled.div`
  width: 52vw;
  height: 42vh;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin: 50px auto;
  padding: 16px 32px;
  display: flex;
  flex-direction: row;
  /* align-items: center;
  justify-content: center; */
  position: relative;
  top: 10px;
`;

export const CategoryOverviewScrollContainer = styled.div`
  width: 52vw;
  height: 100%;
  background-color: #fafafa;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  /* align-items: center;
  justify-content: center; */
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
