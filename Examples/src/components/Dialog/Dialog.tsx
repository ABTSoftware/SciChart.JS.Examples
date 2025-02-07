import React, { useEffect, useState } from "react";
import classes from "./Dialog.module.scss";

interface DialogProps {
    isOpen: boolean;
    onClose?: () => void;
    text: string;
    autoCloseTime?: number;
}

export const Dialog: React.FC<DialogProps> = ({ isOpen: initialIsOpen, onClose, text, autoCloseTime = 2.75 }) => {
    const [isOpen, setIsOpen] = useState(initialIsOpen);

    // Sync local state with prop changes
    useEffect(() => {
        setIsOpen(initialIsOpen);
    }, [initialIsOpen]);

    const handleClose = () => {
        setIsOpen(false); // always close
        onClose?.(); // Only call onClose if provided
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    useEffect(() => {
        if (isOpen && autoCloseTime > 0) {
            const timer = setTimeout(handleClose, autoCloseTime * 1000);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [isOpen, autoCloseTime]);

    return isOpen ? (
        <div className={classes.overlay} onClick={handleOverlayClick}>
            <div className={classes.dialog}>
                <button className={classes.closeButton} onClick={handleClose}>
                    ×
                </button>
                <div className={classes.content}>{text}</div>
            </div>
        </div>
    ) : (
        <></>
    );
};
