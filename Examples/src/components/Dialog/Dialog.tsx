import React, { useState } from "react";
import classes from "./Dialog.module.scss";

interface DialogProps {
    isOpen: boolean;
    onClose?: () => void;
    text: string;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen: initialIsOpen, onClose, text }) => {
    const [isOpen, setIsOpen] = useState(initialIsOpen);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsOpen(false);
        onClose?.(); // Only call onClose if provided
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div className={classes.overlay} onClick={handleOverlayClick}>
            <div className={classes.dialog}>
                <button className={classes.closeButton} onClick={handleClose}>
                    ×
                </button>
                <div className={classes.content}>{text}</div>
            </div>
        </div>
    );
};
