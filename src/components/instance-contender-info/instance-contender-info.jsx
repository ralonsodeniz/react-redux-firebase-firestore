import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import CustomButton from "../custom-button/custom-button";

import {
  validateProofStarts,
  invalidateProofStarts
} from "../../redux/firestore/challenges-instances/actions";
import {
  addLikeToProofStarts,
  addDislikeToProofStarts,
  reportGlobalValidatorStarts
} from "../../redux/firestore/challenges-instances/actions";

import {
  InstanceContenderInfoContainer,
  InstanceContenderInfoTitle,
  InstanceContenderInfoText,
  InstanceContenderInfoStatusText,
  InstanceContenderInfoStateText,
  InstanceContenderInfoVideoPlayer,
  InstanceContenderInfoButtonsContainer,
  InstanceContenderInfoImageContainer,
  InstanceContenderInfoRankingContainer,
  InstanceContenderInfoImageFrame,
  InstanceContenderValidatorContainer,
  InstanceContenderInfoTextPointer
} from "./instance-contender-info.styles";

const InstanceContenderInfo = ({
  challengeInstanceContenders,
  userProfileId,
  isUserValidator,
  instanceId,
  proofFileType,
  selectedContender,
  selfValidation,
  isUserGlobalValidator
}) => {
  const dispatch = useDispatch();

  const { push } = useHistory();

  const isUserContender = challengeInstanceContenders.some(
    contender => contender.id === userProfileId
  );

  const globalValidation =
    !selfValidation && isUserGlobalValidator ? true : false;

  const handleValidateProof = useCallback(
    () =>
      dispatch(
        validateProofStarts(selectedContender, instanceId, globalValidation)
      ),
    [dispatch, selectedContender, instanceId, globalValidation]
  );

  const handleInvalidateProof = useCallback(
    () =>
      dispatch(
        invalidateProofStarts(selectedContender, instanceId, globalValidation)
      ),
    [dispatch, selectedContender, instanceId, globalValidation]
  );

  const handleAddLikeToProof = useCallback(
    (contenderId, hasUserDisliked) =>
      dispatch(addLikeToProofStarts(contenderId, instanceId, hasUserDisliked)),
    [dispatch, instanceId]
  );

  const handleAddDisLikeToProof = useCallback(
    (contenderId, hasUserLiked) =>
      dispatch(addDislikeToProofStarts(contenderId, instanceId, hasUserLiked)),
    [dispatch, instanceId]
  );

  const handleReportGlobalValidator = useCallback(
    contenderId => {
      dispatch(reportGlobalValidatorStarts(instanceId, contenderId));
    },
    [dispatch, instanceId]
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

  const fullScreenEmojisStyles = {
    position: "absolute",
    top: "6.1vh",
    left: "13vw",
    cursor: "pointer"
  };

  return (
    <InstanceContenderInfoContainer>
      {challengeInstanceContenders.reduce(
        (accumulator, contender, contenderIndex) => {
          const isVisible =
            isUserValidator || isUserContender || contender.public
              ? true
              : false;
          const isVisibleAndAuthed =
            isUserValidator ||
            isUserContender ||
            (contender.public && userProfileId)
              ? true
              : false;
          if (contender.id === selectedContender) {
            const hasUserLiked = contender.rating.usersThatLiked.some(
              user => user === userProfileId
            );
            const hasUserDisliked = contender.rating.usersThatDisliked.some(
              user => user === userProfileId
            );
            const contenderId = contender.id;

            accumulator.push(
              <InstanceContenderInfoContainer key={contenderIndex}>
                <InstanceContenderInfoTitle>Name</InstanceContenderInfoTitle>
                <InstanceContenderInfoTextPointer
                  onClick={() => push(`/profile/${contender.id}`)}
                >
                  {contender.name}
                </InstanceContenderInfoTextPointer>
                <InstanceContenderInfoTitle>Proof</InstanceContenderInfoTitle>
                {contender.proof.url ? (
                  isVisible || (!selfValidation && isUserGlobalValidator) ? (
                    proofFileType === "video" ? (
                      <InstanceContenderInfoVideoPlayer
                        src={contender.proof.url}
                        controls
                        controlsList="nodownload"
                        preload="none"
                      />
                    ) : (
                      <InstanceContenderInfoImageContainer>
                        <InstanceContenderInfoImageFrame
                          src={contender.proof.url}
                          alt="contender proof image"
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
                      </InstanceContenderInfoImageContainer>
                    )
                  ) : (
                    <InstanceContenderInfoText>
                      Proof is private
                    </InstanceContenderInfoText>
                  )
                ) : (
                  <InstanceContenderInfoText>
                    No proof provided
                  </InstanceContenderInfoText>
                )}
                <InstanceContenderInfoTitle>
                  Instance status
                </InstanceContenderInfoTitle>
                <InstanceContenderInfoStatusText status={contender.status}>
                  {contender.status}
                </InstanceContenderInfoStatusText>
                <InstanceContenderInfoTitle>
                  Proof state
                </InstanceContenderInfoTitle>
                <InstanceContenderInfoStateText state={contender.proof.state}>
                  {contender.proof.state}
                </InstanceContenderInfoStateText>
                {(contender.proof.state === "Accepted" ||
                  contender.proof.state === "Cancelled") && (
                  <div>
                    <InstanceContenderInfoTitle>
                      Proof state
                    </InstanceContenderInfoTitle>
                    <InstanceContenderInfoTitle>
                      Validated by
                    </InstanceContenderInfoTitle>
                    <InstanceContenderInfoText>
                      <InstanceContenderValidatorContainer>
                        {contender.proof.validatedBy.name}
                        {contender.id === userProfileId &&
                          !selfValidation &&
                          !contender.proof.validatedBy.reported && (
                            <CustomButton
                              type="button"
                              text="Report validator"
                              onClick={() =>
                                handleReportGlobalValidator(contenderId)
                              }
                            />
                          )}
                        {contender.proof.validatedBy.reported && (
                          <span
                            role="img"
                            aria-label="reported"
                            aria-labelledby="reported"
                          >
                            &#10071;
                          </span>
                        )}
                      </InstanceContenderValidatorContainer>
                    </InstanceContenderInfoText>
                  </div>
                )}
                {contender.status === "Accepted" && (
                  <div>
                    <InstanceContenderInfoTitle>
                      Expires at
                    </InstanceContenderInfoTitle>
                    <InstanceContenderInfoText>
                      {contender.expiresAt.toDate().toString()}
                    </InstanceContenderInfoText>
                  </div>
                )}
                <InstanceContenderInfoTitle>Rating</InstanceContenderInfoTitle>
                <InstanceContenderInfoRankingContainer>
                  <InstanceContenderInfoText>
                    Likes: {contender.rating.likes}
                  </InstanceContenderInfoText>
                  {isVisibleAndAuthed &&
                    !hasUserLiked &&
                    contender.id !== userProfileId &&
                    contender.proof.url && (
                      <span
                        role="img"
                        aria-label="like"
                        aria-labelledby="like"
                        onClick={() =>
                          handleAddLikeToProof(contenderId, hasUserDisliked)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        &#128077;
                      </span>
                    )}
                </InstanceContenderInfoRankingContainer>
                <InstanceContenderInfoRankingContainer>
                  <InstanceContenderInfoText>
                    Dislikes: {contender.rating.dislikes}
                  </InstanceContenderInfoText>
                  {isVisibleAndAuthed &&
                    !hasUserDisliked &&
                    contender.id !== userProfileId &&
                    contender.proof.url && (
                      <span
                        role="img"
                        aria-label="dislike"
                        aria-labelledby="dislike"
                        onClick={() =>
                          handleAddDisLikeToProof(contenderId, hasUserLiked)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        &#128078;
                      </span>
                    )}
                </InstanceContenderInfoRankingContainer>
                {contender.id !== userProfileId &&
                  contender.proof.state === "Pending" &&
                  (isUserValidator || globalValidation) && (
                    <InstanceContenderInfoButtonsContainer>
                      <CustomButton
                        text="Validate proof"
                        type="button"
                        onClick={handleValidateProof}
                      />
                      <CustomButton
                        text="Invalidate proof"
                        type="button"
                        onClick={handleInvalidateProof}
                      />
                    </InstanceContenderInfoButtonsContainer>
                  )}
              </InstanceContenderInfoContainer>
            );
          }
          return accumulator;
        },
        []
      )}
    </InstanceContenderInfoContainer>
  );
};

InstanceContenderInfo.propTypes = {
  challengeInstanceContenders: PropTypes.array.isRequired,
  userProfileId: PropTypes.string.isRequired,
  isUserValidator: PropTypes.bool.isRequired,
  instanceId: PropTypes.string.isRequired,
  proofFileType: PropTypes.string.isRequired,
  selectedContender: PropTypes.string.isRequired,
  selfValidation: PropTypes.bool.isRequired,
  isUserGlobalValidator: PropTypes.bool.isRequired
};

export default InstanceContenderInfo;
