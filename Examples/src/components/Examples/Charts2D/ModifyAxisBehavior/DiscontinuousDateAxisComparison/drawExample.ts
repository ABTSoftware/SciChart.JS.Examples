import {
    CategoryAxis,
    DiscontinuousDateAxis,
    ENumericFormat,
    EXyDirection,
    EllipsePointMarker,
    FastCandlestickRenderableSeries,
    FastLineRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    NumericLabelProvider,
    OhlcDataSeries,
    RolloverModifier,
    SciChartSurface,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
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
    // X values from the first series are used as baseXValues for the DiscontinuousDate axis, unless you specify them explicitly.
    const startDate = new Date(Date.UTC(2024, 0, 6, 0, 0, 0, 0));
    const startTime = startDate.getTime() / 1000;
    const ohlcSeries = new OhlcDataSeries(wasmContext, {
        containsNaN: false,
        isSorted: true,
        xValues: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16].map((x) => startTime + x * 24 * 60 * 60),
        openValues: [2, 5, 4, 6.2, 3, 3, 2.3, 3, 4, 5, 3, 3],
        highValues: [4.2, 7.5, 6.8, 8.5, 5.5, 5.2, 4.8, 5.7, 6.9, 7.5, 5.8, 6.2],
        lowValues: [0.8, 3.0, 2.0, 4.5, 1.0, 1.2, 0.5, 1.5, 2.5, 3.5, 1.5, 1.0],
        closeValues: [3.5, 3.8, 6.0, 8.0, 2.0, 4.5, 1.2, 5.0, 6.2, 4.0, 5.0, 2.5],
    });

    // DiscontinuousDate axis supports data with values at the same x coordinate, and data in between baseValues
    const dataSeries1 = new XyDataSeries(wasmContext, {
        containsNaN: false,
        isSorted: true,
        xValues: [1, 2, 2, 5, 5.5, 8, 9, 9.5, 9.8, 11, 15, 16].map((x) => startTime + x * 24 * 60 * 60),
        yValues: [2, 5, 4, 6.2, 3, 3, 2.3, 3, 4, 5, 3, 3],
    });
    if (!isCategoryAxis) {
        dataSeries1.appendRange(
            [5, 5, 9, 9, 15, 15].map((x) => startTime + x * 24 * 60 * 60),
            [3, 4, 4, 5.5, 4.5, 1]
        );
    }

    // DiscontinuousDate axis supports data with more or less x values than the baseValues
    const dataSeries2 = new XyDataSeries(wasmContext, {
        containsNaN: false,
        isSorted: true,
        xValues: [1, 3, 5, 8, 11, 16].map((x) => startTime + x * 24 * 60 * 60),
        yValues: [3, 6, 5, 7.21, 4, 4],
    });

    return { ohlcSeries, dataSeries1, dataSeries2 };
};

// Helper function to add series to a chart
const addSeriesToChart = (sciChartSurface: SciChartSurface, wasmContext: any, dataSeries: any) => {
    sciChartSurface.renderableSeries.add(
        new FastCandlestickRenderableSeries(wasmContext, {
            dataSeries: dataSeries.ohlcSeries,
            strokeThickness: 1,
            brushUp: appTheme.VividGreen + "77",
            brushDown: appTheme.MutedRed + "77",
            strokeUp: appTheme.VividGreen,
            strokeDown: appTheme.MutedRed,
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
            axisTitle: "Discontinuous Date X Axis - Fixed gap between baseValues.  Ideal for financial data.",
            axisTitleStyle: {
                fontSize: 16,
            },
        });
        if (customSettings) {
            xAxisDiscontinuous.labelProvider = new DayOfWeekLabelProvider({
                cursorLabelFormat: ENumericFormat.Date_DDMMHHMM,
            });
            xAxisDiscontinuous.autoTicks = false;
            xAxisDiscontinuous.majorDelta = 24 * 60 * 60;
            xAxisDiscontinuous.minorDelta = 4 * 60 * 60;
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

// Create Numeric Axis Chart
export const createNumericChart = (customSettings: boolean) => async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            majorGridLineBrush: appTheme.MutedSkyBlue + "55",
            minorGridLineBrush: appTheme.MutedSkyBlue + "22",
        },
    });

    const xAxisNumeric = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Date_DDMM,
        axisTitle: "Numeric X Axis - Cannot hide gaps",
        axisTitleStyle: {
            fontSize: 16,
        },
    });
    if (customSettings) {
        xAxisNumeric.labelProvider = new DayOfWeekLabelProvider({ cursorLabelFormat: ENumericFormat.Date_DDMMHHMM });
        xAxisNumeric.autoTicks = false;
        xAxisNumeric.majorDelta = 24 * 60 * 60;
        xAxisNumeric.minorDelta = 4 * 60 * 60;
    }

    const yAxisLinear = new NumericAxis(wasmContext, {
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 2,
        drawMinorGridLines: false,
        growBy: new NumberRange(0.1, 0.1),
    });

    sciChartSurface.xAxes.add(xAxisNumeric);
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
        axisTitle: "Category X Axis.  Hides gaps, but plots by index only",
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
