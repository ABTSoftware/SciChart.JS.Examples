import React from "react";
import styles from "./ConfirmDialog.module.scss";

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
        <div className={styles.dialog}>
            <h2>{title}</h2>
            <p>{message}</p>
            <div className={styles.buttons}>
                <button onClick={onCancel}>Cancel</button>
                <button className={styles.confirm} onClick={onConfirm}>
                    OK
                </button>
            </div>
        </div>
    );
};
