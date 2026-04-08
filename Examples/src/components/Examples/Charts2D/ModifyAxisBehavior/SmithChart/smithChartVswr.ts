import { SciChartSurface, ArcAnnotation, CustomAnnotation, ECoordinateMode } from "scichart";
import { SmithState, SmithAction } from "./useSmithChart";

export class SmithVswrAdapter {
    private surface: SciChartSurface;
    private vswrArc: ArcAnnotation;
    private handle: CustomAnnotation;
    private dispatch: (a: SmithAction) => void = () => {};

    constructor(surface: SciChartSurface) {
        this.surface = surface;

        // VSWR=2 initial: r = (2-1)/(2+1) = 0.333
        this.vswrArc = new ArcAnnotation({
            x1: -0.333,
            y1: 0,
            x2: 0.333,
            y2: 0,
            height: 0,
            isLineMode: true,
            stroke: "#FFAA00",
            strokeThickness: 1.5,
            strokeDashArray: [8, 4],
        });
        surface.annotations.add(this.vswrArc);

        // Draggable handle at (r, 0) on real axis
        this.handle = new CustomAnnotation({
            x1: 0.333,
            y1: 0,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            isEditable: true,
            svgString: `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12">
  <circle cx="6" cy="6" r="4" fill="#FFAA00" stroke="#ffffff" stroke-width="1.5"/>
</svg>`,
        });
        surface.annotations.add(this.handle);
    }

    setDispatch(d: (a: SmithAction) => void) {
        this.dispatch = d;
    }

    update(state: SmithState): void {
        const r = (state.vswr - 1) / (state.vswr + 1);
        this.vswrArc.x1 = -r;
        this.vswrArc.x2 = r;
        this.vswrArc.height = 0;
        this.handle.x1 = r;
        this.handle.y1 = 0;
    }
}
