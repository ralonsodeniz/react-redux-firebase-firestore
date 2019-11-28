import React, { useCallback } from "react";
// we import new redux hooks from react-redux to select from the store what we need and dispatch the actions
// shalllowEqual makes a shallow comparation for returned object when you get more than one thing from the store
import { useSelector, shallowEqual, useDispatch } from "react-redux";

import { openModal } from "../../redux/modal/actions";
import { selectCount } from "../../redux/counter/selectors";

import CustomButton from "../custom-button/custom-button";

import { CounterContainer, CounterTextContainer } from "./counter.styles";

const Counter = () => {
  const count = useSelector(selectCount, shallowEqual);
  const dispatch = useDispatch();
  const counterManagerData = {
    modalType: "COUNTER_MANAGER",
    modalProps: {}
  };
  const openCounterInModal = useCallback(
    () => dispatch(openModal(counterManagerData)),
    [dispatch, counterManagerData]
  );

  return (
    <CounterContainer>
      <CounterTextContainer>Current count is: {count}</CounterTextContainer>
      <CustomButton
        text={"Open counter manager"}
        onClick={openCounterInModal}
      />
    </CounterContainer>
  );
};

export default Counter;
