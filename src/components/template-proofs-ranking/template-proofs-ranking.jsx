import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";

import {
  addLikeToProofStarts,
  addDislikeToProofStarts
} from "../../redux/firestore/challenges-instances/actions";

import {
  TemplateProofsRankingContainer,
  TemplateProofsRankingContender,
  TemplateProofsRankingImageFrame,
  TemplateProofsRankingLikeDislike,
  TemplateProofsRankingLikeDislikeContainer,
  TemplateProofsRankingName,
  TemplateProofsRankingVideoFrame
} from "./template-proofs-rankig.styles";

const TemplateProofsRanking = ({
  sortedRankingInfo,
  userProfileId,
  proofFileType
}) => {
  const dispatch = useDispatch();

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
            <TemplateProofsRankingName>
              {`${contenderIndex + 1} - ${contender.name}`}
            </TemplateProofsRankingName>
            {proofFileType === "video" ? (
              <TemplateProofsRankingVideoFrame
                src={contender.proofUrl}
                controls
                controlsList="nodownload"
              />
            ) : (
              <TemplateProofsRankingImageFrame
                src={contender.proofUrl}
                alt="contender image proof"
              />
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
