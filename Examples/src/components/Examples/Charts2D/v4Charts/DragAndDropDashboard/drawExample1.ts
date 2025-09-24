// import crossfilter from "crossfilter2";
import { Dispatch } from "react";
import {
    easing,
    EAutoRange,
    EAxisAlignment,
    EDataPointWidthMode,
    EllipsePointMarker,
    FastColumnRenderableSeries,
    // FastLineRenderableSeries,
    NumericAxis,
    SciChartJSDarkTheme,
    SciChartOverview,
    SciChartSurface,
    XyDataSeries,
    XyScatterRenderableSeries,
} from "scichart";

import { appTheme } from "../../../theme";

export const divElementId = "chart";
export const divOverviewId = "overview";

export const divElementId1 = "chart1";
export const divOverviewId1 = "overview1";

export const divElementId2 = "chart2";
export const divOverviewId2 = "overview2";

export const divElementId3 = "chart3";
export const divOverviewId3 = "overview3";


export const drawExample = async (xValues: number[], yValues: number[], setFilter: Dispatch<[number, number]>) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        widthAspect: 3,
        heightAspect: 2,
    });

    // sciChartSurface.applyTheme(new SciChartJSDarkTheme());

    const xAxis = new NumericAxis(wasmContext, {
        flippedCoordinates: false,
        axisAlignment: EAxisAlignment.Top,
    });

    xAxis.labelProvider.precision = 0;

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        // visibleRange: new NumberRange(-5000, 5000),
        autoRange: EAutoRange.Always,
        autoRangeAnimation: {
            animateInitialRanging: false,
            animateSubsequentRanging: true,
            duration: 300,
            easing: easing.outExpo,
        },
    });

    yAxis.labelProvider.precision = 0;
    yAxis.flippedCoordinates = false;
    sciChartSurface.yAxes.add(yAxis);

    // get values after brush event
    sciChartSurface.xAxes.get(0).visibleRangeChanged.subscribe((args) => {
        if (args?.visibleRange) {
            const min = +args.visibleRange.min.toFixed(0);

            const max = +args.visibleRange.max.toFixed(0);

            setFilter([min, max]);
        }
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

        // Defines the relative width of columns
        dataPointWidth: 1,
        dataPointWidthMode: EDataPointWidthMode.Relative,
    });

    sciChartSurface.renderableSeries.add(columnSeries);

    // Add Overview
    await SciChartOverview.create(sciChartSurface, divOverviewId, {
        mainAxisId: xAxis.id,
        secondaryAxisId: yAxis.id,
    });

    return { wasmContext, sciChartSurface };
};

export const drawExample1 = async (xValues: number[], yValues: number[], setFilter: Dispatch<[number, number]>) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId1, {
        widthAspect: 3,
        heightAspect: 2,
    });

    const xAxis = new NumericAxis(wasmContext, {
        flippedCoordinates: false,
        axisAlignment: EAxisAlignment.Top,
    });

    xAxis.labelProvider.precision = 0;

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        // visibleRange: new NumberRange(-5000, 5000),
        autoRange: EAutoRange.Always,
        autoRangeAnimation: {
            animateInitialRanging: false,
            animateSubsequentRanging: true,
            duration: 300,
            easing: easing.outExpo,
        },
    });

    yAxis.labelProvider.precision = 0;
    yAxis.flippedCoordinates = false;
    sciChartSurface.yAxes.add(yAxis);

    // get values after brush event
    sciChartSurface.xAxes.get(0).visibleRangeChanged.subscribe((args) => {
        if (args?.visibleRange) {
            const min = +args.visibleRange.min.toFixed(0);

            const max = +args.visibleRange.max.toFixed(0);

            setFilter([min, max]);
        }
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

        // Defines the relative width of columns
        // dataPointWidth: 1,
        // dataPointWidthMode: EDataPointWidthMode.Relative,
    });




    // rendSeries2.xAxisId = xAxis.id;
    // rendSeries2.yAxisId = yAxis.id;
    sciChartSurface.renderableSeries.add(columnSeries);

    // Add Overview
    await SciChartOverview.create(sciChartSurface, divOverviewId1, {
        mainAxisId: xAxis.id,
        secondaryAxisId: yAxis.id,
    });

    return { wasmContext, sciChartSurface };
};

export const drawExample2 = async (xValues: number[], yValues: number[], setFilter: Dispatch<[number, number]>) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId2, {
        widthAspect: 3,
        heightAspect: 2,
    });

    const xAxis = new NumericAxis(wasmContext, {
        flippedCoordinates: false,
        axisAlignment: EAxisAlignment.Top,
    });

    xAxis.labelProvider.precision = 0;

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        // visibleRange: new NumberRange(-5000, 5000),
        autoRange: EAutoRange.Always,
        autoRangeAnimation: {
            animateInitialRanging: false,
            animateSubsequentRanging: true,
            duration: 300,
            easing: easing.outExpo,
        },
    });

    yAxis.labelProvider.precision = 0;
    yAxis.flippedCoordinates = false;
    sciChartSurface.yAxes.add(yAxis);

    // get values after brush event
    sciChartSurface.xAxes.get(0).visibleRangeChanged.subscribe((args) => {
        if (args?.visibleRange) {
            const min = +args.visibleRange.min.toFixed(0);

            const max = +args.visibleRange.max.toFixed(0);

            setFilter([min, max]);
        }
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

        // Defines the relative width of columns
        // dataPointWidth: 1,
        // dataPointWidthMode: EDataPointWidthMode.Relative,
    });


    // rendSeries2.xAxisId = xAxis.id;
    // rendSeries2.yAxisId = yAxis.id;
    sciChartSurface.renderableSeries.add(columnSeries);

    // Add Overview
    await SciChartOverview.create(sciChartSurface, divOverviewId2, {
        mainAxisId: xAxis.id,
        secondaryAxisId: yAxis.id,
    });

    return { wasmContext, sciChartSurface };
};

export const drawExample3 = async (xValues: number[], yValues: number[], setFilter: Dispatch<[number, number]>) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId3, {
        widthAspect: 3,
        heightAspect: 2,
    });

    const xAxis = new NumericAxis(wasmContext, {
        flippedCoordinates: false,
        axisAlignment: EAxisAlignment.Top,
    });

    xAxis.labelProvider.precision = 0;

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        // visibleRange: new NumberRange(-5000, 5000),
        autoRange: EAutoRange.Always,
        autoRangeAnimation: {
            animateInitialRanging: false,
            animateSubsequentRanging: true,
            duration: 300,
            easing: easing.outExpo,
        },
    });

    yAxis.labelProvider.precision = 0;
    yAxis.flippedCoordinates = false;
    sciChartSurface.yAxes.add(yAxis);

    // get values after brush event
    sciChartSurface.xAxes.get(0).visibleRangeChanged.subscribe((args) => {
        if (args?.visibleRange) {
            const min = +args.visibleRange.min.toFixed(0);

            const max = +args.visibleRange.max.toFixed(0);

            setFilter([min, max]);
        }
    });


    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
        }),
        // When solid fill required, use fill
        fill: appTheme.MutedOrange,
        stroke: "#FFFFFF77",
        strokeThickness: 2,
        cornerRadius: 2, // optional cornerradius

        // Defines the relative width of columns
        dataPointWidth: 1,
        dataPointWidthMode: EDataPointWidthMode.Relative,
    });

    // rendSeries.xAxisId = xAxis.id;
    // rendSeries.yAxisId = yAxis.id;
    // rendSeries2.xAxisId = xAxis.id;
    // rendSeries2.yAxisId = yAxis.id;
    sciChartSurface.renderableSeries.add(columnSeries);

    // Add Overview
    await SciChartOverview.create(sciChartSurface, divOverviewId3, {
        mainAxisId: xAxis.id,
        secondaryAxisId: yAxis.id,
    });

    return { wasmContext, sciChartSurface };
};
