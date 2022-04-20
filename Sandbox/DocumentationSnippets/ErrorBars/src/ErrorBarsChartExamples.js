import { SciChartSurface } from 'scichart';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { FastErrorBarsRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastErrorBarsRenderableSeries';
import { HlcDataSeries } from 'scichart/Charting/Model/HlcDataSeries';
import { EErrorDirection } from 'scichart/types/ErrorDirection';
import { ESeriesType } from 'scichart/types/SeriesType';
import { EErrorMode } from 'scichart/types/ErrorMode';
import { EDataPointWidthMode } from 'scichart/types/DataPointWidthMode';
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";

export const drawBasicErrorBarsChart = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];
    const highValues = [3.7, 3.8, 4.0, 5.3, 5.9, 5.7, 5.0, 4.3, 3.2];
    const lowValues = [2.2, 3.4, 3.3, 3.8, 5.0, 4.8, 3.5, 3.0, 1.8];

    const dataSeries = new HlcDataSeries(wasmContext, {
        xValues,
        yValues,
        highValues,
        lowValues
    });

    const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, { dataSeries });

    sciChartSurface.renderableSeries.add(errorBarsSeries);
};

export const drawHorizontalErrorBars = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const xValues = [0, 1, 2, 2.5, 4.5, 5, 6, 7, 8];
    const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];
    const lowValues = [-0.5, 0.6, 1.1, 2.3, 4.0, 4.9, 5.8, 6.8, 7.5];
    const highValues = [0.4, 1.2, 2.1, 3.0, 4.7, 5.7, 6.5, 7.3, 8.9];

    const hlcDataSeries = new HlcDataSeries(wasmContext, {
        xValues,
        yValues,
        highValues,
        lowValues
    });

    const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: hlcDataSeries,
        errorDirection: EErrorDirection.Horizontal,
    });

    sciChartSurface.renderableSeries.add(errorBarsSeries);
};

export const drawErrorBarsWithErrorMode = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];
    const highValues = [3.7, 3.8, 4.0, 5.3, 5.9, 5.7, 5.6, 4.3, 3.2];
    const lowValues = [2.2, 3.4, 3.3, 3.8, 5.0, 4.8, 3.5, 3.0, 1.8];

    const hlcDataSeries = new HlcDataSeries(wasmContext, {
        xValues,
        yValues,
        highValues,
        lowValues
    });

    const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: hlcDataSeries,
        errorMode: EErrorMode.High,
    });

    sciChartSurface.renderableSeries.add(errorBarsSeries);
};

export const drawErrorBarsWithCustomOptions = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];
    const highValues = [3.7, 3.8, 4.0, 5.3, 5.9, 5.7, 5.6, 4.3, 3.2];
    const lowValues = [2.2, 3.4, 3.3, 3.8, 5.0, 4.8, 3.5, 3.0, 1.8];

    const hlcDataSeries = new HlcDataSeries(wasmContext, {
        xValues,
        yValues,
        highValues,
        lowValues
    });

    const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: hlcDataSeries,
        stroke: "Aqua",
        strokeDashArray: [4, 2],
        strokeThickness: 4,
        dataPointWidth: 50,
        dataPointWidthMode: EDataPointWidthMode.Absolute,
        drawConnector: false,
        drawWhiskers: true,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            fill: "#FFFFFF",
            stroke: "#006400"
        })
    });

    sciChartSurface.renderableSeries.add(errorBarsSeries);
};

export const drawErrorBarsWithBuilderApi = async (divElementId) => {
    const hlcData = {
        xValues: [1, 2, 3],
        yValues: [1, 4, 2],
        highValues: [1.2, 5.2, 3.3],
        lowValues: [0.8, 1.9, 2.9]
    };

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: {
            type: ESeriesType.ErrorBarsSeries,
            hlcData,
            options: {
                errorDirection: EErrorDirection.Vertical,
                errorMode: EErrorMode.High,
                dataPointWidthMode: EDataPointWidthMode.Relative,
                dataPointWidth: 0.2
            }
        }
    });
};
