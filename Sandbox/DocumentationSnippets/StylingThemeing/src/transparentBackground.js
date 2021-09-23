import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {SciChartJSLightTheme} from "scichart/Charting/Themes/SciChartJSLightTheme";

export async function transparentBackground(divId) {

    const theme = {... new SciChartJSLightTheme()};
    theme.tickTextBrush = "White";

    // You can set a SciChartSurface background transparent in the theme
    theme.sciChartBackground = "Transparent"
    theme.loadingAnimationBackground = "Transparent";

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId,{ theme });

    // Or you can set it in code
    // SciChart also supports semi-transparent backgrounds like this
    sciChartSurface.background = "#FFFFFF33";

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

