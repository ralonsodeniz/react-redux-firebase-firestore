import { MODAL } from "./types";

const INITIAL_STATE = {
  showModal: false,
  modalData: {
    modalType: "",
    modalProps: {}
  }
};

const modalReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MODAL.OPEN_MODAL:
      return {
        ...state,
        showModal: true,
        modalData: action.payload
      };
    case MODAL.CLOSE_MODAL:
      return {
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};

export default modalReducer;
