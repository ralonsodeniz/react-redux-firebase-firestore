import React from "react";
import { Route, useRouteMatch } from "react-router-dom";

import User from "../../components/user/user";
import CategoryList from "../../components/category-list/category-list";
import InstancesOverview from "../../components/instances-overview/instances-overview";
import ValidateOverview from "../../components/validate-overview/validate-overview";

import { AccountContainer } from "./account.styles";

const AccountPAge = () => {
  const { path } = useRouteMatch();
  return (
    <AccountContainer>
      <User />
      <CategoryList />
      <Route exact path={`${path}/:category`} component={InstancesOverview} />
      <ValidateOverview />
    </AccountContainer>
  );
};

export default AccountPAge;
