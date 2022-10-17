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
    Chart3DScatterFill: string
    Chart3DColor1: string;
    Chart3DColor2: string;
    Chart3DColor3: string;
    Chart3DColor4: string;
    Chart3DColor5: string;
    Chart3DColor6: string;
    Chart3DColor7: string;

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
    ChartsGridStroke1 = "#d52aa7";
    ChartsGridStroke2 = "#2bd452";
    ChartsGridStroke3 = "#916eeb";

    // 3D Chart colors
    Chart3DScatterFill = "#a88d32";
    Chart3DColor1 = "#0a0aae";
    Chart3DColor2 = "#2964ba";
    Chart3DColor3 = "#36e15a";
    Chart3DColor4 = "#f7e24d";
    Chart3DColor5 = "#b8e946";
    Chart3DColor6 = "#dd8037";
    Chart3DColor7 = "#a81d09";

    // Shale chart
    ShaleBackgroundColor = "#90EE90";
    ShaleLegendColor1 = "#b22222";
    ShaleLegendColor2 = "#3333FF";
    ShaleWaterSeries = "#E4E840";
    ShaleSeriesStroke = "#474747";

    // Density chart
    DensityLegendSeparator = "#FF3333";
    DensityBackgroundOne = "#228B22";
    DensityBackgroundTwo = "#FFA500";
    DensityStrokeY = "#1C1C1E";
    DensityStrokeY1 = "#FF3333";
    DensityFillY = "#228B22";
    DensityFillY1 = "#FFA500";

    // Resistivity Chart
    ResistivityLineStroke = "#00BFFF";
    ResistivityLineStroke2 = "#FF4500";

    // Pore Space Chart
    PoreSpaceStroke1 = "#4682B4";
    PoreSpaceStroke2 = "#757000";
    PoreSpaceFill1 = "#4682B490";
    PoreSpaceFill2 = "#75700090";
    PoreSpaceScatterStroke = "#FFF";
    PoreSpaceScatterFill = "#005A9C";

    // Sonic vertical
    SonicGradient1 = "#00008B";
    SonicGradient2 = "#3333FF";
    SonicGradient3 = "#228B22";
    SonicGradient4 = "#DFFF00";
    SonicGradient5 = "#FFFF00";
    SonicGradient6 = "#FF3333";

    // Texture chart
    TextureFill = "#90808080";
    TextureLine = "#808080";
    TexturePalette1 = "#DAA520";
    TexturePalette2 = "#008b8b";
    TexturePalette3 = "#33FF33";
}

export class AppLightTheme implements AppThemeBase {

    SciChartJsTheme = new SciChartJSLightTheme();

    // general colours
    LegendTextColor = "#333";
    SidebarBackground = this.SciChartJsTheme.sciChartBackground;
    SidebarTextColor = "#333";

    // Charts grid colours
    ChartsGridStroke1 = "#d52aa7";
    ChartsGridStroke2 = "#2bd452";
    ChartsGridStroke3 = "#916eeb";

    // 3D Chart colors
    Chart3DScatterFill = "#a88d32";
    Chart3DColor1 = "#0a0aae";
    Chart3DColor2 = "#2964ba";
    Chart3DColor3 = "#36e15a";
    Chart3DColor4 = "#f7e24d";
    Chart3DColor5 = "#b8e946";
    Chart3DColor6 = "#dd8037";
    Chart3DColor7 = "#a81d09";

    // Shale chart
    ShaleBackgroundColor = "#90EE90";
    ShaleLegendColor1 = "#b22222";
    ShaleLegendColor2 = "#3333FF";
    ShaleWaterSeries = "#E4E840";
    ShaleSeriesStroke = "#474747";

    // Density chart
    DensityLegendSeparator = "#FF3333";
    DensityBackgroundOne = "#228B22";
    DensityBackgroundTwo = "#FFA500";
    DensityStrokeY = "#1C1C1E";
    DensityStrokeY1 = "#FF3333";
    DensityFillY = "#228B22";
    DensityFillY1 = "#FFA500";

    // Resistivity Chart
    ResistivityLineStroke = "#00BFFF";
    ResistivityLineStroke2 = "#FF4500";

    // Pore Space Chart
    PoreSpaceStroke1 = "#4682B4";
    PoreSpaceStroke2 = "#757000";
    PoreSpaceFill1 = "#4682B490";
    PoreSpaceFill2 = "#75700090";
    PoreSpaceScatterStroke = "#FFF";
    PoreSpaceScatterFill = "#005A9C";

    // Sonic vertical
    SonicGradient1 = "#00008B";
    SonicGradient2 = "#3333FF";
    SonicGradient3 = "#228B22";
    SonicGradient4 = "#DFFF00";
    SonicGradient5 = "#FFFF00";
    SonicGradient6 = "#FF3333";

    // Texture chart
    TextureFill = "#90808080";
    TextureLine = "#808080";
    TexturePalette1 = "#DAA520";
    TexturePalette2 = "#008b8b";
    TexturePalette3 = "#33FF33";
}

export const appTheme: AppThemeBase = new AppDarkTheme();
