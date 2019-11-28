import { useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

const Modal = ({ children }) => {
  const modal = document.querySelector("#modal");
  const element = document.createElement("div");

  useEffect(() => {
    modal.appendChild(element);
    return () => {
      modal.removeChild(element);
    };
  }, [modal, element]);

  return ReactDOM.createPortal(children, element);
};

Modal.propTypes = {
  children: PropTypes.node
};

Modal.defaultProps = {
  children: null
};

export default Modal;
