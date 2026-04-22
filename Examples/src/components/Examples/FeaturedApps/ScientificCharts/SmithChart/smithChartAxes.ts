// ── Pure math helpers (exported for testing) ──────────────────────────────────

/** Returns the data-space centre and radius of the constant-R circle. */
export function rCircleParams(r: number): { cx: number; cy: number; rad: number } {
    return { cx: r / (1 + r), cy: 0, rad: 1 / (1 + r) };
}

/** Returns the data-space centre and radius of the constant-X arc circle. */
export function xArcCircleCenter(absX: number, isPositive: boolean): { cx: number; cy: number; rad: number } {
    const rad = 1 / absX;
    return { cx: 1, cy: isPositive ? rad : -rad, rad };
}

/**
 * Returns start/end angles (radians, CCW in Y-up space) for the
 * constant-X arc clipped to the unit circle.
 * The arc runs from the unit-circle intersection to the point (1, 0).
 */
export function xArcAngles(absX: number, isPositive: boolean): { startAngle: number; endAngle: number } {
    const xv2 = absX * absX;
    const xInt = (xv2 - 1) / (1 + xv2);
    const yInt = isPositive ? (2 * absX) / (1 + xv2) : -(2 * absX) / (1 + xv2);
    const cy = isPositive ? 1 / absX : -1 / absX;

    const thetaToIntersection = Math.atan2(yInt - cy, xInt - 1);
    const thetaToOrigin = isPositive ? -Math.PI / 2 : Math.PI / 2;

    let startAngle: number;
    let endAngle: number;

    if (isPositive) {
        startAngle = thetaToIntersection;
        endAngle = thetaToOrigin;
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    } else {
        startAngle = thetaToOrigin;
        endAngle = thetaToIntersection;
        while (endAngle <= startAngle) endAngle += 2 * Math.PI;
    }

    return { startAngle, endAngle };
}

import {
    NumericAxis,
    TSciChart,
    Rect,
    DpiHelper,
    TGridLineStyle,
    TTextStyle,
    TTickLineStyle,
    deleteSafe,
} from "scichart";
import { Pen2DCache } from "scichart/Charting/Drawing/Pen2DCache";
import { INumericAxisOptions } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurfaceBase } from "scichart/Charting/Visuals/SciChartSurfaceBase";
import { drawRimTicks, RimConfig, DEFAULT_RIM_TICK_SIZE } from "./smithChartRim";
import { TickProvider } from "scichart/Charting/Numerics/TickProviders/TickProvider";
import { NumberRange } from "scichart/Core/NumberRange";
import { SmithGridCalculator } from "./smithChartGridCalculator";
import { WebGlRenderContext2D, ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { SCRTPen } from "scichart/types/TSciChart";
import {
    getArcParams,
    getVectorArcVertex,
    getArcVertex,
    getVectorColorVertex,
    getVertex,
    getTextBounds,
    getVector4,
} from "scichart/Charting/Visuals/Helpers/NativeObject";
import { AxisRenderer } from "scichart/Charting/Visuals/Axis/AxisRenderer";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { convertMultiLineAlignment } from "scichart/types/TextPosition";

// ── Tick Providers ────────────────────────────────────────────────────────────

export class StaticSmithResistanceTickProvider {
    private readonly _major = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
    private readonly _minor: number[] = [
        /* tier 1 – clip at X=5 */
        0.1, 5, 0.3, 5, 0.4, 5, 0.6, 5, 0.7, 5, 0.8, 5, 0.9, 5, 1.2, 5, 1.4, 5, 1.6, 5, 1.8, 5, 3, 5, 4, 5,
        /* tier 2 – clip at X=2 */
        0.05, 2, 0.15, 2, 0.25, 2, 0.35, 2, 0.45, 2, 0.55, 2, 0.65, 2, 0.75, 2, 0.85, 2, 0.95, 2, 1.1, 2, 1.3, 2, 1.5,
        2, 1.7, 2, 1.9, 2, 2.5, 2 /* tier 3 – clip at X=1 */, 0.025, 1, 0.075, 1, 0.125, 1, 0.175, 1, 0.225, 1, 0.275,
        1, 0.325, 1, 0.375, 1, 0.425, 1, 0.475, 1, 0.525, 1, 0.575, 1, 0.625, 1, 0.675, 1, 0.725, 1, 0.775, 1, 0.825, 1,
        0.875, 1, 0.925, 1, 0.975, 1, 1.25, 1,
    ];
    constructor(_opts: any) {}
    getMajorTicks(_a: number, _b: number, _r: any): number[] {
        return [...this._major];
    }
    getMinorTicks(_a: number, _b: number, _r: any): number[] {
        return [...this._minor];
    }
    attachedToAxis(_axis: any): void {}
    detachedFromAxis(): void {}
}

export class StaticSmithReactanceTickProvider {
    private readonly _major = [0.2, 0.5, 1, 2, 5, 10, 20, 50];
    private readonly _minor: number[] = [
        /* tier 1 – clip at R=5 */
        0.1, 5, 0.3, 5, 0.4, 5, 0.6, 5, 0.7, 5, 0.8, 5, 0.9, 5, 1.2, 5, 1.4, 5, 1.6, 5, 1.8, 5, 3, 5, 4, 5,
        /* tier 2 – clip at R=2 */
        0.05, 2, 0.15, 2, 0.25, 2, 0.35, 2, 0.45, 2, 0.55, 2, 0.65, 2, 0.75, 2, 0.85, 2, 0.95, 2, 1.1, 2, 1.3, 2, 1.5,
        2, 1.7, 2, 1.9, 2, 2.5, 2 /* tier 3 – clip at R=1 */, 0.025, 1, 0.075, 1, 0.125, 1, 0.175, 1, 0.225, 1, 0.275,
        1, 0.325, 1, 0.375, 1, 0.425, 1, 0.475, 1, 0.525, 1, 0.575, 1, 0.625, 1, 0.675, 1, 0.725, 1, 0.775, 1, 0.825, 1,
        0.875, 1, 0.925, 1, 0.975, 1, 1.25, 1,
    ];
    constructor(_opts: any) {}
    getMajorTicks(_a: number, _b: number, _r: any): number[] {
        return [...this._major];
    }
    getMinorTicks(_a: number, _b: number, _r: any): number[] {
        return [...this._minor];
    }
    attachedToAxis(_axis: any): void {}
    detachedFromAxis(): void {}
}

/**
 * Minor ticks are encoded as flat pairs: [value, clipOtherValue, value, clipOtherValue, ...].
 *
 * The arc for a given `value` stops at the point where it intersects the OTHER family's arc
 * at `clipOtherValue`.  The gap distance is:
 *
 *   D = 2 / sqrt((R+1)² + X²)
 *
 * where (R, X) is the intersection of the constant-R circle and constant-X arc.
 * For a resistance-axis minor arc at R=r clipped to X=xClip:  D = 2/sqrt((r+1)²+xClip²)
 * For a reactance-axis minor arc at X=x clipped to R=rClip:   D = 2/sqrt((rClip+1)²+x²)
 *
 * Multiple tiers are interleaved in the same array using different clipOtherValue settings.
 * A smaller clipOtherValue → larger D → shorter arc → only visible for the bigger circles
 * (left side of chart), naturally creating denser coverage there.
 */
const FALLBACK_MAJOR = [0.2, 0.5, 1, 2, 5, 10, 20, 50];

export class SmithResistanceTickProvider extends TickProvider {
    constructor(_wasmContext: TSciChart) {
        super();
    }

    getMajorTicks(_minorDelta: number, _majorDelta: number, _visibleRange: NumberRange): number[] {
        return this._runCompute()?.rMajor ?? FALLBACK_MAJOR;
    }

    getMinorTicks(_minorDelta: number, _majorDelta: number, _visibleRange: NumberRange): number[] {
        return this._runCompute()?.rMinor ?? [];
    }

    private _runCompute(): SmithGridCalculator | null {
        const rAxis = this.parentAxis as SmithChartResistanceAxis | undefined;
        if (!rAxis?.gridCalculator) return null;
        // parentSurface is on AxisBase2D, not AxisCore (TickProvider's parentAxis type) — cast required
        const surface = (rAxis as any).parentSurface;
        if (!surface) return null;
        const xRange: NumberRange = rAxis.visibleRange;
        const yAxis = surface.yAxes?.get(0);
        const yRange: NumberRange = yAxis?.visibleRange ?? xRange;
        const xCalc = rAxis.getCurrentCoordinateCalculator();
        const yCalc = yAxis?.getCurrentCoordinateCalculator() ?? xCalc;
        rAxis.gridCalculator.compute(xRange, yRange, xCalc, yCalc);
        return rAxis.gridCalculator;
    }
}

export class SmithReactanceTickProvider extends TickProvider {
    constructor(_wasmContext: TSciChart) {
        super();
    }

    getMajorTicks(_minorDelta: number, _majorDelta: number, _visibleRange: NumberRange): number[] {
        return this._runCompute()?.xMajor ?? FALLBACK_MAJOR;
    }

    getMinorTicks(_minorDelta: number, _majorDelta: number, _visibleRange: NumberRange): number[] {
        return this._runCompute()?.xMinor ?? [];
    }

    private _runCompute(): SmithGridCalculator | null {
        const yAxis = this.parentAxis;
        if (!yAxis) return null;
        // parentSurface is on AxisBase2D, not AxisCore (TickProvider's parentAxis type) — cast required
        const surface = (yAxis as any).parentSurface;
        if (!surface) return null;
        // Z resistance axis is always at xAxes[0] per registration order in drawExample.ts
        const rAxis = surface.xAxes?.get(0) as SmithChartResistanceAxis | undefined;
        if (!rAxis?.gridCalculator) return null;
        const xRange: NumberRange = rAxis.visibleRange;
        const yRange: NumberRange = yAxis.visibleRange;
        const xCalc = rAxis.getCurrentCoordinateCalculator();
        const yCalc = yAxis.getCurrentCoordinateCalculator();
        rAxis.gridCalculator.compute(xRange, yRange, xCalc, yCalc);
        return rAxis.gridCalculator;
    }
}

// ── SmithChartAxisRenderer ────────────────────────────────────────────────────

/**
 * Draws Smith chart axis labels directly onto the series view rect.
 * Supports both the native-text (DrawStringAdvanced) and texture (drawTexture)
 * rendering paths, matching the pattern used by PolarAxisRenderer.
 */
export class SmithChartAxisRenderer extends AxisRenderer {
    private readonly _isResistanceAxis: boolean;
    private readonly _isAdmittance: boolean;

    constructor(wasmContext: TSciChart, isResistanceAxis: boolean, isAdmittance = false) {
        super(wasmContext);
        this._isResistanceAxis = isResistanceAxis;
        this._isAdmittance = isAdmittance;
    }

    /** No axis margin needed — labels are drawn inside the series view rect. */
    public override measure(
        _isHorizontalAxis: boolean,
        _labelStyle: any,
        _majorTickLabels: string[],
        _ticksSize: number,
        _labelProvider: any,
        _drawLabels: boolean,
        _drawTicks: boolean,
        _labelInfos?: any[]
    ): void {
        (this as any).desiredHeight = 0;
        (this as any).desiredWidth = 0;
        (this as any).desiredTicksSize = 0;
    }

    public override drawLabels(
        renderContext: WebGlRenderContext2D,
        _axisAlignment: any,
        _isInnerAxis: any,
        _tickLabels: any,
        _tickCoords: any,
        _axisOffset: any,
        labelStyle: any,
        _isVerticalChart: any,
        _isFlippedCoordinates: any,
        labelProvider: any,
        _labelInfos?: any
    ): void {
        const axis = (this as any).parentAxis;
        const surface = axis?.parentSurface;
        if (!surface) return;

        const svr: Rect = surface.seriesViewRect;
        renderContext.resetAndClip(svr);

        const xCalc = surface.xAxes.get(0).getCurrentCoordinateCalculator();
        const yCalc = surface.yAxes.get(0).getCurrentCoordinateCalculator();

        // ── Set up rendering paths (mirrors PolarAxisRenderer pattern) ─────────
        const { multilineAlignment } = labelStyle;
        const textColor = parseColorToUIntArgb(labelStyle.color);
        const wasmCtx = (this as any).webAssemblyContext;

        const nativeFont = labelProvider.useNativeText ? renderContext.getFont(labelStyle, true) : null;
        const textBounds = nativeFont ? getTextBounds(wasmCtx) : null;
        // convertMultiLineAlignment called unconditionally, as in PolarAxisRenderer
        const mlaNative = convertMultiLineAlignment(multilineAlignment, wasmCtx);
        const nativeLineSpacing = labelProvider.lineSpacing;
        const lineHeight = this.calculateLineHightForNativeFont(nativeFont, textBounds);

        const drawLabel = (text: string, px: number, py: number, outwardAngle: number) => {
            try {
                if (nativeFont) {
                    nativeFont.CalculateStringBounds(text, textBounds, nativeLineSpacing);
                    const w = textBounds.m_fWidth;
                    const h = textBounds.m_fHeight;
                    const { dx, dy } = SmithChartAxisRenderer._positionLabel(w, h, outwardAngle);
                    const tx = Math.round(px + svr.left + dx);
                    const ty = Math.round(py + svr.top + dy);
                    nativeFont.DrawStringAdvanced(
                        text,
                        textColor,
                        tx,
                        ty + lineHeight,
                        getVector4(wasmCtx, tx, ty + lineHeight, 0, 0),
                        mlaNative,
                        nativeLineSpacing
                    );
                } else {
                    const {
                        bitmapTexture,
                        textureWidth: w,
                        textureHeight: h,
                    } = labelProvider.getCachedLabelTexture(text, this.textureManager, labelStyle);
                    if (!bitmapTexture) return;
                    const { dx, dy } = SmithChartAxisRenderer._positionLabel(w, h, outwardAngle);
                    const tx = Math.round(px + svr.left + dx);
                    const ty = Math.round(py + svr.top + dy);
                    renderContext.drawTexture(bitmapTexture, tx, ty, w, h);
                    if (!labelProvider.useCache) bitmapTexture.delete();
                }
            } catch (_err) {
                // WebGL context lost — clear label cache so it rebuilds next frame
                labelProvider.delete?.();
            }
        };

        // Call getMajorTicks directly rather than using the ticks already computed
        // by AxisBase2D.getTicks(). AxisBase2D filters ticks to visibleRange (e.g. [-1.15, 1.15]),
        // which discards most Smith chart R/X values (e.g. 2, 5, 10, 20, 50). The renderer
        // fetches them unfiltered here so all circle/arc labels are placed correctly.
        const tp = axis?.tickProvider as any;
        const majorTicks: number[] = tp?.getMajorTicks(0, 0, null) ?? [];

        if (this._isResistanceAxis) {
            if (this._isAdmittance) {
                // Admittance G-labels: G=0 at (1,0), G=g at ((1-g)/(1+g), 0)
                drawLabel("0", xCalc.getCoordinate(1), yCalc.getCoordinate(0), Math.PI);
                for (const g of majorTicks) {
                    drawLabel(
                        (labelProvider as any).formatLabel(g),
                        xCalc.getCoordinate((1 - g) / (1 + g)),
                        yCalc.getCoordinate(0),
                        Math.PI / 2
                    );
                }
                if (nativeFont) nativeFont.End();
                return;
            }

            const rAxis = axis as SmithChartResistanceAxis;
            if (rAxis.drawGridLabels !== false) {
                drawLabel("0", xCalc.getCoordinate(-1), yCalc.getCoordinate(0), Math.PI);
                for (const r of majorTicks) {
                    const { cx, rad } = rCircleParams(r);
                    drawLabel(
                        (labelProvider as any).formatLabel(r),
                        xCalc.getCoordinate(cx - rad),
                        yCalc.getCoordinate(0),
                        Math.PI / 2
                    );
                }
            }

            const sel = rAxis.selectedIntersection;
            if (sel !== null) {
                const x0 = sel.x;
                const xArcCy = 1 / x0;
                for (const rj of majorTicks) {
                    const denom = (rj + 1) ** 2 + x0 * x0;
                    const gr = (rj * rj + x0 * x0 - 1) / denom;
                    const gi = (2 * x0) / denom;
                    const angleRad = Math.atan2(gi - xArcCy, gr - 1);
                    drawLabel(
                        (labelProvider as any).formatLabel(rj),
                        xCalc.getCoordinate(gr),
                        yCalc.getCoordinate(gi),
                        angleRad
                    );
                }
            }

            // End main font batch before rim labels, which may use a different style.
            if (nativeFont) nativeFont.End();

            // Rim labels (angle-of-Γ ring) — use rimLabelStyle if set, else reuse labelStyle.
            const rimLabels = rAxis._pendingRimLabels ?? [];
            if (rimLabels.length > 0) {
                const rimStyle = rAxis.rimLabelStyle ? { ...labelStyle, ...rAxis.rimLabelStyle } : labelStyle;
                const rimTextColor = parseColorToUIntArgb(rimStyle.color);
                const rimFont = labelProvider.useNativeText ? renderContext.getFont(rimStyle, true) : null;
                const rimLineH = this.calculateLineHightForNativeFont(rimFont, textBounds);
                for (const lbl of rimLabels) {
                    const angleRad = (lbl.angleDeg * Math.PI) / 180;
                    try {
                        if (rimFont) {
                            rimFont.CalculateStringBounds(lbl.text, textBounds, nativeLineSpacing);
                            const w = textBounds.m_fWidth;
                            const h = textBounds.m_fHeight;
                            const { dx, dy } = SmithChartAxisRenderer._positionLabel(w, h, angleRad, 0);
                            const tx = Math.round(lbl.px + svr.left + dx);
                            const ty = Math.round(lbl.py + svr.top + dy);
                            rimFont.DrawStringAdvanced(
                                lbl.text,
                                rimTextColor,
                                tx,
                                ty + rimLineH,
                                getVector4(wasmCtx, tx, ty + rimLineH, 0, 0),
                                mlaNative,
                                nativeLineSpacing
                            );
                        } else {
                            const {
                                bitmapTexture,
                                textureWidth: w,
                                textureHeight: h,
                            } = labelProvider.getCachedLabelTexture(lbl.text, this.textureManager, rimStyle);
                            if (!bitmapTexture) continue;
                            const { dx, dy } = SmithChartAxisRenderer._positionLabel(w, h, angleRad, 0);
                            const tx = Math.round(lbl.px + svr.left + dx);
                            const ty = Math.round(lbl.py + svr.top + dy);
                            renderContext.drawTexture(bitmapTexture, tx, ty, w, h);
                            if (!labelProvider.useCache) bitmapTexture.delete();
                        }
                    } catch (_err) {
                        labelProvider.delete?.();
                    }
                }
                if (rimFont) rimFont.End();
            }

            return; // nativeFont already ended above
        } else {
            if (this._isAdmittance) {
                // B-arc labels at unit-circle intersection: ((1-b²)/(1+b²), ±2b/(1+b²))
                for (const b of majorTicks) {
                    const bv2 = b * b;
                    const lx = (1 - bv2) / (1 + bv2);
                    const ly = (2 * b) / (1 + bv2);
                    const label = (labelProvider as any).formatLabel(b);
                    drawLabel(`+${label}`, xCalc.getCoordinate(lx), yCalc.getCoordinate(ly), Math.atan2(ly, lx));
                    drawLabel(`-${label}`, xCalc.getCoordinate(lx), yCalc.getCoordinate(-ly), Math.atan2(-ly, lx));
                }
                if (nativeFont) nativeFont.End();
                return;
            }

            for (const x of majorTicks) {
                const xv2 = x * x;
                const lx = (xv2 - 1) / (1 + xv2);
                const ly = (2 * x) / (1 + xv2);
                const label = (labelProvider as any).formatLabel(x);
                drawLabel(`+${label}`, xCalc.getCoordinate(lx), yCalc.getCoordinate(ly), Math.atan2(ly, lx));
                drawLabel(`-${label}`, xCalc.getCoordinate(lx), yCalc.getCoordinate(-ly), Math.atan2(-ly, lx));
            }

            const rAxisForSel = surface?.xAxes?.get(0) as SmithChartResistanceAxis | undefined;
            const sel = rAxisForSel?.selectedIntersection ?? null;
            if (sel !== null) {
                const r0 = sel.r;
                const rCircleCx = r0 / (1 + r0);
                for (const xj of majorTicks) {
                    const denom = (r0 + 1) ** 2 + xj * xj;
                    const gr = (r0 * r0 + xj * xj - 1) / denom;
                    const gi_pos = (2 * xj) / denom;
                    const gi_neg = -gi_pos;
                    const text = (labelProvider as any).formatLabel(xj);
                    drawLabel(
                        `+${text}`,
                        xCalc.getCoordinate(gr),
                        yCalc.getCoordinate(gi_pos),
                        Math.atan2(gi_pos, gr - rCircleCx)
                    );
                    drawLabel(
                        `-${text}`,
                        xCalc.getCoordinate(gr),
                        yCalc.getCoordinate(gi_neg),
                        Math.atan2(gi_neg, gr - rCircleCx)
                    );
                }
            }
        }

        if (nativeFont) nativeFont.End();
    }

    private static _positionLabel(w: number, h: number, angleRad: number, gap = 4): { dx: number; dy: number } {
        const GAP = gap;
        const CARDINAL_DEG = 10;

        const aDeg = Math.round((angleRad * 180) / Math.PI);
        const absModDeg = Math.abs(aDeg) % 90;
        const isCardinal = absModDeg < CARDINAL_DEG || absModDeg > 90 - CARDINAL_DEG;
        const quadrant = ((((aDeg + CARDINAL_DEG) / 90) % 4) + 4) % 4;

        let dx = 0;
        let dy = 0;

        if (isCardinal) {
            if (quadrant < 1) {
                dy = -h / 2;
            } else if (quadrant < 2) {
                dx = -w / 2;
                dy = -h;
            } else if (quadrant < 3) {
                dx = -w;
                dy = -h / 2;
            } else {
                dx = -w / 2;
            }
        } else {
            if (Math.cos(angleRad) < 0) dx = -w;
            if (Math.sin(angleRad) > 0) dy = -h;
        }

        dx += GAP * Math.cos(angleRad);
        dy -= GAP * Math.sin(angleRad);

        return { dx, dy };
    }
}

// ── SmithChartResistanceAxis (X axis) — draws constant-R circles ──────────────

export interface ISmithChartResistanceAxisOptions extends INumericAxisOptions {
    rimMajorTickStep?: number;
    rimMinorTickStep?: number;
    rimLabelOffset?: number;
    rimLabelStyle?: TTextStyle;
    rimTickLineStyle?: TTickLineStyle;
    rimLineStyle?: TGridLineStyle;
}

export class SmithChartResistanceAxis extends NumericAxis {
    private sibling: SmithChartReactanceAxis | null = null;
    public _pendingRimLabels: { text: string; px: number; py: number; angleDeg: number }[] = [];
    /** Set by SmithMarkersAdapter to drive intersection labels. null = no active marker. */
    public selectedIntersection: { r: number; x: number } | null = null;
    /** Controls R/X grid labels independently of rim labels (rim always draws). */
    public drawGridLabels = true;
    public readonly gridCalculator = new SmithGridCalculator("impedance");
    public rimConfig: RimConfig;
    public rimLabelStyle?: TTextStyle;
    public rimTickLineStyle?: TTickLineStyle;
    public rimLineStyle?: TGridLineStyle;
    private _rimLinePenCache: Pen2DCache;
    private _rimTickLinePenCache: Pen2DCache;

    constructor(wasmContext: TSciChart, options?: ISmithChartResistanceAxisOptions) {
        super(wasmContext, {
            drawLabels: true,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorBands: false,
            zoomExtentsToInitialRange: true,
            ...options,
        });
        this.tickProvider = new SmithResistanceTickProvider(wasmContext);
        this.axisRenderer = new SmithChartAxisRenderer(wasmContext, true);
        this.rimConfig = {
            majorTickStep: options?.rimMajorTickStep,
            minorTickStep: options?.rimMinorTickStep,
            labelOffset: options?.rimLabelOffset,
        };
        this.rimLabelStyle = options?.rimLabelStyle;
        this.rimTickLineStyle = options?.rimTickLineStyle;
        this.rimLineStyle = options?.rimLineStyle;
        this._rimLinePenCache = new Pen2DCache(wasmContext);
        this._rimTickLinePenCache = new Pen2DCache(wasmContext);
    }

    override measure(): void {
        super.measure();
        this.sibling = (this.parentSurface?.yAxes?.get(0) as SmithChartReactanceAxis) ?? null;
    }

    public override delete(): void {
        this._rimLinePenCache = deleteSafe(this._rimLinePenCache);
        this._rimTickLinePenCache = deleteSafe(this._rimTickLinePenCache);
        super.delete();
    }

    protected override drawGridLines(
        renderContext: WebGlRenderContext2D,
        _tickCoords: number[],
        linesPen: SCRTPen,
        isMajor: boolean
    ): void {
        if (!this.sibling) return;

        const wasmContext = this.webAssemblyContext2D;
        const xCalc = this.getCurrentCoordinateCalculator();
        const yCalc = this.sibling.getCurrentCoordinateCalculator();
        // Use master canvas height so the y-flip matches the C++ matTransform.
        // viewportSize tracks the visible (target) canvas which shrinks on resize;
        // the master WebGL canvas only grows, and SCRTSetMainWindowSize uses its height.
        const vpHeight =
            SciChartSurfaceBase.domMasterCanvas?.height ?? this.parentSurface.renderSurface.viewportSize.height;
        const clipRect = Rect.intersect(this.parentSurface.clipRect, this.parentSurface.seriesViewRect);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;

        const aspectRatio = Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
        const tp = this.tickProvider as any;

        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        const drawArc = (r: number, gapDistance: number) => {
            const { cx, cy, rad } = rCircleParams(r);
            const sinHalfGap = gapDistance / (2 * rad);
            if (sinHalfGap >= 1) return;
            const arcGap = sinHalfGap > 0 ? 2 * Math.asin(sinHalfGap) : 0;
            const cx_px = xCalc.getCoordinate(cx);
            const cy_native = vpHeight - yCalc.getCoordinate(cy);
            const radius_px = Math.abs(xCalc.getCoordWidth(rad));
            const arcParams = getArcParams(
                wasmContext,
                cx_px,
                cy_native,
                arcGap,
                2 * Math.PI - arcGap,
                radius_px,
                0,
                1,
                aspectRatio,
                linesPen.m_fThickness
            );
            arc.MakeCircularArc(arcParams);
            vecArcs.push_back(arc);
        };

        if (isMajor) {
            for (const r of tp.getMajorTicks(0, 0, null) as number[]) {
                drawArc(r, 0); // full circles
            }
        } else {
            // Minor ticks are encoded as flat pairs [r, xClip, r, xClip, ...]
            const minor = tp.getMinorTicks(0, 0, null) as number[];
            for (let i = 0; i + 1 < minor.length; i += 2) {
                const r = minor[i];
                const xClip = minor[i + 1];
                drawArc(r, 2 / Math.sqrt((r + 1) * (r + 1) + xClip * xClip));
            }
        }

        if (vecArcs.size() > 0) {
            renderContext.drawArcs(vecArcs, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);
        }

        // Draw the horizontal real axis line once, on the major pass
        if (isMajor) {
            const vertices = getVectorColorVertex(wasmContext);
            const vertex = getVertex(wasmContext, 0, 0);

            vertex.SetPosition(xCalc.getCoordinate(-1), yCalc.getCoordinate(0));
            vertices.push_back(vertex);
            vertex.SetPosition(xCalc.getCoordinate(1), yCalc.getCoordinate(0));
            vertices.push_back(vertex);

            renderContext.drawLinesNative(
                vertices,
                linesPen,
                ELineDrawMode.DiscontinuousLine,
                clipRect,
                leftPad,
                topPad
            );

            // Unit circle as hardware arc (radius=1, centre=(0,0))
            const ucVec = getVectorArcVertex(wasmContext);
            const ucArc = getArcVertex(wasmContext);
            const ucx_px = xCalc.getCoordinate(0);
            const ucy_native = vpHeight - yCalc.getCoordinate(0);
            const urad_px = Math.abs(xCalc.getCoordWidth(1));
            let ucPenPre = linesPen;
            if (this.rimLineStyle) {
                const rs = this.rimLineStyle;
                ucPenPre = this.getPenForLines(
                    this._rimLinePenCache,
                    rs.color ?? this.majorGridLineStyle.color ?? "#aaaaaa",
                    rs.strokeThickness ?? this.majorGridLineStyle.strokeThickness ?? 2,
                    rs.strokeDashArray
                );
            }
            const ucThickness = this.rimLineStyle ? ucPenPre.m_fThickness : linesPen.m_fThickness * 2;
            const ucParams = getArcParams(
                wasmContext,
                ucx_px,
                ucy_native,
                0,
                2 * Math.PI,
                urad_px,
                0,
                1,
                aspectRatio,
                ucThickness
            );
            ucArc.MakeCircularArc(ucParams);
            ucVec.push_back(ucArc);
            renderContext.drawArcs(ucVec, 0, 0, 0, clipRect, ucPenPre, undefined, leftPad, topPad);

            // Angle-of-Γ rim ring ticks + labels
            this._pendingRimLabels = [];
            let rimPen = linesPen;
            if (this.rimTickLineStyle) {
                const rs = this.rimTickLineStyle;
                rimPen = this.getPenForLines(
                    this._rimTickLinePenCache,
                    rs.color ?? this.majorGridLineStyle.color ?? "#aaaaaa",
                    rs.strokeThickness ?? this.majorGridLineStyle.strokeThickness ?? 1
                );
            }
            const tickSizePx = this.rimTickLineStyle?.tickSize ?? DEFAULT_RIM_TICK_SIZE;
            const rimLineHalfThicknessPx = ucPenPre.m_fThickness / 2;
            drawRimTicks(
                renderContext,
                xCalc,
                yCalc,
                wasmContext,
                rimPen,
                clipRect,
                leftPad,
                topPad,
                this.rimConfig,
                tickSizePx,
                rimLineHalfThicknessPx,
                (text, px, py, angleDeg) => {
                    this._pendingRimLabels.push({ text, px, py, angleDeg });
                }
            );
        }
    }
}

// ── SmithChartReactanceAxis (Y axis) — draws constant-X arcs ─────────────────

export class SmithChartReactanceAxis extends NumericAxis {
    private sibling: SmithChartResistanceAxis | null = null;

    constructor(wasmContext: TSciChart, options?: object) {
        super(wasmContext, {
            drawLabels: true,
            drawMajorTickLines: false,
            drawMinorTickLines: false,
            drawMajorBands: false,
            zoomExtentsToInitialRange: true,
            ...options,
        });
        this.tickProvider = new SmithReactanceTickProvider(wasmContext);
        this.axisRenderer = new SmithChartAxisRenderer(wasmContext, false);
    }

    override measure(): void {
        super.measure();
        this.sibling = (this.parentSurface?.xAxes?.get(0) as SmithChartResistanceAxis) ?? null;
    }

    protected override drawGridLines(
        renderContext: WebGlRenderContext2D,
        _tickCoords: number[],
        linesPen: SCRTPen,
        isMajor: boolean
    ): void {
        if (!this.sibling) return;

        const wasmContext = this.webAssemblyContext2D;
        const xCalc = this.sibling.getCurrentCoordinateCalculator();
        const yCalc = this.getCurrentCoordinateCalculator();
        // Use master canvas height so the y-flip matches the C++ matTransform.
        // viewportSize tracks the visible (target) canvas which shrinks on resize;
        // the master WebGL canvas only grows, and SCRTSetMainWindowSize uses its height.
        const vpHeight =
            SciChartSurfaceBase.domMasterCanvas?.height ?? this.parentSurface.renderSurface.viewportSize.height;
        const svr = this.parentSurface.seriesViewRect;
        const clipRect = Rect.intersect(this.parentSurface.clipRect, svr);
        const leftPad = (this.parentSurface.padding?.left ?? 0) * DpiHelper.PIXEL_RATIO;
        const topPad = (this.parentSurface.padding?.top ?? 0) * DpiHelper.PIXEL_RATIO;

        const aspectRatio = Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
        const tp = this.tickProvider as any;

        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);

        const drawArc = (absX: number, gapDistance: number) => {
            const pos = xArcCircleCenter(absX, true);
            const posAngles = xArcAngles(absX, true);
            const posStart = posAngles.startAngle;
            let posEnd = posAngles.endAngle;

            const neg = xArcCircleCenter(absX, false);
            const negAngles = xArcAngles(absX, false);
            let negStart = negAngles.startAngle;
            const negEnd = negAngles.endAngle;

            if (gapDistance > 0) {
                const sinHalfGap = gapDistance / (2 * pos.rad);
                if (sinHalfGap >= 1) return;
                const arcGap = 2 * Math.asin(sinHalfGap);
                posEnd -= arcGap;
                negStart += arcGap;
                if (posEnd <= posStart || negEnd <= negStart) return;
            }

            const pos_cx_px = xCalc.getCoordinate(pos.cx);
            const pos_cy_native = vpHeight - yCalc.getCoordinate(pos.cy);
            const pos_radius_px = Math.abs(xCalc.getCoordWidth(pos.rad));
            arc.MakeCircularArc(
                getArcParams(
                    wasmContext,
                    pos_cx_px,
                    pos_cy_native,
                    posStart,
                    posEnd,
                    pos_radius_px,
                    0,
                    1,
                    aspectRatio,
                    linesPen.m_fThickness
                )
            );
            vecArcs.push_back(arc);

            const neg_cx_px = xCalc.getCoordinate(neg.cx);
            const neg_cy_native = vpHeight - yCalc.getCoordinate(neg.cy);
            const neg_radius_px = Math.abs(xCalc.getCoordWidth(neg.rad));
            arc.MakeCircularArc(
                getArcParams(
                    wasmContext,
                    neg_cx_px,
                    neg_cy_native,
                    negStart,
                    negEnd,
                    neg_radius_px,
                    0,
                    1,
                    aspectRatio,
                    linesPen.m_fThickness
                )
            );
            vecArcs.push_back(arc);
        };

        if (isMajor) {
            for (const x of tp.getMajorTicks(0, 0, null) as number[]) {
                drawArc(x, 0); // full arcs
            }
        } else {
            // Minor ticks are encoded as flat pairs [x, rClip, x, rClip, ...]
            const minor = tp.getMinorTicks(0, 0, null) as number[];
            for (let i = 0; i + 1 < minor.length; i += 2) {
                const x = minor[i];
                const rClip = minor[i + 1];
                drawArc(x, 2 / Math.sqrt((rClip + 1) * (rClip + 1) + x * x));
            }
        }

        if (vecArcs.size() > 0) {
            renderContext.drawArcs(vecArcs, 0, 0, 0, clipRect, linesPen, undefined, leftPad, topPad);
        }
    }
}
