import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { colors } from "./colors";

export const theme = {
    ...new SciChartJSLightTheme(),
    loadingAnimationBackground: colors.transparent,
    loadingAnimationForeground: colors.primary,
    sciChartBackground: colors.transparent
};

export const axisOptionsCommon = {
    axisBandsFill: colors.transparent,
    drawMinorGridLines: false,
    drawMajorGridLines: false,
    drawMinorTickLines: false,
    drawMajorTickLines: false,
    majorGridLineStyle: { color: colors.text },
    minorGridLineStyle: { color: colors.text },
    labelStyle: { color: colors.text }
};
