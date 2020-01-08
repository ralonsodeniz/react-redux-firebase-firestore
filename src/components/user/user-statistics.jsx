import React, { useMemo, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory } from "react-router-dom";

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
  StatisticsText,
  StatisticsTextPointer,
  StatisticsCategoryTitle,
  StatisticsTitle,
  StatisticsInstanceContainer,
  StatisticsCategoryTitlePointer
} from "./user.styles";

const userStatisticsData = createStructuredSelector({
  allUserAcceptedInstancesByCategory: selectAllUserAcceptedInstances,
  userProfileId: selectUserProfileId,
  challengesTemplates: selectChallengesTemplates
});

const UserStatistics = () => {
  const { push } = useHistory();

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

  const handleOnClickInstance = useCallback(
    instanceId => push(`/instance/${instanceId}`),
    [push]
  );

  const handleOnClickTemplate = useCallback(
    (templateId, category) => push(`/main/${category}/${templateId}`),
    [push]
  );

  const handleOnClickCategory = useCallback(
    category => {
      push(`/main/${category}/`);
    },
    [push]
  );

  return (
    <UserStatisticsContainer>
      <StatisticsTitle>Completed challenges templates</StatisticsTitle>
      <StatisticsContainer>
        {Object.entries(userCompletedTemplates).map(
          (category, categoryIndex) => {
            const [key, value] = category;
            return (
              <StatisticCategoryContainer key={categoryIndex}>
                <StatisticsCategoryTitlePointer
                  onClick={() => handleOnClickCategory(key)}
                >
                  {key} - {value.length}/
                  {Object.values(challengesTemplates[key]).length}
                </StatisticsCategoryTitlePointer>
                <ul>
                  {value.map((completedTemplate, completedTemplateIndex) => (
                    <li key={completedTemplateIndex}>
                      <StatisticsText>
                        {
                          challengesTemplates[key][completedTemplate.templateId]
                            .name
                        }
                      </StatisticsText>
                    </li>
                  ))}
                </ul>
              </StatisticCategoryContainer>
            );
          }
        )}
      </StatisticsContainer>
      <StatisticsTitle>Best rated public challenges instances</StatisticsTitle>
      <StatisticsContainer>
        {Object.entries(userCompletedTemplates).reduce(
          (accumulator, category, categoryIndex) => {
            const [key, value] = category;
            value.length > 0 &&
              value.some(completedTemplate => completedTemplate.public) &&
              accumulator.push(
                <StatisticCategoryContainer key={categoryIndex}>
                  <StatisticsCategoryTitle>{key}</StatisticsCategoryTitle>
                  <ul>
                    {value.reduce(
                      (
                        accumulator,
                        completedTemplate,
                        completedTemplateIndex
                      ) => {
                        completedTemplate.public &&
                          accumulator.push(
                            <li key={completedTemplateIndex}>
                              <StatisticsInstanceContainer>
                                <StatisticsTextPointer
                                  onClick={() =>
                                    handleOnClickInstance(
                                      completedTemplate.instanceId
                                    )
                                  }
                                >
                                  {
                                    challengesTemplates[key][
                                      completedTemplate.templateId
                                    ].name
                                  }
                                </StatisticsTextPointer>
                                <span
                                  role="img"
                                  aria-label="rating"
                                  aria-labelledby="rating"
                                >
                                  {completedTemplate.rating.likes} &#128077; -{" "}
                                  {completedTemplate.rating.dislikes} &#128078;
                                </span>
                                <StatisticsTextPointer
                                  onClick={() =>
                                    handleOnClickTemplate(
                                      completedTemplate.templateId,
                                      key
                                    )
                                  }
                                >
                                  Ranking position:{" "}
                                  {completedTemplate.rankingPosition}
                                </StatisticsTextPointer>
                              </StatisticsInstanceContainer>
                            </li>
                          );
                        return accumulator;
                      },
                      []
                    )}
                  </ul>
                </StatisticCategoryContainer>
              );
            return accumulator;
          },
          []
        )}
      </StatisticsContainer>
    </UserStatisticsContainer>
  );
};

export default UserStatistics;
