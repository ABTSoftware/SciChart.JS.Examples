import { TSciChart, Rect } from "scichart";
import { WebGlRenderContext2D, ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SCRTPen } from "scichart/types/TSciChart";
import { getVectorColorVertex, getVertex } from "scichart/Charting/Visuals/Helpers/NativeObject";

const RIM_INNER_RADIUS = 1.0;
const RIM_OUTER_RADIUS = 1.08;
const RIM_LABEL_RADIUS = 1.13;
const MAJOR_TICK_STEP = 30; // degrees
const MINOR_TICK_STEP = 10; // degrees
const CARDINAL_DEG = 10; // ±degrees around 0/90/180/270 treated as cardinal

/**
 * Returns pixel offset (dx, dy) to position a label of size (w × h) at an anchor
 * point on the rim, given the outward angle in standard degrees (CCW, 0=right).
 * Mirrors SmithChartAxisRenderer._positionLabel logic from smithChartAxes.ts.
 */
export function getRimLabelOffset(angleDeg: number, w: number, h: number): { dx: number; dy: number } {
    const GAP = 4;
    const angleRad = (angleDeg * Math.PI) / 180;
    const normDeg = ((angleDeg % 360) + 360) % 360;
    const absModDeg = normDeg % 90;
    const isCardinal = absModDeg < CARDINAL_DEG || absModDeg > 90 - CARDINAL_DEG;
    const quadrant = Math.floor(normDeg / 90);

    let dx = 0;
    let dy = 0;

    if (isCardinal) {
        if (quadrant === 0) {
            dy = -h / 2; // right: centre vertically
        } else if (quadrant === 1) {
            dx = -w / 2;
            dy = -h; // top: centre horizontally, above
        } else if (quadrant === 2) {
            dx = -w;
            dy = -h / 2; // left: right-align, centre vertically
        } else {
            dx = -w / 2; // bottom: centre horizontally, below
        }
    } else {
        if (Math.cos(angleRad) < 0) dx = -w;
        if (Math.sin(angleRad) > 0) dy = -h;
    }

    // Nudge outward (screen Y is inverted relative to math Y)
    dx += GAP * Math.cos(angleRad);
    dy -= GAP * Math.sin(angleRad);

    return { dx, dy };
}

/**
 * Draws angle-of-Γ tick marks around the rim (just outside the unit circle).
 * Called from SmithChartResistanceAxis.drawGridLines on the major pass.
 * Labels are emitted via the drawLabel callback so the axis renderer can draw them
 * using its own text rendering pipeline.
 */
export function drawRimTicks(
    renderContext: WebGlRenderContext2D,
    xCalc: any,
    yCalc: any,
    wasmContext: TSciChart,
    majorPen: SCRTPen,
    clipRect: Rect,
    leftPad: number,
    topPad: number,
    drawLabel: (text: string, px: number, py: number, angleDeg: number) => void
): void {
    const vertices = getVectorColorVertex(wasmContext);
    const vertex = getVertex(wasmContext, 0, 0);

    for (let deg = 0; deg < 360; deg += MINOR_TICK_STEP) {
        const isMajorTick = deg % MAJOR_TICK_STEP === 0;
        const rad = (deg * Math.PI) / 180;
        const cosA = Math.cos(rad);
        const sinA = Math.sin(rad);

        const innerR = RIM_INNER_RADIUS;
        const outerR = isMajorTick ? RIM_OUTER_RADIUS : (RIM_INNER_RADIUS + RIM_OUTER_RADIUS) / 2;

        const x1 = cosA * innerR;
        const y1 = sinA * innerR;
        const x2 = cosA * outerR;
        const y2 = sinA * outerR;

        vertex.SetPosition(xCalc.getCoordinate(x1), yCalc.getCoordinate(y1));
        vertices.push_back(vertex);
        vertex.SetPosition(xCalc.getCoordinate(x2), yCalc.getCoordinate(y2));
        vertices.push_back(vertex);

        if (isMajorTick) {
            // Convert to standard ∠Γ convention: 0° = right, CCW positive, range ±180°
            const labelAngle = deg > 180 ? deg - 360 : deg;
            const lx = xCalc.getCoordinate(cosA * RIM_LABEL_RADIUS);
            const ly = yCalc.getCoordinate(sinA * RIM_LABEL_RADIUS);
            drawLabel(`${labelAngle}°`, lx, ly, deg);
        }
    }

    if (vertices.size() > 0) {
        renderContext.drawLinesNative(vertices, majorPen, ELineDrawMode.DiscontinuousLine, clipRect, leftPad, topPad);
    }
}
