import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";
import { EPointMarkerType } from "scichart/types/PointMarkerType";
import { EAxisType } from "scichart/types/AxisType";
import { EAxisAlignment } from "scichart/types/AxisAlignment";

export async function dataLabelsBuilderAPIExample(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        xAxes: { type: EAxisType.NumericAxis, options: { axisAlignment: EAxisAlignment.Left, growBy: { min: 0.1, max: 0.1 } }},
        yAxes: { type: EAxisType.NumericAxis, options: { axisAlignment: EAxisAlignment.Bottom, growBy: { min: 0.1, max: 0.1 } }},
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
                        fontSize: 16
                    },
                    color: "#EEE"
                }
            },
        }
    });
}
