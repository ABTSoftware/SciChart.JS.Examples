import {IThemeProvider} from "../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Themes/IThemeProvider";
import {
    SciChartJSDarkv2Theme
} from "../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Themes/SciChartJSDarkv2Theme";
import {
    SciChartJSLightTheme
} from "../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Themes/SciChartJSLightTheme";


export interface AppThemeBase {
    SciChartJsTheme: IThemeProvider;

    // General colours
    LegendTextColor: string;
    SidebarBackground: string;
    SidebarTextColor: string;

    // Charts grid colours
    ChartsGridStroke1: string;
    ChartsGridStroke2: string;
    ChartsGridStroke3: string;

    // 3D Chart colors
    Chart3DScatterFill: number
    Chart3DColor1: number;
    Chart3DColor2: number;
    Chart3DColor3: number;
    Chart3DColor4: number;
    Chart3DColor5: number;
    Chart3DColor6: number;
    Chart3DColor7: number;

    // Shale chart
    ShaleBackgroundColor: string;
    ShaleLegendColor1: string;
    ShaleLegendColor2: string;
    ShaleWaterSeries: string;
    ShaleSeriesStroke: string;

    // Density chart
    DensityLegendSeparator: string;
    DensityBackgroundOne: string;
    DensityBackgroundTwo: string;
    DensityStrokeY: string;
    DensityStrokeY1: string;
    DensityFillY: string;
    DensityFillY1: string;

    // Resistivity Chart
    ResistivityLineStroke: string;
    ResistivityLineStroke2: string;

    // Pore Space Chart
    PoreSpaceStroke1: string;
    PoreSpaceStroke2: string;
    PoreSpaceFill1: string;
    PoreSpaceFill2: string;
    PoreSpaceScatterStroke: string;
    PoreSpaceScatterFill: string;

    // Sonic vertical
    SonicGradient1: string;
    SonicGradient2: string;
    SonicGradient3: string;
    SonicGradient4: string;
    SonicGradient5: string;
    SonicGradient6: string;

    // Texture chart
    TextureFill: string;
    TextureLine: string;
    TexturePalette1: string;
    TexturePalette2: string;
    TexturePalette3: string;
}

export class AppDarkTheme implements AppThemeBase {

    SciChartJsTheme = new SciChartJSDarkv2Theme();

    // general colours
    LegendTextColor = "LightGray";
    SidebarBackground = this.SciChartJsTheme.sciChartBackground;
    SidebarTextColor = "#FFF";

    // Charts grid colours
    ChartsGridStroke1 = "rgba(213, 42, 167, 1)";
    ChartsGridStroke2 = "rgba(43,212,82,1)";
    ChartsGridStroke3 = "rgba(145,110,235,1)";

    // 3D Chart colors
    Chart3DScatterFill = 0xffa88d32;
    Chart3DColor1 = 0xff0a0aae;
    Chart3DColor2 = 0xff2964ba;
    Chart3DColor3 = 0xff36e15a;
    Chart3DColor4 = 0xfff7e24d;
    Chart3DColor5 = 0xffb8e946;
    Chart3DColor6 = 0xffdd8037;
    Chart3DColor7 = 0xffa81d09;

    // Shale chart
    ShaleBackgroundColor = "LightGreen";
    ShaleLegendColor1 = "FireBrick";
    ShaleLegendColor2 = "Blue";
    ShaleWaterSeries = "#E4E840";
    ShaleSeriesStroke = "#474747";

    // Density chart
    DensityLegendSeparator = "Red";
    DensityBackgroundOne = "ForestGreen";
    DensityBackgroundTwo = "Orange";
    DensityStrokeY = "#1C1C1E";
    DensityStrokeY1 = "Red";
    DensityFillY = "ForestGreen";
    DensityFillY1 = "Orange";

    // Resistivity Chart
    ResistivityLineStroke = "DeepSkyBlue";
    ResistivityLineStroke2 = "OrangeRed";

    // Pore Space Chart
    PoreSpaceStroke1 = "#4682B4";
    PoreSpaceStroke2 = "#757000";
    PoreSpaceFill1 = "#4682B490";
    PoreSpaceFill2 = "#75700090";
    PoreSpaceScatterStroke = "White";
    PoreSpaceScatterFill = "DodgerBlue";

    // Sonic vertical
    SonicGradient1 = "DarkBlue";
    SonicGradient2 = "Blue";
    SonicGradient3 = "ForestGreen";
    SonicGradient4 = "Chartreuse";
    SonicGradient5 = "Yellow";
    SonicGradient6 = "Red";

    // Texture chart
    TextureFill = "#90808080";
    TextureLine = "#808080";
    TexturePalette1 = "Goldenrod";
    TexturePalette2 = "DarkCyan";
    TexturePalette3 = "Green";
}

export class AppLightTheme implements AppThemeBase {

    SciChartJsTheme = new SciChartJSLightTheme();

    // general colours
    LegendTextColor = "#333";
    SidebarBackground = this.SciChartJsTheme.sciChartBackground;
    SidebarTextColor = "#333";

    // Charts grid colours
    ChartsGridStroke1 = "rgba(213, 42, 167, 1)";
    ChartsGridStroke2 = "rgba(43,212,82,1)";
    ChartsGridStroke3 = "rgba(145,110,235,1)";

    // 3D Chart colors
    Chart3DScatterFill = 0xffa88d32;
    Chart3DColor1 = 0xff0a0aae;
    Chart3DColor2 = 0xff2964ba;
    Chart3DColor3 = 0xff36e15a;
    Chart3DColor4 = 0xfff7e24d;
    Chart3DColor5 = 0xffb8e946;
    Chart3DColor6 = 0xffdd8037;
    Chart3DColor7 = 0xffa81d09;

    // Shale chart
    ShaleBackgroundColor = "LightGreen";
    ShaleLegendColor1 = "FireBrick";
    ShaleLegendColor2 = "Blue";
    ShaleWaterSeries = "#E4E840";
    ShaleSeriesStroke = "#474747";

    // Density chart
    DensityLegendSeparator = "Red";
    DensityBackgroundOne = "ForestGreen";
    DensityBackgroundTwo = "Orange";
    DensityStrokeY = "#1C1C1E";
    DensityStrokeY1 = "Red";
    DensityFillY = "ForestGreen";
    DensityFillY1 = "Orange";

    // Resistivity Chart
    ResistivityLineStroke = "DeepSkyBlue";
    ResistivityLineStroke2 = "OrangeRed";

    // Pore Space Chart
    PoreSpaceStroke1 = "#4682B4";
    PoreSpaceStroke2 = "#757000";
    PoreSpaceFill1 = "#4682B490";
    PoreSpaceFill2 = "#75700090";
    PoreSpaceScatterStroke = "White";
    PoreSpaceScatterFill = "DodgerBlue";

    // Sonic vertical
    SonicGradient1 = "DarkBlue";
    SonicGradient2 = "Blue";
    SonicGradient3 = "ForestGreen";
    SonicGradient4 = "Chartreuse";
    SonicGradient5 = "Yellow";
    SonicGradient6 = "Red";

    // Texture chart
    TextureFill = "#90808080";
    TextureLine = "#808080";
    TexturePalette1 = "Goldenrod";
    TexturePalette2 = "DarkCyan";
    TexturePalette3 = "Green";
}

export const appTheme: AppThemeBase = new AppLightTheme();
