import React from "react";

interface ConfirmDialogProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    message?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onConfirm,
    onCancel,
    title = "Unsaved Changes",
    message = "You have unsaved changes. Are you sure you want to close the editor?",
}) => {
    if (!isOpen) return null;

    return (
        <div className="sc-editor-confirm-dialog">
            <h2>{title}</h2>
            <p>{message}</p>
            <div className="sc-editor-confirm-buttons">
                <button onClick={onCancel}>Cancel</button>
                <button className="sc-editor-confirm-confirm" onClick={onConfirm}>
                    OK
                </button>
            </div>
        </div>
    );
};
