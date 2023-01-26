import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {SciChartJSLightTheme} from "scichart/Charting/Themes/SciChartJSLightTheme";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { AUTO_COLOR } from "scichart/Charting/Themes/IThemeProvider";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker"
import { NumberRange } from "scichart/Core/NumberRange";

export async function autoColoring(divId) {

    const theme = new SciChartJSLightTheme();
    // configure the palette on the theme
    theme.strokePalette = ["red", "yellow", "green", "blue"];
    theme.fillPalette = ["blue", "green", "yellow", "red"];
    // Create a sciChartSurface using the theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId,{ theme });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1)}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1)}));

    // common x values - 0 to 20
    const xValues = Array.from(Array(20)).map((_, i) => i);
    // Create 10 line series with pointmarkers
    for (let i = 0; i < 10; i++) {
        const series = new FastLineRenderableSeries(wasmContext, {
            stroke: AUTO_COLOR,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: xValues.map(x => Math.sin(x/2) + i)}),
            pointMarker: new EllipsePointMarker(wasmContext, {
                stroke: AUTO_COLOR,
                fill: AUTO_COLOR,
                width: 10,
                height: 10
            })
        });
        if (i === 4) {
            series.pointMarker.adjustAutoColor = (propertyName, color) => {
                return propertyName === "fill" ? "black" : color;
            };
        }
        sciChartSurface.renderableSeries.add(series);          
    }
    setTimeout(() => {
        sciChartSurface.renderableSeries.removeAt(0);
        sciChartSurface.renderableSeries.removeAt(0);
        sciChartSurface.renderableSeries.removeAt(0);
    }, 1000);
}