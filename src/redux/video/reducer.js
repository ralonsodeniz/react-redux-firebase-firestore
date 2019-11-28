import { VIDEO } from "./types";

const INITIAL_STATE = {
  videoUrl: ""
};

const videoReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case VIDEO.UPDATE_URL:
      return {
        ...state,
        videoUrl: action.payload
      };
    default:
      return state;
  }
};

export default videoReducer;
