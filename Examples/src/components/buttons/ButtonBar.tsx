import React, { ReactNode, CSSProperties, useRef, useState, useEffect } from "react";
import styles from "./ButtonBar.module.scss";

interface ButtonBarProps {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    onPositionChange?: (x: number, y: number) => void;
}

export const ButtonBar: React.FC<ButtonBarProps> = ({ children, className = "", style, onPositionChange }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState({ x: 20, y: 20 });
    const mouseOffset = useRef({ x: 0, y: 0 });
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            // Calculate new position based on mouse position and scroll position
            const newX = e.clientX + window.scrollX - mouseOffset.current.x;
            const newY = e.clientY + window.scrollY - mouseOffset.current.y;

            // Disable transitions during drag for smoother movement
            if (barRef.current) {
                barRef.current.style.transition = "none";
            }

            requestAnimationFrame(() => {
                setPosition({ x: newX, y: newY });
                onPositionChange?.(newX, newY);
            });

            // Prevent text selection during drag
            e.preventDefault();
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = "";

            // Re-enable transitions after drag
            if (barRef.current) {
                barRef.current.style.transition = "";
            }
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove, { passive: false });
            document.addEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "grabbing";
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            document.body.style.cursor = "";
        };
    }, [isDragging, onPositionChange]);

    const handleMouseDown = (e: React.MouseEvent) => {
        // Don't initiate drag if clicking on a button or interactive element
        if ((e.target as HTMLElement).closest('button, input, select, [role="button"]')) {
            return;
        }

        const rect = barRef.current?.getBoundingClientRect();
        if (!rect) return;

        // Calculate offset from the mouse position to the bar's edge
        mouseOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        setIsDragging(true);
        e.preventDefault();
    };

    return (
        <div
            ref={barRef}
            className={`${styles.buttonBar} ${isDragging ? styles.dragging : ""} ${className}`.trim()}
            style={{
                ...style,
                position: "fixed",
                left: `${position.x}px`,
                top: `${position.y}px`,
                cursor: isDragging ? "grabbing" : "grab",
                transform: isDragging ? "scale(1.02)" : undefined,
                willChange: isDragging ? "transform, left, top" : undefined,
            }}
            onMouseDown={handleMouseDown}
        >
            <div className={styles.gripArea}>
                <div className={styles.gripDots}></div>
            </div>
            <div className={styles.content}>{children}</div>
        </div>
    );
};
