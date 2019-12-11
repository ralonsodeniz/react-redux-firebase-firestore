import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectInstanceContenders,
  selectInstanceTemplateId
} from "../../redux/firestore/challenges-instances/selectors";
import { selectChallengeTemplateFromId } from "../../redux/firestore/challenges-templates/selectors";
import { selectUserProfileId } from "../../redux/user/selectors";
import { selectChallengesTemplatesAreLoading } from "../../redux/firestore/challenges-templates/selectors";
import { selectChallengesInstancesAreLoading } from "../../redux/firestore/challenges-instances/selectors";

import Spinner from "../spinner/spinner";

import {
  ChallengeInstanceContainer,
  ChallengeInstanceVideoPlayer,
  ChallengeInstanceTemplateDataContainer,
  ChallengeInstanceTemplateData,
  ChallengeInstanceButtonsContainer
} from "./challenge-instance.styles";

const selectChallengeInstanceData = createStructuredSelector({
  userProfileId: selectUserProfileId,
  challengesTemplatesAreLoading: selectChallengesTemplatesAreLoading,
  challengesInstancesAreLoading: selectChallengesInstancesAreLoading
});

const ChallengeInstance = () => {
  const { instanceId } = useParams();

  const {
    userProfileId,
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
    videoUrl
  } = challengeTemplate;

  const isUserContender = challengeInstanceContenders.find(
    contender => contender.id === userProfileId
  );
  console.log(isUserContender);

  return challengesInstancesAreLoading || challengesTemplatesAreLoading ? (
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
        <ChallengeInstanceButtonsContainer>
          {/* {
                isUserContender ? (

                ) :(

                )
            } */}
        </ChallengeInstanceButtonsContainer>
      </ChallengeInstanceTemplateDataContainer>
    </ChallengeInstanceContainer>
  );
};

export default ChallengeInstance;
