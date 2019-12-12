import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectInstanceContenders,
  selectInstanceTemplateId,
  selectInstanceValidators
} from "../../redux/firestore/challenges-instances/selectors";
import { selectChallengeTemplateFromId } from "../../redux/firestore/challenges-templates/selectors";
import {
  selectUserProfileId,
  selectUserProfileIsLoaded
} from "../../redux/user/selectors";
import { selectChallengesTemplatesAreLoading } from "../../redux/firestore/challenges-templates/selectors";
import { selectChallengesInstancesAreLoading } from "../../redux/firestore/challenges-instances/selectors";

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
  ChallengeInstanceData
} from "./challenge-instance.styles";

const selectChallengeInstanceData = createStructuredSelector({
  userProfileId: selectUserProfileId,
  userProfileIsLoaded: selectUserProfileIsLoaded,
  challengesTemplatesAreLoading: selectChallengesTemplatesAreLoading,
  challengesInstancesAreLoading: selectChallengesInstancesAreLoading
});

const ChallengeInstance = () => {
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

  const challengeInstanceValidators = useSelector(
    state => memoizedSelectInstanceValidators(state, instanceId),
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
    videoUrl
  } = challengeTemplate;

  const userContenderObject = challengeInstanceContenders.find(
    contender => contender.id === userProfileId
  );

  const userStatus = userContenderObject
    ? userContenderObject.status
    : undefined;

  const userDisplayNameForFileName = userContenderObject
    ? userContenderObject.name.replace(/\s/g, "")
    : undefined;

  const isUserValidator = challengeInstanceValidators.some(
    validator => validator.id === userProfileId
  );

  return challengesInstancesAreLoading ||
    challengesTemplatesAreLoading ||
    !userProfileIsLoaded ? (
    <ChallengeInstanceContainer>
      <Spinner />
    </ChallengeInstanceContainer>
  ) : (
    <ChallengeInstanceContainer>
      <ChallengeInstanceVideoPlayer
        src={videoUrl}
        controls
        controlsList="nodownload"
      />
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
          <span>{author}</span>
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
              onClick={() => alert("accept challenge")}
            />
            <CustomButton
              type="button"
              text="Decline challenge"
              onClick={() => alert("decline challenge")}
            />
          </ChallengeInstanceButtonsContainer>
        ) : (
          <ChallengeInstanceButtonsContainer>
            <CustomButton
              type="button"
              text="Cancel challenge"
              onClick={() => alert("cancel challenge")}
            />
            <FileUploader
              fileType="imageOrvideo"
              directory={`challengesInstances/${instanceId}/${userProfileId}`}
              fileName={userDisplayNameForFileName}
              urlAction={() => console.log()}
              labelText="Choose challenge proof"
              submitText={"Upload"}
              disabled={false}
              maxFileSizeInMB={50}
            />
          </ChallengeInstanceButtonsContainer>
        ))}
      <ChallengeInstanceData>
        <InstanceContenderInfo
          challengeInstanceContenders={challengeInstanceContenders}
          userProfileId={userProfileId}
          isUserValidator={isUserValidator}
        />
      </ChallengeInstanceData>
    </ChallengeInstanceContainer>
  );
};

export default ChallengeInstance;
