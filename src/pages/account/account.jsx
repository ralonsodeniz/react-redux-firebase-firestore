import React, { lazy, Suspense } from "react";
import { Route, useRouteMatch, Link } from "react-router-dom";

import User from "../../components/user/user";
import Spinner from "../../components/spinner/spinner";

import { AccountContainer, AccountNavigationContainer } from "./account.styles";

const lazyCategoryList = lazy(() =>
  import("../../components/category-list/category-list")
);
const lazyInstancesOverview = lazy(() =>
  import("../../components/instances-overview/instances-overview")
);
const lazyValidateOverview = lazy(() =>
  import("../../components/validate-overview/validate-overview")
);
const lazyFriendList = lazy(() =>
  import("../../components/friend-list/friend-list")
);
const lazyUserStatistics = lazy(() =>
  import("../../components/user/user-statistics")
);

const AccountPAge = () => {
  const { path } = useRouteMatch();
  return (
    <AccountContainer>
      <AccountNavigationContainer>
        <Link to={`/account`}>Profile</Link>
        <Link to={`/account/instances/all`}>Challenge instances</Link>
        <Link to={`/account/validation`}>Instances to validate</Link>
        <Link to={`/account/friends`}>Friends</Link>
        <Link to={`/account/statistics`}>Statistics</Link>
      </AccountNavigationContainer>
      <Suspense
        fallback={
          <AccountNavigationContainer>
            <Spinner />
          </AccountNavigationContainer>
        }
      >
        <Route exact path={path} component={User} />
        <Route path={`${path}/instances`} component={lazyCategoryList} />
        <Route
          exact
          path={`${path}/instances/:category`}
          component={lazyInstancesOverview}
        />
        <Route
          exact
          path={`${path}/validation`}
          component={lazyValidateOverview}
        />
        <Route exact path={`${path}/friends`} component={lazyFriendList} />
        <Route
          exact
          path={`${path}/statistics`}
          component={lazyUserStatistics}
        />
      </Suspense>
    </AccountContainer>
  );
};

export default AccountPAge;
