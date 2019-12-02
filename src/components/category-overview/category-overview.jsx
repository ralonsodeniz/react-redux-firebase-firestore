import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectChallengesTemplatesCategory,
  selectChallengesTemplatesAreLoading
} from "../../redux/firestore/challenges-templates/selectors";

import Spinner from "../spinner/spinner";
import CategoryItem from "../category-item/category-item";

import {
  CategoryOverviewContainer,
  CategoryOverviewScrollContainer
} from "./category-overview.styles";

const selectCategoryOverviewData = createStructuredSelector({
  challengesTemplatesAreLoading: selectChallengesTemplatesAreLoading
});

const CategoryOverview = () => {
  const { category } = useParams();
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

  return (
    <CategoryOverviewContainer>
      {!challengesTemplatesAreLoading ? (
        <CategoryOverviewScrollContainer>
          {Object.values(challengesTemplateCategory).reduce(
            (accumulator, challengeTemplate, challengeTemplateIndex) => {
              if (challengeTemplate.approved === false) {
                accumulator.push(
                  <CategoryItem
                    key={challengeTemplateIndex}
                    challengeTemplate={challengeTemplate}
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
    </CategoryOverviewContainer>
  );
};

export default CategoryOverview;
