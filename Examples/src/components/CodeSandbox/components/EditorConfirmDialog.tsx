import React from "react";
import { ConfirmDialog } from "./ConfirmDialog";

interface EditorConfirmDialogProps {
    isOpen: boolean;
    hasEdits: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const EditorConfirmDialog: React.FC<EditorConfirmDialogProps> = ({ isOpen, hasEdits, onConfirm, onCancel }) => {
    return (
        <ConfirmDialog
            isOpen={isOpen}
            onConfirm={onConfirm}
            onCancel={onCancel}
            title={hasEdits ? "Unsaved Changes" : "Close Editor"}
            message={
                hasEdits
                    ? "You have unsaved changes. Are you sure you want to close the editor?"
                    : "Are you sure you want to close the editor?"
            }
        />
    );
};
