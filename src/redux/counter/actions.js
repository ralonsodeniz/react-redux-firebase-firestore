import { COUNTER } from "./types";

export const counterAdd = () => ({
  type: COUNTER.ADD
});

export const counterSubtract = () => ({
  type: COUNTER.SUBTRACT
});

export const counterReset = () => ({
  type: COUNTER.RESET
});
