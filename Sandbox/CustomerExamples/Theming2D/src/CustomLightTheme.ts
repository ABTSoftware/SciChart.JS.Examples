import { ThemeProvider, EThemeProviderType } from "scichart";

export class CustomLightTheme extends ThemeProvider {
    public strokePalette = ["#F48420", "#AE408E", "#30BC9A", "#209FD9", "#264B93"];
    public fillPalette = ["#F4842077", "#AE408E77", "#30BC9A77", "#209FD977", "#264B9377"];
    public type = EThemeProviderType.Light;
    public sciChartBackground = "#F9F9F9FF";
    public loadingAnimationBackground = "#F9F9F9FF";
    public loadingAnimationForeground = "#777777FF";
    public gridBorderBrush = "#33333399";
    public axisBandsFill = "#AAAAAA09";
    public axisBorder = "#00000000";
    public tickTextBrush = "#333333FF";
    public majorGridLineBrush = "#CFCFCFFF";
    public minorGridLineBrush = "#CFCFCF77";
    public polarMajorGridLineBrush = "#CFCFCFFF";
    public polarMinorGridLineBrush = "#E5E5E5FF";
    public gridBackgroundBrush = "#05333377";
    public rolloverLineBrush = "#33333333";
    public cursorLineBrush = "#33333355";
    public rubberBandFillBrush = "#33333333";
    public rubberBandStrokeBrush = "#33333377";
    public legendBackgroundBrush = "#33333333";
    public labelBackgroundBrush = "#D0D0D0BB";
    public labelBorderBrush = "#33333377";
    public labelForegroundBrush = "#555555FF";
    public textAnnotationForeground = "#000000FF";
    public textAnnotationBackground = "#FFFFFFFF";
    public annotationsGripsBorderBrush = "#232323FF";
    public annotationsGripsBackgroundBrush = "#FFFFFF33";
    public annotationSelectionStroke = "#f00e0e66";
    public overviewFillBrush = "#33333322";
    public scrollbarBackgroundBrush = "#33333322";
    public scrollbarBorderBrush = "#12121255";
    public scrollbarGripsBackgroundBrush = "#FFFFFF66";
    public scrollbarViewportBackgroundBrush = "#FFFFFF44";
    public scrollbarViewportBorderBrush = "#12121255";
    public upWickColor = "#52CC54FF";
    public downWickColor = "#E26565FF";
    public upBodyBrush = "#52CC54A0";
    public downBodyBrush = "#E26565D0";
    public upBandSeriesLineColor = "#52CC54FF";
    public downBandSeriesLineColor = "#E26565FF";
    public upBandSeriesFillColor = "#52CC5490";
    public downBandSeriesFillColor = "#E26565A0";
    public mountainAreaBrush = "#76B7E2B4";
    public mountainLineColor = "#777777FF";
    public lineSeriesColor = "#777777FF";
    public columnLineColor = "#777777FF";
    public columnFillBrush = "#777777FF";
    public impulseFillBrush = "#777777FF";
    public defaultColorMapBrush = [
        { offset: 0, color: "DARKBLUE" },
        { offset: 0.5, color: "CORNFLOWERBLUE" },
        { offset: 1, color: "#FF22AAFF" }
    ];
    public axisTitleColor = "#777777FF";
    public chartTitleColor = "#777777FF";
    public shadowEffectColor = "#A0AABAFA";
    public planeBorderColor = "#EEEEEEFF";
    public axisPlaneBackgroundFill = "TRANSPARENT";
    public axis3DBandsFill = "#33333333";
    public isLightBackground = true;
}
