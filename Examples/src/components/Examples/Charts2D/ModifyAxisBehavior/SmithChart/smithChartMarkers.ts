import {
    SciChartSurface,
    TSciChart,
    CustomAnnotation,
    LineAnnotation,
    TextAnnotation,
    XyDataSeries,
    FastLineRenderableSeries,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ChartModifierBase2D,
    ModifierMouseArgs,
    EExecuteOn,
} from "scichart";
import { GammaPoint, SmithState, SmithAction, Marker } from "./useSmithChart";

export type MarkerReadout = {
    gammaMag: number;
    gammaAngleDeg: number;
    zr: number;
    zx: number;
    gy: number;
    by: number;
    vswr: number;
    returnLoss: number;
    mismatchLoss: number;
    q: number;
    wtg: number;
    wtl: number;
};

export function computeReadouts(gamma: GammaPoint): MarkerReadout {
    const { re, im } = gamma;
    const gammaMag = Math.sqrt(re * re + im * im);
    const gammaAngleDeg = (Math.atan2(im, re) * 180) / Math.PI;

    // Z = (1+Γ)/(1−Γ)
    const denom = (1 - re) * (1 - re) + im * im;
    const zr = denom > 1e-10 ? (1 - re * re - im * im) / denom : Infinity;
    const zx = denom > 1e-10 ? (2 * im) / denom : Infinity;

    // Y = 1/Z
    const zMagSq = zr * zr + zx * zx;
    const gy = zMagSq > 1e-10 ? zr / zMagSq : Infinity;
    const by = zMagSq > 1e-10 ? -zx / zMagSq : Infinity;

    const vswr = gammaMag < 1 - 1e-10 ? (1 + gammaMag) / (1 - gammaMag) : Infinity;
    const returnLoss = gammaMag > 1e-10 ? -20 * Math.log10(gammaMag) : Infinity;
    const mismatchLoss = gammaMag < 1 - 1e-10 ? -10 * Math.log10(1 - gammaMag * gammaMag) : Infinity;
    const q = isFinite(zr) && zr > 1e-10 ? Math.abs(zx) / zr : Infinity;

    // WTG: (π − ∠Γ_rad) / (4π) mod 0.5
    const gammaAngleRad = Math.atan2(im, re);
    let wtg = ((Math.PI - gammaAngleRad) / (4 * Math.PI)) % 0.5;
    if (wtg < 0) wtg += 0.5;
    const wtl = 0.5 - wtg;

    return {
        gammaMag,
        gammaAngleDeg,
        zr,
        zx,
        gy,
        by,
        vswr,
        returnLoss,
        mismatchLoss,
        q,
        wtg,
        wtl,
    };
}

// ── Highlight arc helpers (also used by drawExample.ts) ───────────────────────

export function populateRCircle(ds: XyDataSeries, r: number) {
    ds.clear();
    if (!isFinite(r) || r < 0) return;
    const cx = r / (1 + r);
    const rad = 1 / (1 + r);
    const n = 200;
    for (let i = 0; i <= n; i++) {
        const angle = (i / n) * 2 * Math.PI;
        ds.append(cx + rad * Math.cos(angle), rad * Math.sin(angle));
    }
}

export function populateXArc(ds: XyDataSeries, xVal: number) {
    ds.clear();
    if (!isFinite(xVal)) return;

    if (Math.abs(xVal) < 0.001) {
        ds.append(-1, 0);
        ds.append(1, 0);
        return;
    }

    const absX = Math.abs(xVal);
    const isPos = xVal > 0;
    const radius = 1 / absX;
    const cx = 1;
    const cy = isPos ? radius : -radius;

    const xv2 = absX * absX;
    const xInt = (xv2 - 1) / (1 + xv2);
    const yInt = isPos ? (2 * absX) / (1 + xv2) : (-2 * absX) / (1 + xv2);

    const thetaOther = Math.atan2(yInt - cy, xInt - cx);
    const thetaOrigin = isPos ? -Math.PI / 2 : Math.PI / 2;

    let startAngle: number;
    let endAngle: number;

    if (isPos) {
        startAngle = thetaOther;
        endAngle = thetaOrigin;
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    } else {
        startAngle = thetaOrigin;
        endAngle = thetaOther;
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    }

    const n = 200;
    for (let i = 0; i <= n; i++) {
        const angle = startAngle + (i / n) * (endAngle - startAngle);
        ds.append(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
}

export function populateCircle(ds: XyDataSeries, cx: number, cy: number, radius: number) {
    ds.clear();
    if (radius < 0.001) return;
    const n = 200;
    for (let i = 0; i <= n; i++) {
        const angle = (i / n) * 2 * Math.PI;
        ds.append(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
}

// ── Marker colours ────────────────────────────────────────────────────────────

export const MARKER_COLOURS = ["#FF4444", "#44AAFF", "#FFAA00", "#44FF88", "#FF44CC", "#88FF44"];

// ── Annotation IDs helpers ────────────────────────────────────────────────────

function dotAnnotationId(markerId: string) {
    return `dot-${markerId}`;
}

function spokeLineId(markerId: string) {
    return `spoke-line-${markerId}`;
}

function spokeTextId(markerId: string) {
    return `spoke-text-${markerId}`;
}

// ── CustomAnnotation SVG for a coloured dot ───────────────────────────────────

function makeDotSvg(color: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14">
  <circle cx="7" cy="7" r="5" fill="${color}" stroke="#ffffff" stroke-width="2"/>
</svg>`;
}

// ── SmithClickModifier ────────────────────────────────────────────────────────

class SmithClickModifier extends ChartModifierBase2D {
    readonly type = "SmithClickModifier";

    private dispatch: ((a: SmithAction) => void) | null = null;
    private markerPositions: Map<string, { re: number; im: number }> = new Map();
    private dragTargetId: string | null = null;

    setDispatch(d: (a: SmithAction) => void) {
        this.dispatch = d;
    }

    setMarkerPositions(positions: Map<string, { re: number; im: number }>) {
        this.markerPositions = positions;
    }

    modifierMouseDown(args: ModifierMouseArgs) {
        super.modifierMouseDown(args);
        this.dragTargetId = null; // reset any stale drag from missed mouseup
        if (!this.checkExecuteConditions(args).isPrimary) return;

        const { re, im } = this.pixelToData(args.mousePoint.x, args.mousePoint.y);

        // Hit-test existing markers (12 px radius)
        const hitId = this.hitTestMarkers(args.mousePoint.x, args.mousePoint.y);
        if (hitId !== null) {
            this.dragTargetId = hitId;
            this.dispatch?.({ type: "SET_ACTIVE_MARKER", id: hitId });
            args.handled = true;
            return;
        }

        // Click inside unit circle → add marker
        if (re * re + im * im <= 1) {
            this.dispatch?.({ type: "ADD_MARKER", gamma: { re, im } });
            args.handled = true;
        }
    }

    modifierMouseMove(args: ModifierMouseArgs) {
        super.modifierMouseMove(args);
        if (this.dragTargetId !== null) {
            let { re, im } = this.pixelToData(args.mousePoint.x, args.mousePoint.y);
            // Clamp to unit circle
            const mag = Math.sqrt(re * re + im * im);
            if (mag > 1) {
                re /= mag;
                im /= mag;
            }
            this.dispatch?.({ type: "MOVE_MARKER", id: this.dragTargetId, gamma: { re, im } });
            args.handled = true;
        }
    }

    modifierMouseUp(args: ModifierMouseArgs) {
        super.modifierMouseUp(args);
        this.dragTargetId = null;
    }

    private pixelToData(px: number, py: number): { re: number; im: number } {
        const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const yCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();
        return { re: xCalc.getDataValue(px), im: yCalc.getDataValue(py) };
    }

    private hitTestMarkers(px: number, py: number): string | null {
        const RADIUS_PX = 12;
        for (const [id, pos] of this.markerPositions) {
            const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
            const yCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();
            const sx = xCalc.getCoordinate(pos.re);
            const sy = yCalc.getCoordinate(pos.im);
            const dx = px - sx;
            const dy = py - sy;
            if (dx * dx + dy * dy <= RADIUS_PX * RADIUS_PX) {
                return id;
            }
        }
        return null;
    }
}

// ── SmithMarkersAdapter ───────────────────────────────────────────────────────

export class SmithMarkersAdapter {
    private surface: SciChartSurface;
    private wasmContext: TSciChart;
    private modifier: SmithClickModifier;

    private rCircleDS: XyDataSeries;
    private xArcDS: XyDataSeries;
    private gammaCircleDS: XyDataSeries;

    // Track annotation IDs currently on the chart
    private activeAnnotationIds = new Set<string>();

    constructor(surface: SciChartSurface, wasmContext: TSciChart) {
        this.surface = surface;
        this.wasmContext = wasmContext;

        // ── Highlight series ──────────────────────────────────────────────────
        this.rCircleDS = new XyDataSeries(wasmContext);
        surface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: this.rCircleDS,
                stroke: "#FF4444",
                strokeThickness: 2.5,
            })
        );

        this.xArcDS = new XyDataSeries(wasmContext);
        surface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: this.xArcDS,
                stroke: "#4488FF",
                strokeThickness: 2.5,
            })
        );

        this.gammaCircleDS = new XyDataSeries(wasmContext);
        surface.renderableSeries.add(
            new FastLineRenderableSeries(wasmContext, {
                dataSeries: this.gammaCircleDS,
                stroke: "#44CC44",
                strokeThickness: 1.5,
                strokeDashArray: [5, 5],
            })
        );

        // ── Modifier ──────────────────────────────────────────────────────────
        this.modifier = new SmithClickModifier({
            executeCondition: { button: EExecuteOn.MouseLeftButton },
        });
        surface.chartModifiers.add(this.modifier);
    }

    setDispatch(d: (a: SmithAction) => void) {
        this.modifier.setDispatch(d);
    }

    update(state: SmithState) {
        this.syncMarkerAnnotations(state.markers);
        this.updateHighlights(state);
    }

    // ── Sync annotations ──────────────────────────────────────────────────────

    private syncMarkerAnnotations(markers: Marker[]) {
        const desiredIds = new Set<string>();
        const markerPositions = new Map<string, { re: number; im: number }>();

        for (let i = 0; i < markers.length; i++) {
            const marker = markers[i];
            const color = MARKER_COLOURS[i % MARKER_COLOURS.length];
            markerPositions.set(marker.id, marker.gamma);

            // Dot
            const dotId = dotAnnotationId(marker.id);
            desiredIds.add(dotId);
            if (!this.activeAnnotationIds.has(dotId)) {
                this.surface.annotations.add(this.makeDotAnnotation(dotId, marker, color));
                this.activeAnnotationIds.add(dotId);
            } else {
                this.moveDotAnnotation(dotId, marker);
            }

            // Spoke line + text
            const lineId = spokeLineId(marker.id);
            const textId = spokeTextId(marker.id);
            desiredIds.add(lineId);
            desiredIds.add(textId);
            if (!this.activeAnnotationIds.has(lineId)) {
                this.surface.annotations.add(this.makeSpokeLineAnnotation(lineId, marker, color));
                this.activeAnnotationIds.add(lineId);
            } else {
                this.moveSpokeLineAnnotation(lineId, marker);
            }
            if (!this.activeAnnotationIds.has(textId)) {
                this.surface.annotations.add(this.makeSpokeTextAnnotation(textId, marker, color));
                this.activeAnnotationIds.add(textId);
            } else {
                this.moveSpokeTextAnnotation(textId, marker);
            }
        }

        // Remove stale annotations
        for (const id of [...this.activeAnnotationIds]) {
            if (!desiredIds.has(id)) {
                const ann = this.surface.annotations.getById(id);
                if (ann) {
                    this.surface.annotations.remove(ann);
                }
                this.activeAnnotationIds.delete(id);
            }
        }

        this.modifier.setMarkerPositions(markerPositions);
    }

    private makeDotAnnotation(id: string, marker: Marker, color: string): CustomAnnotation {
        return new CustomAnnotation({
            id,
            x1: marker.gamma.re,
            y1: marker.gamma.im,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            svgString: makeDotSvg(color),
        });
    }

    private moveDotAnnotation(id: string, marker: Marker) {
        const ann = this.surface.annotations.getById(id);
        if (ann) {
            ann.x1 = marker.gamma.re;
            ann.y1 = marker.gamma.im;
        }
    }

    private spokeRimPoint(marker: Marker): { rimRe: number; rimIm: number; theta: number } {
        const theta = Math.atan2(marker.gamma.im, marker.gamma.re);
        return { rimRe: Math.cos(theta) * 1.08, rimIm: Math.sin(theta) * 1.08, theta };
    }

    private makeSpokeLineAnnotation(id: string, marker: Marker, color: string): LineAnnotation {
        const { rimRe, rimIm } = this.spokeRimPoint(marker);
        return new LineAnnotation({
            id,
            x1: marker.gamma.re,
            y1: marker.gamma.im,
            x2: rimRe,
            y2: rimIm,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            stroke: color,
            strokeThickness: 1,
        });
    }

    private moveSpokeLineAnnotation(id: string, marker: Marker) {
        const ann = this.surface.annotations.getById(id) as LineAnnotation | undefined;
        if (ann) {
            const { rimRe, rimIm } = this.spokeRimPoint(marker);
            ann.x1 = marker.gamma.re;
            ann.y1 = marker.gamma.im;
            ann.x2 = rimRe;
            ann.y2 = rimIm;
        }
    }

    private spokeText(marker: Marker): string {
        const angleDeg = (Math.atan2(marker.gamma.im, marker.gamma.re) * 180) / Math.PI;
        return `${marker.label} ${angleDeg.toFixed(1)}°`;
    }

    private makeSpokeTextAnnotation(id: string, marker: Marker, color: string): TextAnnotation {
        const { rimRe, rimIm } = this.spokeRimPoint(marker);
        const labelRe = Math.cos(Math.atan2(rimIm, rimRe)) * 1.14;
        const labelIm = Math.sin(Math.atan2(rimIm, rimRe)) * 1.14;
        return new TextAnnotation({
            id,
            x1: labelRe,
            y1: labelIm,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            text: this.spokeText(marker),
            fontSize: 10,
            fontFamily: "monospace",
            textColor: color,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
        });
    }

    private moveSpokeTextAnnotation(id: string, marker: Marker) {
        const ann = this.surface.annotations.getById(id) as TextAnnotation | undefined;
        if (ann) {
            const theta = Math.atan2(marker.gamma.im, marker.gamma.re);
            ann.x1 = Math.cos(theta) * 1.14;
            ann.y1 = Math.sin(theta) * 1.14;
            ann.text = this.spokeText(marker);
        }
    }

    // ── Update highlight arcs ─────────────────────────────────────────────────

    private updateHighlights(state: SmithState) {
        if (!state.activeMarkerId) {
            this.rCircleDS.clear();
            this.xArcDS.clear();
            this.gammaCircleDS.clear();
            return;
        }
        const active = state.markers.find((m) => m.id === state.activeMarkerId);
        if (!active) {
            this.rCircleDS.clear();
            this.xArcDS.clear();
            this.gammaCircleDS.clear();
            return;
        }

        const { re, im } = active.gamma;
        const denom = (1 - re) * (1 - re) + im * im;
        const r = denom > 1e-10 ? (1 - re * re - im * im) / denom : Infinity;
        const x = denom > 1e-10 ? (2 * im) / denom : Infinity;
        const gammaMag = Math.sqrt(re * re + im * im);

        populateRCircle(this.rCircleDS, r);
        populateXArc(this.xArcDS, x);
        populateCircle(this.gammaCircleDS, 0, 0, gammaMag);
    }
}
