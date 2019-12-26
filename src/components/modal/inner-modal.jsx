import React, { lazy, Suspense, useCallback } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { createStructuredSelector } from "reselect";

import { closeModal } from "../../redux/modal/actions";
import { selectModalType, selectModalProps } from "../../redux/modal/selectors";

import Spinner from "../spinner/spinner";
import OnClickOutSide from "../onclick-outside/onclick-outside";

import {
  InnerModalContainer,
  InnerModalComponentContainer
} from "./inner-modal.styles";

const lazyVideoPlayer = lazy(() => import("../video-player/video-player"));

const lazySystemMessage = lazy(() =>
  import("../system-message/system-message")
);

const lazyAddChallenge = lazy(() => import("../add-challenge/add-challenge"));

const lazyAddChallengeInstance = lazy(() =>
  import("../add-challenge-instance/add-challenge-instance")
);

const lazyUpdateUserData = lazy(() => import("../user/update-user-data"));

const lazyDeleteUser = lazy(() => import("../user/delete-user"));

const lazyUpdateUserPassword = lazy(() =>
  import("../user/update-user-password")
);

const lazyImageViewer = lazy(() => import("../image-viewer/image-viewer"))

const lazyTemplateProofsRanking = lazy(() => import("../template-proofs-ranking/template-proofs-ranking"))

const MODAL_OPTIONS = {
  VIDEO_PLAYER: lazyVideoPlayer,
  SYSTEM_MESSAGE: lazySystemMessage,
  ADD_CHALLENGE: lazyAddChallenge,
  ADD_CHALLENGE_INSTANCE: lazyAddChallengeInstance,
  UPDATE_USER_DATA: lazyUpdateUserData,
  DELETE_USER: lazyDeleteUser,
  UPDATE_USER_PASSWORD: lazyUpdateUserPassword,
  IMAGE_VIEWER: lazyImageViewer,
  TEMPLATE_PROOFS_RANKING: lazyTemplateProofsRanking
};

// we can create a structured selector object using createStructuredSelector from reselect using different selectors and then pass it to useSelector redux custom hook
const getModalData = createStructuredSelector({
  modalType: selectModalType,
  modalProps: selectModalProps
});

const InnerModal = () => {
  const dispatch = useDispatch();
  const modalData = useSelector(getModalData, shallowEqual);
  const closeModalOnClickOutside = useCallback(() => dispatch(closeModal()), [
    dispatch
  ]);
  const SpecificModal = MODAL_OPTIONS[modalData.modalType];

  return (
    <InnerModalContainer>
      <OnClickOutSide enabled action={closeModalOnClickOutside}>
        <InnerModalComponentContainer>
          <Suspense fallback={<Spinner />}>
            <SpecificModal {...modalData.modalProps} />
          </Suspense>
        </InnerModalComponentContainer>
      </OnClickOutSide>
    </InnerModalContainer>
  );
};

export default InnerModal;
