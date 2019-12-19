import React, { useMemo, useCallback, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectUserAcceptedFriends,
  selectUserPendingFriends,
  selectUsersDisplayNamesById,
  selectUserProfileIsLoaded,
  selectAllUsersId
} from "../../redux/user/selectors";
import {
  acceptFriendRequestStarts,
  declineFriendRequestStarts,
  deleteFriendStarts,
  sendFriendRequestStarts
} from "../../redux/user/actions";
import { openModal } from "../../redux/modal/actions";

import Spinner from "../spinner/spinner";
import FormInput from "../form-input/form-input";
import FormDropdown from "../form-dropdown/form-dropdown";
import CustomButton from "../custom-button/custom-button";

import {
  FriendListContainer,
  FriendsContainer,
  FriendListTitle,
  FriendListText,
  FriendContianer,
  FriendIcons,
  ListsContainers,
  SearchFriendContainer
} from "./friend-list.styles";

const selectFriendListData = createStructuredSelector({
  userAcceptedFriends: selectUserAcceptedFriends,
  userPendingFriends: selectUserPendingFriends,
  userProfileIsLoaded: selectUserProfileIsLoaded,
  allUsersId: selectAllUsersId
});

const FriendList = () => {
  const dispatch = useDispatch();

  const [friendSearch, setFriendSearch] = useState("");

  const [friendToAdd, setFriendToAdd] = useState("");

  const memoizedSelectUserDisplayNamesById = useMemo(
    () => selectUsersDisplayNamesById,
    []
  );

  const {
    userAcceptedFriends,
    userPendingFriends,
    userProfileIsLoaded,
    allUsersId
  } = useSelector(selectFriendListData, shallowEqual);

  const userAcceptedFriendsDisplayNames = useSelector(
    state => memoizedSelectUserDisplayNamesById(state, userAcceptedFriends),
    shallowEqual
  );

  const userPendingFriendsDisplayNames = useSelector(
    state => memoizedSelectUserDisplayNamesById(state, userPendingFriends),
    shallowEqual
  );

  const allUsersDisplayNames = useSelector(state =>
    memoizedSelectUserDisplayNamesById(state, allUsersId)
  );

  const userAcceptedFriendsArray = userAcceptedFriends.map(
    (friend, friendIndex) => ({
      id: friend,
      name: userAcceptedFriendsDisplayNames[friendIndex]
    })
  );

  const userPendingFriendsArray = userPendingFriends.map(
    (friend, friendIndex) => ({
      id: friend,
      name: userPendingFriendsDisplayNames[friendIndex]
    })
  );

  const allUsersArray = allUsersId.map((user, userIndex) => ({
    id: user,
    name: allUsersDisplayNames[userIndex]
  }));

  const handleAcceptFriendRequest = useCallback(
    id => dispatch(acceptFriendRequestStarts(id)),
    [dispatch]
  );

  const handleDeclineFriendRequest = useCallback(
    id => dispatch(declineFriendRequestStarts(id)),
    [dispatch]
  );

  const handleDeleteFriend = useCallback(
    id => dispatch(deleteFriendStarts(id)),
    [dispatch]
  );

  const hanldeFriendSearch = useCallback(event => {
    const { value } = event.target;
    setFriendSearch(value);
  }, []);

  const handleFriendToAdd = useCallback(event => {
    const { value } = event.target;
    setFriendToAdd(value);
  }, []);

  const userOptions = allUsersArray.reduce((accumulator, user) => {
    if (user.name.includes(friendSearch)) {
      accumulator.push({
        text: user.name,
        value: user.id
      });
    }
    return accumulator;
  }, []);

  const handleSendFriendRequest = useCallback(
    event => {
      event.preventDefault();

      if (friendToAdd !== "") {
        dispatch(sendFriendRequestStarts(friendToAdd));
        setFriendToAdd("");
        setFriendSearch("");
      } else {
        const friendToAddEmptyModalData = {
          modalType: "SYSTEM_MESSAGE",
          modalProps: {
            text: "Please select a user or inser an user ID"
          }
        };
        dispatch(openModal(friendToAddEmptyModalData));
      }
    },
    [dispatch, friendToAdd]
  );

  return userProfileIsLoaded ? (
    <FriendListContainer>
      <ListsContainers>
        <FriendsContainer>
          <FriendListTitle>Accepted friends</FriendListTitle>
          {userAcceptedFriendsArray.map(friend => (
            <FriendContianer key={friend.id}>
              <FriendListText onClick={() => console.log(friend)}>
                {friend.name}
              </FriendListText>
              <FriendIcons
                role="img"
                aria-label="remove"
                onClick={() => handleDeleteFriend(friend.id)}
              >
                &#10006;
              </FriendIcons>
            </FriendContianer>
          ))}
        </FriendsContainer>
        <FriendsContainer>
          <FriendListTitle>Friend requests</FriendListTitle>
          {userPendingFriendsArray.map(friend => (
            <FriendContianer key={friend.id}>
              <FriendListText onClick={() => console.log(friend)}>
                {friend.name}
              </FriendListText>
              <FriendIcons
                role="img"
                aria-label="accept"
                onClick={() => handleAcceptFriendRequest(friend.id)}
              >
                &#10004;
              </FriendIcons>
              <FriendIcons
                role="img"
                aria-label="decline"
                onClick={() => handleDeclineFriendRequest(friend.id)}
              >
                &#10006;
              </FriendIcons>
            </FriendContianer>
          ))}
        </FriendsContainer>
      </ListsContainers>
      <SearchFriendContainer>
        <form onSubmit={handleSendFriendRequest}>
          <FormInput
            type="text"
            id="friendSearch"
            name="friendSearch"
            value={friendSearch}
            handleChange={hanldeFriendSearch}
            label="Search for friends"
          />
          <FormDropdown
            type="text"
            id="users"
            name="users"
            handleChange={handleFriendToAdd}
            label="Select friend to add"
            options={userOptions}
            required
            multiple={false}
            size={3}
          />
          <FormInput
            type="text"
            id="friendId"
            name="friendId"
            value={friendToAdd}
            handleChange={handleFriendToAdd}
            label="Add friend by user ID"
          />
          <CustomButton type="submit" text="Send friend request" />
        </form>
      </SearchFriendContainer>
    </FriendListContainer>
  ) : (
    <FriendListContainer>
      <Spinner />
    </FriendListContainer>
  );
};

export default FriendList;
