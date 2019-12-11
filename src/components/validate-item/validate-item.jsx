import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useSelector, shallowEqual } from "react-redux";

import {
  selectVideoUrlFromChallengeTemplate,
  selectNameFromChallengeTemplate
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

  const memoizedSelectVideoUrlFromChallengeTemplate = useMemo(
    () => selectVideoUrlFromChallengeTemplate,
    []
  );

  const memoizedSelectNameFromChallengeTemplate = useMemo(
    () => selectNameFromChallengeTemplate,
    []
  );

  const videoUrlFromChallengeTemplayte = useSelector(
    state =>
      memoizedSelectVideoUrlFromChallengeTemplate(state, challengeTemplateId),
    shallowEqual
  );

  const nameFromChallengeTemplate = useSelector(
    state =>
      memoizedSelectNameFromChallengeTemplate(state, challengeTemplateId),
    shallowEqual
  );

  const contendersDisplayNamesString = contenders
    .map(contender => contender.name)
    .join(" ,");

  const status = contenders.some(
    contender => contender.status === "Accepted" && contender.proof.url !== ""
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
