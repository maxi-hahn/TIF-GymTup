import './ConfirmationModal.css'

const ConfirmationModal = ({
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    onConfirm,
    onCancel,
}) => {

    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div
                className="modal-container"
                onClick={(e) => e.stopPropagation()}
            >

                <h2>{title}</h2>

                <p>{message}</p>

                <div className="modal-actions">

                    <button
                        className="modal-cancel"
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>

                    <button
                        className="modal-confirm"
                        onClick={onConfirm}
                    >
                        {confirmText}
                    </button>

                </div>

            </div>
        </div>
    )
}

export default ConfirmationModal