import {
    EAutoRange,
    EAxisAlignment,
    EExecuteOn,
    FastLineRenderableSeries,
    IRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OverviewRangeSelectionModifier,
    RolloverModifier,
    RubberBandXyZoomModifier,
    SciChartSurface,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
    buildSeries,
    Thickness
} from "scichart";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { appTheme } from "../../../theme";
import { AxisSynchroniser } from "./AxisSynchroniser";

export const MAX_CHARTS = 8;

export const createChart = async (divId: string | HTMLDivElement, id: number) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId, {
        id: `multiChart${id}`,
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,
        padding: new Thickness(0, 0, 6, 0)
    });

    // Create and add an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        drawMinorGridLines: false,
        labelPrecision: 0
    }));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment: EAxisAlignment.Left,
            labelPrecision: 0,
            drawMinorGridLines: false
        })
    );

    const stroke = appTheme.SciChartJsTheme.getStrokeColor((id - 1) % MAX_CHARTS, MAX_CHARTS, wasmContext);
    const POINTS = 1000;
    const data0 = new RandomWalkGenerator().Seed((id + 1) * 10).getRandomWalkSeries(POINTS);
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues: data0.xValues, yValues: data0.yValues }),
            strokeThickness: 3,
            stroke,
        })
    );

    // Use modifierGroup to trigger the modifier in the same place on multiple charts
    sciChartSurface.chartModifiers.add(
        new RolloverModifier({ modifierGroup: "one" }),
        new RubberBandXyZoomModifier({
            executeCondition: { button: EExecuteOn.MouseRightButton },
            modifierGroup: "one",
        }),
        // These do not need modifierGroup as the xAxes are synchronised.
        new ZoomPanModifier({ enableZoom: true }),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};

export const createOverview = async (divId: string | HTMLDivElement, axisSynchroniser: AxisSynchroniser) => {
    // Note this does not use SciChartOverview.
    // Instead we create a normal chart and then manually add the OverviewRangeSelectionModifier and bind it to the axisSynchroniser
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divId, {
        id: "multiChartOverview",
        theme: appTheme.SciChartJsTheme,
    });

    // Create and add an XAxis and YAxis
    const xAxis = new NumericAxis(wasmContext, { 
        visibleRange: new NumberRange(0, 1000), 
        autoRange: EAutoRange.Never,
        labelPrecision: 0
    });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            autoRange: EAutoRange.Always,
            growBy: new NumberRange(0.1, 0.1),
            axisAlignment: EAxisAlignment.Left,
            labelPrecision: 0
        })
    );

    const rangeSelectionModifier = new OverviewRangeSelectionModifier();
    // When the range selection is moved, updated the linked charts
    rangeSelectionModifier.onSelectedAreaChanged = (selectedRange: NumberRange) => {
        if (!selectedRange.equals(axisSynchroniser.visibleRange)) {
            axisSynchroniser.publishChange({ visibleRange: selectedRange }, xAxis);
        }
    };
    rangeSelectionModifier.selectedArea = axisSynchroniser.visibleRange;
    sciChartSurface.chartModifiers.add(rangeSelectionModifier);

    // When charts are moved, update the range selection
    axisSynchroniser.visibleRangeChanged.subscribe(({ visibleRange }) => {
        const updatedSelectedRange = visibleRange.clip(xAxis.visibleRange);
        const shouldUpdateSelectedRange = !updatedSelectedRange.equals(rangeSelectionModifier.selectedArea);
        if (shouldUpdateSelectedRange) {
            rangeSelectionModifier.selectedArea = updatedSelectedRange;
        }
    });
    return { wasmContext, sciChartSurface };
};

export const addToOverview = (series: IRenderableSeries, overview: SciChartSurface) => {
    // Deep clone the series but without the data
    const cloneSeries = buildSeries(overview.webAssemblyContext2D, series.toJSON(true))[0];
    // Reference the original data
    cloneSeries.dataSeries = series.dataSeries;
    // Clear the axisIds so the series will automatically be assigned to the default axes on the overview.
    // in v4 we can no longer rely on the axisIds being DefaultAxisId
    cloneSeries.xAxisId = undefined;
    cloneSeries.yAxisId = undefined;
    overview.renderableSeries.add(cloneSeries);
};

export const removeFromOverview = (series: IRenderableSeries, overview: SciChartSurface) => {
    const overviewSeries = overview.renderableSeries.getById(series.id);
    // Do not delete children as this is using shared data
    overview.renderableSeries.remove(overviewSeries, false);
};
