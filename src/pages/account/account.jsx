import React from "react";
import { Route, useRouteMatch, Link } from "react-router-dom";

import User from "../../components/user/user";
import CategoryList from "../../components/category-list/category-list";
import InstancesOverview from "../../components/instances-overview/instances-overview";
import ValidateOverview from "../../components/validate-overview/validate-overview";

import { AccountContainer, AccountNavigationContainer } from "./account.styles";

const AccountPAge = () => {
  const { path } = useRouteMatch();
  return (
    <AccountContainer>
      <AccountNavigationContainer>
        <Link to={`/account`}>Profile</Link>
        <Link to={`/account/instances/all`}>Challenge instances</Link>
        <Link to={`/account/validation`}>Challenge instances to validate</Link>
      </AccountNavigationContainer>
      <Route exact path={path} component={User} />
      <Route path={`${path}/instances`} component={CategoryList} />
      <Route
        exact
        path={`${path}/instances/:category`}
        component={InstancesOverview}
      />
      <Route exact path={`${path}/validation`} component={ValidateOverview} />
    </AccountContainer>
  );
};

export default AccountPAge;
