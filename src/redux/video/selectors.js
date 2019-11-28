import { createSelector } from "reselect";

// input selector
const selectVideo = state => state.video;

// output selectors
export const selectVideoUrl = createSelector(
  [selectVideo],
  video => video.videoUrl
);
