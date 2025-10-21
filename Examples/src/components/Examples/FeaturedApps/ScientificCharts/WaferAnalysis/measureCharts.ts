import { Dispatch } from "react";
import {
    buildSeries,
    DeltaCalculator,
    easing,
    EAutoRange,
    EAxisAlignment,
    EDataPointWidthMode,
    EllipsePointMarker,
    FastColumnRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    NumericDeltaCalculator,
    SciChartJSDarkTheme,
    SciChartOverview,
    SciChartSurface,
    Thickness,
    vectorToArray,
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";

import { appTheme } from "../../../theme";

export const divElementId = "mrchart";
export const divOverviewId = "overview";

export const divElementId1 = "hrchart";
export const divOverviewId1 = "overview1";

class IntegerDeltaCalculator extends NumericDeltaCalculator {
    public getDeltaFromRange(min: number, max: number, minorsPerMajor: number, maxTicks: number): NumberRange {
        const delta = super.getDeltaFromRange(min, max, minorsPerMajor, maxTicks);
        return new NumberRange(Math.ceil(delta.min), Math.ceil(delta.max));
    }
}

export const initializeMeasureChart = async (
    div: string,
    overviewDiv: string,
    xValues: number[],
    yValues: number[],
    setFilter: Dispatch<[number, number]>
) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(div, {
        padding: new Thickness(5, 5, 0, 5),
    });

    const xAxis = new NumericAxis(wasmContext, {
        flippedCoordinates: false,
        axisAlignment: EAxisAlignment.Top,
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMinorTickLines: false,
    });
    xAxis.deltaCalculator = new IntegerDeltaCalculator(wasmContext);

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.1, 0),
        autoRangeAnimation: {
            animateInitialRanging: false,
            animateSubsequentRanging: true,
            duration: 300,
            easing: easing.outExpo,
        },
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMinorTickLines: false,
    });
    const yAxis2 = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        autoRange: EAutoRange.Always,
        growBy: new NumberRange(0.1, 0),
        autoRangeAnimation: {
            animateInitialRanging: false,
            animateSubsequentRanging: true,
            duration: 300,
            easing: easing.outExpo,
        },
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMinorTickLines: false,
    });

    sciChartSurface.yAxes.add(yAxis, yAxis2);

    xAxis.visibleRangeChanged.subscribe((args) => {
        // Set filter on zoom/pan
        console.log("Filtering", div);
        setFilter([Math.floor(args.visibleRange.min), Math.floor(args.visibleRange.max)]);
    });

    const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries,
        // When solid fill required, use fill
        fill: appTheme.MutedOrange,
        strokeThickness: 0,
        //cornerRadius: 4, // optional cornerradius
        dataPointWidth: 0.9,
        dataPointWidthMode: EDataPointWidthMode.Range,
    });

    sciChartSurface.renderableSeries.add(columnSeries);

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Add Overview
    const overview = await SciChartOverview.create(sciChartSurface, overviewDiv, {
        padding: new Thickness(2, 5, 5, 5),
        mainAxisId: xAxis.id,
        secondaryAxisId: yAxis.id,
        // transformRenderableSeries: (renderableSeries) => {
        //     // clone the series using builder api.  Normally we pass true here to not copy the data, but here we want a copy as we will be filtering the main data
        //     const [overviewSeries] = buildSeries(wasmContext, renderableSeries.toJSON(false));
        //     overviewSeries.xAxisId = xAxis.id;
        //     overviewSeries.yAxisId = yAxis.id;
        //     return overviewSeries;
        // },
    });

    console.log(div, "created");
    // Cleanup function
    const cleanup = () => {
        sciChartSurface?.delete();
    };

    // Update function that clears and repopulates data series
    const updateMeasureChartData = (xValues: number[], yValues: number[]) => {
        console.log(xValues.length);
        dataSeries.clear();
        dataSeries.appendRange(xValues, yValues);
    };

    return { wasmContext, sciChartSurface, updateMeasureChartData, cleanup };
};
