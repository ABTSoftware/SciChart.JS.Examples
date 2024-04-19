import { IThemeProvider, SciChartJsNavyTheme } from "scichart";

export interface AppThemeBase {
    SciChartJsTheme: IThemeProvider;

    // general colors
    ForegroundColor: string;
    Background: string;

    // Series colors
    VividSkyBlue: string;
    VividPink: string;
    VividTeal: string;
    VividOrange: string;
    VividBlue: string;
    VividPurple: string;
    VividGreen: string;
    VividRed: string;

    MutedSkyBlue: string;
    MutedPink: string;
    MutedTeal: string;
    MutedOrange: string;
    MutedBlue: string;
    MutedPurple: string;
    MutedRed: string;

    PaleSkyBlue: string;
    PalePink: string;
    PaleTeal: string;
    PaleOrange: string;
    PaleBlue: string;
    PalePurple: string;
}

export class SciChart2022AppTheme implements AppThemeBase {
    SciChartJsTheme = new SciChartJsNavyTheme();

    // General colors
    ForegroundColor = "#FFFFFF";
    Background = this.SciChartJsTheme.sciChartBackground;

    // Series colors
    VividSkyBlue = "#50C7E0";
    VividPink = "#EC0F6C";
    VividTeal = "#30BC9A";
    VividOrange = "#F48420";
    VividBlue = "#364BA0";
    VividPurple = "#882B91";
    VividGreen = "#67BDAF";
    VividRed = "#C52E60";

    DarkIndigo = "#14233C";
    Indigo = "#264B93";

    MutedSkyBlue = "#83D2F5";
    MutedPink = "#DF69A8";
    MutedTeal = "#7BCAAB";
    MutedOrange = "#E7C565";
    MutedBlue = "#537ABD";
    MutedPurple = "#A16DAE";
    MutedRed = "#DC7969";

    PaleSkyBlue = "#E4F5FC";
    PalePink = "#EEB3D2";
    PaleTeal = "#B9E0D4";
    PaleOrange = "#F1CFB5";
    PaleBlue = "#B5BEDF";
    PalePurple = "#CFB4D5";
}

export const appTheme = new SciChart2022AppTheme();
