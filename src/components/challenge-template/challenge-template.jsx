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
import { selectInfoForRankingFromAllInstancesFromTemplateId } from "../../redux/firestore/challenges-instances/selectors";
import { openModal } from "../../redux/modal/actions";
import { addNewInstanceStarts } from "../../redux/firestore/challenges-instances/actions";
import {
  addLikeToProofStarts,
  addDislikeToProofStarts
} from "../../redux/firestore/challenges-instances/actions";

import CustomButton from "../custom-button/custom-button";
import Spinner from "../spinner/spinner";
import StarRating from "../star-rating/star-rating";

import {
  ChallengeTemplateContainer,
  ChallengeTemplateVideoPlayer,
  ChallengeTemplateDataContainer,
  ChallengeTemplateData,
  ChallengeTemplateRanking,
  ChallengeTemplateButtonsContainer,
  ChallengeTemplateImageContainer,
  ChallengeTemplateRankingContender,
  ChallengeTemplateRankingName,
  ChallengeTemplateRankingLikeDislikeContainer,
  ChallengeTemplateRankingLikeDislike,
  ShowAllProofsContainer,
  ChallengeTemplateImageFrame
} from "./challenge-template.styles";

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

  const memoizedSelectInfoForRankingFromAllInstancesFromTemplateId = useMemo(
    () => selectInfoForRankingFromAllInstancesFromTemplateId,
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
    rating,
    timesCompleted,
    proofUrl,
    posterUrl,
    proofFileType
  } = challengeTemplate;

  const authorDisplayName = useSelector(state =>
    memoizedSelectUsersDisplayNamesById(state, author)
  );

  const infoForRankingFromAllInstancesFromTemplate = useSelector(state =>
    memoizedSelectInfoForRankingFromAllInstancesFromTemplateId(
      state,
      challengeTemplateId
    )
  );

  const rankingUsersId = infoForRankingFromAllInstancesFromTemplate.map(
    contender => contender.id
  );

  const rankingUsersDisplayNames = useSelector(state =>
    memoizedSelectUsersDisplayNamesById(state, rankingUsersId)
  );

  const enhancedRankingInfo = infoForRankingFromAllInstancesFromTemplate
    ? infoForRankingFromAllInstancesFromTemplate.map(
        (contender, contenderIndex) => ({
          ...contender,
          name: rankingUsersDisplayNames[contenderIndex]
        })
      )
    : [];

  const sortedRankingInfo = enhancedRankingInfo.sort((a, b) =>
    a.likes > b.likes
      ? -1
      : a.likes === b.likes
      ? a.dislikes > b.dislikes
        ? 1
        : a.dislikes === b.dislikes
        ? a.dateUploaded > b.dateUploaded
          ? 1
          : -1
        : -1
      : 1
  );

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
          userProfileId,
          false
        )
      );
    }
  }, [challengeTemplate, userProfileId, dispatch, push, userProfileIsEmpty]);

  const handleShowContenderProof = useCallback(
    proofUrl => {
      if (proofFileType === "video") {
        const openModalVideoData = {
          modalType: "VIDEO_PLAYER",
          modalProps: {
            videoUrl: proofUrl,
            videoPoster: posterUrl
          }
        };
        dispatch(openModal(openModalVideoData));
      } else if (proofFileType === "image") {
        const openModalImageData = {
          modalType: "IMAGE_VIEWER",
          modalProps: {
            imageUrl: proofUrl
          }
        };
        dispatch(openModal(openModalImageData));
      }
    },
    [dispatch, proofFileType]
  );

  const handleAddLikeToProof = useCallback(
    (contenderId, hasUserDisliked, instanceId) =>
      dispatch(addLikeToProofStarts(contenderId, instanceId, hasUserDisliked)),
    [dispatch]
  );

  const handleAddDisLikeToProof = useCallback(
    (contenderId, hasUserLiked, instanceId) =>
      dispatch(addDislikeToProofStarts(contenderId, instanceId, hasUserLiked)),
    [dispatch]
  );

  const handleOpenTemplateProofsRanking = useCallback(() => {
    const openModalTemplateProofsRankingData = {
      modalType: "TEMPLATE_PROOFS_RANKING",
      modalProps: {
        sortedRankingInfo,
        userProfileId,
        proofFileType
      }
    };
    dispatch(openModal(openModalTemplateProofsRankingData));
  }, [dispatch, sortedRankingInfo, userProfileId, proofFileType]);

  const handleImageFullScreen = useCallback(() => {
    const image = document.getElementById("imageProof");
    if (image.requestFullscreen) {
      image.requestFullscreen();
    } else if (image.mozRequestFullScreen) {
      image.mozRequestFullScreen();
    } else if (image.webkitRequestFullscreen) {
      image.webkitRequestFullscreen();
    } else if (image.msRequestFullscreen) {
      image.msRequestFullscreen();
    }
  }, []);

  const fullScreenEmojisStyles = {
    position: "absolute",
    top: "9vh",
    left: "20vw",
    cursor: "pointer"
  };

  return !challengesTempletesAreLoading ? (
    <ChallengeTemplateContainer>
      {proofFileType === "video" ? (
        <ChallengeTemplateVideoPlayer
          src={proofUrl}
          controls
          controlsList="nodownload"
          preload="none"
          poster={posterUrl}
        />
      ) : (
        <ChallengeTemplateImageContainer>
          <ChallengeTemplateImageFrame
            src={proofUrl}
            alt="proof image"
            id="imageProof"
          />
          <span
            role="img"
            aria-label="like"
            aria-labelledby="like"
            onClick={handleImageFullScreen}
            style={fullScreenEmojisStyles}
          >
            &#128306;
          </span>
        </ChallengeTemplateImageContainer>
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
          <span
            onClick={() => push(`/profile/${author}`)}
            style={{ cursor: "pointer" }}
          >
            {authorDisplayName}
          </span>
          <h4>Difficulty:</h4>
          <span>{difficulty}</span>
          <h4>Times completed:</h4>
          <span>{timesCompleted}</span>
          <h4>Rating:</h4>
          <StarRating
            totalStars={5}
            interactive={false}
            initialStars={rating.ratingAverage}
            color="red"
            reset={false}
          />
        </ChallengeTemplateData>
      </ChallengeTemplateDataContainer>
      <ChallengeTemplateRanking>
        <h4>Top 10 ranking</h4>
        {sortedRankingInfo
          .filter((contender, contenderIndex) => contenderIndex < 10)
          .map((contender, contenderIndex) => {
            const hasUserLiked = contender.usersThatLiked.some(
              user => user === userProfileId
            );
            const hasUserDisliked = contender.usersThatDisliked.some(
              user => user === userProfileId
            );

            return (
              <ChallengeTemplateRankingContender key={contenderIndex}>
                <ChallengeTemplateRankingName>
                  <span
                    onClick={() => push(`/profile/${contender.id}`)}
                  >{`${contenderIndex + 1} - ${contender.name}`}</span>{" "}
                  <span
                    onClick={() => handleShowContenderProof(contender.proofUrl)}
                  >
                    - View proof
                  </span>
                </ChallengeTemplateRankingName>
                <ChallengeTemplateRankingLikeDislikeContainer>
                  <ChallengeTemplateRankingLikeDislike>
                    {`Likes: ${contender.likes}`}
                  </ChallengeTemplateRankingLikeDislike>
                  {userProfileId &&
                    !hasUserLiked &&
                    contender.id !== userProfileId && (
                      <span
                        role="img"
                        aria-label="like"
                        aria-labelledby="like"
                        onClick={() =>
                          handleAddLikeToProof(
                            contender.id,
                            hasUserDisliked,
                            contender.challengeInstanceId
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        &#128077;
                      </span>
                    )}
                </ChallengeTemplateRankingLikeDislikeContainer>
                <ChallengeTemplateRankingLikeDislikeContainer>
                  <ChallengeTemplateRankingLikeDislike>
                    {`Dislikes: ${contender.dislikes}`}
                  </ChallengeTemplateRankingLikeDislike>
                  {userProfileId &&
                    !hasUserDisliked &&
                    contender.id !== userProfileId && (
                      <span
                        role="img"
                        aria-label="dislike"
                        aria-labelledby="dislike"
                        onClick={() =>
                          handleAddDisLikeToProof(
                            contender.id,
                            hasUserLiked,
                            contender.challengeInstanceId
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        &#128078;
                      </span>
                    )}
                </ChallengeTemplateRankingLikeDislikeContainer>
              </ChallengeTemplateRankingContender>
            );
          })}
        <ShowAllProofsContainer onClick={handleOpenTemplateProofsRanking}>
          Show all ranking proofs
        </ShowAllProofsContainer>
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
