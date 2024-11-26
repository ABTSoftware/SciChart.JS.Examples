import React, { ReactNode, useState, useCallback } from "react";
import styles from "./Tooltip.module.scss";

interface TooltipProps {
    children: ReactNode;
    content: string;
    className?: string;
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({
    children,
    content,
    className = "",
    delay = 400, // Default delay of 400ms
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = React.useRef<number>();

    const handleMouseEnter = useCallback(() => {
        timeoutRef.current = window.setTimeout(() => {
            setIsVisible(true);
        }, delay);
    }, [delay]);

    const handleMouseLeave = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    }, []);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className={`${styles.tooltipContainer} ${className}`.trim()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <div className={`${styles.tooltip} ${isVisible ? styles.visible : ""}`}>{content}</div>
        </div>
    );
};
