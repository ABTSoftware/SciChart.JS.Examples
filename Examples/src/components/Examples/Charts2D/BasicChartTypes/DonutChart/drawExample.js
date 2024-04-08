import { appTheme } from "scichart-example-dependencies";
import {
    EPieType,
    ESizingMode,
    SciChartPieSurface,
    PieSegment,
    GradientParams,
    Point,
    ELegendOrientation,
    ELegendPlacement,
} from "scichart";
export const drawExample = async (rootElement) => {
    // Create the pie chart
    const sciChartPieSurface = await SciChartPieSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        pieType: EPieType.Donut,
        holeRadius: 0.6,
        holeRadiusSizingMode: ESizingMode.Relative,
        animate: true,
        seriesSpacing: 10,
        showLegend: true,
        showLegendSeriesMarkers: true,
        animateLegend: true,
    });
    // Optional placement of legend
    sciChartPieSurface.legend.orientation = ELegendOrientation.Vertical;
    sciChartPieSurface.legend.placement = ELegendPlacement.TopLeft;
    // SciChart.js expects a list of PieSegment, however data is often formatted like this
    // Dataset = 'percentage market share of phones, 2022'
    const dataset = [
        { name: "Chrome", percent: 65.27 },
        { name: "Safari", percent: 19.03 },
        { name: "Edge", percent: 4.4 },
        { name: "Firefox", percent: 3.07 },
        { name: "Samsung", percent: 2.7 },
        { name: "Opera", percent: 2.49 },
        { name: "Android", percent: 0.78 },
        { name: "IE", percent: 0.32 },
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
    ];
    // Optional Relative radius adjustment per segment
    const radiusSize = [0.8, 0.85, 0.9, 0.9, 0.9, 0.95, 0.95, 0.95];
    const toPieSegment = (name, value, radiusAdjustment, color1, color2) => {
        return new PieSegment({
            value,
            text: name,
            labelStyle: { color: appTheme.ForegroundColor },
            radiusAdjustment,
            showLabel: value > 2,
            colorLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: color1, offset: 0 },
                { color: color2 || color1 + "77", offset: 1 },
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
