import { VIDEO } from "./types";

export const updateUrl = url => ({
  type: VIDEO.UPDATE_URL,
  payload: url
});
