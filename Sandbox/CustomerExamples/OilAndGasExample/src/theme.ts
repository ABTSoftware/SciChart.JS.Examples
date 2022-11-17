import {ThemeProvider} from "scichart/Charting/Themes/IThemeProvider";
import {
    SciChartJSDarkv2Theme
} from "scichart/Charting/Themes/SciChartJSDarkv2Theme";
import {
    SciChartJSLightTheme
} from "scichart/Charting/Themes/SciChartJSLightTheme";
import {
    SciChartJS2022Theme
} from "scichart/Charting/Themes/SciChartJS2022Theme";


export interface AppThemeBase {
    SciChartJsTheme: ThemeProvider;

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
    ShaleOilLegendColor: string;
    ShaleWaterLegendColor: string;
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
    PoreSpacePhieFill: string;
    PoreSpacePhitFill: string;
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
    TextureSandFill: string;
    TextureGrainFill: string;
    TextureGravelFill: string;
    RolloverLineColor: string;
    RolloverTooltipFill: string;
    RolloverTooltipText: string;
}

export class App2022BrandTheme implements AppThemeBase {

    SciChartJsTheme = new SciChartJS2022Theme();

    // general colours
    LegendTextColor = "LightGray";
    SidebarBackground = this.SciChartJsTheme.sciChartBackground;
    SidebarTextColor = "#FFF";

    // Charts grid colours
    ChartsGridStroke1 = "#AE408E";
    ChartsGridStroke2 = "#EA6F63";
    ChartsGridStroke3 = "#45BEE8";

    // 3D Chart colors
    Chart3DScatterFill = "#F1CFB5";
    Chart3DColor1 = "#28266D";
    Chart3DColor2 = "#E7C565";
    Chart3DColor3 = "#83D2F5";
    Chart3DColor4 = "#209FD9";
    Chart3DColor5 = "#BE7336";
    Chart3DColor6 = "#AE408E";
    Chart3DColor7 = "#634E97";

    // Shale chart
    ShaleBackgroundColor = "#67BDAFAA";
    ShaleOilLegendColor = "#AE408E";
    ShaleWaterLegendColor = "#209FD9";
    ShaleWaterSeries = "#209FD9";
    ShaleSeriesStroke = "#E4F5FC";

    // Density chart
    DensityLegendSeparator = "#264B93";
    DensityBackgroundOne = "#537ABD";
    DensityBackgroundTwo = "#67BDAF";
    DensityStrokeY = "#45BEE8";
    DensityStrokeY1 = "#AE408E";
    DensityFillY = "#45BEE877";
    DensityFillY1 = "#67BDAF";

    // Resistivity Chart
    ResistivityLineStroke = "#45BEE8";
    ResistivityLineStroke2 = "#67BDAF";

    // Pore Space Chart
    PoreSpaceStroke1 = "#E4F5FC";
    PoreSpaceStroke2 = "#F1CFB5";
    PoreSpacePhieFill = "#67BDAF";
    PoreSpacePhitFill = "#F48420";
    PoreSpaceScatterStroke = "#FFF";
    PoreSpaceScatterFill = "#83D2F5";

    // Sonic vertical
    SonicGradient1 = "#634E97";
    SonicGradient2 = "#264B93";
    SonicGradient3 = "#AE408E";
    SonicGradient4 = "#45BEE8";
    SonicGradient5 = "#E4F5FC";
    SonicGradient6 = "#DF69A8";

    // Texture chart
    TextureFill = "#90808080";
    TextureLine = "#808080";
    TextureSandFill = "#E7C565";
    TextureGrainFill = "#209FD9";
    TextureGravelFill = "#BE7336";

    // Cursors
    RolloverLineColor = "#DF69A8";
    RolloverTooltipFill = "#AE408E";
    RolloverTooltipText = "#FFF";
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
    ShaleOilLegendColor = "#b22222";
    ShaleWaterLegendColor = "#3333FF";
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
    PoreSpacePhieFill = "#4682B490";
    PoreSpacePhitFill = "#75700090";
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
    TextureSandFill = "#DAA520";
    TextureGrainFill = "#008b8b";
    TextureGravelFill = "#33FF33";

    // Cursors
    RolloverLineColor = "#AE408E";
    RolloverTooltipFill = "#AE408E";
    RolloverTooltipText = "#FFF";
}

export class AppLightTheme implements AppThemeBase {

    SciChartJsTheme = new SciChartJSLightTheme();

    // general colours
    LegendTextColor = "#222";
    SidebarBackground = this.SciChartJsTheme.sciChartBackground;
    SidebarTextColor = "#222";

    // Charts grid colours
    ChartsGridStroke1 = "#DF69A8";
    ChartsGridStroke2 = "#EA6F63";
    ChartsGridStroke3 = "#45BEE8";

    // 3D Chart colors
    Chart3DScatterFill = "#DF69A8";
    Chart3DColor1 = "#E4F5FC";
    Chart3DColor2 = "#45BEE8";
    Chart3DColor3 = "#45BEE8";
    Chart3DColor4 = "#EA6F63";
    Chart3DColor5 = "#DF69A8";
    Chart3DColor6 = "#8065A3";
    Chart3DColor7 = "#364BA0";

    // Shale chart
    ShaleBackgroundColor = "#B9E0D4";
    ShaleOilLegendColor = "#DF69A8";
    ShaleWaterLegendColor = "#45BEE8";
    ShaleWaterSeries = "#45BEE877";
    ShaleSeriesStroke = "#264B93";

    // Density chart
    DensityLegendSeparator = "#264B93";
    DensityBackgroundOne = "#AE408E";
    DensityBackgroundTwo = "#EA6F63AA";
    DensityStrokeY = "#45BEE8";
    DensityStrokeY1 = "#AE408E";
    DensityFillY = "#AE408EAA";
    DensityFillY1 = "#EA6F63AA";

    // Resistivity Chart
    ResistivityLineStroke = "#45BEE8";
    ResistivityLineStroke2 = "#AE408E";

    // Pore Space Chart
    PoreSpaceStroke1 = "#E4F5FC";
    PoreSpaceStroke2 = "#F1CFB5";
    PoreSpacePhieFill = "#45BEE8";
    PoreSpacePhitFill = "#AE408E";
    PoreSpaceScatterStroke = "#EA6F63";
    PoreSpaceScatterFill = "#EA6F63";

    // Sonic vertical
    SonicGradient1 = "#634E9733";
    SonicGradient2 = "#264B9355";
    SonicGradient3 = "#AE408E77";
    SonicGradient4 = "#45BEE899";
    SonicGradient5 = "#E4F5FCAA";
    SonicGradient6 = "#DF69A8";

    // Texture chart
    TextureFill = "#90808080";
    TextureLine = "#808080";
    TextureSandFill = "#E7C565";
    TextureGrainFill = "#209FD9";
    TextureGravelFill = "#BE7336";

    // Cursors
    RolloverLineColor = "#364BA0";
    RolloverTooltipFill = "#364BA0";
    RolloverTooltipText = "#FFF";
}

export const appTheme: AppThemeBase = new App2022BrandTheme();
