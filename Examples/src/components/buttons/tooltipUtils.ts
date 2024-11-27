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
