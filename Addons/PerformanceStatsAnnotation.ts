import {
    NativeTextAnnotation,
    INativeTextAnnotationOptions,
    ECoordinateMode,
    EMultiLineAlignment,
    SciChartSurface
} from "scichart";

export type TPerformanceMeasurementResults = {
    invalidatedTimeStamp: DOMHighResTimeStamp;
    renderStartTimeStamp: DOMHighResTimeStamp;
    renderToWebGlEndTimeStamp: DOMHighResTimeStamp;
    renderEndTimeStamp: DOMHighResTimeStamp;
    paintEndTimeStamp: DOMHighResTimeStamp;
    lastPaintEndTimeStamp: DOMHighResTimeStamp;
};

/**
 * An annotation displaying render performance stats of the surface.
 * It extends the NativeTextAnnotation so its position and styles could be easily updated.
 *
 * @remarks Since the annotation is rendered on the same surface, the annotation displays stats from the previous frame.
 * So, basically it is always a frame behind the last drawn frame...
 */
export class PerformanceStatsAnnotation extends NativeTextAnnotation {
    constructor(options?: INativeTextAnnotationOptions) {
        super(options);
        this.processResults = this.processResults.bind(this);

        this.x1 = options?.x1 ?? 0;
        this.y1 = options?.y1 ?? 0;
        this.xCoordinateMode = options?.xCoordinateMode ?? ECoordinateMode.Relative;
        this.yCoordinateMode = options?.yCoordinateMode ?? ECoordinateMode.Relative;
        this.multiLineAlignment = options?.multiLineAlignment ?? EMultiLineAlignment.Left;
        this.backgroundProperty = options?.background ?? "black";
    }
    public onAttach(scs: SciChartSurface): void {
        super.onAttach(scs);

        if (scs.isSubSurface) {
            scs.hasInvalidState = true;
            throw new Error(
                `PerformanceStatsAnnotation is only supposed to be attached to a regular surface, not a sub-chart!`
            );
        }
        subscribeToPerformanceMeasurements(scs, this.processResults);
    }

    protected processResults(result: TPerformanceMeasurementResults) {
        const {
            invalidatedTimeStamp,
            renderStartTimeStamp,
            renderToWebGlEndTimeStamp,
            renderEndTimeStamp,
            paintEndTimeStamp,
            lastPaintEndTimeStamp
        } = result;
        const renderTime = renderEndTimeStamp - renderStartTimeStamp;
        const renderToWebGlTime = renderToWebGlEndTimeStamp - renderStartTimeStamp;
        const copyToCanvasTime = renderTime - renderToWebGlTime;
        const timeToRenderStart = renderStartTimeStamp - invalidatedTimeStamp;
        const timeBetweenPaints = paintEndTimeStamp - lastPaintEndTimeStamp;
        const timeFromRequestToPaint = paintEndTimeStamp - invalidatedTimeStamp;
        // updating the underlying property instead of the setter to prevent
        this.textProperty = [
            `Render: ${renderTime.toFixed(2).padStart(2, "0")}ms`,
            renderToWebGlTime === renderToWebGlTime
                ? `Copy to Canvas: ${copyToCanvasTime.toFixed(2).padStart(2, "0")}ms`
                : "",
            `Since Last Paint: ${timeBetweenPaints.toFixed(2).padStart(2, "0")}ms`
        ].join("\n");
    }
}

export function subscribeToPerformanceMeasurements(
    surface: SciChartSurface,
    callback: (result: TPerformanceMeasurementResults) => void
) {
    let invalidatedTimeStamp: DOMHighResTimeStamp;
    let renderStartTimeStamp: DOMHighResTimeStamp;
    let renderToWebGlEndTimeStamp: DOMHighResTimeStamp;
    let renderEndTimeStamp: DOMHighResTimeStamp;
    let paintEndTimeStamp: DOMHighResTimeStamp;
    let lastPaintEndTimeStamp: DOMHighResTimeStamp;

    surface.redrawRequested.subscribe(isInvalidated => {
        invalidatedTimeStamp = performance.now();
    });

    surface.preRenderAll.subscribe(() => {
        renderStartTimeStamp = performance.now();
    });

    if (surface.isCopyCanvasSurface) {
        surface.renderedToWebGl.subscribe(() => {
            renderToWebGlEndTimeStamp = performance.now();
        });
    }

    surface.renderedToDestination.subscribe(() => {
        renderEndTimeStamp = performance.now();
    });

    surface.painted.subscribe(() => {
        lastPaintEndTimeStamp = paintEndTimeStamp;
        paintEndTimeStamp = performance.now();

        callback({
            invalidatedTimeStamp,
            renderStartTimeStamp,
            renderToWebGlEndTimeStamp,
            renderEndTimeStamp,
            paintEndTimeStamp,
            lastPaintEndTimeStamp
        });
    });
}
