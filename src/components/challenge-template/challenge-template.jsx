import React, { useMemo, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useDispatch } from "react-redux";

import {
  selectChallengeTemplateFromCategory,
  selectChallengesTemplatesAreLoading
} from "../../redux/firestore/challenges-templates/selectors";
import {
  selectUserProfileIsEmpty,
  selectUserAcceptedFriends,
  selectUserProfileDisplayName,
  selectUserProfileId
} from "../../redux/user/selectors";
import { openModal } from "../../redux/modal/actions";
import { addNewInstanceStart } from "../../redux/firestore/challenges-instances/actions";

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
  challengesTempletesAreLoading: selectChallengesTemplatesAreLoading,
  userProfileIsEmpty: selectUserProfileIsEmpty,
  userAcceptedFriends: selectUserAcceptedFriends,
  userProfileDisplayName: selectUserProfileDisplayName,
  userProfileId: selectUserProfileId
});

const ChallengeTemplate = () => {
  const dispatch = useDispatch();
  const { category, challengeTemplateId } = useParams();
  const { push } = useHistory();
  const memoizedSelectChallengeTemplateFromCategory = useMemo(
    () => selectChallengeTemplateFromCategory,
    []
  );
  const {
    challengesTempletesAreLoading,
    userProfileIsEmpty,
    userAcceptedFriends,
    userProfileDisplayName,
    userProfileId
  } = useSelector(selectChallengeTemplateData, shallowEqual);

  const challengeTemplate = useSelector(
    state =>
      memoizedSelectChallengeTemplateFromCategory(
        state,
        category,
        challengeTemplateId
      ),
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
  } = challengeTemplate;

  const handleOpenAcceptChallenge = useCallback(() => {
    if (userProfileIsEmpty) {
      push("/signin");
    } else {
      const openAcceptChallengeModalData = {
        modalType: "ADD_CHALLENGE_INSTANCE",
        modalProps: {
          challengeTemplate
        }
      };
      dispatch(openModal(openAcceptChallengeModalData));
    }
  }, [dispatch, challengeTemplate, push, userProfileIsEmpty]);

  const handleCreateNewChallengeInstance = useCallback(() => {
    if (userProfileIsEmpty) {
      push("/signin");
    } else {
      dispatch(
        addNewInstanceStart(
          challengeTemplate,
          {
            contenders: [],
            validators: []
          },
          userProfileDisplayName,
          userProfileId
        )
      );
    }
  }, [
    challengeTemplate,
    userProfileDisplayName,
    userProfileId,
    dispatch,
    push,
    userProfileIsEmpty
  ]);

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
        {ranking
          .sort((a, b) =>
            a.rating > b.rating
              ? -1
              : a.rating === b.rating
              ? a.name > b.name
                ? 1
                : -1
              : 1
          )
          .map((user, userIndex) => (
            <span key={userIndex}>
              {user.name} - {user.rating}
            </span>
          ))}
      </ChallengeTemplateRanking>
      <ChallengeTemplateButtonsContainer>
        {userAcceptedFriends.length > 0 ? (
          <CustomButton
            text="Accept challenge"
            type="button"
            onClick={handleOpenAcceptChallenge}
            large
          />
        ) : (
          <CustomButton
            text="Accept challenge"
            type="button"
            onClick={handleCreateNewChallengeInstance}
            large
          />
        )}
      </ChallengeTemplateButtonsContainer>
    </ChallengeTemplateContainer>
  ) : (
    <ChallengeTemplateContainer>
      <Spinner />
    </ChallengeTemplateContainer>
  );
};

export default ChallengeTemplate;
