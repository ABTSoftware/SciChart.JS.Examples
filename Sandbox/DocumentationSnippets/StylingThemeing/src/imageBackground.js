import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {SciChartJSLightTheme} from "scichart/Charting/Themes/SciChartJSLightTheme";

export async function imageBackground(divId) {

    // Ensure background transparent to show the image through
    const theme = {... new SciChartJSLightTheme()};
    theme.tickTextBrush = "White";
    theme.sciChartBackground = "Transparent"
    theme.loadingAnimationBackground = "Transparent";

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId,{ theme });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

