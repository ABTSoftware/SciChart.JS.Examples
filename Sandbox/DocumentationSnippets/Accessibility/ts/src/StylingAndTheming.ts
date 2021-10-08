import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartJSDarkTheme } from 'scichart/Charting/Themes/SciChartJSDarkTheme';
import { SciChartJSLightTheme } from 'scichart/Charting/Themes/SciChartJSLightTheme';

export async function themeSelection(divElementId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Apply system defined theme
    const isDarkThemeSelected = window.matchMedia
        && window.matchMedia("(prefers-color-scheme: dark)").matches;

    const newColorScheme = isDarkThemeSelected
        ? new SciChartJSDarkTheme()
        : new SciChartJSLightTheme();

    sciChartSurface.applyTheme(newColorScheme)

    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
        const newColorScheme = event.matches
            ? new SciChartJSDarkTheme()
            : new SciChartJSLightTheme();
        sciChartSurface.applyTheme(newColorScheme)
    };

    window.matchMedia("(prefers-color-scheme: dark)")
        .addEventListener("change", handleSystemThemeChange);
}