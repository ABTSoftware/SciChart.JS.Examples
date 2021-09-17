import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EDataFilterType } from "scichart/types/DataFilterType";

export async function drawChartWithFilterUsingBuilderApi(divElementId) {
    const xyData = {
        xValues: [1, 2, 3, 4, 5, 6],
        yValues: [2, 5, 7, 4, 10, 15]
    };
    chartBuilder.buildChart(divElementId, {
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData, 
            },
            {
                type: ESeriesType.LineSeries,
                options: { stroke: "red" },
                xyData: {
                    ...xyData,
                    filter: { type: EDataFilterType.XyLinearTrend }
                }
            }
        ]
    });
}
