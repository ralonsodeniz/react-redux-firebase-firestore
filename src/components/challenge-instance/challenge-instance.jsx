import React, { useMemo, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory } from "react-router-dom";

import {
  selectInstanceContenders,
  selectInstanceTemplateId,
  selectInstanceValidators,
  selectInstanceSelfValidation
} from "../../redux/firestore/challenges-instances/selectors";
import {
  selectChallengeTemplateFromId,
  selectChallengesTemplatesAreLoading
} from "../../redux/firestore/challenges-templates/selectors";
import {
  selectUserProfileId,
  selectUserProfileIsLoaded,
  selectUsersDisplayNamesById,
  selectUserGlobalValidator
} from "../../redux/user/selectors";
import { selectChallengesInstancesAreLoading } from "../../redux/firestore/challenges-instances/selectors";
import {
  acceptInstanceStarts,
  cancelInstanceStarts,
  uploadProofStarts,
  toggleProofPublicPrivateStarts
} from "../../redux/firestore/challenges-instances/actions";
import { submitChallengeRatingStarts } from "../../redux/firestore/challenges-templates/actions";

import Spinner from "../spinner/spinner";
import CustomButton from "../custom-button/custom-button";
import FileUploader from "../file-uplader/file-uploader";
import InstanceContenderInfo from "../instance-contender-info/instance-contender-info";
import FormDropdown from "../form-dropdown/form-dropdown";
import InstanceContenderComments from "../instance-contender-comments/instance-contender-comments";
import StarRating from "../star-rating/star-rating";

import {
  ChallengeInstanceContainer,
  ChallengeInstanceVideoPlayer,
  ChallengeInstanceTemplateDataContainer,
  ChallengeInstanceTemplateData,
  ChallengeInstanceButtonsContainer,
  ChallengeInstanceData,
  ChallengeInstanceButtonsGroup,
  ChallengeInstanceImageContainer,
  ChallengeInstanceImageFrame,
  ChallengeInstanceContenderDropdownContainer,
  ChallengeInstanceComments
} from "./challenge-instance.styles";

const selectChallengeInstanceData = createStructuredSelector({
  userProfileId: selectUserProfileId,
  userProfileIsLoaded: selectUserProfileIsLoaded,
  challengesTemplatesAreLoading: selectChallengesTemplatesAreLoading,
  challengesInstancesAreLoading: selectChallengesInstancesAreLoading,
  userGlobalValidator: selectUserGlobalValidator
});

const ChallengeInstance = () => {
  const dispatch = useDispatch();

  const history = useHistory();

  const { instanceId } = useParams();

  const [selectedContender, setSelectedContender] = useState("default");

  const {
    userProfileId,
    userProfileIsLoaded,
    challengesTemplatesAreLoading,
    challengesInstancesAreLoading,
    userGlobalValidator
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

  const memoizedSelectInstanceSelfValidation = useMemo(
    () => selectInstanceSelfValidation,
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
    posterUrl,
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

  const authorDisplayName = useSelector(
    state => memoizedSelectUsersDisplayNameById(state, author),
    shallowEqual
  );

  const challengeInstanceValidatorsId = challengeInstanceContenders.map(
    contender => contender.proof.validatedBy.id
  );

  const challengeInstanceValidatorsDisplayNames = useSelector(
    state =>
      memoizedSelectUsersDisplayNameById(state, challengeInstanceValidatorsId),
    shallowEqual
  );

  const selfValidation = useSelector(
    state => memoizedSelectInstanceSelfValidation(state, instanceId),
    shallowEqual
  );

  const enhancedChallengeInstanceContenders = challengeInstanceContenders.map(
    (contender, contenderIndex) => {
      return {
        ...contender,
        name: challengeInstanceContendersDisplayNames[contenderIndex],
        proof: {
          ...contender.proof,
          validatedBy: {
            ...contender.proof.validatedBy,
            name: challengeInstanceValidatorsDisplayNames[contenderIndex]
          }
        }
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

  const userInstanceProofUrl = userContenderObject
    ? userContenderObject.proof.url !== ""
      ? userContenderObject.proof.url
      : ""
    : "";

  const userChallengeRating = rating
    ? rating.usersThatRated.find(user => user.userId === userProfileId)
    : {};

  const userChallengeRatingNumber = userChallengeRating
    ? userChallengeRating.userRating
    : 0;

  const isUserValidator = challengeInstanceValidators.some(
    validator => validator === userProfileId
  );

  const dropdownOptions = enhancedChallengeInstanceContenders.map(
    contender => ({
      value: contender.id,
      text: contender.name
    })
  );

  const isUserGlobalValidator =
    userGlobalValidator.status !== "no validator" ||
    userGlobalValidator.status !== "banned validator"
      ? true
      : false;

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
    (dispatch, instanceId, userProfileId) => proofFileType => (
      url,
      posterUrl
    ) => {
      const proofData = {
        instanceId,
        userProfileId,
        url,
        posterUrl
      };
      dispatch(uploadProofStarts(proofData));
    },
    []
  );

  const handleUpdateProofPublicOrPrivate = useCallback(
    () => dispatch(toggleProofPublicPrivateStarts(userProfileId, instanceId)),
    [userProfileId, instanceId, dispatch]
  );

  const handleChange = useCallback(event => {
    const { value } = event.target;
    setSelectedContender(value);
  }, []);

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

  const handleSubmitChallengeRating = useCallback(
    starsSelected => {
      dispatch(
        submitChallengeRatingStarts(
          starsSelected,
          templateId,
          category,
          userProfileId
        )
      );
    },
    [dispatch, templateId, category, userProfileId]
  );

  const fullScreenEmojisStyles = {
    position: "absolute",
    top: "10vh",
    left: "20vw",
    cursor: "pointer"
  };

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
          preload="none"
          poster={posterUrl}
        />
      ) : (
        <ChallengeInstanceImageContainer>
          <ChallengeInstanceImageFrame
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
        </ChallengeInstanceImageContainer>
      )}
      <ChallengeInstanceTemplateDataContainer>
        <ChallengeInstanceTemplateData>
          <h4>Name:</h4>
          <span
            onClick={() => history.push(`/main/${category}/${templateId}`)}
            style={{ cursor: "pointer" }}
          >
            {name}
          </span>
          <h4>Description:</h4>
          <span>{description}</span>
          <h4>Minimum participants:</h4>
          <span>{minimumParticipants}</span>
          <h4>Days to Complete:</h4>
          <span>{daysToComplete}</span>
        </ChallengeInstanceTemplateData>
        <ChallengeInstanceTemplateData>
          <h4>Author:</h4>
          <span
            onClick={() => history.push(`/profile/${author}`)}
            style={{ cursor: "pointer" }}
          >
            {authorDisplayName}
          </span>
          <h4>Category:</h4>
          <span>{category}</span>
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
              fileType={proofFileType}
              directory={`challengesInstances/${instanceId}/${userProfileId}`}
              fileName={userDisplayNameForFileName}
              oldFileName={userInstanceProofUrl}
              urlAction={handleUploadProof(dispatch, instanceId, userProfileId)}
              labelText="Choose challenge proof"
              submitText={"Upload"}
              disabled={false}
              maxFileSizeInMB={50}
            />
          </ChallengeInstanceButtonsContainer>
        ) : userStatus === "Completed" ? (
          <ChallengeInstanceButtonsContainer>
            <span>Rate the challenge</span>
            <StarRating
              totalStars={5}
              interactive={true}
              initialStars={userChallengeRatingNumber}
              color="orange"
              action={handleSubmitChallengeRating}
              reset={false}
            />
          </ChallengeInstanceButtonsContainer>
        ) : null)}
      <ChallengeInstanceData>
        <ChallengeInstanceContenderDropdownContainer>
          <FormDropdown
            handleChange={handleChange}
            label="Select contender"
            options={dropdownOptions}
            multiple={false}
            size={0}
            defaultValue={"default"}
          />
        </ChallengeInstanceContenderDropdownContainer>
        <InstanceContenderInfo
          challengeInstanceContenders={enhancedChallengeInstanceContenders}
          userProfileId={userProfileId}
          isUserValidator={isUserValidator}
          instanceId={instanceId}
          proofFileType={proofFileType}
          selectedContender={selectedContender}
          selfValidation={selfValidation}
          isUserGlobalValidator={isUserGlobalValidator}
        />
      </ChallengeInstanceData>
      <ChallengeInstanceComments>
        <InstanceContenderComments
          challengeInstanceContenders={enhancedChallengeInstanceContenders}
          userProfileId={userProfileId}
          isUserValidator={isUserValidator}
          instanceId={instanceId}
          selectedContender={selectedContender}
        />
      </ChallengeInstanceComments>
    </ChallengeInstanceContainer>
  );
};

export default ChallengeInstance;
