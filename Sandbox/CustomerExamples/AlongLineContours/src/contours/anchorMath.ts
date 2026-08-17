const MAX_ANCHOR_LEVEL = 10;

/**
 * Returns anchors in nested order. Each level cuts every gap in half. A loop labels all 2^n parts;
 * an open line leaves its endpoints clear, so it has 2^n - 1 labels.
 */
export const getAnchorFraction = (ordinal: number, isClosed = false): number => {
    if (isClosed) {
        if (ordinal === 0) return 1 / 2;
        if (ordinal === 1) return 0;
        ordinal--;
    }
    const level = Math.floor(Math.log2(ordinal + 1));
    const withinLevel = ordinal - (1 << level) + 1;
    return (2 * withinLevel + 1) / (1 << (level + 1));
};

/** Chooses a complete subdivision level, keeping every label evenly spaced. */
export const getAnchorLevel = (
    totalPixel: number,
    visiblePixel: number,
    spacing: number,
    maxLabelsPerLine: number,
    isClosed = false
): number => {
    const minParts = totalPixel / Math.max(visiblePixel, 1);
    const minLevel = Math.max(isClosed ? 0 : 1, Math.ceil(Math.log2(Math.max(minParts, isClosed ? 1 : 2))));
    const wanted = Math.round(Math.log2(Math.max(totalPixel / spacing, isClosed ? 1 : 2)));
    let level = Math.min(MAX_ANCHOR_LEVEL, Math.max(minLevel, wanted));
    const visibleFraction = Math.min(1, visiblePixel / totalPixel);
    while (level > minLevel && ((1 << level) - (isClosed ? 0 : 1)) * visibleFraction > maxLabelsPerLine) {
        level--;
    }
    return level;
};
