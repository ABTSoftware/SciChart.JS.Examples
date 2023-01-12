import { chartBuilder } from "scichart/Builder/chartBuilder";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { ELineType } from "scichart/Charting/Visuals/RenderableSeries/BaseLineRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { Thickness } from "scichart/Core/Thickness";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EAxisType } from "scichart/types/AxisType";
import { EDataLabelSkipMode } from "scichart/types/DataLabelSkipMode";
import { EPointMarkerType } from "scichart/types/PointMarkerType";
import { ESeriesType } from "scichart/types/SeriesType";
import { EHorizontalTextPosition, EVerticalTextPosition } from "scichart/types/TextPosition";

export async function dataLabelSkipModes(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 3,
        lineType: ELineType.Digital,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "SteelBlue",
            fill: "LightSteelBlue"}),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [4.3, 5, 5, 6, 8, 6.8, 7, 7, 7.2, 6.5, 6.5, 7],
        }),
        // dataLabels style must be specified to show labels
        dataLabels: {
            skipMode: EDataLabelSkipMode.SkipIfSame,
            aboveBelow: false,
            verticalTextPosition: EVerticalTextPosition.Above,
            horizontalTextPosition: EHorizontalTextPosition.Left,
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                padding: new Thickness(0,5,5,0)
            },
            color: "#EEE"
        }
    });

    sciChartSurface.renderableSeries.add(lineSeries);
}


export async function dataLabelSkipModesBuilder(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        xAxes: [ { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) }}],
        yAxes: [ { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) }}],
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
                    verticalTextPosition: EVerticalTextPosition.Above,
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
