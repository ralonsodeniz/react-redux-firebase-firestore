import styled, { css } from "styled-components";

const UserDataStyles = css`
  display: flex;
  flex-direction: column;
`;

export const ProfileContainer = styled.div`
  height: min-content;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 32px;
  margin: 50px auto;
  padding: 16px 32px;
  display: grid;
  justify-content: space-evenly;
  align-content: center;
  align-items:center;
  width: 50vw;
  grid-template: auto/auto;
  grid-template-areas:
    "userAvatar displayName"
    "userAvatar userId"
    "userStatistics userStatistics"
    "buttons buttons";
`;

export const DisplayNameContainer = styled.div`
  grid-area: displayName;
  ${UserDataStyles}
`;

export const UserAvatarContainer = styled.div`
  grid-area: userAvatar;
  display: flex;
  justify-content: cener;
  align-items: center;
`;

export const ButtonsContainer = styled.div`
  grid-area: buttons;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
`;

export const UserIdContainer = styled.div`
  grid-area: userId;
  ${UserDataStyles}
`;

export const UserDataTextTitle = styled.h4`
  font-weight: 400;
`;

export const UserDataText = styled.span`
  font-weight: 100;
`;

export const UserStatisticsContainer = styled.div`
  grid-area: userStatistics;
  width: 42vw;
  height: auto;
  background-color: #fafafa;
  box-shadow: 0 0 32px 8px rgba(0, 0, 0, 0.3);
  border-radius: 32px;
  margin: 50px auto;
  padding: 16px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

export const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 100%;
  align-items: flex-start;
`;

export const StatisticCategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

export const StatisticsTitle = styled.h4`
  font-weight: 700;
  margin-bottom: -5px;
`;

export const StatisticsCategoryTitle = styled.h4`
  font-weight: 400;
  margin-bottom: -10px;
`;

export const StatisticsCategoryTitlePointer = styled(StatisticsCategoryTitle)`
  cursor: pointer;
`;

export const StatisticsText = styled.span`
  font-weight: 100;
`;

export const StatisticsTextPointer = styled(StatisticsText)`
  cursor: pointer;
`;

export const StatisticsInstanceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: flex-start;
`;

export const AvatarContainer = styled.div`
  width: 150px;
  height: 150px;
`;
