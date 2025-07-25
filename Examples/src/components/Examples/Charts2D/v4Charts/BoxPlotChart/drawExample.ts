import {
    BoxPlotDataSeries,
    CategoryAxis,
    EAutoRange,
    EAxisAlignment,
    EDataPointWidthMode,
    ENumericFormat,
    FastBoxPlotRenderableSeries,
    ICategoryAxisOptions,
    NumberRange,
    NumericAxis,
    Rect,
    SciChartSubSurface,
    SciChartSurface,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";

const NUMERIC_AXIS_OPTIONS = {
    axisAlignment: EAxisAlignment.Left,
    growBy: new NumberRange(0.05, 0.05),
    autoRange: EAutoRange.Once,
    flippedCoordinates: false,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement);

    // 1st sub-surface
    const sub1 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0, 0, 0.5, 1),
        theme: appTheme.SciChartJsTheme,
    });

    sub1.xAxes.add(
        new CategoryAxis(wasmContext, {
            growBy: new NumberRange(0.05, 0.05),
            labels: ["P1", "P2", "P3", "P4", "P5", "P6"],
            axisAlignment: EAxisAlignment.Left,
        })
    );
    sub1.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Bottom,
            growBy: new NumberRange(0.05, 0.05),
            autoRange: EAutoRange.Once,
            flippedCoordinates: true,
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 0,
        })
    );

    const boxSeries1 = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: new BoxPlotDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6],
            minimumValues: [0, 1, 0.5, 0, 1, 0.5],
            maximumValues: [10, 9, 9.5, 10, 9, 9.5],
            medianValues: [4.5, 5.5, 5, 4.5, 5.5, 5],
            lowerQuartileValues: [3, 4, 3.5, 3, 4, 3.5],
            upperQuartileValues: [7, 6, 6.5, 7, 6, 6.5],
        }),
        stroke: appTheme.MutedSkyBlue,
        fill: appTheme.MutedSkyBlue + "66",
        strokeThickness: 2,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.5,
        opacity: 0.8,
        whiskers: {
            stroke: appTheme.MutedSkyBlue,
            strokeThickness: 2,
            strokeDashArray: [5, 5],
        },
        cap: {
            stroke: appTheme.MutedOrange,
            strokeThickness: 2,
            dataPointWidth: 0.5,
        },
        medianLine: {
            stroke: appTheme.MutedOrange,
            strokeThickness: 2,
        },
    });
    sub1.renderableSeries.add(boxSeries1);

    // 2nd sub-surface
    const sub2 = SciChartSubSurface.createSubSurface(sciChartSurface, {
        position: new Rect(0.5, 0, 0.5, 1),
        theme: appTheme.SciChartJsTheme,
    });

    sub2.xAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
            autoRange: EAutoRange.Once,
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 0,
        })
    );
    sub2.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.05, 0.05),
            autoRange: EAutoRange.Once,
            flippedCoordinates: false,
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 0,
        })
    );

    const boxSeries2 = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: new BoxPlotDataSeries(wasmContext, {
            xValues: [1, 2, 5, 7.5, 12],
            minimumValues: [0, 1, 2, 5, 7],
            lowerQuartileValues: [1, 2, 3.5, 6, 9],
            medianValues: [3, 2.8, 6, 7, 10],
            upperQuartileValues: [4, 3, 8, 9, 11],
            maximumValues: [5, 4, 9.5, 10, 13],
        }),
        stroke: appTheme.MutedTeal,
        fill: appTheme.MutedPurple + "66",
        strokeThickness: 1,
        dataPointWidthMode: EDataPointWidthMode.Range,
        dataPointWidth: 0.6,
        opacity: 0.8,
        whiskers: {
            stroke: appTheme.MutedTeal,
            strokeThickness: 1,
        },
        cap: {
            stroke: appTheme.MutedPurple,
            strokeThickness: 2,
            dataPointWidth: 0.5,
        },
        medianLine: {
            stroke: appTheme.MutedPurple,
            strokeThickness: 2,
        },
    });
    sub2.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
    sub2.renderableSeries.add(boxSeries2);

    return { sciChartSurface, wasmContext };
};
