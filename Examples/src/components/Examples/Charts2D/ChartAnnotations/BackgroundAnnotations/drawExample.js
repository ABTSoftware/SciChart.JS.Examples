import { appTheme } from "scichart-example-dependencies";
import { happinessData } from "./happinessData";
import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    ZoomPanModifier,
    BoxAnnotation,
    EAnnotationLayer,
    EAxisAlignment,
    MouseWheelZoomModifier,
    FastBubbleRenderableSeries,
    XyzDataSeries,
    ZoomExtentsModifier,
    EllipsePointMarker,
    CursorModifier,
    LogarithmicAxis,
    ENumericFormat,
    DefaultPaletteProvider,
    parseColorToUIntArgb,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    SweepAnimation,
    ManualLegend,
} from "scichart";
class ContinentPaletteProvider extends DefaultPaletteProvider {
    Europe = parseColorToUIntArgb(appTheme.VividBlue);
    Asia = parseColorToUIntArgb(appTheme.VividPurple);
    NorthAmerica = parseColorToUIntArgb(appTheme.VividPink);
    Oceania = parseColorToUIntArgb(appTheme.VividTeal);
    SouthAmerica = parseColorToUIntArgb(appTheme.VividGreen);
    Africa = parseColorToUIntArgb(appTheme.VividOrange);
    overridePointMarkerArgb(xValue, yValue, index, opacity, metadata) {
        let fill;
        // @ts-ignore
        switch (metadata.continent) {
            case "Europe":
                fill = this.Europe;
                break;
            case "Asia":
                fill = this.Asia;
                break;
            case "North America":
                fill = this.NorthAmerica;
                break;
            case "Oceania":
                fill = this.Oceania;
                break;
            case "South America":
                fill = this.SouthAmerica;
                break;
            case "Africa":
                fill = this.Africa;
                break;
            default:
                break;
        }
        return { fill, stroke: undefined };
    }
}
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Happiness vs GDP",
        titleStyle: { fontSize: 20 },
    });
    // Create an XAxis and YAxis
    const xAxis = new LogarithmicAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        labelPrefix: "$",
        labelFormat: ENumericFormat.SignificantFigures,
        labelPrecision: 2,
        cursorLabelFormat: ENumericFormat.Decimal,
        logBase: 10,
        drawMinorGridLines: false,
        axisTitle: "GDP per Capita",
        axisTitleStyle: { fontSize: 16 },
    });
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        axisAlignment: EAxisAlignment.Left,
        drawMinorGridLines: false,
        axisTitle: "Happiness",
        axisTitleStyle: { fontSize: 16 },
    });
    sciChartSurface.yAxes.add(yAxis);
    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new CursorModifier({
            showTooltip: true,
            hitTestRadius: 1,
            tooltipContainerBackground: appTheme.MutedRed,
            showAxisLabels: false,
            showXLine: false,
            showYLine: false,
            tooltipDataTemplate: (seriesInfos, tooltipTitle) => {
                const valuesWithLabels = [];
                const xyzSeriesInfo = seriesInfos[0];
                if (xyzSeriesInfo?.isHit) {
                    // @ts-ignore
                    valuesWithLabels.push(`${xyzSeriesInfo.pointMetadata.name}`);
                    valuesWithLabels.push(`GDP: ${xyzSeriesInfo.formattedXValue}`);
                    valuesWithLabels.push(`Happiness: ${xyzSeriesInfo.formattedYValue}`);
                    valuesWithLabels.push(`Population: ${xyzSeriesInfo.formattedZValue}`);
                }
                return valuesWithLabels;
            },
        })
    );
    // These boxes are set up so that x1,y1 is the outer corner and x2,y2 is the centre of the data
    const x2 = 10000;
    const y2 = 5;
    const box1 = new BoxAnnotation({
        annotationLayer: EAnnotationLayer.Background,
        fill: appTheme.PaleBlue,
        strokeThickness: 0,
        x1: -10,
        x2,
        y1: 10,
        y2,
    });
    const box2 = new BoxAnnotation({
        annotationLayer: EAnnotationLayer.Background,
        fill: appTheme.PalePurple,
        strokeThickness: 0,
        x1: 10,
        x2,
        y1: 10,
        y2,
    });
    const box3 = new BoxAnnotation({
        annotationLayer: EAnnotationLayer.Background,
        fill: appTheme.PalePink,
        strokeThickness: 0,
        x1: -10,
        x2,
        y1: -10,
        y2,
    });
    const box4 = new BoxAnnotation({
        annotationLayer: EAnnotationLayer.Background,
        fill: appTheme.PaleTeal,
        strokeThickness: 0,
        x1: 10,
        x2,
        y1: -10,
        y2,
    });
    // update the outer corners of each box before the chart draws so that they always fill the plane
    sciChartSurface.preRender.subscribe((data) => {
        box1.x1 = xAxis.visibleRange.min;
        box2.x1 = xAxis.visibleRange.max;
        box3.x1 = xAxis.visibleRange.min;
        box4.x1 = xAxis.visibleRange.max;
        box1.y1 = yAxis.visibleRange.min;
        box2.y1 = yAxis.visibleRange.min;
        box3.y1 = yAxis.visibleRange.max;
        box4.y1 = yAxis.visibleRange.max;
    });
    sciChartSurface.annotations.add(box1, box2, box3, box4);
    const xValues = [];
    const yValues = [];
    const zValues = [];
    const metadata = [];
    for (const item of happinessData) {
        xValues.push(parseFloat(item.GDP));
        yValues.push(parseFloat(item.Happiness));
        zValues.push((Math.log2(parseInt(item.Population)) - 18) * 5);
        //console.log(item.Entity, parseFloat(item.GDP), parseFloat(item.Happiness));
        metadata.push({ isSelected: false, name: item.Entity, continent: item.Continent });
    }
    const dataSeries = new XyzDataSeries(wasmContext, { xValues, yValues, zValues, metadata });
    const series = new FastBubbleRenderableSeries(wasmContext, {
        dataSeries,
        paletteProvider: new ContinentPaletteProvider(),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            opacity: 0.6,
        }),
        dataLabels: {
            color: "#000000C0",
            style: {
                fontFamily: "Arial",
                fontSize: 14,
            },
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Below,
            metaDataSelector: (metadata) => metadata.name,
        },
        animation: new SweepAnimation({ duration: 2000 }),
    });
    sciChartSurface.renderableSeries.add(series);
    const legend = new ManualLegend(
        {
            textColor: "black",
            backgroundColor: "#E0E0E077",
            items: [
                {
                    name: "Bubble size represents population",
                    color: "transparent",
                    id: "pop",
                    checked: false,
                    showMarker: false,
                },
                {
                    name: "Bubble color indicates continent",
                    color: "transparent",
                    id: "col",
                    checked: false,
                    showMarker: false,
                },
                { name: "Europe", color: appTheme.VividBlue, id: "Europe", checked: false },
                { name: "Asia", color: appTheme.VividPurple, id: "Asia", checked: false },
                { name: "North America", color: appTheme.VividPink, id: "NorthAmerica", checked: false },
                { name: "South America", color: appTheme.VividGreen, id: "SouthAmerica", checked: false },
                { name: "Oceania", color: appTheme.VividBlue, id: "VividTeal", checked: false },
                { name: "Africa", color: appTheme.VividOrange, id: "Africa", checked: false },
            ],
        },
        sciChartSurface
    );
    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};
