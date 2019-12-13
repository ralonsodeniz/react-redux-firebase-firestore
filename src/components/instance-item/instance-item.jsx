import React, { useMemo, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import { selectUserProfileId } from "../../redux/user/selectors";
import {
  selectVideoUrlFromChallengeTemplate,
  selectNameFromChallengeTemplate,
  selectCategoryFromChallengeTemplate
} from "../../redux/firestore/challenges-templates/selectors";

import {
  InstanceItemContainer,
  InstanceItemVideoPlayer,
  InstanceItemStatusText,
  InstanceCustomButton,
  InstanceExpiresAtContainer
} from "./instance-item.styles";

const selectInstanceItemData = createStructuredSelector({
  userProfileId: selectUserProfileId
});

const InstanceItem = ({ challengeInstanceData }) => {
  const { push } = useHistory();

  const { userProfileId } = useSelector(selectInstanceItemData, shallowEqual);

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

  const videoUrlFromChallengeTemplate = useSelector(
    state =>
      memoizedSelectVideoUrlFromChallengeTemplate(state, challengeTemplateId),
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

  const contendersDisplayNamesString = contenders
    .map(contender => contender.name)
    .join(", ");

  const userInstanceData = contenders.find(
    contender => contender.id === userProfileId
  );

  const {
    status,
    proof: { url },
    expiresAt
  } = userInstanceData;

  const videoUrl = url !== "" ? url : videoUrlFromChallengeTemplate;

  const handleOnClick = useCallback(
    () => push(`/instance/${challengeInstanceId}`),
    [push, challengeInstanceId]
  );

  return (
    <InstanceItemContainer>
      <InstanceItemVideoPlayer
        src={videoUrl}
        controls
        controlsList="nodownload"
      />
      <strong>Name:</strong>
      <span>{nameFromChallengeTemplate}</span>
      <strong>Category:</strong>
      <span>{categoryFromChallengeTemplate}</span>
      <strong>Administrator:</strong>
      <span>{userProfileDisplayName}</span>
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
