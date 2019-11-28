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

const lazyCounterManager = lazy(() =>
  import("../counter-manager/counter-manager")
);
const lazyVideoPlayer = lazy(() => import("../video-player/video-player"));
const lazySystemMessage = lazy(() =>
  import("../system-message/system-message")
);

const MODAL_OPTIONS = {
  COUNTER_MANAGER: lazyCounterManager,
  VIDEO_PLAYER: lazyVideoPlayer,
  SYSTEM_MESSAGE: lazySystemMessage
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
          <span>This is the modal (React Portal)</span>
          <Suspense fallback={<Spinner />}>
            <SpecificModal {...modalData.modalProps} />
          </Suspense>
        </InnerModalComponentContainer>
      </OnClickOutSide>
    </InnerModalContainer>
  );
};

export default InnerModal;
