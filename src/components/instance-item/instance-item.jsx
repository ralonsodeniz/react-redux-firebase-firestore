import React, { useMemo, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import {
  selectUserProfileId,
  selectUsersDisplayNamesById
} from "../../redux/user/selectors";
import {
  selectProofUrlFromChallengeTemplate,
  selectNameFromChallengeTemplate,
  selectCategoryFromChallengeTemplate,
  selectProofFileTypeFromChallengeTemplate
} from "../../redux/firestore/challenges-templates/selectors";

import {
  InstanceItemContainer,
  InstanceItemVideoPlayer,
  InstanceItemStatusText,
  InstanceCustomButton,
  InstanceExpiresAtContainer,
  InstanceItemImageContianer
} from "./instance-item.styles";

const selectInstanceItemData = createStructuredSelector({
  userProfileId: selectUserProfileId
});

const InstanceItem = ({ challengeInstanceData }) => {
  const { push } = useHistory();

  const { userProfileId } = useSelector(selectInstanceItemData, shallowEqual);

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

  const proofUrlFromChallengeTemplate = useSelector(
    state =>
      memoizedSelectProofUrlFromChallengeTemplate(state, challengeTemplateId),
    shallowEqual
  );

  const memoizedSelectCategoryFromChallengeTemplate = useMemo(
    () => selectCategoryFromChallengeTemplate,
    []
  );

  const categoryFromChallengeTemplate = useSelector(state =>
    memoizedSelectCategoryFromChallengeTemplate(state, challengeTemplateId)
  );

  const memoizedSelectNameFromChallengeTemplate = useMemo(
    () => selectNameFromChallengeTemplate,
    []
  );

  const nameFromChallengeTemplate = useSelector(
    state =>
      memoizedSelectNameFromChallengeTemplate(state, challengeTemplateId),
    shallowEqual
  );

  const memoizedSelectUsersDisplayNamesById = useMemo(
    () => selectUsersDisplayNamesById,
    []
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

  const memoizedSelectProofFileTypeFromChallengeTemplate = useMemo(
    () => selectProofFileTypeFromChallengeTemplate,
    []
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

  const userInstanceData = contenders.find(
    contender => contender.id === userProfileId
  );

  const {
    status,
    proof: { url },
    expiresAt
  } = userInstanceData;

  const proofUrl = url !== "" ? url : proofUrlFromChallengeTemplate;

  const handleOnClick = useCallback(
    () => push(`/instance/${challengeInstanceId}`),
    [push, challengeInstanceId]
  );

  return (
    <InstanceItemContainer>
      {proofFileType === "video" ? (
        <InstanceItemVideoPlayer
          src={proofUrl}
          controls
          controlsList="nodownload"
          preload="none"
        />
      ) : (
        <InstanceItemImageContianer src={proofUrl} alt="instance proof image" />
      )}
      <strong>Name:</strong>
      <span>{nameFromChallengeTemplate}</span>
      <strong>Category:</strong>
      <span>{categoryFromChallengeTemplate}</span>
      <strong>Administrator:</strong>
      <span>{authorDisplayName}</span>
      <strong>Instance ID:</strong>
      <span>{challengeInstanceId}</span>
      <strong>Contenders:</strong>
      <span>{contendersDisplayNamesString}</span>
      <strong>Status:</strong>
      <InstanceItemStatusText status={status}>{status}</InstanceItemStatusText>
      {expiresAt && (
        <InstanceExpiresAtContainer>
          <strong>Expires at:</strong>
          <span>{expiresAt.toDate().toString()}</span>
        </InstanceExpiresAtContainer>
      )}
      <InstanceCustomButton
        type="button"
        text="Go to instance"
        onClick={handleOnClick}
      />
    </InstanceItemContainer>
  );
};

InstanceItem.propTypes = {
  challengeInstanceData: PropTypes.object.isRequired
};

export default InstanceItem;
