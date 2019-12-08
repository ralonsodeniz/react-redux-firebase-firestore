import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector, shallowEqual } from "react-redux";

import {
  selectVideoUrlFromChallengeTemplateUsingId,
  selectNameFromChallengeTemplateUsingId
} from "../../redux/firestore/challenges-templates/selectors";

import {
  ValidateItemContainer,
  ValidateItemStatusText,
  ValidateItemVideoPlayer
} from "./validate-item.styles";

const ValidateItem = ({ challengeInstanceData }) => {
  const {
    administrator: { userProfileDisplayName },
    challengeInstanceId,
    challengeTemplateId,
    contenders
  } = challengeInstanceData;

  const memoizedSelectVideoUrlFromChallengeTemplateUsingId = useMemo(
    () => selectVideoUrlFromChallengeTemplateUsingId,
    []
  );

  const memoizedSelectNameFromChallengeTemplateUsingId = useMemo(
    () => selectNameFromChallengeTemplateUsingId,
    []
  );

  const videoUrlFromChallengeTemplayte = useSelector(
    state =>
      memoizedSelectVideoUrlFromChallengeTemplateUsingId(
        state,
        challengeTemplateId
      ),
    shallowEqual
  );

  const nameFromChallengeTemplate = useSelector(
    state =>
      memoizedSelectNameFromChallengeTemplateUsingId(
        state,
        challengeTemplateId
      ),
    shallowEqual
  );

  const contendersDisplayNamesString = contenders
    .map(contender => contender.name)
    .join(" ,");

  const status = contenders.some(
    contender => contender.status === "Accepted" && contender.proof !== ""
  )
    ? "Validations pending"
    : contenders.every(contender => contender.status === "Completed")
    ? "Challenge completed"
    : contenders.every(contender => contender.status === "Cancelled")
    ? "Challenge cancelled"
    : contenders.some(
        contender =>
          contender.status === "Pending" ||
          (contender.status === "Accepted" && contender.proof === "")
      )
    ? "No proofs to validate"
    : "";

  return (
    <ValidateItemContainer>
      <ValidateItemVideoPlayer
        src={videoUrlFromChallengeTemplayte}
        controls
        controlsList="nodownload"
      />
      <strong>Name:</strong>
      <span>{nameFromChallengeTemplate}</span>
      <strong>Administrator:</strong>
      <span>{userProfileDisplayName}</span>
      <strong>Instance ID:</strong>
      <span>{challengeInstanceId}</span>
      <strong>Contenders:</strong>
      <span>{contendersDisplayNamesString}</span>
      <strong>Status:</strong>
      <ValidateItemStatusText status={status}>{status}</ValidateItemStatusText>
    </ValidateItemContainer>
  );
};

ValidateItem.propTypes = {
  challengeInstanceData: PropTypes.object.isRequired
};

export default ValidateItem;
