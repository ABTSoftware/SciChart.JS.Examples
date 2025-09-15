import {
    BoxPlotDataSeries,
    CategoryAxis,
    EAutoRange,
    EAxisAlignment,
    EDataPointWidthMode,
    EllipsePointMarker,
    ENumericFormat,
    FastBoxPlotRenderableSeries,
    ICategoryAxisOptions,
    NumberRange,
    NumericAxis,
    Rect,
    SciChartSubSurface,
    SciChartSurface,
    SweepAnimation,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";

import { BoxPlotValue } from "./helpers";

import { appTheme } from "../../../theme";
import { WaferData } from "./store";

export const scatterPlotId = "scatterPlotId";

const NUMERIC_AXIS_OPTIONS = {
    axisAlignment: EAxisAlignment.Left,
    growBy: new NumberRange(0.05, 0.05),
    autoRange: EAutoRange.Once,
    flippedCoordinates: false,
    labelFormat: ENumericFormat.Decimal,
    labelPrecision: 0,
};

export const drawScatterPlot = async (values: readonly WaferData[]) => {
    console.log({ values });

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(scatterPlotId);

    // const minValues = Object.values(values).map((d) => d.min);
    // const maxValues = Object.values(values).map((d) => d.max);
    // const medianValues = Object.values(values).map((d) => d.median);
    // const q1Values = Object.values(values).map((d) => d.q1);
    // const q2Values = Object.values(values).map((d) => d.q3);

    const xAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.01, 0.01),
        // axisAlignment: EAxisAlignment.Top,
    });

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.05, 0.05),
    });

    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: values.map((d) => d.MAP_COL),
                yValues: values.map((d) => d.MR2),
            }),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 2,
                height: 2,
                strokeThickness: 0,
                fill: appTheme.VividSkyBlue,
            }),
            opacity: 0.67,
            animation: new SweepAnimation({ duration: 600, fadeEffect: true }),
        })
    );

    return { sciChartSurface, wasmContext };
};
