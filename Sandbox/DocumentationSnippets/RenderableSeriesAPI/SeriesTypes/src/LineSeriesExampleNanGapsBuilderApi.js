import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";

export const drawLineSeriesNanGapsBuilderApi = async (divElementId) => {
    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
                    yValues: [2.5, 3.5, NaN, 4.0, 5.0, 5.5, NaN, 4.0, 3.0]
                },
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 5,
                    drawNaNAs: ELineDrawMode.DiscontinuousLine
                }
            }
        ]
    });
};
