import React, { useMemo, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserAcceptedInstancesArray,
  selectChallengesInstancesAreLoading
} from "../../redux/firestore/challenges-instances/selectors";
import {
  selectUserAcceptedInstancesByCategory,
  selectUserProfileId
} from "../../redux/user/selectors";
import { statusOptions } from "../../utils/options";

import Spinner from "../spinner/spinner";
import InstanceItem from "../instance-item/instance-item";
import FormDropdown from "../form-dropdown/form-dropdown";

import {
  InstancesOverviewContainer,
  InstancesOverviewScrollContainer,
  InstancesOverviewTitle,
  InstancesOverviewHeaderContainer
} from "./instances-overview.styles";

const selectInstancesOverviewData = createStructuredSelector({
  challengesInstancesAreLoading: selectChallengesInstancesAreLoading,
  userProfileId: selectUserProfileId
});

const InstancesOverview = () => {
  const { category } = useParams();
  const [selectedStatus, setSelectedStatus] = useState("Any");
  const memoizedSelectUserAcceptedInstancesArray = useMemo(
    () => selectUserAcceptedInstancesArray,
    []
  );
  const memoizedSelectUserAcceptedInstancesByCategory = useMemo(
    () => selectUserAcceptedInstancesByCategory,
    []
  );
  const { challengesInstancesAreLoading, userProfileId } = useSelector(
    selectInstancesOverviewData,
    shallowEqual
  );
  const userAcceptedInstancesByCategory = useSelector(
    state => memoizedSelectUserAcceptedInstancesByCategory(category)(state),
    shallowEqual
  );
  const userAcceptedInstancesArray = useSelector(
    state =>
      memoizedSelectUserAcceptedInstancesArray(userAcceptedInstancesByCategory)(
        state
      ),
    shallowEqual
  );

  const handleChange = useCallback(event => {
    const { value } = event.target;
    setSelectedStatus(value);
  }, []);

  return !challengesInstancesAreLoading ? (
    <InstancesOverviewContainer>
      <InstancesOverviewHeaderContainer>
        <InstancesOverviewTitle>
          {category === "all"
            ? `Challenges instances from ${category} categories`
            : `  Challenges instances from ${category} category`}
        </InstancesOverviewTitle>
        <FormDropdown
          type="text"
          id="selectedCategory"
          name="selectedCategory"
          multiple={false}
          label={"Instance status"}
          handleChange={handleChange}
          required
          options={statusOptions}
          size={0}
          defaultValue="Any"
        />
      </InstancesOverviewHeaderContainer>
      <InstancesOverviewScrollContainer>
        {userAcceptedInstancesArray.reduce(
          (accumulator, instance, instanceIndex) => {
            const getContenderExpiresAt = instance =>
              instance.contenders.find(
                contender => contender.id === userProfileId
              ).expiresAt;

            const getContenderStatus = instance => {
              return instance.contenders.find(
                contender => contender.id === userProfileId
              ).status;
            };

            if (selectedStatus === "Any") {
              accumulator.push(
                <InstanceItem
                  key={instanceIndex}
                  challengeInstanceData={instance}
                />
              );
              accumulator.sort((a, b) => {
                const aContenderStatus = getContenderStatus(
                  a.props.challengeInstanceData
                );
                const bContenderStatus = getContenderStatus(
                  b.props.challengeInstanceData
                );
                const aContenderExpiresAt = getContenderExpiresAt(
                  a.props.challengeInstanceData
                );
                const bContenderExpiresAt = getContenderExpiresAt(
                  b.props.challengeInstanceData
                );

                return aContenderStatus > bContenderStatus
                  ? 1
                  : aContenderStatus === bContenderStatus
                  ? aContenderExpiresAt > bContenderExpiresAt
                    ? 1
                    : -1
                  : -1;
              });
            } else {
              const user = instance.contenders.find(
                contender => contender.id === userProfileId
              );
              if (user.status === selectedStatus) {
                accumulator.push(
                  <InstanceItem
                    key={instanceIndex}
                    challengeInstanceData={instance}
                  />
                );
              }
              if (selectedStatus === "Accepted") {
                accumulator.sort((a, b) => {
                  const aContenderExpiresAt = getContenderExpiresAt(
                    a.props.challengeInstanceData
                  );
                  const bContenderExpiresAt = getContenderExpiresAt(
                    b.props.challengeInstanceData
                  );
                  return aContenderExpiresAt > bContenderExpiresAt ? 1 : -1;
                });
              }
            }
            return accumulator;
          },
          []
        )}
      </InstancesOverviewScrollContainer>
    </InstancesOverviewContainer>
  ) : (
    <InstancesOverviewContainer>
      <Spinner />
    </InstancesOverviewContainer>
  );
};

export default InstancesOverview;
