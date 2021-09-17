import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ISciChart2DDefinition } from "scichart/Builder/buildSurface";
import { TSharedDataDefinition } from "scichart/Builder/buildDataSeries";
import { ESeriesType } from "scichart/types/SeriesType";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";

export async function drawChartWithSharedDataSeries(divElementId) {
    const chartDefinition = {
        series: [
            { type: ESeriesType.ColumnSeries, xyData: { xDataId: "x", yDataId: "col" } },
            { type: ESeriesType.LineSeries, xyData: { xDataId: "x", yDataId: "line" } },
        ]
    };
    const sharedData = { x: [1, 2, 3, 4, 5], col: [8, 2, 3, 7, 10], line: [10, 6, 7, 2, 16] };
    return chartBuilder.build2DChart(divElementId, { ...chartDefinition, sharedData });
}

export async function drawChartWithManuallyCreatedDataSeries(divElementId) {
    const chartDefinition = {
        series: [
            { type: ESeriesType.ColumnSeries, xyData: { xDataId: "x", yDataId: "col" } },
            { type: ESeriesType.LineSeries, xyData: { xDataId: "x", yDataId: "line" } },
        ]
    };
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, chartDefinition);
    const dataSeries = new XyDataSeries(wasmContext, { xValues: [1, 2, 3, 4, 5], yValues: [8, 2, 3, 7, 10] });
    sciChartSurface.renderableSeries.get(0).dataSeries = dataSeries;
}

export async function drawChartWithBuiltRenderableSeries(divElementId) {
    const chartDefinition = {
        series: [
            { type: ESeriesType.ColumnSeries, xyData: { xDataId: "x", yDataId: "col" } },
        ]
    };
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, chartDefinition);
    const dataSeries = new XyDataSeries(wasmContext, { xValues: [1, 2, 3, 4, 5], yValues: [8, 2, 3, 7, 10] });
    const seriesArray = chartBuilder.buildSeries(wasmContext, { type: ESeriesType.LineSeries, options: { dataSeries } });
    sciChartSurface.renderableSeries.add(...seriesArray);
}
