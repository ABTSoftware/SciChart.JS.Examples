import { ReactNode, useEffect, useRef } from "react";

export function MobileDrawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
    const ref = useRef<HTMLDialogElement>(null);
    useEffect(() => {
        const dialog = ref.current;
        if (!open) return undefined;
        dialog.showModal();
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            dialog.close();
            document.body.style.overflow = overflow;
        };
    }, [open]);
    return (
        <dialog
            ref={ref}
            className="sc-app-mobile-drawer"
            aria-label="Examples navigation"
            onCancel={(event) => {
                event.preventDefault();
                onClose();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <div className="sc-app-drawer-paper">
                {children}
            </div>
        </dialog>
    );
}
