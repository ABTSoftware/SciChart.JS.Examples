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
    const initialState = useRef({
        mouseX: 0,
        mouseY: 0,
        barX: 0,
        barY: 0,
    });
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;

            // Calculate the displacement from initial mouse position
            const dx = e.clientX - initialState.current.mouseX;
            const dy = e.clientY - initialState.current.mouseY;

            // Add displacement to initial bar position
            const newX = initialState.current.barX + dx;
            const newY = initialState.current.barY + dy;

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

        // Store initial mouse position and bar position
        initialState.current = {
            mouseX: e.clientX,
            mouseY: e.clientY,
            barX: position.x,
            barY: position.y,
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
                left: `${position.x}px`,
                top: `${position.y}px`,
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
