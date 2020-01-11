import React, { useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory } from "react-router-dom";

import {
  selectUserProfilePhotoUrlById,
  selectUserProfileDisplayNameById,
  selectUserProfileIdById,
  selectUserProfileId,
  selectAllUserAcceptedInstancesById,
  selectUserAcceptedFriends,
  selectUserPendingFriends,
  selectUserPendingFriendsById,
  selectUsersAreLoading
} from "../../redux/user/selectors";
import { selectCompletedTemplatesFromUserInstancesObject } from "../../redux/firestore/challenges-instances/selectors";
import { selectChallengesTemplates } from "../../redux/firestore/challenges-templates/selectors";

import { openModal } from "../../redux/modal/actions";

import { sendFriendRequestStarts } from "../../redux/user/actions";

import ClippedImage from "../../components/clipped-image/clipped-image";
import CustomButton from "../../components/custom-button/custom-button";
import Spinner from "../../components/spinner/spinner";
import { ReactComponent as UserIcon } from "../../assets/user.svg";

import {
  ProfileContainer,
  DisplayNameContainer,
  UserAvatarContainer,
  ButtonsContainer,
  UserIdContainer,
  UserDataTextTitle,
  UserDataText,
  UserStatisticsContainer,
  StatisticsContainer,
  StatisticCategoryContainer,
  StatisticsTitle,
  StatisticsCategoryTitle,
  StatisticsCategoryTitlePointer,
  StatisticsText,
  StatisticsTextPointer,
  StatisticsInstanceContainer,
  AvatarContainer
} from "./profile.styles";

const profilePageData = createStructuredSelector({
  userProfileId: selectUserProfileId,
  challengesTemplates: selectChallengesTemplates,
  userAcceptedFriends: selectUserAcceptedFriends,
  userPendingFriends: selectUserPendingFriends,
  usersAreLoading: selectUsersAreLoading
});

const ProfilePage = () => {
  const { userId } = useParams();

  const { push } = useHistory();

  const dispatch = useDispatch();

  const {
    userProfileId,
    challengesTemplates,
    userAcceptedFriends,
    userPendingFriends,
    usersAreLoading
  } = useSelector(profilePageData, shallowEqual);

  const memoizedSelectAllUserAcceptedInstancesById = useMemo(
    () => selectAllUserAcceptedInstancesById,
    []
  );

  const memoizedSelectUserProfilePhotoUrlById = useMemo(
    () => selectUserProfilePhotoUrlById,
    []
  );

  const memoizedSelectUserProfileDisplayNameById = useMemo(
    () => selectUserProfileDisplayNameById,
    []
  );

  const memoizedSelectUserProfileIdById = useMemo(
    () => selectUserProfileIdById,
    []
  );

  const memoizedSelectCompletedTemplatesFromUserInstancesObject = useMemo(
    () => selectCompletedTemplatesFromUserInstancesObject,
    []
  );

  const memoizedSelectUserPendingFriendsById = useMemo(
    () => selectUserPendingFriendsById,
    []
  );

  const allUserAcceptedInstancesByCategory = useSelector(
    state => memoizedSelectAllUserAcceptedInstancesById(state, userId),
    shallowEqual
  );

  const userProfilePhotoUrl = useSelector(
    state => memoizedSelectUserProfilePhotoUrlById(state, userId),
    shallowEqual
  );

  const userProfileDisplayName = useSelector(
    state => memoizedSelectUserProfileDisplayNameById(state, userId),
    shallowEqual
  );

  const userProfileUid = useSelector(
    state => memoizedSelectUserProfileIdById(state, userId),
    shallowEqual
  );

  const userCompletedTemplates = useSelector(
    state =>
      memoizedSelectCompletedTemplatesFromUserInstancesObject(
        state,
        allUserAcceptedInstancesByCategory,
        userId
      ),
    shallowEqual
  );

  const userToAddPendingFriends = useSelector(
    state => memoizedSelectUserPendingFriendsById(state, userId),
    shallowEqual
  );

  const handleOnClickInstance = useCallback(
    instanceId => push(`/instance/${instanceId}`),
    [push]
  );

  const handleOnClickTemplate = useCallback(
    (templateId, category) => push(`/main/${category}/${templateId}`),
    [push]
  );

  const handleOnClickCategory = useCallback(
    category => {
      push(`/main/${category}/`);
    },
    [push]
  );

  const handleSendFriendRequest = useCallback(() => {
    if (userId === userProfileId) {
      const userIsYourselfModalData = {
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text: "You cannot add yourself as friend"
        }
      };
      dispatch(openModal(userIsYourselfModalData));
    } else if (userAcceptedFriends.some(friend => friend === userId)) {
      const userIsAlreadyYourFriendModalData = {
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text: "User is already your friend"
        }
      };
      dispatch(openModal(userIsAlreadyYourFriendModalData));
    } else if (
      userPendingFriends.some(friend => friend === userId) ||
      userToAddPendingFriends.some(friend => friend === userProfileId)
    ) {
      const userIsAlreadyPendingToAcceptModalData = {
        modalType: "SYSTEM_MESSAGE",
        modalProps: {
          text: "User is already pending to be accepted as your friend"
        }
      };
      dispatch(openModal(userIsAlreadyPendingToAcceptModalData));
    } else {
      dispatch(sendFriendRequestStarts(userId));
    }
  }, [
    dispatch,
    userId,
    userAcceptedFriends,
    userPendingFriends,
    userProfileId,
    userToAddPendingFriends
  ]);

  return !usersAreLoading ? (
    <ProfileContainer>
      <UserAvatarContainer>
        {userProfilePhotoUrl !== "" && userProfilePhotoUrl !== undefined ? (
          <ClippedImage url={userProfilePhotoUrl} alt={"User Avatar"} />
        ) : (
          <AvatarContainer>
            <UserIcon />
          </AvatarContainer>
        )}
      </UserAvatarContainer>
      <DisplayNameContainer>
        <UserDataTextTitle>Name:</UserDataTextTitle>
        <UserDataText>{userProfileDisplayName}</UserDataText>
      </DisplayNameContainer>
      <UserIdContainer>
        <UserDataTextTitle>Id:</UserDataTextTitle>
        <UserDataText>{userProfileUid}</UserDataText>
      </UserIdContainer>
      <UserStatisticsContainer>
        <StatisticsTitle>Completed challenges templates</StatisticsTitle>
        <StatisticsContainer>
          {Object.entries(userCompletedTemplates).map(
            (category, categoryIndex) => {
              const [key, value] = category;
              return (
                <StatisticCategoryContainer key={categoryIndex}>
                  <StatisticsCategoryTitlePointer
                    onClick={() => handleOnClickCategory(key)}
                  >
                    {key} - {value.length}/
                    {Object.values(challengesTemplates[key]).length}
                  </StatisticsCategoryTitlePointer>
                  <ul>
                    {value.map((completedTemplate, completedTemplateIndex) => (
                      <li key={completedTemplateIndex}>
                        <StatisticsText>
                          {
                            challengesTemplates[key][
                              completedTemplate.templateId
                            ].name
                          }
                        </StatisticsText>
                      </li>
                    ))}
                  </ul>
                </StatisticCategoryContainer>
              );
            }
          )}
        </StatisticsContainer>
        <StatisticsTitle>
          Best rated public challenges instances
        </StatisticsTitle>
        <StatisticsContainer>
          {Object.entries(userCompletedTemplates).reduce(
            (accumulator, category, categoryIndex) => {
              const [key, value] = category;
              value.length > 0 &&
                value.some(completedTemplate => completedTemplate.public) &&
                accumulator.push(
                  <StatisticCategoryContainer key={categoryIndex}>
                    <StatisticsCategoryTitle>{key}</StatisticsCategoryTitle>
                    <ul>
                      {value.reduce(
                        (
                          accumulator,
                          completedTemplate,
                          completedTemplateIndex
                        ) => {
                          completedTemplate.public &&
                            accumulator.push(
                              <li key={completedTemplateIndex}>
                                <StatisticsInstanceContainer>
                                  <StatisticsTextPointer
                                    onClick={() =>
                                      handleOnClickInstance(
                                        completedTemplate.instanceId
                                      )
                                    }
                                  >
                                    {
                                      challengesTemplates[key][
                                        completedTemplate.templateId
                                      ].name
                                    }
                                  </StatisticsTextPointer>
                                  <span
                                    role="img"
                                    aria-label="rating"
                                    aria-labelledby="rating"
                                  >
                                    {completedTemplate.rating.likes} &#128077; -{" "}
                                    {completedTemplate.rating.dislikes}{" "}
                                    &#128078;
                                  </span>
                                  <StatisticsTextPointer
                                    onClick={() =>
                                      handleOnClickTemplate(
                                        completedTemplate.templateId,
                                        key
                                      )
                                    }
                                  >
                                    Ranking position:{" "}
                                    {completedTemplate.rankingPosition}
                                  </StatisticsTextPointer>
                                </StatisticsInstanceContainer>
                              </li>
                            );
                          return accumulator;
                        },
                        []
                      )}
                    </ul>
                  </StatisticCategoryContainer>
                );
              return accumulator;
            },
            []
          )}
        </StatisticsContainer>
      </UserStatisticsContainer>
      <ButtonsContainer>
        {userProfileId && (
          <CustomButton
            type="button"
            text="Send friend request"
            large
            onClick={handleSendFriendRequest}
          />
        )}
      </ButtonsContainer>
    </ProfileContainer>
  ) : (
    <ProfileContainer>
      <Spinner />
    </ProfileContainer>
  );
};

export default ProfilePage;
