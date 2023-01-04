import {NumberRange} from "scichart/Core/NumberRange";
import {EDataLabelSkipMode} from "scichart/types/DataLabelSkipMode";
import {chartBuilder} from "scichart/Builder/chartBuilder";
import {ESeriesType} from "scichart/types/SeriesType";
import {EPointMarkerType} from "scichart/types/PointMarkerType";
import {EAxisType} from "scichart/types/AxisType";
import { ELineType } from "scichart/Charting/Visuals/RenderableSeries/BaseLineRenderableSeries";
import { EHorizontalTextPosition, EVerticalTextPosition } from "scichart/types/TextPosition";
import { Thickness } from "scichart/Core/Thickness";
import { EAxisAlignment } from "scichart/types/AxisAlignment";

export async function dataLabelSkipModesBuilder(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        xAxes: [ { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1), axisAlignment: EAxisAlignment.Left }}],
        yAxes: [ { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1), axisAlignment: EAxisAlignment.Bottom, flippedCoordinates: true }}],
        series: {
            type: ESeriesType.LineSeries,
            xyData: {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [4.3, 5, 5, 6, 8, 6.8, 7, 7, 7.2, 6.5, 6.5, 7],
            },
            options: {
                stroke: "SteelBlue",
                strokeThickness: 3,
                lineType: ELineType.Digital,
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
                    aboveBelow: false,
                    verticalTextPosition: EVerticalTextPosition.Top,
                    horizontalTextPosition: EHorizontalTextPosition.Left,
                    style: {
                        fontFamily: "Arial",
                        fontSize: 18,
                        padding: new Thickness(0,5,5,0)
                    },
                    color: "#EEE"
                }
            },
        }
    });
}
