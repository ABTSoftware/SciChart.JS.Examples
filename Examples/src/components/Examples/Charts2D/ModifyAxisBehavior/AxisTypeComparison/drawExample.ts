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
    AxisBase2D,
} from "scichart";
import { appTheme } from "../../../theme";

// Custom label provider for days of the week
class DayOfWeekLabelProvider extends NumericLabelProvider {
    private dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    public get formatLabel() {
        return (dataValue: number): string => {
            if (dataValue > 100) {
                const date = new Date(dataValue * 1000);
                const day = date.getUTCDay();

                return `${this.dayNames[day]} ${date.getUTCDate()}`;
            } else {
                return `${this.dayNames[dataValue % 7]} ${dataValue}`;
            }
        };
    }
}

// Helper function to create data series
const createDataSeries = (wasmContext: any, isCategoryAxis: boolean) => {
    // X values from the first series are used as baseXValues for the Index and DiscontinuousDate axis, unless you specify them explicitly.
    const startDate = Date.UTC(2024, 0, 6, 0, 0, 0, 0) / 1000;
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16].map((x) => startDate + x * 24 * 60 * 60),
        yValues: [1, 4, 3, 5.21, 2, 2, 1.3, 2, 3, 4, 2, 2],
    });

    // Index and DiscontinuousDate axis support data with values at the same x coordinate, and data in between baseXValues
    const dataSeries1 = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 2, 5, 5.5, 8, 9, 9.5, 9.8, 11, 15, 16].map((x) => startDate + x * 24 * 60 * 60),
        yValues: [2, 5, 4, 6.2, 3, 3, 2.3, 3, 4, 5, 3, 3],
    });
    if (!isCategoryAxis) {
        dataSeries1.appendRange(
            [5, 5, 9, 9, 13, 14].map((x) => startDate + x * 24 * 60 * 60),
            [3, 4, 4, 5.5, 4.5, 1]
        );
    }

    // Index and DiscontinuousDate axis support data with more or less x values than the baseXValues
    const dataSeries2 = new XyDataSeries(wasmContext, {
        xValues: [1, 3, 5, 8, 11, 16].map((x) => startDate + x * 24 * 60 * 60),
        yValues: [3, 6, 5, 7.21, 4, 4],
    });

    return { dataSeries, dataSeries1, dataSeries2 };
};

// Helper function to add series to a chart
const addSeriesToChart = (sciChartSurface: SciChartSurface, wasmContext: any, dataSeries: any) => {
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: dataSeries.dataSeries,
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
        })
    );

    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: dataSeries.dataSeries1,
            stroke: appTheme.VividRed,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 10,
                height: 10,
                fill: appTheme.VividRed,
                strokeThickness: 0,
                opacity: 0.8,
            }),
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: dataSeries.dataSeries2,
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
        })
    );
};

const axisCustomSettings = (axis: AxisBase2D) => {
    axis.labelProvider = new DayOfWeekLabelProvider({ cursorLabelFormat: ENumericFormat.Date_DDMMHHMM });
    axis.autoTicks = false;
    axis.majorDelta = 24 * 60 * 60;
    axis.minorDelta = 4 * 60 * 60;
};

// Create Discontinuous Date Axis Chart
export const createDiscontinuousDateChart =
    (customSettings: boolean) => async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
            theme: {
                ...appTheme.SciChartJsTheme,
                majorGridLineBrush: appTheme.MutedSkyBlue + "55",
                minorGridLineBrush: appTheme.MutedSkyBlue + "22",
            },
        });

        const xAxisDiscontinuous = new DiscontinuousDateAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            dataGap: 24 * 60 * 60, // This is auto-calculated using the minimum gap between baseXValues, but should be set where possible to avoid that calculation.
            cursorLabelFormat: ENumericFormat.Date_DDMMHHMM,
            axisTitle: "Discontinuous Date X Axis - Fixed gap between baseXValues.  Ideal for financial data.",
            axisTitleStyle: {
                fontSize: 16,
            },
        });
        if (customSettings) {
            axisCustomSettings(xAxisDiscontinuous);
        }

        const yAxisLinear = new NumericAxis(wasmContext, {
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 2,
            drawMinorGridLines: false,
            growBy: new NumberRange(0.1, 0.1),
        });

        sciChartSurface.xAxes.add(xAxisDiscontinuous);
        sciChartSurface.yAxes.add(yAxisLinear);

        const dataSeries = createDataSeries(wasmContext, false);
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
export const createIndexChart = (customSettings: boolean) => async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
    });

    const xAxisIndex = new IndexAxis(wasmContext, {
        labelFormat: ENumericFormat.Date_DDMM,
        axisTitle: "Index X Axis - Nonlinear but continuous",
        axisTitleStyle: {
            fontSize: 16,
        },
    });
    if (customSettings) {
        axisCustomSettings(xAxisIndex);
    }

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        drawMinorGridLines: false,
        growBy: new NumberRange(0.1, 0.1),
    });

    sciChartSurface.xAxes.add(xAxisIndex);
    sciChartSurface.yAxes.add(yAxisLinear);

    const dataSeries = createDataSeries(wasmContext, false);
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
export const createCategoryChart = (customSettings: boolean) => async (rootElement: string | HTMLDivElement) => {
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
        axisTitle: "Category X Axis.  Data plotted by index only",
        axisTitleStyle: {
            fontSize: 16,
        },
    });
    if (customSettings) {
        xAxisCategory.labelProvider = new DayOfWeekLabelProvider({ cursorLabelFormat: ENumericFormat.Date_DDMMHHMM });
    }

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        drawMinorGridLines: false,
        growBy: new NumberRange(0.1, 0.1),
    });

    sciChartSurface.xAxes.add(xAxisCategory);
    sciChartSurface.yAxes.add(yAxisLinear);

    const categoryDataSeries = createDataSeries(wasmContext, true);

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
