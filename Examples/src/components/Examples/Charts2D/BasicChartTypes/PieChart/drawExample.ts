import { appTheme } from "scichart-example-dependencies";
import {
    EPieType,
    ELegendOrientation,
    ELegendPlacement,
    GradientParams,
    Point,
    PieSegment,
    SciChartPieSurface,
} from "scichart";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create the pie chart
    const sciChartPieSurface = await SciChartPieSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        pieType: EPieType.Pie,
        animate: true,
        seriesSpacing: 15,
        showLegend: true,
        showLegendSeriesMarkers: true,
        animateLegend: true,
    });
    // Optional placement of legend
    sciChartPieSurface.legend.orientation = ELegendOrientation.Horizontal;
    sciChartPieSurface.legend.placement = ELegendPlacement.BottomLeft;

    // SciChart.js expects a list of PieSegment, however data is often formatted like this
    // Dataset = 'percentage market share of phones, 2022'
    const dataset = [
        { name: "Apple", percent: 28.41 },
        { name: "Samsung", percent: 28.21 },
        { name: "Xiaomi", percent: 12.73 },
        { name: "Huawei", percent: 5.27 },
        { name: "Oppo", percent: 5.53 },
        { name: "Vivo", percent: 4.31 },
        { name: "Realme", percent: 3.16 },
        { name: "Motorola", percent: 2.33 },
        { name: "Unknown", percent: 2.19 },
        { name: "LG", percent: 0.85 },
        { name: "OnePlus", percent: 1.11 },
        { name: "Tecno", percent: 1.09 },
        { name: "Infinix", percent: 0.96 },
        { name: "Google", percent: 0.77 },
        { name: "Nokia", percent: 0.45 },
    ];

    // Colors are just hex strings, supporting #FFFFFF (RBG) or 8-digit with RGBA or CSS color strings e.g. rgba()
    const colors = [
        { color1: appTheme.VividOrange, color2: appTheme.MutedOrange },
        { color1: appTheme.Indigo, color2: appTheme.VividBlue },
        { color1: appTheme.MutedSkyBlue, color2: appTheme.MutedTeal },
        { color1: appTheme.MutedTeal, color2: appTheme.PaleTeal },
        { color1: appTheme.VividSkyBlue, color2: appTheme.MutedSkyBlue },
        { color1: appTheme.MutedRed },
        { color1: appTheme.MutedPink },
        { color1: appTheme.VividPink },
        { color1: appTheme.VividPurple },
        { color1: appTheme.MutedOrange },
        { color1: appTheme.VividOrange },
        { color1: appTheme.PaleTeal },
        { color1: appTheme.PaleBlue },
        { color1: appTheme.PaleOrange },
        { color1: appTheme.PalePink },
    ];

    // Optional Relative radius adjustment per segment
    const radiusSize = [0.8, 0.8, 0.8, 0.8, 0.85, 0.85, 0.85, 0.9, 0.9, 0.9, 0.95, 0.95, 0.95, 0.95, 0.95];

    const toPieSegment = (name: string, value: number, radiusAdjustment: number, color1: string, color2: string) => {
        return new PieSegment({
            value,
            text: name,
            labelStyle: { color: appTheme.ForegroundColor },
            radiusAdjustment,
            showLabel: value > 2,
            colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: color1, offset: 0 },
                { color: color2 || (color1 + "77"), offset: 1 },
            ]),
        });
    };

    // Transform the data to pie segment and add to scichart
    const pieSegments = dataset.map((row, index) =>
        toPieSegment(row.name, row.percent, radiusSize[index], colors[index].color1, colors[index].color2)
    );

    sciChartPieSurface.pieSegments.add(...pieSegments);

    return { sciChartSurface: sciChartPieSurface };
};
