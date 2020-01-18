import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import {
  addLikeToProofStarts,
  addDislikeToProofStarts
} from "../../redux/firestore/challenges-instances/actions";

import { closeModal } from "../../redux/modal/actions";

import {
  TemplateProofsRankingContainer,
  TemplateProofsRankingContender,
  TemplateProofsRankingImageFrame,
  TemplateProofsRankingLikeDislike,
  TemplateProofsRankingLikeDislikeContainer,
  TemplateProofsRankingName,
  TemplateProofsRankingVideoFrame,
  TemplateProofsRankingImageContainer
} from "./template-proofs-rankig.styles";

const TemplateProofsRanking = ({
  sortedRankingInfo,
  userProfileId,
  proofFileType
}) => {
  const dispatch = useDispatch();

  const { push } = useHistory();

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

  const handleImageFullScreen = useCallback(contenderIndex => {
    const image = document.getElementById(contenderIndex);
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

  const handleClickToProfile = useCallback(
    contenderId => {
      push(`/profile/${contenderId}`);
      dispatch(closeModal());
    },
    [dispatch, push]
  );

  const fullScreenEmojisStyles = {
    position: "absolute",
    top: "10vh",
    left: "10vw",
    cursor: "pointer"
  };

  return (
    <TemplateProofsRankingContainer>
      {sortedRankingInfo.map((contender, contenderIndex) => {
        const hasUserLiked = contender.usersThatLiked.some(
          user => user === userProfileId
        );
        const hasUserDisliked = contender.usersThatDisliked.some(
          user => user === userProfileId
        );

        return (
          <TemplateProofsRankingContender key={contenderIndex}>
            <TemplateProofsRankingName
              onClick={() => handleClickToProfile(contender.id)}
            >
              {`${contenderIndex + 1} - ${contender.name}`}
            </TemplateProofsRankingName>
            {proofFileType === "video" ? (
              <TemplateProofsRankingVideoFrame
                src={contender.proofUrl}
                controls
                controlsList="nodownload"
                preload="none"
                poster={contender.poster}
              />
            ) : (
              <TemplateProofsRankingImageContainer>
                <TemplateProofsRankingImageFrame
                  src={contender.proofUrl}
                  alt="contender image proof"
                  id={contenderIndex}
                />
                <span
                  role="img"
                  aria-label="like"
                  aria-labelledby="like"
                  onClick={() => handleImageFullScreen(contenderIndex)}
                  style={fullScreenEmojisStyles}
                >
                  &#128306;
                </span>
              </TemplateProofsRankingImageContainer>
            )}
            <TemplateProofsRankingLikeDislikeContainer>
              <TemplateProofsRankingLikeDislike>
                {`Likes: ${contender.likes}`}
              </TemplateProofsRankingLikeDislike>
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
            </TemplateProofsRankingLikeDislikeContainer>
            <TemplateProofsRankingLikeDislikeContainer>
              <TemplateProofsRankingLikeDislike>
                {`Dislikes: ${contender.dislikes}`}
              </TemplateProofsRankingLikeDislike>
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
            </TemplateProofsRankingLikeDislikeContainer>
          </TemplateProofsRankingContender>
        );
      })}
    </TemplateProofsRankingContainer>
  );
};

TemplateProofsRanking.propTypes = {
  sortedRankingInfo: PropTypes.array.isRequired,
  userProfileId: PropTypes.string.isRequired,
  proofFileType: PropTypes.string.isRequired
};

export default TemplateProofsRanking;
