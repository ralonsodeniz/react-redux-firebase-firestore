import React, { useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";

import {
  selectProofUrlFromChallengeTemplate,
  selectNameFromChallengeTemplate,
  selectProofFileTypeFromChallengeTemplate
} from "../../redux/firestore/challenges-templates/selectors";

import { selectUsersDisplayNamesById } from "../../redux/user/selectors";

import CustomButton from "../custom-button/custom-button";

import {
  ValidateItemContainer,
  ValidateItemStatusText,
  ValidateItemVideoPlayer,
  ValidateItemImageContainer
} from "./validate-item.styles";

const ValidateItem = ({ challengeInstanceData }) => {
  const { push } = useHistory();

  const {
    administrator,
    challengeInstanceId,
    challengeTemplateId,
    contenders
  } = challengeInstanceData;

  const memoizedSelectProofUrlFromChallengeTemplate = useMemo(
    () => selectProofUrlFromChallengeTemplate,
    []
  );

  const memoizedSelectNameFromChallengeTemplate = useMemo(
    () => selectNameFromChallengeTemplate,
    []
  );

  const memoizedSelectUsersDisplayNamesById = useMemo(
    () => selectUsersDisplayNamesById,
    []
  );

  const memoizedSelectProofFileTypeFromChallengeTemplate = useMemo(
    () => selectProofFileTypeFromChallengeTemplate,
    []
  );

  const proofUrlFromChallengeTemplayte = useSelector(
    state =>
      memoizedSelectProofUrlFromChallengeTemplate(state, challengeTemplateId),
    shallowEqual
  );

  const nameFromChallengeTemplate = useSelector(
    state =>
      memoizedSelectNameFromChallengeTemplate(state, challengeTemplateId),
    shallowEqual
  );

  const authorDisplayName = useSelector(
    state => memoizedSelectUsersDisplayNamesById(state, administrator),
    shallowEqual
  );

  const contendersIdArray = contenders.map(contender => contender.id);

  const contendersDisplayNamesArray = useSelector(
    state => memoizedSelectUsersDisplayNamesById(state, contendersIdArray),
    shallowEqual
  );

  const proofFileType = useSelector(
    state =>
      memoizedSelectProofFileTypeFromChallengeTemplate(
        state,
        challengeTemplateId
      ),
    shallowEqual
  );

  const contendersDisplayNamesString = contendersDisplayNamesArray.join(" ,");

  const status = contenders.some(
    contender => contender.proof.state === "Pending"
  )
    ? "Validations pending"
    : contenders.every(contender => contender.status === "Completed")
    ? "Challenge completed"
    : contenders.every(contender => contender.status === "Cancelled")
    ? "Challenge cancelled"
    : contenders.some(
        contender =>
          contender.status === "Pending" ||
          contender.proof === "No proof provided"
      )
    ? "No proofs to validate"
    : "";

  const handleOnClick = useCallback(
    () => push(`/instance/${challengeInstanceId}`),
    [push, challengeInstanceId]
  );

  return (
    <ValidateItemContainer>
      {proofFileType === "video" ? (
        <ValidateItemVideoPlayer
          src={proofUrlFromChallengeTemplayte}
          controls
          controlsList="nodownload"
          preload="none"
        />
      ) : (
        <ValidateItemImageContainer
          src={proofUrlFromChallengeTemplayte}
          alt="proof image"
        />
      )}
      <strong>Name:</strong>
      <span>{nameFromChallengeTemplate}</span>
      <strong>Administrator:</strong>
      <span>{authorDisplayName}</span>
      <strong>Instance ID:</strong>
      <span>{challengeInstanceId}</span>
      <strong>Contenders:</strong>
      <span>{contendersDisplayNamesString}</span>
      <strong>Status:</strong>
      <ValidateItemStatusText status={status}>{status}</ValidateItemStatusText>
      <CustomButton
        type="button"
        text="Go to instance"
        onClick={handleOnClick}
      />
    </ValidateItemContainer>
  );
};

ValidateItem.propTypes = {
  challengeInstanceData: PropTypes.object.isRequired
};

export default ValidateItem;
