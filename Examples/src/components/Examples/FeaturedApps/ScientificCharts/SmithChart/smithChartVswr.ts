import { ArcAnnotationBase } from "scichart/Charting/Visuals/Annotations/ArcAnnotationBase";
import { WebGlRenderContext2D } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { CoordinateCalculatorBase } from "scichart/Charting/Numerics/CoordinateCalculators/CoordinateCalculatorBase";
import { ESurfaceType } from "scichart/types/SurfaceType";
import { getWebGlPenFromCache } from "scichart/Charting/Drawing/Pen2DCache";
import { SmithState, SmithAction } from "./useSmithChart";
import { Rect } from "scichart/Core/Rect";
import { getArcParams, getArcVertex, getVectorArcVertex } from "scichart/Charting/Visuals/Helpers/NativeObject";
import { ChartModifierBase2D } from "scichart/Charting/ChartModifiers/ChartModifierBase2D";
import { ModifierMouseArgs } from "scichart/Charting/ChartModifiers/ModifierMouseArgs";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { EExecuteOn } from "scichart/types/ChartModifiers/ExecuteOn";
import { EAnnotationType } from "scichart/Charting/Visuals/Annotations/IAnnotation";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";

// ── Shared helper ─────────────────────────────────────────────────────────────
// Computes the centre and radius of the VSWR circle in screen pixel space.
function getVswrCirclePixels(
    xCalc: CoordinateCalculatorBase,
    yCalc: CoordinateCalculatorBase,
    vpH: number,
    dataRadius: number
): { cx: number; cy: number; radius_px: number; aspectRatio: number } {
    const cx = xCalc.getCoordinate(0);
    const cy = vpH - yCalc.getCoordinate(0);
    const radius_px = Math.abs(xCalc.getCoordWidth(dataRadius));
    const aspectRatio = Math.abs(xCalc.getCoordWidth(1)) / Math.abs(yCalc.getCoordWidth(1));
    return { cx, cy, radius_px, aspectRatio };
}

// ── SmithVswrFillAnnotation ───────────────────────────────────────────────────
// Fills the VSWR disk using drawMode=0 (sector fill) centred at the true
// circumcircle centre (0, 0) in data space.

class SmithVswrFillAnnotation extends ArcAnnotationBase {
    public readonly type = EAnnotationType.RenderContextArcAnnotation;
    public readonly surfaceTypes: ESurfaceType[] = [ESurfaceType.SciChartSurfaceType];
    private _radius: number = 0.333;

    constructor() {
        super({ fill: "#FFAA0033", strokeThickness: 0 });
    }

    set radius(r: number) {
        if (r !== this._radius) {
            this._radius = r;
            this.notifyPropertyChanged("radius");
        }
    }
    get radius(): number {
        return this._radius;
    }

    public override drawWithContext(
        renderContext: WebGlRenderContext2D,
        xCalc: CoordinateCalculatorBase,
        yCalc: CoordinateCalculatorBase,
        seriesViewRect: Rect,
        surfaceViewRect: Rect,
        chartViewRect: Rect
    ): void {
        const brush = this.getBrush();
        if (!brush) return;

        // drawArcs requires a real WASM pen — undefined causes a toWireType crash.
        // The zero-thickness strokePenCache pen is invisible but satisfies the API.
        const strokePen = getWebGlPenFromCache(this.strokePenCache);
        if (!strokePen) return;

        const wasmContext = renderContext.webAssemblyContext;
        const { cx, cy, radius_px, aspectRatio } = getVswrCirclePixels(
            xCalc,
            yCalc,
            this.getViewportHeight(),
            this._radius
        );

        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);
        // drawMode=0: sector fill; sweep [0, 2π] fills the full disk.
        const arcParams = getArcParams(wasmContext, cx, cy, 0, 2 * Math.PI, radius_px, 0, 0, aspectRatio, 0);
        if (!arcParams || !vecArcs || !arc) return;
        arc.MakeCircularArc(arcParams);
        vecArcs.push_back(arc);

        const clipRect = this.getClippingRect(this.clipping, seriesViewRect, surfaceViewRect, chartViewRect);
        renderContext.drawArcs(
            vecArcs,
            cx,
            cy,
            0,
            clipRect,
            strokePen.scrtPen,
            brush,
            seriesViewRect.left,
            seriesViewRect.top
        );
    }
}

// ── SmithVswrStrokeAnnotation ─────────────────────────────────────────────────
// Draws the VSWR circle outline using drawMode=1 (gridline/antialiased stroke)
// centred at the true circumcircle centre (0, 0) in data space.

class SmithVswrStrokeAnnotation extends ArcAnnotationBase {
    public readonly type = EAnnotationType.RenderContextArcAnnotation;
    public readonly surfaceTypes: ESurfaceType[] = [ESurfaceType.SciChartSurfaceType];
    private _radius: number = 0.333;

    constructor() {
        super({
            isLineMode: true,
            stroke: "#FFAA00",
            strokeThickness: 1.5,
            strokeDashArray: [8, 4],
        });
    }

    set radius(r: number) {
        if (r !== this._radius) {
            this._radius = r;
            this.notifyPropertyChanged("radius");
        }
    }
    get radius(): number {
        return this._radius;
    }

    public override drawWithContext(
        renderContext: WebGlRenderContext2D,
        xCalc: CoordinateCalculatorBase,
        yCalc: CoordinateCalculatorBase,
        seriesViewRect: Rect,
        surfaceViewRect: Rect,
        chartViewRect: Rect
    ): void {
        const strokePen = getWebGlPenFromCache(this.strokePenCache);
        if (!strokePen) return;

        const wasmContext = renderContext.webAssemblyContext;
        const { cx, cy, radius_px, aspectRatio } = getVswrCirclePixels(
            xCalc,
            yCalc,
            this.getViewportHeight(),
            this._radius
        );

        const vecArcs = getVectorArcVertex(wasmContext);
        const arc = getArcVertex(wasmContext);
        // drawMode=1: gridline/antialiased stroke; sweep [0, 2π] draws the full circle.
        const arcParams = getArcParams(
            wasmContext,
            cx,
            cy,
            0,
            2 * Math.PI,
            radius_px,
            0,
            1,
            aspectRatio,
            this.strokeThickness
        );
        if (!arcParams || !vecArcs || !arc) return;
        arc.MakeCircularArc(arcParams);
        vecArcs.push_back(arc);

        const clipRect = this.getClippingRect(this.clipping, seriesViewRect, surfaceViewRect, chartViewRect);
        renderContext.drawArcs(
            vecArcs,
            cx,
            cy,
            0,
            clipRect,
            strokePen.scrtPen,
            undefined,
            seriesViewRect.left,
            seriesViewRect.top
        );
    }
}

// ── SmithVswrModifier ────────────────────────────────────────────────────────
// Runs before SmithClickModifier — must be added to surface first.

class SmithVswrModifier extends ChartModifierBase2D {
    readonly type = "SmithVswrModifier";
    private dragging = false;
    private handleRe = 0.333; // known handle x in data coords
    private dispatch: (a: SmithAction) => void = () => {};

    setHandleRe(re: number) {
        this.handleRe = re;
    }

    setDispatch(d: (a: SmithAction) => void) {
        this.dispatch = d;
    }

    override modifierMouseDown(args: ModifierMouseArgs): void {
        super.modifierMouseDown(args);
        this.dragging = false;
        if (!this.checkExecuteConditions(args).isPrimary) return;
        const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const yCalc = this.parentSurface.yAxes.get(0).getCurrentCoordinateCalculator();
        const svr = this.parentSurface.seriesViewRect;
        const hx = xCalc.getCoordinate(this.handleRe);
        const hy = yCalc.getCoordinate(0);
        const dx = args.mousePoint.x - svr.left - hx;
        const dy = args.mousePoint.y - svr.top - hy;
        if (dx * dx + dy * dy <= 12 * 12) {
            this.dragging = true;
            args.handled = true;
        }
    }

    override modifierMouseMove(args: ModifierMouseArgs): void {
        super.modifierMouseMove(args);
        if (!this.dragging) return;
        const xCalc = this.parentSurface.xAxes.get(0).getCurrentCoordinateCalculator();
        const svr = this.parentSurface.seriesViewRect;
        const re = Math.min(Math.max(xCalc.getDataValue(args.mousePoint.x - svr.left), 0.001), 0.999);
        const vswr = (1 + re) / (1 - re);
        this.dispatch({ type: "SET_VSWR", vswr });
        args.handled = true;
    }

    override modifierMouseUp(args: ModifierMouseArgs): void {
        super.modifierMouseUp(args);
        this.dragging = false;
    }
}

// ── SmithVswrAdapter ──────────────────────────────────────────────────────────

export class SmithVswrAdapter {
    private surface: SciChartSurface;
    private vswrFill: SmithVswrFillAnnotation;
    private vswrStroke: SmithVswrStrokeAnnotation;
    private handle: CustomAnnotation;
    private modifier: SmithVswrModifier;

    constructor(surface: SciChartSurface) {
        this.surface = surface;

        // Fill disk added first so it renders beneath the dashed stroke
        this.vswrFill = new SmithVswrFillAnnotation();
        this.vswrFill.isHidden = true;
        surface.annotations.add(this.vswrFill);

        this.vswrStroke = new SmithVswrStrokeAnnotation();
        surface.annotations.add(this.vswrStroke);

        // Draggable handle at (r, 0) on real axis — visual dot
        this.handle = new CustomAnnotation({
            x1: 0.333,
            y1: 0,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            svgString: `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1" style="overflow:visible"><circle cx="0" cy="0" r="4" fill="#FFAA00" stroke="#ffffff" stroke-width="1.5"/></svg>`,
        });
        surface.annotations.add(this.handle);

        // Modifier handles drag — must be added before SmithClickModifier
        this.modifier = new SmithVswrModifier({ executeCondition: { button: EExecuteOn.MouseLeftButton } });
        surface.chartModifiers.add(this.modifier);
    }

    setDispatch(d: (a: SmithAction) => void) {
        this.modifier.setDispatch(d);
    }

    update(state: SmithState): void {
        const r = (state.vswr - 1) / (state.vswr + 1);

        this.vswrStroke.radius = r;
        this.handle.x1 = r;
        this.handle.y1 = 0;
        this.modifier.setHandleRe(r);

        this.vswrFill.radius = r;
        this.vswrFill.isHidden = !state.vswrShaded;
        this.vswrStroke.isHidden = !state.vswrOutline;
        this.handle.isHidden = !state.vswrOutline;
    }
}
