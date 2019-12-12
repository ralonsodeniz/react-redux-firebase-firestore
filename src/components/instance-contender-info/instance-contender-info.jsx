import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

import FormDropdown from "../form-dropdown/form-dropdown";
import CustomButton from "../custom-button/custom-button";

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
  isUserValidator
}) => {
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
                <InstanceContenderInfoVideoPlayer
                  src={contender.proof.url}
                  controls
                  controlsList="nodownload"
                />
                <InstanceContenderInfoTitle>Rating</InstanceContenderInfoTitle>
                <InstanceContenderInfoText>
                  {contender.rating}
                </InstanceContenderInfoText>
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

                {isUserValidator &&
                  contender.id !== userProfileId &&
                  contender.proof.state === "Pending" && (
                    <InstanceContenderInfoButtonsContainer>
                      <CustomButton
                        text="Valid proof"
                        type="button"
                        onClick={() => {}}
                      />
                      <CustomButton
                        text="Invalid proof"
                        type="button"
                        onClick={() => {}}
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
  isUserValidator: PropTypes.bool.isRequired
};

export default InstanceContenderInfo;
