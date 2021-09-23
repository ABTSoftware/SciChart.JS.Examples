import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {SciChartJSLightTheme} from "scichart/Charting/Themes/SciChartJSLightTheme";

export async function inheritThemeGradientBackground(divId) {


    // Create a theme and inherit / override some properties
    const theme = {... new SciChartJSLightTheme()};

    // Override axis text label
    theme.tickTextBrush = "#ff6600";
    // Override gridlines
    theme.majorGridLineBrush = "#777";
    theme.minorGridLineBrush = "#aaa";
    // Override background with a gradient
    theme.sciChartBackground = "radial-gradient(circle, #ffffff 0%, #eeeeee 50%, #AAAAAA 100%)"

    // Apply theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId,{ theme });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
}

