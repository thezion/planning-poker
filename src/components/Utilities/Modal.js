import { Fragment, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const mount = document.getElementById('modal');

function Modal({ title, body, confirmText, confirmHandler, setVisibility }) {
    const el = document.createElement('div');
    const modalRef = useRef(null);
    useEffect(() => {
        mount.appendChild(el);
        window.setTimeout(() => {
            modalRef.current.className += ' show';
        }, 100);
        return () => mount.removeChild(el);
    }, [el]);

    return createPortal(
        <Fragment>
            <div className="modal-backdrop fade show"></div>
            <div ref={modalRef} className="modal d-block fade">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h5 className="modal-title">{title}</h5>
                        </div>
                        {body && <div className="modal-body">{body}</div>}
                        <div className="modal-footer border-0">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                data-bs-dismiss="modal"
                                onClick={() => {
                                    setVisibility(false);
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                    confirmHandler();
                                    setVisibility(false);
                                }}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>,
        el
    );
}

export default Modal;
