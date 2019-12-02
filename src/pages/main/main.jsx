import React from "react";
import { MainContainer } from "./main.styles";
import { Route, useRouteMatch } from "react-router-dom";

import CategoryList from "../../components/category-list/category-list";
import TestParams from "../../components/testparams/testparams";

const MainPage = () => {
  const match = useRouteMatch();

  return (
    <MainContainer>
      <CategoryList />
      <Route path={`${match.path}/:category`} component={TestParams} />
    </MainContainer>
  );
};

export default MainPage;
