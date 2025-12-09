import {
    CustomChartModifier2D,
    ECoordinateMode,
    IChartModifierBaseOptions,
    INativeTextAnnotationOptions,
    SciChartSurface
} from "scichart";

import { IHtmlCustomAnnotationOptions } from "scichart";
import { HtmlCustomAnnotation } from "scichart";
import { createPerformanceChart } from "./createPerformanceChart";
import { EAnnotationClippingMode } from "scichart";
import {
    PerformanceStatsAnnotation,
    subscribeToPerformanceMeasurements,
    TPerformanceMeasurementResults
} from "./PerformanceStatsAnnotation";

/**
 * A modifier that displays live performance statistics using PerformanceStatsAnnotation
 */
export class PerformanceStatsModifier extends CustomChartModifier2D {
    public performanceStatsAnnotation: PerformanceStatsAnnotation;
    protected performanceGraphAnnotation: HtmlCustomAnnotation;

    public override onAttach(): void {
        super.onAttach();

        // Create and add the performance stats annotation
        this.performanceStatsAnnotation = this.createPerformanceStatsAnnotation({
            x1: 0,
            y1: 0,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative
        });
        // this.performanceGraphAnnotation = this.createPerformanceGraphAnnotation();

        // this.createPerformanceGraph(this.performanceGraphAnnotation.htmlElement as HTMLDivElement);

        this.parentSurface.annotations.add(this.performanceStatsAnnotation);
        // this.parentSurface.annotations.add(this.performanceGraphAnnotation);
    }

    public override onDetach(): void {
        super.onDetach();

        this.parentSurface.annotations.remove(this.performanceStatsAnnotation);
        this.performanceStatsAnnotation = null;
    }

    protected createPerformanceStatsAnnotation(options?: INativeTextAnnotationOptions) {
        return new PerformanceStatsAnnotation(options);
    }

    protected createPerformanceGraphAnnotation(options?: IHtmlCustomAnnotationOptions) {
        return new HtmlCustomAnnotation({
            x1: 0,
            y1: 0,
            x2: 1,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            clipping: EAnnotationClippingMode.Chart
        });
    }

    protected async createPerformanceGraph(rootElement: HTMLDivElement) {
        rootElement.style.height = "100px";

        const { sciChartSurface } = await SciChartSurface.create(rootElement);
        const {
            addRenderTimePoint,
            addTimeSinceLastPaintPoint,
            addFpsPoint,
            clear,
            delete: deleteFn
        } = await createPerformanceChart(sciChartSurface);

        const handleMeasurements = (result: TPerformanceMeasurementResults) => {
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

            if (lastPaintEndTimeStamp) {
                addRenderTimePoint(renderTime);
                addTimeSinceLastPaintPoint(timeBetweenPaints);
                addFpsPoint(Math.min(1000 / timeBetweenPaints, Number.MAX_SAFE_INTEGER));
            }
        };

        subscribeToPerformanceMeasurements(this.parentSurface, handleMeasurements);
    }
}
