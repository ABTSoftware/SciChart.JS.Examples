import {NumberRange} from "scichart/Core/NumberRange";
import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {EDataLabelSkipMode} from "scichart/types/DataLabelSkipMode";
import {chartBuilder} from "scichart/Builder/chartBuilder";
import {ESeriesType} from "scichart/types/SeriesType";
import {EPointMarkerType} from "scichart/types/PointMarkerType";
import {EAxisType} from "scichart/types/AxisType";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import {FastColumnRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { EColumnDataLabelPosition } from "scichart/Charting/Visuals/RenderableSeries/DataLabels/ColumnSeriesDataLabelProvider";
import { Thickness } from "scichart/Core/Thickness";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";

export async function dataLabelColoring(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        fill: "LightSteelBlue",
        strokeThickness: 1,
        dataSeries: new XyDataSeries(wasmContext, {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [-3, -4, 0, 2, 6.3, 3, 4, 8, 7, 5, 6, 8],
            }),
        dataLabels: {
            positionMode: EColumnDataLabelPosition.Outside,
            style: {
                fontFamily: "Arial",
                fontSize: 18,
                padding: new Thickness(3, 0, 3, 0)
            },
            color: "#EEE"
        }
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const red = parseColorToUIntArgb("red");
    const yellow = parseColorToUIntArgb("yellow");
    const green = parseColorToUIntArgb("green");
    columnSeries.dataLabelProvider.getColor = (dataLabelState, text) => {
        const y = dataLabelState.yVal();
        if (y <= 0) return red;
        if (y <= 5) return yellow;
        return green;
    }
}

export async function dataLabelColoringBuilderApi(divElementId) {
    const { sciChartSurface, wasmContext } = await chartBuilder.buildChart(divElementId, {
        xAxes: [ { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) }}],
        yAxes: [ { type: EAxisType.NumericAxis, options: { growBy: new NumberRange(0.1, 0.1) }}],
        series: {
            type: ESeriesType.ColumnSeries,
            xyData: {
                xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                yValues: [-3, -4, 0, 2, 6.3, 3, 4, 8, 7, 5, 6, 8],
            },
            options: {
                stroke: "SteelBlue",
                fill: "LightSteelBlue",
                strokeThickness: 1,
                dataLabels: {
                    positionMode: EColumnDataLabelPosition.Outside,
                    style: {
                        fontFamily: "Arial",
                        fontSize: 18,
                        padding: new Thickness(3, 0, 3, 0)
                    },
                    color: "#EEE"
                }
            },
        }
    });
    const red = parseColorToUIntArgb("red");
    const yellow = parseColorToUIntArgb("yellow");
    const green = parseColorToUIntArgb("green");
    sciChartSurface.renderableSeries.get(0).dataLabelProvider.getColor = (dataLabelState, text) => {
        const y = dataLabelState.yVal();
        if (y <= 0) return red;
        if (y <= 5) return yellow;
        return green;
    }
}
