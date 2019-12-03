import React from "react";
import { MainContainer } from "./main.styles";
import { Route, useRouteMatch } from "react-router-dom";

import CategoryList from "../../components/category-list/category-list";
import CategoryOverview from "../../components/category-overview/category-overview";
import ChallengeTemplate from "../../components/challenge-template/challenge-template";

const MainPage = () => {
  const match = useRouteMatch();

  return (
    <MainContainer>
      <CategoryList />
      <Route
        exact
        path={`${match.path}/:category`}
        component={CategoryOverview}
      />
      <Route
        exact
        path={`${match.path}/:category/:challengeTemplateId`}
        component={ChallengeTemplate}
      />
    </MainContainer>
  );
};

export default MainPage;
