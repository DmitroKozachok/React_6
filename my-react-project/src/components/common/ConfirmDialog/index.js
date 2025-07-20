import React from "react";

const ConfirmDialog = ({ message, onConfirm, onCancel }) => {
    return (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content text-center">

                    <div className="modal-header justify-content-center border-0">
                        <h5 className="modal-title w-100">Підтвердження</h5>
                    </div>

                    <div className="modal-body">
                        <p className="mb-0">{message}</p>
                    </div>

                    <div className="modal-footer justify-content-center border-0">
                        <button type="button" className="btn btn-danger me-2" onClick={onCancel}>Скасувати</button>
                        <button type="button" className="btn btn-success" onClick={onConfirm}>Підтвердити</button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
