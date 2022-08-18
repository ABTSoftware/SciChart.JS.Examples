import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import {ENumericFormat} from "scichart/Types/NumericFormat";
import {LineSeriesDataLabelProvider} from "../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/RenderableSeries/DataLabels/LineSeriesDataLabelProvider";

export async function dataLabelProviderGetText(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        stroke: "SteelBlue",
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: "SteelBlue",
            fill: "LightSteelBlue"}),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8],
        }),
        // dataLabels style must be specified to show labels
        dataLabels: {
            style: {
                fontFamily: "Arial",
                fontSize: 16,
                color: "#EEE"
            }
        }
    });

    // Override default dataLabelProvider.getText() function
    // See type DataLabelState for available data
    lineSeries.dataLabelProvider.getText = (dataLabelState) => {
        return `[x: ${dataLabelState.xVal()}, y: ${dataLabelState.yVal()}]`;
    };

    sciChartSurface.renderableSeries.add(lineSeries);
}