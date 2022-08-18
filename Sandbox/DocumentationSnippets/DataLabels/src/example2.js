import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";

export async function dataLabelsBuilderAPIExample(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        series: {
            type: ESeriesType.LineSeries,
            xyData: {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
            },
            options: {
                stroke: "SteelBlue",
                strokeThickness: 3,
                pointMarker: {
                    type: EPointMarkerType.Ellipse,
                    options: {
                        stroke: "SteelBlue",
                        fill: "LightSteelBlue",
                        width: 10,
                        height: 10,
                        strokeThickness: 2
                    }
                },
                dataLabels: {
                    style: {
                        fontFamily: "Arial",
                        fontSize: 16,
                        color: "#EEE"
                    }
                }
            },
        }
    });
}
