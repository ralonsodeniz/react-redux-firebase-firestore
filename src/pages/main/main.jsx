import React, { useCallback } from "react";
import { MainContainer } from "./main.styles";
import { Route, useRouteMatch } from "react-router-dom";
import { useDispatch } from "react-redux";

import { openModal } from "../../redux/modal/actions";

import CategoryList from "../../components/category-list/category-list";
import CategoryOverview from "../../components/category-overview/category-overview";
import CustomButton from "../../components/custom-button/custom-button";

const MainPage = () => {
  const match = useRouteMatch();
  const dispatch = useDispatch();
  const addNewChallengeModalData = {
    modalType: "ADD_CHALLENGE",
    modalProps: {}
  };

  const handleProposeNewChallenge = useCallback(
    () => dispatch(openModal(addNewChallengeModalData)),
    [dispatch, addNewChallengeModalData]
  );

  return (
    <MainContainer>
      <CategoryList />
      <Route path={`${match.path}/:category`} component={CategoryOverview} />
      <CustomButton
        type="button"
        text="Propose new challenge"
        large
        onClick={handleProposeNewChallenge}
      />
    </MainContainer>
  );
};

export default MainPage;
