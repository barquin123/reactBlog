import React from 'react'
import PropTypes from 'prop-types';

const Modal = (active = 'false') => {
  return (
    <>
        { active ? 
            <div className="modal">
                <div className="modal-content">
                    <span className="close">&times;</span>
                    <p>Some text in the Modal..</p>
                </div>
            </div>
            : ''
        }
    </>
  )
}
Modal.propTypes = {
    active: PropTypes.bool,
  };

export default Modal