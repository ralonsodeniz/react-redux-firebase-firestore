import React, { useState, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

import Star from "./star";
import CustomButton from "../custom-button/custom-button";

import { StarRatingContainer, StarsContainer } from "./star-rating.styles";

const StarRating = ({
  totalStars,
  interactive,
  initialStars,
  color,
  action,
  reset
}) => {
  const [starsSelected, setStarsSelected] = useState(Math.round(initialStars));

  // we use this useEffet to update the value of the non interactive star ratings when the input value that we use as initialStars changes
  useEffect(() => {
    setStarsSelected(initialStars);
  }, [initialStars]);

  const handleStarSelected = useCallback(
    starIndex => {
      interactive && setStarsSelected(starIndex + 1);
    },
    [interactive]
  );

  const handleSubmitRanking = useCallback(() => {
    action(starsSelected);
    reset && setStarsSelected(0);
  }, [action, starsSelected, reset]);

  return (
    <StarRatingContainer>
      <StarsContainer>
        {[...Array(totalStars)].map((star, starIndex) => (
          <Star
            key={starIndex}
            color={color}
            selected={starIndex < starsSelected}
            onClick={() => handleStarSelected(starIndex)}
            interactive={interactive}
          />
        ))}
      </StarsContainer>
      <span>
        {starsSelected} of {totalStars} stars
      </span>
      {interactive && (
        <CustomButton
          text="Submit rating"
          type="button"
          onClick={handleSubmitRanking}
        />
      )}
    </StarRatingContainer>
  );
};

StarRating.propTypes = {
  totalStars: PropTypes.number.isRequired,
  interactive: PropTypes.bool.isRequired,
  initialStars: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  action: PropTypes.func,
  reset: PropTypes.bool.isRequired
};

export default StarRating;
