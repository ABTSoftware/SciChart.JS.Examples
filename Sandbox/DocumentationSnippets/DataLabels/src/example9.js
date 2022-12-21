import {NumberRange} from "scichart/Core/NumberRange";
import {EDataLabelSkipMode} from "scichart/types/DataLabelSkipMode";
import {chartBuilder} from "scichart/Builder/chartBuilder";
import {ESeriesType} from "scichart/types/SeriesType";
import {EPointMarkerType} from "scichart/types/PointMarkerType";
import {EAxisType} from "scichart/types/AxisType";

export async function dataLabelSkipModesBuilder(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        xAxes: [ { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) }}],
        yAxes: [ { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) }}],
        series: {
            type: ESeriesType.LineSeries,
            xyData: {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [4.3, 5, 5, 6, 6.3, 6.3, 7, 7.2, 7.8, 8, 8, 8],
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
                    skipMode: EDataLabelSkipMode.SkipIfSame,
                    skipNumber: 0,
                    style: {
                        fontFamily: "Arial",
                        fontSize: 18,
                        color: "#EEE"
                    }
                }
            },
        }
    });
}
