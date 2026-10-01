import "./styles.css";
import * as React from "react";
import Draggable from "react-draggable";

import { CloseIcon } from "../icons";
import { BodyPortal } from "../Portal";

let zTop = 1000;

export interface FloatingPanelProps {
    title: string;
    open: boolean;
    onClose: () => void;
    defaultPosition?: { x: number; y: number };
    children: React.ReactNode;
}

export function FloatingPanel({
    title,
    open,
    onClose,
    defaultPosition = { x: 60, y: 60 },
    children,
}: FloatingPanelProps) {
    const [isMobile, setIsMobile] = React.useState(
        () => typeof window !== "undefined" && window.matchMedia("(max-width: 600px)").matches
    );
    const [zIndex, setZIndex] = React.useState(zTop);
    const nodeRef = React.useRef<HTMLDivElement>(null);

    const bringToFront = React.useCallback(() => {
        zTop += 1;
        setZIndex(zTop);
    }, []);

    // Bring this panel to front whenever it mounts (open→true causes remount).
    // bringToFront has a stable identity (useCallback []), so this fires exactly once per mount.
    React.useEffect(() => {
        bringToFront();
    }, [bringToFront]);

    React.useEffect(() => {
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
                        <div
                            className="fp-handle"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: 8,
                            }}
                        >
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
            <div
                ref={nodeRef}
                style={{ position: "fixed", zIndex, minWidth: 260, top: 0, left: 0 }}
                onMouseDown={bringToFront}
            >
                <div className="fp-paper">
                    <div
                        className="fp-handle"
                        style={{
                            padding: "6px 8px",
                            cursor: "move",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: "var(--sc-background)",
                            userSelect: "none",
                        }}
                    >
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
