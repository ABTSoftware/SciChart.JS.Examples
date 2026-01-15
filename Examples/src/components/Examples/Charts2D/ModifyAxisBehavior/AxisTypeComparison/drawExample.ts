import {
    ENumericFormat,
    EllipsePointMarker,
    FastRectangleRenderableSeries,
    FastLineRenderableSeries,
    LegendModifier,
    LogarithmicAxis,
    MouseWheelZoomModifier,
    NumericAxis,
    RubberBandXyZoomModifier,
    SciChartSurface,
    SweepAnimation,
    XyDataSeries,
    Thickness,
    ZoomExtentsModifier,
    IndexAxis,
    NumericLabelProvider,
    NumberRange,
    CategoryAxis,
    EAxisAlignment,
    SmartDateLabelProvider,
    AxisMarkerAnnotation,
    ELabelPlacement,
    LabelProviderBase2D,
    ZoomPanModifier,
    EXyDirection,
    RolloverModifier,
    DiscontinuousDateAxis,
    XyScatterRenderableSeries,
} from "scichart";
import { appTheme } from "../../../theme";

// Custom label provider for days of the week
class DayOfWeekLabelProvider extends NumericLabelProvider {
    private dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    public get formatLabel() {
        return (dataValue: number): string => {
            const roundedValue = Math.round(dataValue);
            const weekNo = Math.floor((roundedValue - 1) / 7);

            if (roundedValue >= 1) {
                const dayIndex = (roundedValue - 1) % 7;
                return `${this.dayNames[dayIndex]} ${dataValue}`;
            }
            return ""; //dataValue.toString();
        };
    }
}

// Helper function to create data series
const createDataSeries = (wasmContext: any) => {
    // X values from the first series are used as baseXValues for the Index and DiscontinuousDate axis, unless you specify them explicitly.
    const lineDataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16],
        yValues: [1, 4, 3, 5.21, 2, 2, 1.3, 2, 3, 4, 2, 2],
    });

    // Index and DiscontinuousDate axis support data with values at the same x coordinate, and data in between baseXValues
    const lineDataSeries1 = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 2, 5, 5.5, 8, 9, 9.5, 9.8, 11, 15, 16],
        yValues: [2, 5, 4, 6.21, 3, 3, 2.3, 3, 4, 5, 3, 3],
    });

    // Index and DiscontinuousDate axis support data with more or less x values than the baseXValues
    const lineDataSeries2 = new XyDataSeries(wasmContext, {
        xValues: [1, 3, 5, 8, 11, 16],
        yValues: [3, 6, 5, 7.21, 4, 4],
    });

    return { lineDataSeries, lineDataSeries1, lineDataSeries2 };
};

// Helper function to add series to a chart
const addSeriesToChart = (sciChartSurface: SciChartSurface, wasmContext: any, dataSeries: any) => {
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: dataSeries.lineDataSeries,
            stroke: appTheme.VividOrange,
            opacity: 0.8,
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 8,
                height: 8,
                fill: appTheme.VividOrange,
                strokeThickness: 0,
                opacity: 0.7,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 0 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: dataSeries.lineDataSeries1,
            stroke: appTheme.VividRed,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: appTheme.VividRed,
                strokeThickness: 0,
                opacity: 0.8,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 100 }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: dataSeries.lineDataSeries2,
            stroke: appTheme.VividSkyBlue,
            opacity: 0.7,
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 8,
                height: 8,
                fill: appTheme.VividSkyBlue,
                strokeThickness: 0,
                opacity: 0.7,
            }),
            animation: new SweepAnimation({ duration: 800, delay: 200 }),
        })
    );
};

// Create Discontinuous Date Axis Chart
export const createDiscontinuousDateChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
    });

    const xAxisDiscontinuous = new DiscontinuousDateAxis(wasmContext, {
        labelProvider: new DayOfWeekLabelProvider(),
        dataGap: 1, // This is auto-calculated using the minimum gap between baseXValues, but should be set where possible to avoid that calculation.
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 0.2,
        growBy: new NumberRange(0.055, 0.055),
        axisTitle: "Discontinuous Date X Axis - Fixed gap between baseXValues.",
        axisTitleStyle: {
            fontSize: 16,
        },
    });

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        drawMinorGridLines: false,
        growBy: new NumberRange(0.1, 0.1),
    });

    sciChartSurface.xAxes.add(xAxisDiscontinuous);
    sciChartSurface.yAxes.add(yAxisLinear);

    const dataSeries = createDataSeries(wasmContext);
    addSeriesToChart(sciChartSurface, wasmContext, dataSeries);

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new RolloverModifier({ showTooltip: false, showAxisLabel: true, modifierGroup: "Group1" })
    );

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// Create Index Axis Chart
export const createIndexChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
    });

    const xAxisIndex = new IndexAxis(wasmContext, {
        labelProvider: new DayOfWeekLabelProvider(),
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 0.2,
        axisTitle: "Index X Axis - Nonlinear but continuous",
        axisTitleStyle: {
            fontSize: 16,
        },
    });

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        drawMinorGridLines: false,
        growBy: new NumberRange(0.1, 0.1),
    });

    sciChartSurface.xAxes.add(xAxisIndex);
    sciChartSurface.yAxes.add(yAxisLinear);

    const dataSeries = createDataSeries(wasmContext);
    addSeriesToChart(sciChartSurface, wasmContext, dataSeries);

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new RolloverModifier({ showTooltip: false, showAxisLabel: true, modifierGroup: "Group1" })
    );
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// Create Category Axis Chart
export const createCategoryChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
    });

    const xAxisCategory = new CategoryAxis(wasmContext, {
        autoTicks: false,
        majorDelta: 1,
        minorDelta: 0.2,
        labelProvider: new DayOfWeekLabelProvider(),
        axisTitle: "Category X Axis",
        axisTitleStyle: {
            fontSize: 16,
        },
    });

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        drawMinorGridLines: false,
        growBy: new NumberRange(0.1, 0.1),
    });

    sciChartSurface.xAxes.add(xAxisCategory);
    sciChartSurface.yAxes.add(yAxisLinear);

    const categoryDataSeries = createDataSeries(wasmContext);

    addSeriesToChart(sciChartSurface, wasmContext, categoryDataSeries);

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier(),
        new ZoomPanModifier(),
        new RolloverModifier({ showTooltip: false, showAxisLabel: true, modifierGroup: "Group1" })
    );

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
