import React from "react";
import PropTypes from "prop-types";
import { useRouteMatch, useHistory } from "react-router-dom";

import CustomButton from "../custom-button/custom-button";

import {
  CategoryItemContainer,
  CategoryItemVideoPlayer
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
    videoUrl
  } = challengeTemplateData;
  const history = useHistory();
  const { url } = useRouteMatch();

  return (
    <CategoryItemContainer>
      <CategoryItemVideoPlayer
        src={videoUrl}
        controls
        controlsList="nodownload"
      />
      <strong>Name:</strong>
      <span>{name}</span>
      <strong>Author:</strong>
      <span>{author}</span>
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
        onClick={() => history.push(`${url}/${challengeTemplateId}`)}
      />
    </CategoryItemContainer>
  );
};

CategoryItem.propTypes = {
  challengeTemplateId: PropTypes.string.isRequired,
  challengeTemplateData: PropTypes.object.isRequired
};

export default CategoryItem;