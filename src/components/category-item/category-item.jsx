import React from "react";

import {
  CategoryItemContainer,
  CategoryItemVideoPlayer
} from "./category-item.styles";

const CategoryItem = ({ challengeTemplate }) => {
  const {
    name,
    author,
    difficulty,
    daysToComplete,
    minimunParticipants,
    timesCompleted,
    rating,
    videoUrl
  } = challengeTemplate;
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
      <span>{minimunParticipants}</span>
      <strong>Times completed</strong>
      <span>{timesCompleted}</span>
      <strong>Rating</strong>
      <span>{rating}</span>
    </CategoryItemContainer>
  );
};

export default CategoryItem;
