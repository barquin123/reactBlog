import React, { useState } from "react";
import PropTypes from "prop-types";

const Modal = ({ message = "", modalTitle = ""}) => {
  // State to control modal visibility
  const [modalActive, setModalActive] = useState(true);

  return (
    <>
      <div
        className={`fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-50 ${
          modalActive ? "block" : "hidden"
        }`}
      ></div>
      <div
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-white p-4 rounded-lg ${
          modalActive ? "block" : "hidden"
        }`}
      >
        <h1 className="text-2xl font-bold">{modalTitle}</h1>
        <p className="text-lg mt-2">{message}</p>
        <button
          className="bg-red-500 text-white px-4 py-2 mt-4"
          onClick={() => setModalActive(false)}
        >
          Close
        </button>
      </div>
    </>
  );
};

// Define PropTypes for the component
Modal.propTypes = {
  message: PropTypes.string.isRequired, // 'message' prop must be a string
  modalTitle: PropTypes.string.isRequired,
};

export default Modal;