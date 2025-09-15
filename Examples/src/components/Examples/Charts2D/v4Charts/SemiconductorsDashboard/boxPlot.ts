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

import { BoxPlotValue } from "./helpers";

import { appTheme } from "../../../theme";

export const boxPlotId = "boxPlotId";

const NUMERIC_AXIS_OPTIONS = {
    axisAlignment: EAxisAlignment.Left,
    growBy: new NumberRange(0.05, 0.05),
    autoRange: EAutoRange.Once,
    flippedCoordinates: false,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
};


export const drawBoxPlot = async (values: Record<string, BoxPlotValue>) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(boxPlotId);

    const minValues = Object.values(values).map((d) => d.min);
    const maxValues = Object.values(values).map((d) => d.max);
    const medianValues = Object.values(values).map((d) => d.median);
    const q1Values = Object.values(values).map((d) => d.q1);
    const q2Values = Object.values(values).map((d) => d.q3);

    const xAxis = new CategoryAxis(wasmContext, {
        growBy: new NumberRange(0.01, 0.01),
        labels: ["MR", "HR", "HDI", "MR2"],
        axisAlignment: EAxisAlignment.Top,
    });

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.05, 0.05),
    });

    sciChartSurface.yAxes.add(yAxis);

    const boxSeries = new FastBoxPlotRenderableSeries(wasmContext, {
        dataSeries: new BoxPlotDataSeries(wasmContext, {
            xValues: [2, 4, 6, 8],
            minimumValues: minValues,
            lowerQuartileValues: q1Values,
            medianValues: medianValues,
            upperQuartileValues: q2Values,
            maximumValues: maxValues,
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

    sciChartSurface.renderableSeries.add(boxSeries);

    return { sciChartSurface, wasmContext };
};
