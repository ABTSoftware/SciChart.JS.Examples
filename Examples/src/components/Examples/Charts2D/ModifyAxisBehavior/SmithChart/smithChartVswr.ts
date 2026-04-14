import {
    SciChartSurface,
    ArcAnnotation,
    CustomAnnotation,
    ECoordinateMode,
    ChartModifierBase2D,
    ModifierMouseArgs,
    EExecuteOn,
} from "scichart";
import { SmithState, SmithAction } from "./useSmithChart";

// ── VSWR drag modifier ────────────────────────────────────────────────────────
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
    private vswrArcUpper: ArcAnnotation; // upper semicircle (height = r)
    private vswrArcLower: ArcAnnotation; // lower semicircle (height = -r)
    private handle: CustomAnnotation;
    private modifier: SmithVswrModifier;

    constructor(surface: SciChartSurface) {
        this.surface = surface;

        // VSWR=2 initial: r = (2-1)/(2+1) ≈ 0.333
        // Two ArcAnnotations form a full circle: upper half (height=r) + lower half (height=-r)
        const arcOptions = {
            isLineMode: true,
            stroke: "#FFAA00",
            strokeThickness: 1.5,
            strokeDashArray: [8, 4],
        };
        this.vswrArcUpper = new ArcAnnotation({ x1: -0.333, y1: 0, x2: 0.333, y2: 0, height: 0.333, ...arcOptions });
        this.vswrArcLower = new ArcAnnotation({ x1: -0.333, y1: 0, x2: 0.333, y2: 0, height: -0.333, ...arcOptions });
        surface.annotations.add(this.vswrArcUpper);
        surface.annotations.add(this.vswrArcLower);

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

        this.vswrArcUpper.x1 = -r;
        this.vswrArcUpper.x2 = r;
        this.vswrArcUpper.height = r;
        this.vswrArcLower.x1 = -r;
        this.vswrArcLower.x2 = r;
        this.vswrArcLower.height = -r;

        this.handle.x1 = r;
        this.handle.y1 = 0;
        this.modifier.setHandleRe(r);

        // Shading: fill interior of VSWR circle
        if (state.vswrShaded) {
            (this.vswrArcUpper as any).fill = "#FFAA0033";
            (this.vswrArcLower as any).fill = "#FFAA0033";
        } else {
            (this.vswrArcUpper as any).fill = "transparent";
            (this.vswrArcLower as any).fill = "transparent";
        }
    }
}
