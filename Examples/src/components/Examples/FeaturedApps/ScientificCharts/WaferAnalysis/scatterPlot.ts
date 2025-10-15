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

export const initializeScatterPlot = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(scatterPlotId);

    const xAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.01, 0.01),
        // axisAlignment: EAxisAlignment.Top,
    });

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.05, 0.05),
    });

    sciChartSurface.yAxes.add(yAxis);

    // Create empty data series for MR values
    const mrDataSeries = new XyDataSeries(wasmContext, {
        xValues: [],
        yValues: [],
    });

    // Create empty data series for HR values
    // const hrDataSeries = new XyDataSeries(wasmContext, {
    //     xValues: [],
    //     yValues: [],
    // });

    // Create MR scatter series
    const mrScatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: mrDataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 2,
            height: 2,
            strokeThickness: 0,
            fill: appTheme.MutedTeal,
        }),
        opacity: 0.67,
        animation: new SweepAnimation({ duration: 600, fadeEffect: true }),
    });

    // // Create HR scatter series
    // const hrScatterSeries = new XyScatterRenderableSeries(wasmContext, {
    //     dataSeries: hrDataSeries,
    //     pointMarker: new EllipsePointMarker(wasmContext, {
    //         width: 2,
    //         height: 2,
    //         strokeThickness: 0,
    //         fill: appTheme.PaleOrange,
    //     }),
    //     opacity: 0.67,
    //     animation: new SweepAnimation({ duration: 600, fadeEffect: true }),
    // });

    sciChartSurface.renderableSeries.add(mrScatterSeries);
    //sciChartSurface.renderableSeries.add(hrScatterSeries);

    // Add zoom and pan modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());

    // Update function that clears and repopulates both data series
    const updateScatterPlotData = (values: readonly WaferData[]) => {
        // Prepare data arrays
        const xValues = values.map((d) => d.MR);
        const mrYValues = values.map((d) => d.HR);
        //const hrYValues = values.map((d) => d.HR);

        // Clear and update MR data series
        mrDataSeries.clear();
        mrDataSeries.appendRange(xValues, mrYValues);

        // Clear and update HR data series
        //hrDataSeries.clear();
        //hrDataSeries.appendRange(xValues, hrYValues);
    };

    // Cleanup function
    const cleanup = () => {
        sciChartSurface?.delete();
    };

    return { sciChartSurface, wasmContext, updateScatterPlotData, cleanup };
};
