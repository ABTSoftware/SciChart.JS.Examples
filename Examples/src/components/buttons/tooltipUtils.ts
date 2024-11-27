export type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipDimensions {
    tooltipRect: DOMRect;
    targetRect: DOMRect;
    windowWidth: number;
    windowHeight: number;
}

export const calculateTooltipPosition = ({
    tooltipRect,
    targetRect,
    windowWidth,
    windowHeight,
}: TooltipDimensions): TooltipPosition => {
    const spaceAbove = targetRect.top;
    const spaceBelow = windowHeight - targetRect.bottom;
    const spaceLeft = targetRect.left;
    const spaceRight = windowWidth - targetRect.right;

    // Calculate available space in each direction
    const spaces = {
        top: spaceAbove - tooltipRect.height,
        bottom: spaceBelow - tooltipRect.height,
        left: spaceLeft - tooltipRect.width,
        right: spaceRight - tooltipRect.width,
    };

    // Find the direction with the most space
    return Object.entries(spaces).reduce((best, [position, space]) => {
        return space > spaces[best as TooltipPosition] ? (position as TooltipPosition) : best;
    }, "top" as TooltipPosition);
};

export const getTooltipStyles = (position: TooltipPosition) => {
    const baseStyles = {
        transform: "",
        top: "auto",
        bottom: "auto",
        left: "auto",
        right: "auto",
        marginLeft: "0",
        marginRight: "0",
        marginTop: "0",
        marginBottom: "0",
    };

    switch (position) {
        case "bottom":
            return {
                ...baseStyles,
                top: "100%",
                left: "50%",
                transform: "translateX(-50%) translateY(0)",
                marginTop: "8px",
            };
        case "left":
            return {
                ...baseStyles,
                top: "50%",
                right: "100%",
                transform: "translateY(-50%) translateX(0)",
                marginRight: "8px",
            };
        case "right":
            return {
                ...baseStyles,
                top: "50%",
                left: "100%",
                transform: "translateY(-50%) translateX(0)",
                marginLeft: "8px",
            };
        case "top":
        default:
            return {
                ...baseStyles,
                bottom: "100%",
                left: "50%",
                transform: "translateX(-50%) translateY(0)",
                marginBottom: "8px",
            };
    }
};
