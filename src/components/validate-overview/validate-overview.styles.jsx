import styled from "styled-components";

export const ValidateOverviewContainer = styled.div`
  width: 52vw;
  height: min-content;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  margin: 50px auto;
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  /*justify-content: center; */
  position: relative;
  top: 10px;
`;

export const ValidateOverviewHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
`;

export const ValidateOverviewScrollContainer = styled.div`
  width: 52vw;
  height: 23vh;
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

export const ValidateOverviewTitle = styled.h3`
  font-weight: 400;
  margin-left: auto;
  margin-right: auto;
`;
