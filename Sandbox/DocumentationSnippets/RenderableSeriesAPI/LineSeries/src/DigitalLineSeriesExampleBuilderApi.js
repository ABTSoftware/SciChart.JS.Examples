import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";

export const drawDigitalLineSeriesBuilderApi = async (divElementId) => {

    const xValues = [];
    const yValues = [];
    for(let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.1));
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 5,
                    isDigitalLine: true,
                }
            }
        ]
    });
};
