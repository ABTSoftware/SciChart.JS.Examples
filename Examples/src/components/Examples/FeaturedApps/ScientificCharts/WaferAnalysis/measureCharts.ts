import { Dispatch } from "react";
import {
    buildSeries,
    easing,
    EAutoRange,
    EAxisAlignment,
    EDataPointWidthMode,
    FastColumnRenderableSeries,
    IRenderableSeries,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    NumericDeltaCalculator,
    SciChartSurface,
    Thickness,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";

import { appTheme } from "../../../theme";

class IntegerDeltaCalculator extends NumericDeltaCalculator {
    public getDeltaFromRange(min: number, max: number, minorsPerMajor: number, maxTicks: number): NumberRange {
        const delta = super.getDeltaFromRange(min, max, minorsPerMajor, maxTicks);
        return new NumberRange(Math.ceil(delta.min), Math.ceil(delta.max));
    }
}

// Export overview options for use with SciChartNestedOverview
export const overviewOptions = {
    padding: new Thickness(2, 5, 5, 5),
    overviewXAxisOptions: { id: "OverviewX" },
    overviewYAxisOptions: { id: "OverviewY" },
    transformRenderableSeries: (renderableSeries: IRenderableSeries) => {
        // The wasmContext is available from the parent chart
        const wasmContext = renderableSeries.parentSurface?.webAssemblyContext2D;
        if (!wasmContext) return renderableSeries;

        // clone the series using builder api.  Normally we pass true here to not copy the data, but here we want a copy as we will be filtering the main data
        const [overviewSeries] = buildSeries(wasmContext, renderableSeries.toJSON(false));
        // The series is cloned with the axis Ids from the parent chart, so we have to explicitly set them.
        overviewSeries.xAxisId = "OverviewX";
        overviewSeries.yAxisId = "OverviewY";
        return overviewSeries;
    },
};

// Create init function that works with SciChartReact
export const createInitMeasureChart =
    (xValues: number[], yValues: number[], setFilter: Dispatch<[number, number]>) =>
    async (rootElement: string | HTMLDivElement) => {
        const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
            padding: new Thickness(5, 5, 0, 5),
        });

        const xAxis = new NumericAxis(wasmContext, {
            flippedCoordinates: false,
            axisAlignment: EAxisAlignment.Top,
            labelPrecision: 0,
            growBy: new NumberRange(0.05, 0.05),
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

        sciChartSurface.yAxes.add(yAxis);

        const dataSeries = new XyDataSeries(wasmContext, {
            xValues,
            yValues,
            dataIsSortedInX: true,
            containsNaN: false,
        });

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

        sciChartSurface.chartModifiers.add(
            new ZoomExtentsModifier(),
            new ZoomPanModifier(),
            new MouseWheelZoomModifier()
        );
        xAxis.visibleRangeChanged.subscribe((args) => {
            // Set filter on zoom/pan
            setFilter([Math.floor(args.visibleRange.min), Math.floor(args.visibleRange.max)]);
        });

        // Force the range to be calculated before the overview is created.
        sciChartSurface.zoomExtents();

        // Update function that clears and repopulates data series
        const updateMeasureChartData = (xValues: number[], yValues: number[]) => {
            dataSeries.clear();
            dataSeries.appendRange(xValues, yValues);
        };

        return { wasmContext, sciChartSurface, dataSeries, updateMeasureChartData };
    };
