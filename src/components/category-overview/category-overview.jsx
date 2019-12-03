import React, { useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import { openModal } from "../../redux/modal/actions";
import {
  selectChallengesTemplatesCategory,
  selectChallengesTemplatesAreLoading
} from "../../redux/firestore/challenges-templates/selectors";

import Spinner from "../spinner/spinner";
import CategoryItem from "../category-item/category-item";
import CustomButton from "../custom-button/custom-button";

import {
  CategoryOverviewContainer,
  CategoryOverviewScrollContainer
} from "./category-overview.styles";

const selectCategoryOverviewData = createStructuredSelector({
  challengesTemplatesAreLoading: selectChallengesTemplatesAreLoading
});

const CategoryOverview = () => {
  const { category } = useParams();
  const dispatch = useDispatch();
  const addNewChallengeModalData = {
    modalType: "ADD_CHALLENGE",
    modalProps: {
      urlCategory: category
    }
  };

  // since the selector is usign a prop of the component and it can be used in different components we create a memoized instance for this particular case before using it
  const selectChallengesTemplatesCategoryInstance = useMemo(
    () => selectChallengesTemplatesCategory,
    []
  );
  const { challengesTemplatesAreLoading } = useSelector(
    selectCategoryOverviewData,
    shallowEqual
  );
  const challengesTemplateCategory = useSelector(
    state => selectChallengesTemplatesCategoryInstance(category)(state),
    shallowEqual
  );

  const handleProposeNewChallenge = useCallback(
    () => dispatch(openModal(addNewChallengeModalData)),
    [dispatch, addNewChallengeModalData]
  );

  return (
    <CategoryOverviewContainer>
      {!challengesTemplatesAreLoading ? (
        <CategoryOverviewScrollContainer>
          {Object.entries(challengesTemplateCategory).reduce(
            (accumulator, challengeTemplate, challengeTemplateIndex) => {
              // this is destructuring from an array instead of an object as we are more used to see
              const [
                challengeTemplateId,
                challengeTemplateData
              ] = challengeTemplate;
              if (challengeTemplateData.approved === false) {
                accumulator.push(
                  <CategoryItem
                    key={challengeTemplateIndex}
                    challengeTemplateId={challengeTemplateId}
                    challengeTemplateData={challengeTemplateData}
                  />
                );
              }
              return accumulator;
            },
            []
          )}
        </CategoryOverviewScrollContainer>
      ) : (
        <Spinner />
      )}
      <CustomButton
        type="button"
        text="Propose new challenge"
        large
        onClick={handleProposeNewChallenge}
      />
    </CategoryOverviewContainer>
  );
};

export default CategoryOverview;
