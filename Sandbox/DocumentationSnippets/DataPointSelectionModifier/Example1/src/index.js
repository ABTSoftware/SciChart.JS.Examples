import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {DataPointSelectionModifier } from "scichart/Charting/ChartModifiers/DataPointSelectionModifier";
import {DataPointSelectionPaletteProvider} from "scichart/Charting/Model/DataPointSelectionPaletteProvider";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";

async function initSciChart() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create a chart with line series with a point-marker
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
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
            yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
        }),
        // Adding the DataPointSelectionPaletteProvider will change the fill/stroke of the pointmarker on selection
        paletteProvider: new DataPointSelectionPaletteProvider({ fill: "white", stroke: "white" })
    }));

    // Add the DatapointSelectionModifier to the chart
    sciChartSurface.chartModifiers.add(new DataPointSelectionModifier());
}

initSciChart();
