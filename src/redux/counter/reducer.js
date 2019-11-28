import { COUNTER } from "./types";

const INITIAL_STATE = {
  count: 0
};

const counterReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case COUNTER.ADD:
      return {
        ...state,
        count: ++state.count
      };
    case COUNTER.SUBTRACT:
      return {
        ...state,
        count: --state.count
      };
    case COUNTER.RESET:
      return {
        state,
        count: 0
      };
    default:
      return state;
  }
};

export default counterReducer;
