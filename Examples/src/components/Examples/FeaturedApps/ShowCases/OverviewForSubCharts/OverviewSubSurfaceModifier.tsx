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
    ChartModifierBase2D,
    EModifierType,
    TSciChart,
    AxisBase2D,
} from "scichart";

export interface IOverviewSubSurfaceModifierOptions
    extends IChartModifierBaseOptions,
        IOverviewOptions,
        I2DSubSurfaceOptions {}

const defaultTransform = (
    rendSeries: IRenderableSeries,
    // TODO create a separate type for contextParams
    contextParams: {
        wasmContext: TSciChart;
        originalXAxis: AxisBase2D;
        originalYAxis: AxisBase2D;
        overviewXAxis: AxisBase2D;
        overviewYAxis: AxisBase2D;
        overviewSurface: SciChartSubSurface;
    }
) => {
    const { wasmContext, originalXAxis, originalYAxis, overviewXAxis, overviewYAxis } = contextParams;
    // TODO this check might have sense only when mapping series from the main surface, but probably unnecessary when dealing with subcharts on OverviewSSSsubSurfaceModifier

    // return undefined to skip
    if (rendSeries.xAxis?.id !== originalXAxis.id || rendSeries.yAxis?.id !== originalYAxis.id) {
        return undefined;
    }
    // clone the series using builder api
    const [overviewSeries] = buildSeries(wasmContext, rendSeries.toJSON(true));

    // TODO (for later) check if deleting data series here is still necessary
    overviewSeries.dataSeries.delete();
    overviewSeries.dataSeries = rendSeries.dataSeries;
    overviewSeries.xAxisId = overviewXAxis.id;
    overviewSeries.yAxisId = overviewYAxis.id;
    return overviewSeries;
};

// TODO move OverviewModifier into a separate file
/** Basic Overview that maps series from main surface only */
class OverviewModifier extends ChartModifierBase2D {
    // TODO add new value to the EModifierType enum
    readonly type: EModifierType = "OverviewModifier" as EModifierType;
    protected options: IOverviewSubSurfaceModifierOptions;
    protected overviewSurface: SciChartSubSurface;

    constructor(options?: IOverviewSubSurfaceModifierOptions) {
        super(options);

        this.options = options;
    }

    public override onAttach(): void {
        super.onAttach();
        this.overviewSurface = this.createOverview();
        // TODO add logic to calculate the remaining space for the mainSurface.seriesViewRect
    }

    onDetach(): void {
        this.overviewSurface.delete();
    }

    onAttachSeries(rs: IRenderableSeries): void {
        // TODO run transform function on the series and attach the resulting series to the overview
        // const mappedSeries = this.mapTargetRenderableSeriesToOverview(rs, {...});
        // if (mappedSeries) {
        //     this.overviewSurface.renderableSeries.add(mappedSeries)
        // }
    }

    onDetachSeries(rs: IRenderableSeries): void {
        const mappedSeries = this.overviewSurface.renderableSeries.getById(rs.id);
        this.overviewSurface.renderableSeries.remove(mappedSeries, true);
    }

    protected getTargetRenderableSeries() {
        return this.parentSurface.renderableSeries.asArray();
    }

    protected mapTargetRenderableSeriesToOverview(
        targetSeriesEntry: IRenderableSeries,
        contextParams: any // TODO specify proper type, refer to params for defaultTransform
    ) {
        const transform = this.options?.transformRenderableSeries ?? defaultTransform;
        return transform(targetSeriesEntry, {
            overviewSurface: this.overviewSurface,
            // TODO pass these from createOverview to mapTargetRenderableSeriesToOverview
            ...contextParams,
        });
    }

    protected createOverview() {
        const options = this.options;
        const originalSciChartSurface = this.parentSurface;
        const wasmContext = originalSciChartSurface.webAssemblyContext2D;

        const sciChartSurface = SciChartSubSurface.createSubSurface(this.parentSurface, options);

        // TODO extract axis mapping into a separate method (e.g. mapAxes(originalXAxis, originalYAxis) => {overviewXAxis, overviewYAxis})
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
        if (!originalSecondaryAxis)
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
        //

        const mainOverviewAxis = originalMainAxis.isXAxis ? xAxis : yAxis;

        const renderableSeries = this.getTargetRenderableSeries()
            .map((rs) =>
                this.mapTargetRenderableSeriesToOverview(rs, {
                    // TODO pass required args
                    originalXAxis,
                    originalYAxis,
                    overviewSurface: this.overviewSurface,
                    overviewXAxis: xAxis,
                    overviewYAxis: yAxis,
                })
            )
            .filter((rendSeries: IRenderableSeries) => rendSeries);

        sciChartSurface.xAxes.add(xAxis);
        sciChartSurface.yAxes.add(yAxis);

        sciChartSurface.renderableSeries.add(...renderableSeries);
        sciChartSurface.zoomExtents();
        const rangeSelectionModifier = options?.customRangeSelectionModifier ?? new OverviewRangeSelectionModifier();
        rangeSelectionModifier.xAxisId = xAxis.id;
        rangeSelectionModifier.yAxisId = yAxis.id;

        // TODO extract visible range subscriptions into a separate method - subscribeToVisibleRangeUpdates(). This whole block from here
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
        // to here, would be different in OverviewModifier compared to OverviewSubSurfaceModifier

        return sciChartSurface;
    }
}

/** A Modifier that adds an overview as subsurface.
 * The series to display are aggregated from other subsurfaces on the chart
 */
export class OverviewSubSurfaceModifier extends OverviewModifier {
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

    onDetachSubSurface(subChart: ISciChartSubSurface): void {
        // TODO, unsubscribe collectionChanged and remove corresponding series from overview (by Id)
    }

    // TODO considering that the OverviewModifier.createOverview would be refactored into more granular methods,
    // here we would need only to do the relevant changes to them:
    override getTargetRenderableSeries() {
        return this.parentSurface.subCharts.flatMap((sc) => sc.renderableSeries.asArray());
    }

    // override mapTargetRenderableSeriesToOverview(targetSeriesEntry: IRenderableSeries, contextParams: any) {
    //     // TODO maybe no need to override, just check if there are issues with axis ids
    // }

    // override subscribeToVisibleRangeUpdates() {
    //     // TODO configure the two way binding between all subcharts and overview by using AxisSyncroniser
    // }
}
