import { Dispatch } from "react";
import {
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
    XyDataSeries,
    XyScatterRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";

import { appTheme } from "../../../theme";

export const divElementId = "chart";
export const divOverviewId = "overview";

export const divElementId1 = "chart1";
export const divOverviewId1 = "overview1";

class IntegerDeltaCalculator extends NumericDeltaCalculator {
    public getDeltaFromRange(min: number, max: number, minorsPerMajor: number, maxTicks: number): NumberRange {
        const delta = super.getDeltaFromRange(min, max, minorsPerMajor, maxTicks);
        return new NumberRange(Math.ceil(delta.min), Math.ceil(delta.max));
    }
}

export const drawExample = async (xValues: number[], yValues: number[], setFilter: Dispatch<[number, number]>) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        padding: new Thickness(5, 5, 0, 5),
    });

    const xAxis = new NumericAxis(wasmContext, {
        flippedCoordinates: false,
        axisAlignment: EAxisAlignment.Top,
        labelPrecision: 0,
    });
    xAxis.deltaCalculator = new IntegerDeltaCalculator(wasmContext);

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Always,
        autoRangeAnimation: {
            animateInitialRanging: false,
            animateSubsequentRanging: true,
            duration: 300,
            easing: easing.outExpo,
        },
        labelPrecision: 0,
    });

    sciChartSurface.yAxes.add(yAxis);

    xAxis.visibleRangeChanged.subscribe((args) => {
        // Set filter on zoom/pan
        setFilter([Math.floor(args.visibleRange.min), Math.floor(args.visibleRange.max)]);
    });

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
        }),
        // When solid fill required, use fill
        fill: appTheme.MutedOrange,
        strokeThickness: 2,
        cornerRadius: 4, // optional cornerradius
        dataPointWidth: 0.9,
        dataPointWidthMode: EDataPointWidthMode.Range,
    });

    sciChartSurface.renderableSeries.add(columnSeries);

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Add Overview
    await SciChartOverview.create(sciChartSurface, divOverviewId, {
        padding: new Thickness(2, 5, 5, 5),
        mainAxisId: xAxis.id,
        secondaryAxisId: yAxis.id,
    });

    return { wasmContext, sciChartSurface };
};

export const drawExample1 = async (xValues: number[], yValues: number[], setFilter: Dispatch<[number, number]>) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId1, {
        padding: new Thickness(5, 5, 0, 5),
    });

    const xAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Top,
        labelPrecision: 0,
    });

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        autoRange: EAutoRange.Always,
        autoRangeAnimation: {
            animateInitialRanging: false,
            animateSubsequentRanging: true,
            duration: 300,
            easing: easing.outExpo,
        },
        labelPrecision: 0,
    });

    sciChartSurface.yAxes.add(yAxis);

    xAxis.deltaCalculator = new IntegerDeltaCalculator(wasmContext);

    xAxis.visibleRangeChanged.subscribe((args) => {
        // Set filter on zoom/pan
        setFilter([Math.floor(args.visibleRange.min), Math.floor(args.visibleRange.max)]);
    });

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
        }),
        // When solid fill required, use fill
        fill: appTheme.MutedOrange,
        // stroke: "#FFFFFF77",
        strokeThickness: 2,
        cornerRadius: 4, // optional cornerradius
        dataPointWidth: 0.9,
        dataPointWidthMode: EDataPointWidthMode.Range,
    });

    sciChartSurface.renderableSeries.add(columnSeries);
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());
    // Add Overview
    await SciChartOverview.create(sciChartSurface, divOverviewId1, {
        padding: new Thickness(2, 5, 5, 5),
        mainAxisId: xAxis.id,
        secondaryAxisId: yAxis.id,
    });

    return { wasmContext, sciChartSurface };
};
