import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";

import { selectUsersDisplayNamesById } from "../../redux/user/selectors";

import CustomButton from "../custom-button/custom-button";

import {
  CategoryItemContainer,
  CategoryItemVideoPlayer,
  CategoryItemImageContainer
} from "./category-item.styles";

const CategoryItem = ({ challengeTemplateId, challengeTemplateData }) => {
  const {
    name,
    author,
    difficulty,
    daysToComplete,
    minimumParticipants,
    timesCompleted,
    rating,
    proofUrl,
    category,
    proofFileType
  } = challengeTemplateData;

  const history = useHistory();

  const memoizedSelectUsersDisplayNamesById = useMemo(
    () => selectUsersDisplayNamesById,
    []
  );

  const authorDisplayName = useSelector(
    state => memoizedSelectUsersDisplayNamesById(state, author),
    shallowEqual
  );

  return (
    <CategoryItemContainer>
      {console.log(proofFileType)}
      {proofFileType === "video" ? (
        <CategoryItemVideoPlayer
          src={proofUrl}
          controls
          controlsList="nodownload"
        />
      ) : (
        <CategoryItemImageContainer src={proofUrl} alt="proof image" />
      )}
      <strong>Name:</strong>
      <span>{name}</span>
      <strong>Category:</strong>
      <span>{category}</span>
      <strong>Author:</strong>
      <span>{authorDisplayName}</span>
      <strong>Difficulty</strong>
      <span>{difficulty}</span>
      <strong>Days to complete challenge</strong>
      <span>{daysToComplete}</span>
      <strong>Minmum participants</strong>
      <span>{minimumParticipants}</span>
      <strong>Times completed</strong>
      <span>{timesCompleted}</span>
      <strong>Rating</strong>
      <span>{rating}</span>
      <CustomButton
        text="Go to challenge"
        type="button"
        onClick={() => history.push(`${category}/${challengeTemplateId}`)}
      />
    </CategoryItemContainer>
  );
};

CategoryItem.propTypes = {
  challengeTemplateId: PropTypes.string.isRequired,
  challengeTemplateData: PropTypes.object.isRequired
};

export default CategoryItem;
