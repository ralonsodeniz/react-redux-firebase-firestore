import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import FormDropdown from "../form-dropdown/form-dropdown";
import CustomButton from "../custom-button/custom-button";

import {
  validateProofStarts,
  invalidateProofStarts
} from "../../redux/firestore/challenges-instances/actions";

import {
  InstanceContenderInfoContainer,
  InstanceContenderInfoTitle,
  InstanceContenderInfoText,
  InstanceContenderInfoStatusText,
  InstanceContenderInfoStateText,
  InstanceContenderInfoFormDropdownContainer,
  InstanceContenderInfoVideoPlayer,
  InstanceContenderInfoButtonsContainer
} from "./instance-contender-info.styles";

const InstanceContenderInfo = ({
  challengeInstanceContenders,
  userProfileId,
  isUserValidator,
  instanceId
}) => {
  const dispatch = useDispatch();

  const isUserContender = challengeInstanceContenders.some(
    contender => contender.id === userProfileId
  );

  const selectedContenderInitialValue = isUserContender
    ? userProfileId
    : "default";

  const [selectedContender, setSelectedContender] = useState(
    selectedContenderInitialValue
  );

  const dropdownOptions = challengeInstanceContenders.map(contender => ({
    value: contender.id,
    text: contender.name
  }));

  const handleChange = useCallback(event => {
    const { value } = event.target;
    setSelectedContender(value);
  }, []);

  const handleValidateProof = useCallback(
    () => dispatch(validateProofStarts(selectedContender, instanceId)),
    [dispatch, selectedContender, instanceId]
  );

  const handleInvalidateProof = useCallback(
    () => dispatch(invalidateProofStarts(selectedContender, instanceId)),
    [dispatch, selectedContender, instanceId]
  );

  return (
    <InstanceContenderInfoContainer>
      <InstanceContenderInfoFormDropdownContainer>
        <FormDropdown
          handleChange={handleChange}
          label="Select contender"
          options={dropdownOptions}
          multiple={false}
          size={0}
          defaultValue={selectedContenderInitialValue}
        />
      </InstanceContenderInfoFormDropdownContainer>
      {challengeInstanceContenders.reduce(
        (accumulator, contender, contenderIndex) => {
          if (contender.id === selectedContender) {
            accumulator.push(
              <InstanceContenderInfoContainer key={contenderIndex}>
                <InstanceContenderInfoTitle>Name</InstanceContenderInfoTitle>
                <InstanceContenderInfoText>
                  {contender.name}
                </InstanceContenderInfoText>
                <InstanceContenderInfoTitle>Proof</InstanceContenderInfoTitle>
                {contender.proof.url ? (
                  isUserValidator || isUserContender || contender.public ? (
                    <InstanceContenderInfoVideoPlayer
                      src={contender.proof.url}
                      controls
                      controlsList="nodownload"
                    />
                  ) : (
                    <InstanceContenderInfoText>
                      Proof is private
                    </InstanceContenderInfoText>
                  )
                ) : (
                  <InstanceContenderInfoText>
                    No proof provided
                  </InstanceContenderInfoText>
                )}
                <InstanceContenderInfoTitle>
                  Instance tatus
                </InstanceContenderInfoTitle>
                <InstanceContenderInfoStatusText status={contender.status}>
                  {contender.status}
                </InstanceContenderInfoStatusText>
                <InstanceContenderInfoTitle>
                  Proof state
                </InstanceContenderInfoTitle>
                <InstanceContenderInfoStateText state={contender.proof.state}>
                  {contender.proof.state}
                </InstanceContenderInfoStateText>
                {contender.status === "Accepted" && (
                  <div>
                    <InstanceContenderInfoTitle>
                      Expires at
                    </InstanceContenderInfoTitle>
                    <InstanceContenderInfoText>
                      {contender.expiresAt.toDate().toString()}
                    </InstanceContenderInfoText>
                  </div>
                )}
                <InstanceContenderInfoTitle>Rating</InstanceContenderInfoTitle>
                <InstanceContenderInfoText>
                  {contender.rating}
                </InstanceContenderInfoText>

                {isUserValidator &&
                  contender.id !== userProfileId &&
                  contender.proof.state === "Pending" && (
                    <InstanceContenderInfoButtonsContainer>
                      <CustomButton
                        text="Validate proof"
                        type="button"
                        onClick={handleValidateProof}
                      />
                      <CustomButton
                        text="Invalidate proof"
                        type="button"
                        onClick={handleInvalidateProof}
                      />
                    </InstanceContenderInfoButtonsContainer>
                  )}
              </InstanceContenderInfoContainer>
            );
          }
          return accumulator;
        },
        []
      )}
    </InstanceContenderInfoContainer>
  );
};

InstanceContenderInfo.propTypes = {
  challengeInstanceContenders: PropTypes.array.isRequired,
  userProfileId: PropTypes.string.isRequired,
  isUserValidator: PropTypes.bool.isRequired,
  instanceId: PropTypes.string.isRequired
};

export default InstanceContenderInfo;
