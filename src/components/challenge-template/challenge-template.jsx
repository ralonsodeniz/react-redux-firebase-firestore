import React, { useMemo, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useDispatch } from "react-redux";

import {
  selectChallengeTemplateFromId,
  selectChallengesTemplatesAreLoading
} from "../../redux/firestore/challenges-templates/selectors";
import {
  selectUserProfileIsEmpty,
  selectUserAcceptedFriends,
  selectUserProfileId,
  selectUsersDisplayNamesById
} from "../../redux/user/selectors";
import { openModal } from "../../redux/modal/actions";
import { addNewInstanceStarts } from "../../redux/firestore/challenges-instances/actions";

import CustomButton from "../custom-button/custom-button";

import {
  ChallengeTemplateContainer,
  ChallengeTemplateVideoPlayer,
  ChallengeTemplateDataContainer,
  ChallengeTemplateData,
  ChallengeTemplateRanking,
  ChallengeTemplateButtonsContainer,
  ChallengeTemplateImageContainer
} from "./challenge-template.styles";
import Spinner from "../spinner/spinner";

const selectChallengeTemplateData = createStructuredSelector({
  challengesTempletesAreLoading: selectChallengesTemplatesAreLoading,
  userProfileIsEmpty: selectUserProfileIsEmpty,
  userAcceptedFriends: selectUserAcceptedFriends,
  userProfileId: selectUserProfileId
});

const ChallengeTemplate = () => {
  const dispatch = useDispatch();

  const { challengeTemplateId } = useParams();

  const { push } = useHistory();

  const memoizedSelectChallengeTemplateFromId = useMemo(
    () => selectChallengeTemplateFromId,
    []
  );

  const memoizedSelectUsersDisplayNamesById = useMemo(
    () => selectUsersDisplayNamesById,
    []
  );

  const {
    challengesTempletesAreLoading,
    userProfileIsEmpty,
    userAcceptedFriends,
    userProfileId
  } = useSelector(selectChallengeTemplateData, shallowEqual);

  const challengeTemplate = useSelector(
    state => memoizedSelectChallengeTemplateFromId(state, challengeTemplateId),
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
    proofUrl,
    proofFileType
  } = challengeTemplate;

  const authorDisplayName = useSelector(state =>
    memoizedSelectUsersDisplayNamesById(state, author)
  );

  const rankingUsersId = ranking ? ranking.map(user => user.id) : [];

  const rankingUsersDisplayNames = useSelector(state =>
    memoizedSelectUsersDisplayNamesById(state, rankingUsersId)
  );

  const enhancedRanking = ranking
    ? ranking.map((user, userIndex) => ({
        ...user,
        name: rankingUsersDisplayNames[userIndex]
      }))
    : [];

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
        addNewInstanceStarts(
          challengeTemplate,
          {
            contenders: [],
            validators: []
          },
          userProfileId
        )
      );
    }
  }, [challengeTemplate, userProfileId, dispatch, push, userProfileIsEmpty]);

  return !challengesTempletesAreLoading ? (
    <ChallengeTemplateContainer>
      {proofFileType === "video" ? (
        <ChallengeTemplateVideoPlayer
          src={proofUrl}
          controls
          controlsList="nodownload"
        />
      ) : (
        <ChallengeTemplateImageContainer src={proofUrl} alt="proof image" />
      )}
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
          <span>{authorDisplayName}</span>
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
        {enhancedRanking
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
