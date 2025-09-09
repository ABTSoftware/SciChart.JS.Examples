function correlationLinePoints(x: number[], y: number[]) {
    if (x.length !== y.length || x.length === 0) {
        throw new Error("Arrays must have the same non-zero length.");
    }
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominatorX = 0;
    let denominatorY = 0;
    let covXY = 0;
    let varX = 0;

    for (let i = 0; i < n; i++) {
        const dx = x[i] - meanX;
        const dy = y[i] - meanY;
        numerator += dx * dy;
        denominatorX += dx * dx;
        denominatorY += dy * dy;
        covXY += dx * dy;
        varX += dx * dx;
    }

    const r = denominatorX * denominatorY === 0 ? 0 : numerator / Math.sqrt(denominatorX * denominatorY);

    // Regression line slope and intercept
    const slope = covXY / varX;
    const intercept = meanY - slope * meanX;

    // Find x range
    const xStart = Math.min(...x);
    const xEnd = Math.max(...x);

    // Calculate corresponding y for line ends
    const yStart = slope * xStart + intercept;
    const yEnd = slope * xEnd + intercept;

    return {
        correlationCoefficient: +r.toFixed(2),
        linePoints: { x1: xStart, y1: yStart, x2: xEnd, y2: yEnd },
    };
}

export default correlationLinePoints;
