import React, { ReactNode, useState, useCallback, useRef, useEffect } from "react";
import styles from "./Tooltip.module.scss";
import { calculateTooltipPosition, TooltipPosition } from "./tooltipUtils";

interface TooltipProps {
    children: ReactNode;
    content: string;
    className?: string;
    delay?: number;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, content, className = "", delay = 400 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<TooltipPosition>("top");
    const timeoutRef = useRef<number>();
    const tooltipRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const updatePosition = useCallback(() => {
        if (!isVisible || !tooltipRef.current || !containerRef.current) return;

        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const targetRect = containerRef.current.getBoundingClientRect();

        const newPosition = calculateTooltipPosition({
            tooltipRect,
            targetRect,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
        });

        setPosition(newPosition);
    }, [isVisible]);

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

    useEffect(() => {
        if (isVisible) {
            updatePosition();
            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            window.removeEventListener("scroll", updatePosition, true);
            window.removeEventListener("resize", updatePosition);
        };
    }, [isVisible, updatePosition]);

    return (
        <div
            ref={containerRef}
            className={`${styles.tooltipContainer} ${className}`.trim()}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
            <div
                ref={tooltipRef}
                className={`${styles.tooltip} ${isVisible ? styles.visible : ""} ${styles[position]}`}
            >
                {content}
            </div>
        </div>
    );
};
