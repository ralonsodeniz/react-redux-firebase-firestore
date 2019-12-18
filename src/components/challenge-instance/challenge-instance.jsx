import React, { useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectInstanceContenders,
  selectInstanceTemplateId,
  selectInstanceValidators
} from "../../redux/firestore/challenges-instances/selectors";
import {
  selectChallengeTemplateFromId,
  selectChallengesTemplatesAreLoading
} from "../../redux/firestore/challenges-templates/selectors";
import {
  selectUserProfileId,
  selectUserProfileIsLoaded,
  selectUsersDisplayNamesById
} from "../../redux/user/selectors";
import { selectChallengesInstancesAreLoading } from "../../redux/firestore/challenges-instances/selectors";
import {
  acceptInstanceStarts,
  cancelInstanceStarts,
  uploadProofStarts,
  toggleProofPublicPrivateStarts
} from "../../redux/firestore/challenges-instances/actions";

import Spinner from "../spinner/spinner";
import CustomButton from "../custom-button/custom-button";
import FileUploader from "../file-uplader/file-uploader";
import InstanceContenderInfo from "../instance-contender-info/instance-contender-info";

import {
  ChallengeInstanceContainer,
  ChallengeInstanceVideoPlayer,
  ChallengeInstanceTemplateDataContainer,
  ChallengeInstanceTemplateData,
  ChallengeInstanceButtonsContainer,
  ChallengeInstanceData,
  ChallengeInstanceButtonsGroup,
  ChallengeInstanceImageContainer
} from "./challenge-instance.styles";

const selectChallengeInstanceData = createStructuredSelector({
  userProfileId: selectUserProfileId,
  userProfileIsLoaded: selectUserProfileIsLoaded,
  challengesTemplatesAreLoading: selectChallengesTemplatesAreLoading,
  challengesInstancesAreLoading: selectChallengesInstancesAreLoading
});

const ChallengeInstance = () => {
  const dispatch = useDispatch();

  const { instanceId } = useParams();

  const {
    userProfileId,
    userProfileIsLoaded,
    challengesTemplatesAreLoading,
    challengesInstancesAreLoading
  } = useSelector(selectChallengeInstanceData, shallowEqual);

  const memoizedSelectInstanceContenders = useMemo(
    () => selectInstanceContenders,
    []
  );

  const memoizedSelectInstanceTemplateId = useMemo(
    () => selectInstanceTemplateId,
    []
  );

  const memoizedSelectChallengeTemplateFromId = useMemo(
    () => selectChallengeTemplateFromId,
    []
  );

  const memoizedSelectInstanceValidators = useMemo(
    () => selectInstanceValidators,
    []
  );

  const memoizedSelectUsersDisplayNameById = useMemo(
    () => selectUsersDisplayNamesById,
    []
  );

  const challengeInstanceContenders = useSelector(
    state => memoizedSelectInstanceContenders(state, instanceId),
    shallowEqual
  );

  const templateId = useSelector(
    state => memoizedSelectInstanceTemplateId(state, instanceId),
    shallowEqual
  );

  const challengeTemplate = useSelector(
    state => memoizedSelectChallengeTemplateFromId(state, templateId),
    shallowEqual
  );

  const {
    author,
    daysToComplete,
    description,
    difficulty,
    minimumParticipants,
    name,
    rating,
    timesCompleted,
    proofUrl,
    category,
    proofFileType
  } = challengeTemplate;

  const challengeInstanceValidators = useSelector(
    state => memoizedSelectInstanceValidators(state, instanceId),
    shallowEqual
  );

  const challengeInstanceContendersIds = challengeInstanceContenders.map(
    contender => contender.id
  );

  const challengeInstanceContendersDisplayNames = useSelector(state =>
    memoizedSelectUsersDisplayNameById(state, challengeInstanceContendersIds)
  );

  const authorDisplayName = useSelector(state =>
    memoizedSelectUsersDisplayNameById(state, author)
  );

  const enhancedChallengeInstanceContenders = challengeInstanceContenders.map(
    (contender, contenderIndex) => {
      return {
        ...contender,
        name: challengeInstanceContendersDisplayNames[contenderIndex]
      };
    }
  );

  const userContenderObject = enhancedChallengeInstanceContenders.find(
    contender => contender.id === userProfileId
  );

  const userStatus = userContenderObject
    ? userContenderObject.status
    : undefined;

  const userDisplayNameForFileName = userContenderObject
    ? userContenderObject.name.replace(/\s/g, "")
    : undefined;

  const userInstancePublic = userContenderObject
    ? userContenderObject.public
    : false;

  const isUserValidator = challengeInstanceValidators.some(
    validator => validator === userProfileId
  );

  const handleAcceptChallenge = useCallback(
    () =>
      dispatch(acceptInstanceStarts(userProfileId, instanceId, daysToComplete)),
    [dispatch, userProfileId, instanceId, daysToComplete]
  );

  const handleCancelChallenge = useCallback(
    () => dispatch(cancelInstanceStarts(userProfileId, instanceId)),
    [dispatch, userProfileId, instanceId]
  );

  const handleUploadProof = useCallback(
    (dispatch, instanceId, userProfileId) => proofFileType => url => {
      const proofData = {
        instanceId,
        userProfileId,
        url
      };
      dispatch(uploadProofStarts(proofData));
    },
    []
  );

  const handleUpdateProofPublicOrPrivate = useCallback(
    () => dispatch(toggleProofPublicPrivateStarts(userProfileId, instanceId)),
    [userProfileId, instanceId, dispatch]
  );

  return challengesInstancesAreLoading ||
    challengesTemplatesAreLoading ||
    !userProfileIsLoaded ? (
    <ChallengeInstanceContainer>
      <Spinner />
    </ChallengeInstanceContainer>
  ) : (
    <ChallengeInstanceContainer>
      {proofFileType === "video" ? (
        <ChallengeInstanceVideoPlayer
          src={proofUrl}
          controls
          controlsList="nodownload"
        />
      ) : (
        <ChallengeInstanceImageContainer src={proofUrl} alt="proof image" />
      )}
      <ChallengeInstanceTemplateDataContainer>
        <ChallengeInstanceTemplateData>
          <h4>Name:</h4>
          <span>{name}</span>
          <h4>Description:</h4>
          <span>{description}</span>
          <h4>Minimum participants:</h4>
          <span>{minimumParticipants}</span>
          <h4>Days to Complete:</h4>
          <span>{daysToComplete}</span>
        </ChallengeInstanceTemplateData>
        <ChallengeInstanceTemplateData>
          <h4>Author:</h4>
          <span>{authorDisplayName}</span>
          <h4>Category:</h4>
          <span>{category}</span>
          <h4>Difficulty:</h4>
          <span>{difficulty}</span>
          <h4>Times completed:</h4>
          <span>{timesCompleted}</span>
          <h4>Rating:</h4>
          <span>{rating}</span>
        </ChallengeInstanceTemplateData>
      </ChallengeInstanceTemplateDataContainer>
      {userStatus &&
        (userStatus === "Pending" ? (
          <ChallengeInstanceButtonsContainer>
            <CustomButton
              type="button"
              text="Accept challenge"
              onClick={handleAcceptChallenge}
            />
            <CustomButton
              type="button"
              text="Decline challenge"
              onClick={handleCancelChallenge}
            />
          </ChallengeInstanceButtonsContainer>
        ) : userStatus === "Accepted" ? (
          <ChallengeInstanceButtonsContainer>
            <ChallengeInstanceButtonsGroup>
              <CustomButton
                type="button"
                text="Cancel challenge"
                onClick={handleCancelChallenge}
              />
              {userInstancePublic ? (
                <CustomButton
                  type="button"
                  text="Make your proof private"
                  onClick={handleUpdateProofPublicOrPrivate}
                />
              ) : (
                <CustomButton
                  type="button"
                  text="Make your proof public"
                  onClick={handleUpdateProofPublicOrPrivate}
                />
              )}
            </ChallengeInstanceButtonsGroup>
            <FileUploader
              fileType="imageOrvideo"
              directory={`challengesInstances/${instanceId}/${userProfileId}`}
              fileName={userDisplayNameForFileName}
              urlAction={handleUploadProof(dispatch, instanceId, userProfileId)}
              labelText="Choose challenge proof"
              submitText={"Upload"}
              disabled={false}
              maxFileSizeInMB={50}
            />
          </ChallengeInstanceButtonsContainer>
        ) : null)}
      <ChallengeInstanceData>
        <InstanceContenderInfo
          challengeInstanceContenders={enhancedChallengeInstanceContenders}
          userProfileId={userProfileId}
          isUserValidator={isUserValidator}
          instanceId={instanceId}
          proofFileType={proofFileType}
        />
      </ChallengeInstanceData>
    </ChallengeInstanceContainer>
  );
};

export default ChallengeInstance;
