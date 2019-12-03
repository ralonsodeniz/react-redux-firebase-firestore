import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectChallengeTemplateFromCategory,
  selectChallengesTemplatesAreLoading
} from "../../redux/firestore/challenges-templates/selectors";

import CustomButton from "../custom-button/custom-button";

import {
  ChallengeTemplateContainer,
  ChallengeTemplateVideoPlayer,
  ChallengeTemplateDataContainer,
  ChallengeTemplateData,
  ChallengeTemplateRanking,
  ChallengeTemplateButtonsContainer
} from "./challenge-template.styles";
import Spinner from "../spinner/spinner";

const selectChallengeTemplateData = createStructuredSelector({
  challengesTempletesAreLoading: selectChallengesTemplatesAreLoading
});

const ChallengeTemplate = () => {
  const { category, challengeTemplateId } = useParams();
  const memoizedSelectChallengeTemplateFromCategory = useMemo(
    () => selectChallengeTemplateFromCategory,
    []
  );
  const { challengesTempletesAreLoading } = useSelector(
    selectChallengeTemplateData,
    shallowEqual
  );

  const {
    author,
    daysToComplete,
    description,
    difficulty,
    minimumParticipants,
    name,
    ranking,
    rating,
    timesCompleted,
    videoUrl
  } = useSelector(
    state =>
      memoizedSelectChallengeTemplateFromCategory(
        state,
        category,
        challengeTemplateId
      ),
    shallowEqual
  );

  return !challengesTempletesAreLoading ? (
    <ChallengeTemplateContainer>
      <ChallengeTemplateVideoPlayer
        src={videoUrl}
        controls
        controlsList="nodownload"
      />
      <ChallengeTemplateDataContainer>
        <ChallengeTemplateData>
          <h4>Name:</h4>
          <span>{name}</span>
          <h4>Description:</h4>
          <span>{description}</span>
          <h4>Minimum participants:</h4>
          <span>{minimumParticipants}</span>
          <h4>Days to Complete:</h4>
          <span>{daysToComplete}</span>
        </ChallengeTemplateData>
        <ChallengeTemplateData>
          <h4>Author:</h4>
          <span>{author}</span>
          <h4>Difficulty:</h4>
          <span>{difficulty}</span>
          <h4>Times completed:</h4>
          <span>{timesCompleted}</span>
          <h4>Rating:</h4>
          <span>{rating}</span>
        </ChallengeTemplateData>
      </ChallengeTemplateDataContainer>
      <ChallengeTemplateRanking>
        <h4>Users ranking</h4>
        {ranking.map((user, userIndex) => (
          <span key={userIndex}>{user}</span>
        ))}
      </ChallengeTemplateRanking>
      <ChallengeTemplateButtonsContainer>
        <CustomButton
          text="Accept challenge"
          type="button"
          onClick={() => {}}
          large
        />
      </ChallengeTemplateButtonsContainer>
    </ChallengeTemplateContainer>
  ) : (
    <ChallengeTemplateContainer>
      <Spinner />
    </ChallengeTemplateContainer>
  );
};

export default ChallengeTemplate;
