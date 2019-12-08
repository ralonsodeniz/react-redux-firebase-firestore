import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useHistory, useRouteMatch } from "react-router-dom";

import {
  selectChallengesTemplatesCategories,
  selectChallengesTemplatesAreLoading
} from "../../redux/firestore/challenges-templates/selectors";

import Spinner from "../spinner/spinner";
import CustomButton from "../custom-button/custom-button";

import {
  CategoryListContainer,
  CategoryListScrollContainer,
  CategoryListTitle
} from "./category-list.styles";

const challengesTemplatesCategoriesSelector = createStructuredSelector({
  challengesTemplatesCategories: selectChallengesTemplatesCategories,
  challengesTemplatesAreLoading: selectChallengesTemplatesAreLoading
});

const CategoryList = () => {
  const history = useHistory();
  const match = useRouteMatch();

  const categoryListData = useSelector(
    challengesTemplatesCategoriesSelector,
    shallowEqual
  );
  const {
    challengesTemplatesCategories,
    challengesTemplatesAreLoading
  } = categoryListData;
  return (
    <CategoryListContainer>
      <CategoryListTitle>Choose a challenge category</CategoryListTitle>
      {challengesTemplatesAreLoading ? (
        <Spinner />
      ) : (
        <CategoryListScrollContainer>
          {challengesTemplatesCategories.map((category, categoryIndex) => (
            <CustomButton
              key={categoryIndex}
              text={category}
              onClick={() => history.push(`${match.path}/${category}`)}
              large
            />
          ))}
        </CategoryListScrollContainer>
      )}
    </CategoryListContainer>
  );
};

export default CategoryList;
