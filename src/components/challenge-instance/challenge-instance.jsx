import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
import { createStructuredSelector } from "reselect";

import {
  selectInstanceFromId,
  selectInstanceTemplateId
} from "../../redux/firestore/challenges-instances/selectors";
import { selectChallengeTemplateFromId } from "../../redux/firestore/challenges-templates/selectors";
import { selectUserProfileId } from "../../redux/user/selectors";

import {
  ChallengeInstanceContainer,
  ChallengeInstanceVideoPlayer,
  ChallengeInstanceDataContainer,
  ChallengeInstanceData,
  ChallengeInstanceButtonsContainer
} from "./challenge-instance.styles";

const ChallengeInstance = () => {
  const { instanceId } = useParams();

  const memoizedSelectInstanceFromId = useMemo(() => selectInstanceFromId, []);

  const memoizedSelectInstanceTemplateId = useMemo(
    () => selectInstanceTemplateId,
    []
  );

  const memoizedSelectChallengeTemplateFromId = useMemo(
    () => selectChallengeTemplateFromId,
    []
  );

  const instanceData = useSelector(
    state => memoizedSelectInstanceFromId(state, instanceId),
    shallowEqual
  );

  const templateId = useSelector(
    state => memoizedSelectInstanceTemplateId(state, instanceId),
    shallowEqual
  );

  const templateData = useSelector(
    state => memoizedSelectChallengeTemplateFromId(state, templateId),
    shallowEqual
  );

  console.log("instanceData", instanceData);
  console.log("templateData", templateData);

  return (
    <ChallengeInstanceContainer>
      <ChallengeInstanceVideoPlayer />
      <ChallengeInstanceDataContainer>
        <ChallengeInstanceData>{instanceId}</ChallengeInstanceData>
        <ChallengeInstanceButtonsContainer></ChallengeInstanceButtonsContainer>
      </ChallengeInstanceDataContainer>
    </ChallengeInstanceContainer>
  );
};

export default ChallengeInstance;
