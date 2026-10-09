import "./styles.css";
import { ReactNode, useState, useRef, useCallback, useEffect } from "react";
import Draggable from "react-draggable";

import { CloseIcon } from "../icons";
import { BodyPortal } from "../Portal";

let zTop = 1000;

export interface FloatingPanelProps {
    title: string;
    open: boolean;
    onClose: () => void;
    defaultPosition?: { x: number; y: number };
    children: ReactNode;
}

export function FloatingPanel({
    title,
    open,
    onClose,
    defaultPosition = { x: 60, y: 60 },
    children,
}: FloatingPanelProps) {
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches
    );
    const [zIndex, setZIndex] = useState(zTop);
    const nodeRef = useRef<HTMLDivElement>(null);

    const bringToFront = useCallback(() => {
        zTop += 1;
        setZIndex(zTop);
    }, []);

    // Each panel starts above previously opened panels; clicking it brings it forward.
    useEffect(() => {
        bringToFront();
    }, [bringToFront]);

    useEffect(() => {
        const query = window.matchMedia("(max-width: 600px)");
        const update = () => setIsMobile(query.matches);
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    if (!open) return null;

    if (isMobile) {
        return (
            <BodyPortal>
                <div
                    className="fp-drawer-backdrop"
                    onClick={(event) => event.target === event.currentTarget && onClose()}
                    onKeyDown={(event) => event.key === "Escape" && onClose()}
                >
                    <section className="fp-drawer" role="dialog" aria-modal="true" aria-label={title}>
                        <div className="fp-handle fp-drawer-heading">
                            <strong>{title}</strong>
                            <button
                                className="sc-button sc-button-icon"
                                aria-label={`Close ${title}`}
                                onClick={onClose}
                                autoFocus
                                type="button"
                            >
                                <CloseIcon fontSize="small" />
                            </button>
                        </div>
                        <hr />
                        <div className="fp-body">{children}</div>
                    </section>
                </div>
            </BodyPortal>
        );
    }

    return (
        <Draggable handle=".fp-handle" nodeRef={nodeRef} defaultPosition={defaultPosition} bounds="body">
            <div ref={nodeRef} className="fp-floating" style={{ zIndex }} onMouseDown={bringToFront}>
                <div className="fp-paper">
                    <div className="fp-handle fp-floating-heading">
                        <strong>{title}</strong>
                        <button
                            className="sc-button sc-button-icon"
                            aria-label={`Close ${title}`}
                            onClick={onClose}
                            type="button"
                        >
                            <CloseIcon fontSize="small" />
                        </button>
                    </div>
                    <div className="fp-body">{children}</div>
                </div>
            </div>
        </Draggable>
    );
}
