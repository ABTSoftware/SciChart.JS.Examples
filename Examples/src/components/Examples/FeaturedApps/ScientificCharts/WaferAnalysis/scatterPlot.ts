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

export const initializeScatterPlot = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(scatterPlotId);

    const xAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.01, 0.01),
        drawMinorGridLines: false,
        drawMinorTickLines: false,
        labelPrecision: 0,
    });

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.05, 0.05),
        drawMinorGridLines: false,
        drawMinorTickLines: false,
        labelPrecision: 0,
    });

    sciChartSurface.yAxes.add(yAxis);

    // Create empty data series for MR/HR values
    const dataSeries1 = new XyDataSeries(wasmContext, { containsNaN: false });

    // Create empty data series for MR2/HD1 values
    const dataSeries2 = new XyDataSeries(wasmContext, { containsNaN: false });

    // Create MR scatter series
    const mrScatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: dataSeries1,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 2,
            height: 2,
            strokeThickness: 0,
            fill: appTheme.MutedTeal,
        }),
        opacity: 0.67,
        //animation: new SweepAnimation({ duration: 600, fadeEffect: true }),
    });

    // Create HR scatter series
    const hrScatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: dataSeries2,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 2,
            height: 2,
            strokeThickness: 0,
            fill: appTheme.PaleOrange,
        }),
        opacity: 0.67,
        //animation: new SweepAnimation({ duration: 600, fadeEffect: true }),
    });

    sciChartSurface.renderableSeries.add(mrScatterSeries);
    sciChartSurface.renderableSeries.add(hrScatterSeries);

    // Add zoom and pan modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());

    // Update function that clears and repopulates both data series
    const updateScatterPlotData = (values: readonly WaferData[]) => {
        console.log("scatter update", values.length);
        // Prepare data arrays
        const mrValues = values.map((d) => d.MR);
        const hrValues = values.map((d) => d.HR);
        const mr2Values = values.map((d) => d.MR2);
        const hdiValues = values.map((d) => d.HDI);

        // Clear and update MR data series
        dataSeries1.clear();
        dataSeries1.appendRange(mrValues, mr2Values);

        // Clear and update HR data series
        dataSeries2.clear();
        dataSeries2.appendRange(hrValues, hdiValues);
    };

    // Cleanup function
    const cleanup = () => {
        sciChartSurface?.delete();
    };

    return { sciChartSurface, wasmContext, updateScatterPlotData, cleanup };
};
