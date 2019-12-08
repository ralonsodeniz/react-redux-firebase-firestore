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
  const [selectedStatus, setSelectedStatus] = useState("");
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
          Challenges instances from {category} category
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
        />
      </InstancesOverviewHeaderContainer>
      <InstancesOverviewScrollContainer>
        {userAcceptedInstancesArray.reduce(
          (accumulator, instance, instanceIndex) => {
            const user = instance.contenders.find(
              contender => contender.id === userProfileId
            );
            if (user.status === selectedStatus) {
              accumulator.push(
                <InstanceItem
                  key={instanceIndex}
                  challengeInstanceData={instance}
                  category={category}
                />
              );
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
