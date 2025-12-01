import {
    buildSeries,
    CategoryAxis,
    EAutoRange,
    EAxisType,
    I2DSubSurfaceOptions,
    IAxisBase2dOptions,
    IChartModifierBaseOptions,
    INumericAxisOptions,
    IRenderableSeries,
    LogarithmicAxis,
    NumberRange,
    NumericAxis,
    OverviewRangeSelectionModifier,
    SciChartSubSurface,
    IOverviewOptions,
    ISciChartSubSurface,
} from "scichart";
import { CustomChartModifier2D } from "scichart";

export interface IOverviewSubSurfaceModifierOptions
    extends IChartModifierBaseOptions,
        IOverviewOptions,
        I2DSubSurfaceOptions {}

/** A Modifier that adds an overview as subsurface.
 * The series to display are aggregated from other subsurfaces on the chart
 */
export class OverviewSubSurfaceModifier extends CustomChartModifier2D {
    protected options: IOverviewSubSurfaceModifierOptions;
    protected overviewSurface: SciChartSubSurface;

    constructor(options?: IOverviewSubSurfaceModifierOptions) {
        super(options);

        this.options = options;
    }

    public override onAttach(): void {
        super.onAttach();
        this.overviewSurface = this.createOverview();
    }

    public override onAttachSubSurface(subChart: ISciChartSubSurface): void {
        console.log("onAttachSubSurface", subChart.id);
        if (subChart.id === "overviewSubSurface") {
            return;
        }

        subChart.renderableSeries.collectionChanged.subscribe((args) => {
            if (this.overviewSurface) {
                const newMappedSeries = args
                    .getNewItems()
                    // @ts-ignore
                    .map(this.options.transformRenderableSeries)
                    .filter((rendSeries: IRenderableSeries) => rendSeries);

                this.overviewSurface.renderableSeries.add(...newMappedSeries);
                // this.overviewSurface.zoomExtents();
            }
        });
    }

    protected createOverview() {
        const options = this.options;
        const originalSciChartSurface = this.parentSurface;
        const wasmContext = originalSciChartSurface.webAssemblyContext2D;

        const sciChartSurface = SciChartSubSurface.createSubSurface(this.parentSurface, options);

        const mainAxisId = options?.mainAxisId;
        const secondaryAxisId = options?.secondaryAxisId;

        const originalMainAxis =
            originalSciChartSurface.getXAxisById(mainAxisId) ?? originalSciChartSurface.getDefaultXAxis();
        const originalSecondaryAxis =
            originalSciChartSurface.getYAxisById(secondaryAxisId) ?? originalSciChartSurface.getDefaultYAxis();

        if (!originalMainAxis)
            throw new Error(
                `Could not find a main axis with id ${mainAxisId}.` +
                    (!options?.mainAxisId ? "Please specify mainAxisId in the options" : "")
            );
        if (!originalMainAxis)
            throw new Error(
                `Could not find a secondary axis with id ${secondaryAxisId}.` +
                    (!options?.secondaryAxisId ? "Please specify secondaryAxisId in the options" : "")
            );

        const originalXAxis = originalMainAxis.isXAxis ? originalMainAxis : originalSecondaryAxis;
        const originalYAxis = originalMainAxis.isXAxis ? originalSecondaryAxis : originalMainAxis;

        const xAxisOptions: IAxisBase2dOptions = {
            axisAlignment: originalXAxis.axisAlignment,
            isVisible: false,
            autoRange: EAutoRange.Always,
            visibleRange: originalXAxis.visibleRange,
            ...options?.overviewXAxisOptions,
        };

        const yAxisOptions: IAxisBase2dOptions = {
            axisAlignment: originalYAxis.axisAlignment,
            isVisible: false,
            autoRange: EAutoRange.Always,
            visibleRange: originalYAxis.visibleRange,
            ...options?.overviewYAxisOptions,
        };

        const xAxis = originalXAxis.isCategoryAxis
            ? new CategoryAxis(wasmContext, xAxisOptions)
            : originalXAxis.type === EAxisType.LogarithmicAxis
            ? new LogarithmicAxis(wasmContext, xAxisOptions)
            : new NumericAxis(wasmContext, xAxisOptions);

        const yAxis = originalYAxis.isCategoryAxis
            ? new CategoryAxis(wasmContext, yAxisOptions)
            : originalXAxis.type === EAxisType.LogarithmicAxis
            ? new LogarithmicAxis(wasmContext, yAxisOptions)
            : new NumericAxis(wasmContext, yAxisOptions);

        const mainOverviewAxis = originalMainAxis.isXAxis ? xAxis : yAxis;

        const defaultTransform = (rendSeries: IRenderableSeries) => {
            // return undefined to skip
            if (rendSeries.xAxis?.id !== originalXAxis.id || rendSeries.yAxis?.id !== originalYAxis.id) {
                return undefined;
            }
            // clone the series using builder api
            const [overviewSeries] = buildSeries(wasmContext, rendSeries.toJSON(true));
            overviewSeries.dataSeries.delete();
            overviewSeries.dataSeries = rendSeries.dataSeries;
            overviewSeries.xAxisId = xAxis.id;
            overviewSeries.yAxisId = yAxis.id;
            return overviewSeries;
        };

        const existingSeries = originalSciChartSurface.subCharts.flatMap((subChart) =>
            subChart.renderableSeries.asArray()
        );

        const renderableSeries = existingSeries
            // @ts-ignore
            .map(options?.transformRenderableSeries ?? defaultTransform)
            .filter((rendSeries: IRenderableSeries) => rendSeries);

        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        sciChartSurface.renderableSeries.add(...renderableSeries);
        sciChartSurface.zoomExtents();
        const rangeSelectionModifier = options?.customRangeSelectionModifier ?? new OverviewRangeSelectionModifier();
        rangeSelectionModifier.xAxisId = xAxis.id;
        rangeSelectionModifier.yAxisId = yAxis.id;

        rangeSelectionModifier.onSelectedAreaChanged = (selectedRange: NumberRange) => {
            if (!selectedRange.equals(originalMainAxis.visibleRange)) {
                originalMainAxis.setVisibleRangeWithLimits(selectedRange);
            }
        };

        rangeSelectionModifier.selectedArea = new NumberRange(
            Math.max(xAxis.visibleRange.min, originalMainAxis.visibleRange.min),
            Math.min(xAxis.visibleRange.max, originalMainAxis.visibleRange.max)
        );

        sciChartSurface.chartModifiers.add(rangeSelectionModifier);

        if (options?.rangeSelectionAnnotationSvgString !== undefined) {
            rangeSelectionModifier.rangeSelectionAnnotation.svgString = options.rangeSelectionAnnotationSvgString;
        }

        xAxis.visibleRangeChanged.subscribe(({ visibleRange: overviewVisibleRange }) => {
            const updatedSelectedRange = originalMainAxis.visibleRange.clip(overviewVisibleRange);
            rangeSelectionModifier.selectedArea = updatedSelectedRange;
        });

        originalMainAxis.visibleRangeChanged.subscribe(({ visibleRange }) => {
            const updatedSelectedRange = visibleRange.clip(mainOverviewAxis.visibleRange);

            const shouldUpdateSelectedRange = !updatedSelectedRange.equals(rangeSelectionModifier.selectedArea);

            if (shouldUpdateSelectedRange) {
                rangeSelectionModifier.selectedArea = updatedSelectedRange;
            }
        });

        return sciChartSurface;
    }
}
