import { createSelector } from "reselect";

// input selector
const selectCounter = state => state.counter;

// output selectors
export const selectCount = createSelector(
  [selectCounter],
  counter => counter.count
);
