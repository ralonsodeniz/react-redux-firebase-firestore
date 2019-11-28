import React, { useCallback } from "react";
// we import new redux hooks from react-redux to select from the store what we need and dispatch the actions
import { useDispatch } from "react-redux";

import CustomButton from "../custom-button/custom-button";

import {
  counterAdd,
  counterSubtract,
  counterReset
} from "../../redux/counter/actions";

import { CounterButtonsContainer } from "./counter-manager.styles";

const CounterManager = () => {
  const dispatch = useDispatch();
  // When passing a callback using dispatch to a child component, it is recommended to memoize it with useCallback,
  // since otherwise child components may render unnecessarily due to the changed reference.
  const incrementCount = useCallback(() => dispatch(counterAdd()), [dispatch]);
  const decrementCount = useCallback(() => dispatch(counterSubtract()), [
    dispatch
  ]);
  const resetCount = useCallback(() => dispatch(counterReset()), [dispatch]);

  return (
    <CounterButtonsContainer>
      <CustomButton large text={"ADD"} onClick={incrementCount} />
      <CustomButton large text={"SUBTRACT"} onClick={decrementCount} />
      <CustomButton large text={"RESET"} onClick={resetCount} />
    </CounterButtonsContainer>
  );
};

export default CounterManager;
