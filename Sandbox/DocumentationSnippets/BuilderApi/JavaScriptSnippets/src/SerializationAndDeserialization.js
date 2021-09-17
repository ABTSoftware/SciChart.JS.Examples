import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EChart2DModifierType } from "scichart/types/ChartModifierType";
import { ISciChart2DDefinition } from "scichart/Builder/buildSurface";

export async function drawAndSerializeChart(divElementId) {
    const { sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: { type: ESeriesType.LineSeries, xyData: { xValues: [1, 3, 4, 7, 9], yValues: [10, 6, 7, 2, 16] } }
    });

    const definition = sciChartSurface.toJSON(true);
    const json = JSON.stringify(definition);
}

export async function deserializeAndDrawChart(divElementId) {
    const chartDefinition = {
        series: { type: ESeriesType.LineSeries, xyData: { xValues: [1, 3, 4, 7, 9], yValues: [10, 6, 7, 2, 16] } }
    };
    const json = JSON.stringify(chartDefinition);
    const definition = JSON.parse(json, chartBuilder.chartReviver);
    definition.modifiers = [{ type: EChart2DModifierType.Rollover }];
    return chartBuilder.build2DChart(divElementId, definition);
}
