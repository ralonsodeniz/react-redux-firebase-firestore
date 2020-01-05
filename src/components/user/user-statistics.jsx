import React, { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectAllUserAcceptedInstances,
  selectUserProfileId
} from "../../redux/user/selectors";
import { selectCompletedTemplatesFromUserInstancesObject } from "../../redux/firestore/challenges-instances/selectors";
import { selectChallengesTemplates } from "../../redux/firestore/challenges-templates/selectors";

import {
  UserStatisticsContainer,
  StatisticsContainer,
  StatisticCategoryContainer,
  StatisticsTextTitle,
  StatisticsText,
  StatisticsCategoryTitle
} from "./user.styles";

const userStatisticsData = createStructuredSelector({
  allUserAcceptedInstancesByCategory: selectAllUserAcceptedInstances,
  userProfileId: selectUserProfileId,
  challengesTemplates: selectChallengesTemplates
});

const UserStatistics = () => {
  const {
    allUserAcceptedInstancesByCategory,
    userProfileId,
    challengesTemplates
  } = useSelector(userStatisticsData, shallowEqual);

  const memoizedSelectCompletedTemplatesFromUserInstancesObject = useMemo(
    () => selectCompletedTemplatesFromUserInstancesObject,
    []
  );

  const userCompletedTemplates = useSelector(
    state =>
      memoizedSelectCompletedTemplatesFromUserInstancesObject(
        state,
        allUserAcceptedInstancesByCategory,
        userProfileId
      ),
    shallowEqual
  );

  return (
    <UserStatisticsContainer>
      {Object.entries(userCompletedTemplates).map((category, categoryIndex) => {
        const [key, value] = category;
        return (
          <StatisticCategoryContainer key={categoryIndex}>
            <StatisticsCategoryTitle>{key}</StatisticsCategoryTitle>
            <StatisticsContainer>
              <StatisticsTextTitle>
                Completed {value.length}/
                {Object.values(challengesTemplates[key]).length}
              </StatisticsTextTitle>
            </StatisticsContainer>
            {value.map((completedTemplate, completedTemplateIndex) => (
              <StatisticsText key={completedTemplateIndex}>
                · {challengesTemplates[key][completedTemplate.templateId].name}
              </StatisticsText>
            ))}
          </StatisticCategoryContainer>
        );
      })}
    </UserStatisticsContainer>
  );
};

export default UserStatistics;
