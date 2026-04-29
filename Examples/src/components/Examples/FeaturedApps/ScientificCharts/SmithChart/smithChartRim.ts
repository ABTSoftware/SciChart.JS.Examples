import { TSciChart, Rect } from "scichart";
import { WebGlRenderContext2D, ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SCRTPen } from "scichart/types/TSciChart";
import { getVectorColorVertex, getVertex } from "scichart/Charting/Visuals/Helpers/NativeObject";

export const DEFAULT_RIM_TICK_SIZE = 8; // pixels — major tick length
export const DEFAULT_RIM_LABEL_OFFSET = 2; // pixels — gap from tick tip to label anchor
const DEFAULT_RIM_MAJOR_TICK_STEP = 30; // degrees
const DEFAULT_RIM_MINOR_TICK_STEP = 10; // degrees

/**
 * Angular spacing and label-gap configuration for the angle-of-Γ rim ring.
 *
 * Inner/outer radii are not configurable here — they are derived at render time
 * from the rim-line stroke thickness and the tick-line tickSize so ticks always
 * sit flush against the outer edge of the unit-circle boundary.
 *
 * majorTickStep must be an integer multiple of minorTickStep.
 */
export type RimConfig = {
    /** Angular spacing in degrees between major (labelled) ticks. Default 30. */
    majorTickStep?: number;
    /** Angular spacing in degrees between minor ticks. Default 10. */
    minorTickStep?: number;
    /**
     * Pixel gap between the outer tip of a major tick and the label anchor.
     * Must be > 0; values ≤ 0 are clamped to 1. Default 2.
     */
    labelOffset?: number;
};

/**
 * Draws angle-of-Γ tick marks around the rim (just outside the unit circle).
 * Called from SmithChartResistanceAxis.drawGridLines on the major pass.
 * Labels are emitted via the drawLabel callback so the axis renderer can draw
 * them using its own text-rendering pipeline.
 *
 * @param tickSizePx        Major tick length in pixels; minor ticks use half.
 * @param rimLineHalfThicknessPx  Half the rendered stroke-width of the unit-circle
 *   line, so tick starts are flush with its outer edge (pass 0 if no rim line).
 */
export function drawRimTicks(
    renderContext: WebGlRenderContext2D,
    xCalc: any,
    yCalc: any,
    wasmContext: TSciChart,
    pen: SCRTPen,
    clipRect: Rect,
    leftPad: number,
    topPad: number,
    config: RimConfig,
    tickSizePx: number,
    rimLineHalfThicknessPx: number,
    drawLabel: (text: string, px: number, py: number, angleDeg: number) => void
): void {
    const majorStep = config.majorTickStep ?? DEFAULT_RIM_MAJOR_TICK_STEP;
    const minorStep = config.minorTickStep ?? DEFAULT_RIM_MINOR_TICK_STEP;
    const labelOffsetPx = Math.max(1, config.labelOffset ?? DEFAULT_RIM_LABEL_OFFSET);

    // Convert pixel measurements to data units at the current zoom level.
    // getCoordWidth(1) = pixels per 1 data unit on the x axis.
    const pxPerDataUnit = Math.abs(xCalc.getCoordWidth(1));
    const innerR = 1 + rimLineHalfThicknessPx / pxPerDataUnit;
    const majorOuterR = innerR + tickSizePx / pxPerDataUnit;
    const minorOuterR = innerR + tickSizePx / 2 / pxPerDataUnit;
    const labelR = majorOuterR + labelOffsetPx / pxPerDataUnit;

    const vertices = getVectorColorVertex(wasmContext);
    const vertex = getVertex(wasmContext, 0, 0);

    for (let deg = 0; deg < 360; deg += minorStep) {
        const isMajorTick = deg % majorStep === 0;
        const rad = (deg * Math.PI) / 180;
        const cosA = Math.cos(rad);
        const sinA = Math.sin(rad);

        const tickOuterR = isMajorTick ? majorOuterR : minorOuterR;

        vertex.SetPosition(xCalc.getCoordinate(cosA * innerR), yCalc.getCoordinate(sinA * innerR));
        vertices.push_back(vertex);
        vertex.SetPosition(xCalc.getCoordinate(cosA * tickOuterR), yCalc.getCoordinate(sinA * tickOuterR));
        vertices.push_back(vertex);

        if (isMajorTick) {
            // Convert to standard ∠Γ convention: 0° = right, CCW positive, range ±180°
            const labelAngle = deg > 180 ? deg - 360 : deg;
            const lx = xCalc.getCoordinate(cosA * labelR);
            const ly = yCalc.getCoordinate(sinA * labelR);
            drawLabel(`${labelAngle}°`, lx, ly, deg);
        }
    }

    if (vertices.size() > 0) {
        renderContext.drawLinesNative(vertices, pen, ELineDrawMode.DiscontinuousLine, clipRect, leftPad, topPad);
    }
}
