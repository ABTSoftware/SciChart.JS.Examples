import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";

export async function drawChartWithMetaData(divElementId) {
    const { sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: {
            type: ESeriesType.LineSeries,
            xyData: {
                metadata: { isSelected: false },
                xValues: [1, 3, 4, 7, 9],
                yValues: [10, 6, 7, 2, 16]
            }
        }
    });

    const definition = sciChartSurface.toJSON(true);
    const json = JSON.stringify(definition);
    // console.log(json);
}
