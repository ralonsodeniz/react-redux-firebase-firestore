import React from "react";
import { Route, useRouteMatch } from "react-router-dom";

import ChallengeInstance from "../../components/challenge-instance/challenge-instance";

import { InstanceContainer } from "./instance.styles";

const InstancePage = () => {
  const match = useRouteMatch();

  return (
    <InstanceContainer>
      <Route
        exact
        path={`${match.path}/:instanceId`}
        component={ChallengeInstance}
      />
    </InstanceContainer>
  );
};

export default InstancePage;
