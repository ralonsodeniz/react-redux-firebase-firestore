import { takeLatest, put, call, all } from "redux-saga/effects";

import { CHALLENGES } from "./types";
import { openModal } from "../../modal/actions";
import {
  addNewChallengeTemplateInFs,
  submitChallengeRatingInFs
} from "../../../firebase/firebase.utils";

// add new challenge to templates
export function* onAddNewChallengeStarts() {
  yield takeLatest(CHALLENGES.ADD_NEW_CHALLENGE_STARTS, addNewChallenge);
}

export function* addNewChallenge({ payload }) {
  try {
    yield call(addNewChallengeTemplateInFs, payload);
    const addNewChallengeSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "New challenge added and pending to be approved"
      }
    };
    yield put(openModal(addNewChallengeSuccessModalData));
  } catch (error) {
    const addNewChallengeFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(addNewChallengeFailureModalData));
  }
}

// submit challenge template rating
export function* onSubmitChallengeRatingStarts() {
  yield takeLatest(
    CHALLENGES.SUBMIT_CHALLENGE_RATING_STARTS,
    submitChallengeRating
  );
}

export function* submitChallengeRating({ payload }) {
  const { starsSelected, templateId, category, userProfileId } = payload;
  try {
    yield call(
      submitChallengeRatingInFs,
      starsSelected,
      templateId,
      category,
      userProfileId
    );
    const submitChallengeRatingSuccessModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: "Submitted challenge rating"
      }
    };
    yield put(openModal(submitChallengeRatingSuccessModalData));
  } catch (error) {
    const submitChallengeRatingFailureModalData = {
      modalType: "SYSTEM_MESSAGE",
      modalProps: {
        text: error.message
      }
    };
    yield put(openModal(submitChallengeRatingFailureModalData));
  }
}

// root saga creator for challenges templates
export function* challengesTemplatesSagas() {
  yield all([
    call(onAddNewChallengeStarts),
    call(onSubmitChallengeRatingStarts)
  ]);
}
