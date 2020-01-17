import React, { useMemo, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory } from "react-router-dom";

import {
  selectAllUserAcceptedInstances,
  selectUserProfileId,
  selectUserAcceptedInstancesByCategory,
  selectUserIntancesToValidate,
  selectUserGlobalValidator,
  selectUserProfileIsLoaded,
  selectUserProfileIsEmpty
} from "../../redux/user/selectors";
import {
  selectCompletedTemplatesFromUserInstancesObject,
  selectUserAcceptedInstancesArray,
  selectChallengesInstancesAreLoading,
  selectUserInstancesToValidateArray,
  selectAllChallengeInstancesNotSelfValidated
} from "../../redux/firestore/challenges-instances/selectors";
import {
  selectChallengesTemplates,
  selectNameFromChallengeTemplate
} from "../../redux/firestore/challenges-templates/selectors";
import { makeDate } from "../../utils/utils";

import Spinner from "../spinner/spinner";

import {
  HeaderStatisticsContainer,
  HeaderStatisticsInfoContainer,
  HeaderStatisticsTitle,
  HeaderStatisticsText,
  HeaderStatisticsStatContainer,
  HeaderStatisticsTitlePointer,
  HeaderStatisticsEmptyContainer
} from "./header.styles";

const headerStatisticsData = createStructuredSelector({
  allUserAcceptedInstancesByCategory: selectAllUserAcceptedInstances,
  userProfileId: selectUserProfileId,
  challengesTemplates: selectChallengesTemplates,
  challengesInstancesAreLoading: selectChallengesInstancesAreLoading,
  userIntancesToValidate: selectUserIntancesToValidate,
  userGlobalValidator: selectUserGlobalValidator,
  challengeInstancesNotSelfValidated: selectAllChallengeInstancesNotSelfValidated,
  userProfileIsLoaded: selectUserProfileIsLoaded,
  userProfileIsEmpty: selectUserProfileIsEmpty
});

const HeaderStatistics = () => {
  const { push } = useHistory();

  const {
    allUserAcceptedInstancesByCategory,
    userProfileId,
    challengesTemplates,
    challengesInstancesAreLoading,
    userIntancesToValidate,
    userGlobalValidator,
    challengeInstancesNotSelfValidated,
    userProfileIsLoaded,
    userProfileIsEmpty
  } = useSelector(headerStatisticsData, shallowEqual);

  const memoizedSelectCompletedTemplatesFromUserInstancesObject = useMemo(
    () => selectCompletedTemplatesFromUserInstancesObject,
    []
  );

  const memoizedSelectUserAcceptedInstancesArray = useMemo(
    () => selectUserAcceptedInstancesArray,
    []
  );
  const memoizedSelectUserAcceptedInstancesByCategory = useMemo(
    () => selectUserAcceptedInstancesByCategory,
    []
  );

  const memoizedSelectNameFromChallengeTemplate = useMemo(
    () => selectNameFromChallengeTemplate,
    []
  );

  const memoizedSelectUserInstancesToValidateArray = useMemo(
    () => selectUserInstancesToValidateArray,
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

  const userAcceptedInstancesByCategory = useSelector(
    state => memoizedSelectUserAcceptedInstancesByCategory("all")(state),
    shallowEqual
  );
  const userAcceptedInstancesArray = useSelector(
    state =>
      memoizedSelectUserAcceptedInstancesArray(userAcceptedInstancesByCategory)(
        state
      ),
    shallowEqual
  );

  const userInstancesToValidateArray = useSelector(state =>
    memoizedSelectUserInstancesToValidateArray(userIntancesToValidate)(state)
  );

  const sortedUserAcceptedInstancesArray =
    userAcceptedInstancesArray &&
    userAcceptedInstancesArray.reduce((accumulator, instance) => {
      const getContenderExpiresAt = instance =>
        instance.contenders.find(contender => contender.id === userProfileId)
          .expiresAt;

      const user = instance.contenders.find(
        contender => contender.id === userProfileId
      );
      if (user.status === "Accepted") {
        accumulator.push(instance);
      }
      accumulator.sort((a, b) => {
        const aContenderExpiresAt = getContenderExpiresAt(a);
        const bContenderExpiresAt = getContenderExpiresAt(b);
        return aContenderExpiresAt > bContenderExpiresAt ? 1 : -1;
      });
      return accumulator;
    }, []);

  const challengeInstanceToExpire =
    sortedUserAcceptedInstancesArray.length > 0
      ? sortedUserAcceptedInstancesArray[0].challengeTemplateId
      : "";

  const nameFromChallengeTemplate = useSelector(state =>
    memoizedSelectNameFromChallengeTemplate(state, challengeInstanceToExpire)
  );

  const userContenderInfo =
    sortedUserAcceptedInstancesArray.length > 0
      ? sortedUserAcceptedInstancesArray[0].contenders.find(
          contender => contender.id === userProfileId
        )
      : {};

  const instanceExpiringDate =
    sortedUserAcceptedInstancesArray.length > 0
      ? makeDate(userContenderInfo.expiresAt.toDate(), true)
      : "";

  const instanceExpiringId =
    sortedUserAcceptedInstancesArray.length > 0
      ? sortedUserAcceptedInstancesArray[0].challengeInstanceId
      : "";

  const filteredChallengeInstancesNotSelfValidated = challengeInstancesNotSelfValidated
    ? challengeInstancesNotSelfValidated.reduce((accumulator, instance) => {
        !instance.selfValidation &&
          instance.contenders.every(
            contender => contender.id !== userProfileId
          ) &&
          instance.contenders.some(
            contender => contender.proof.state === "Pending"
          ) &&
          accumulator.push(instance);
        return accumulator;
      }, [])
    : [];

  const instancesToValidateArray =
    userGlobalValidator.status !== "no validator" &&
    userGlobalValidator.status !== "banned validator"
      ? [
          ...userInstancesToValidateArray,
          ...filteredChallengeInstancesNotSelfValidated
        ]
      : userInstancesToValidateArray;

  const instancesPendingToValidateArray =
    instancesToValidateArray.length > 0
      ? instancesToValidateArray.reduce((accumulator, instance) => {
          instance.contenders.some(
            contender =>
              contender.proof.state === "Pending" &&
              contender.id !== userProfileId
          ) && accumulator.push(instance);
          return accumulator;
        }, [])
      : [];

  const numberOfInstancesPendingToValidate = instancesPendingToValidateArray
    ? instancesPendingToValidateArray.length
    : 0;

  const handleOnClickCategory = useCallback(
    category => {
      push(`/main/${category}/`);
    },
    [push]
  );

  const handleOnClickInstance = useCallback(
    instanceId => push(`/instance/${instanceId}`),
    [push]
  );

  const handleOnClickValidate = useCallback(() => push(`/account/validation`), [
    push
  ]);

  return !challengesInstancesAreLoading && userProfileIsLoaded ? (
    !userProfileIsEmpty ? (
      <HeaderStatisticsContainer>
        <HeaderStatisticsInfoContainer>
          {Object.entries(userCompletedTemplates).map(
            (category, categoryIndex) => {
              const [key, value] = category;
              return (
                <HeaderStatisticsStatContainer key={categoryIndex}>
                  <HeaderStatisticsTitlePointer
                    onClick={() => handleOnClickCategory(key)}
                  >
                    {`${key}`}
                  </HeaderStatisticsTitlePointer>
                  <HeaderStatisticsText>
                    {` :${value.length}/${
                      Object.values(challengesTemplates[key]).length
                    }`}
                  </HeaderStatisticsText>
                </HeaderStatisticsStatContainer>
              );
            }
          )}
        </HeaderStatisticsInfoContainer>
        <HeaderStatisticsInfoContainer>
          {nameFromChallengeTemplate === undefined ? (
            <HeaderStatisticsTitle>
              {" "}
              No upcoming instanes to complete
            </HeaderStatisticsTitle>
          ) : (
            <HeaderStatisticsTitlePointer
              onClick={() => handleOnClickInstance(instanceExpiringId)}
            >
              {`${nameFromChallengeTemplate} expires at ${instanceExpiringDate}`}
            </HeaderStatisticsTitlePointer>
          )}
          <HeaderStatisticsTitlePointer onClick={handleOnClickValidate}>
            {`You have ${numberOfInstancesPendingToValidate} pending instance to validate`}
          </HeaderStatisticsTitlePointer>
        </HeaderStatisticsInfoContainer>
      </HeaderStatisticsContainer>
    ) : (
      <HeaderStatisticsContainer>
        <HeaderStatisticsEmptyContainer>
          Sign in or register
        </HeaderStatisticsEmptyContainer>
      </HeaderStatisticsContainer>
    )
  ) : (
    <Spinner />
  );
};

export default HeaderStatistics;
