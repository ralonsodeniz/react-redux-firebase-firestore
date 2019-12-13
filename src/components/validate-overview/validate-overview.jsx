import React, { useMemo, useCallback, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserInstancesToValidateArray,
  selectChallengesInstancesAreLoading
} from "../../redux/firestore/challenges-instances/selectors";

import {
  selectUserIntancesToValidate,
  selectUserProfileIsLoaded,
  selectUserProfileId
} from "../../redux/user/selectors";
import { validateStatusOptions } from "../../utils/options";

import Spinner from "../spinner/spinner";
import ValidateItem from "../validate-item/validate-item";
import FormDropdown from "../form-dropdown/form-dropdown";

import {
  ValidateOverviewContainer,
  ValidateOverviewHeaderContainer,
  ValidateOverviewScrollContainer,
  ValidateOverviewTitle
} from "./validate-overview.styles";

const selectValidateOverviewData = createStructuredSelector({
  userIntancesToValidate: selectUserIntancesToValidate,
  challengesInstancesAreLoading: selectChallengesInstancesAreLoading,
  userProfileIsLoaded: selectUserProfileIsLoaded,
  userProfileId: selectUserProfileId
});

const ValidateOverview = () => {
  const [selectedStatus, setSelectedStatus] = useState("Validations pending");

  const memoizedSelectUserInstancesToValidateArray = useMemo(
    () => selectUserInstancesToValidateArray,
    []
  );

  const {
    userIntancesToValidate,
    challengesInstancesAreLoading,
    userProfileIsLoaded,
    userProfileId
  } = useSelector(selectValidateOverviewData, shallowEqual);

  const userInstancesToValidateArray = useSelector(state =>
    memoizedSelectUserInstancesToValidateArray(userIntancesToValidate)(state)
  );

  const handleChange = useCallback(event => {
    const { value } = event.target;
    setSelectedStatus(value);
  }, []);

  return !challengesInstancesAreLoading && userProfileIsLoaded ? (
    <ValidateOverviewContainer>
      <ValidateOverviewHeaderContainer>
        <ValidateOverviewTitle>
          Challenges instances to validate
        </ValidateOverviewTitle>
        <FormDropdown
          type="text"
          id="selectedCategory"
          name="selectedCategory"
          multiple={false}
          label="Instance validation status"
          handleChange={handleChange}
          required
          options={validateStatusOptions}
          size={0}
          defaultValue="Validations pending"
        />
      </ValidateOverviewHeaderContainer>
      <ValidateOverviewScrollContainer>
        {userInstancesToValidateArray.reduce(
          (accumulator, instance, instanceIndex) => {
            const instanceStatus = instance.contenders.some(
              contender =>
                contender.proof.state === "Pending" &&
                contender.id !== userProfileId
            )
              ? "Validations pending"
              : instance.contenders.every(
                  contender => contender.status === "Completed"
                )
              ? "Challenge completed"
              : instance.contenders.every(
                  contender => contender.status === "Cancelled"
                )
              ? "Challenge cancelled"
              : instance.contenders.some(
                  contender =>
                    contender.status === "Pending" ||
                    contender.proof.state === "No proof provided"
                )
              ? "No proofs to validate"
              : "";
            if (instanceStatus === selectedStatus) {
              accumulator.push(
                <ValidateItem
                  key={instanceIndex}
                  challengeInstanceData={instance}
                />
              );
            }
            if (selectedStatus === "Validations pending") {
              const getOlderDateUploaded = instance => {
                const filteredContenders = instance.contenders.filter(
                  contender => contender.proof.state === "Pending"
                );
                const sortedContenders = filteredContenders.sort((a, b) =>
                  a.proof.dateUploaded > b.proof.dateUploaded ? 1 : -1
                );
                return sortedContenders[0].proof.dateUploaded;
              };

              accumulator.sort((a, b) => {
                const aOlderDateUploaded = getOlderDateUploaded(
                  a.props.challengeInstanceData
                );
                const bOlderDateUploaded = getOlderDateUploaded(
                  b.props.challengeInstanceData
                );

                return aOlderDateUploaded > bOlderDateUploaded ? 1 : -1;
              });
            }
            return accumulator;
          },
          []
        )}
      </ValidateOverviewScrollContainer>
    </ValidateOverviewContainer>
  ) : (
    <ValidateOverviewContainer>
      <Spinner />
    </ValidateOverviewContainer>
  );
};

export default ValidateOverview;
