import React, { Fragment, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import db from 'libraries/database';
import './TshirtLegend.scss';

const DEFAULT_LEGEND = {
    title: 'T-Shirt Sizing Legend',
    subtext: "time estimates based on one engineer's full time dedicated to the task",
    values: {
        XS: '1 week',
        S: '2 weeks',
        M: '4 weeks',
        L: '8 weeks',
        XL: '16 weeks',
        XXL: '32 weeks',
    },
};

const mount = document.getElementById('modal');

function TshirtLegend({ legend }) {
    const [showModal, setShowModal] = useState(false);
    const [editedLegend, setEditedLegend] = useState(DEFAULT_LEGEND);
    const containerRef = useRef(null);
    const modalRef = useRef(null);

    if (!containerRef.current) {
        containerRef.current = document.createElement('div');
    }
    const el = containerRef.current;

    const currentLegend = legend || DEFAULT_LEGEND;

    useEffect(() => {
        if (showModal && mount) {
            mount.appendChild(el);
            window.setTimeout(() => {
                if (modalRef.current) modalRef.current.className += ' show';
            }, 100);
            return () => {
                if (mount.contains(el)) {
                    mount.removeChild(el);
                }
            };
        }
    }, [showModal, el]);

    const handleEdit = () => {
        setEditedLegend(currentLegend);
        setShowModal(true);
    };

    const handleSave = () => {
        db.setTshirtLegend(editedLegend);
        setShowModal(false);
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    const handleValueChange = (size, value) => {
        setEditedLegend({
            ...editedLegend,
            values: {
                ...editedLegend.values,
                [size]: value,
            },
        });
    };

    const modalContent = showModal
        ? createPortal(
              <Fragment>
                  <div className="modal-backdrop fade show"></div>
                  <div ref={modalRef} className="modal d-block fade">
                      <div className="modal-dialog">
                          <div className="modal-content">
                              <div className="modal-header">
                                  <h5 className="modal-title">Edit T-Shirt Sizing Legend</h5>
                                  <button
                                      type="button"
                                      className="btn-close"
                                      aria-label="Close"
                                      onClick={handleCancel}
                                  ></button>
                              </div>
                              <div className="modal-body">
                                  <div className="mb-3">
                                      <label htmlFor="legend-title" className="form-label">
                                          Title
                                      </label>
                                      <input
                                          type="text"
                                          className="form-control"
                                          id="legend-title"
                                          value={editedLegend.title}
                                          onChange={(e) => setEditedLegend({ ...editedLegend, title: e.target.value })}
                                      />
                                  </div>

                                  <div className="mb-3">
                                      <label className="form-label">Size Values</label>
                                      {Object.entries(editedLegend.values).map(([size, value]) => (
                                          <div key={size} className="input-group mb-2">
                                              <span className="input-group-text" style={{ minWidth: '60px' }}>
                                                  {size}
                                              </span>
                                              <input
                                                  type="text"
                                                  className="form-control"
                                                  value={value}
                                                  onChange={(e) => handleValueChange(size, e.target.value)}
                                                  placeholder="e.g., 1 week"
                                              />
                                          </div>
                                      ))}
                                  </div>

                                  <div className="mb-3">
                                      <label htmlFor="legend-subtext" className="form-label">
                                          Subtext
                                      </label>
                                      <textarea
                                          className="form-control"
                                          id="legend-subtext"
                                          rows="2"
                                          value={editedLegend.subtext}
                                          onChange={(e) => setEditedLegend({ ...editedLegend, subtext: e.target.value })}
                                      />
                                  </div>
                              </div>
                              <div className="modal-footer">
                                  <button className="btn btn-secondary" onClick={handleCancel}>
                                      Cancel
                                  </button>
                                  <button className="btn btn-primary" onClick={handleSave}>
                                      Save Legend
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              </Fragment>,
              el
          )
        : null;

    return (
        <>
            <div className="__tshirt-legend">
                <div className="__tshirt-legend__header">
                    <h5 className="__tshirt-legend__title">{currentLegend.title}</h5>
                    <button
                        className="btn btn-sm btn-outline-secondary __tshirt-legend__edit-btn"
                        onClick={handleEdit}
                        aria-label="Edit legend"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                        >
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z" />
                        </svg>
                    </button>
                </div>
                <div className="__tshirt-legend__values">
                    <div className="__tshirt-legend__column">
                        {['XS', 'S', 'M'].map((size) => (
                            <div key={size} className="__tshirt-legend__item">
                                <span className={`__tshirt-legend__badge __tshirt-legend__badge--${size.toLowerCase()}`}>
                                    {size}
                                </span>
                                <span className="__tshirt-legend__value">{currentLegend.values[size]}</span>
                            </div>
                        ))}
                    </div>
                    <div className="__tshirt-legend__column">
                        {['L', 'XL', 'XXL'].map((size) => (
                            <div key={size} className="__tshirt-legend__item">
                                <span className={`__tshirt-legend__badge __tshirt-legend__badge--${size.toLowerCase()}`}>
                                    {size}
                                </span>
                                <span className="__tshirt-legend__value">{currentLegend.values[size]}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {currentLegend.subtext && (
                    <p className="__tshirt-legend__subtext">{currentLegend.subtext}</p>
                )}
            </div>
            {modalContent}
        </>
    );
}

TshirtLegend.propTypes = {
    legend: PropTypes.shape({
        title: PropTypes.string,
        subtext: PropTypes.string,
        values: PropTypes.objectOf(PropTypes.string),
    }),
};

export default React.memo(TshirtLegend);
