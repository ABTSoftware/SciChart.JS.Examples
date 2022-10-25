import {IThemeProvider} from "scichart/Charting/Themes/IThemeProvider";
import { SciChartJS2022Theme } from "sciChart/Charting/Themes/SciChartJS2022Theme";
import {
    SciChartJSLightTheme
} from "../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Themes/SciChartJSLightTheme";
import {
    SciChartJSDarkTheme
} from "../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Themes/SciChartJSDarkTheme";

export interface AppThemeBase {
    SciChartJsThemeDark: IThemeProvider;
    SciChartJsThemeMid: IThemeProvider;
    SciChartJsThemeLight: IThemeProvider;

    // general colors
    ForegroundColor: string;
    BackgroundDark: string;
    BackgroundMid: string;

    // Series colors
    VividSkyBlue: string;
    VividPink: string;
    VividTeal: string;
    VividOrange: string;
    VividBlue: string;
    VividPurple: string;

    MutedSkyBlue: string;
    MutedPink: string;
    MutedTeal: string;
    MutedOrange: string;
    MutedBlue: string;
    MutedPurple: string;

    PaleSkyBlue: string;
    PalePink: string;
    PaleTeal: string;
    PaleOrange: string;
    PaleBlue: string;
    PalePurple: string;
}

export class SciChart2022AppTheme implements AppThemeBase {
    SciChartJsThemeMid = new SciChartJS2022Theme();
    SciChartJsThemeDark = {
        ...new SciChartJS2022Theme(),
        sciChartBackground: "radial-gradient(circle, #21253D 0%, #09090F 100%)",
        loadingAnimationBackground: "radial-gradient(circle, #21253D 0%, #09090F 100%)",
        majorGridLineBrush: "#2B2D7077",
        minorGridLineBrush: "#191C6D77",
        tickTextBrush: "#E0FDFF"
    };
    SciChartJsThemeLight = new SciChartJSLightTheme();

    // General colors
    ForegroundColor = "#FFF";
    BackgroundDark = this.SciChartJsThemeDark.sciChartBackground;
    BackgroundMid = this.SciChartJsThemeMid.sciChartBackground;

    // Series colors
    VividSkyBlue = "#50C7E0";
    VividPink = "#EC0F6C";
    VividTeal = "#30BC9A";
    VividOrange = "#F48420";
    VividBlue = "#364BA0";
    VividPurple = "#882B91";

    MutedSkyBlue = "#83D2F5";
    MutedPink = "#DF69A8";
    MutedTeal = "#7BCAAB";
    MutedOrange = "#E7C565";
    MutedBlue = "#537ABD";
    MutedPurple = "#A16DAE";

    PaleSkyBlue = "#E4F5FC";
    PalePink = "#EEB3D2";
    PaleTeal = "#B9E0D4";
    PaleOrange = "#F1CFB5";
    PaleBlue = "#B5BEDF";
    PalePurple = "#CFB4D5";
}

export const appTheme = new SciChart2022AppTheme();
