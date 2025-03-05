import {
    PolarColumnRenderableSeries,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    GradientParams, 
    Point, 
    EXyDirection,
    EDataPointWidthMode,
    EColumnMode,
    PolarCategoryAxis,
    TextLabelProvider,
    ShadowEffect,
    XyxDataSeries,
    PolarStackedColumnCollection,
    PolarStackedColumnRenderableSeries,
    EPolarLabelMode
} from "scichart";
import { appTheme } from "../../../theme";

const DATA: Record<string, number[]> = {
    "Norway": [132, 125, 111],
    "USA": [105, 110, 88],
    "Germany": [92, 88, 60],
    "Canada": [73, 64, 62],
    "Austria": [64, 81, 87],
    "Sweden": [57, 46, 55],
    "Switzerland": [56, 45, 52],
    "Russia": [47, 38, 35],
    "Netherlands": [45, 44, 41],
    "Finland": [43, 55, 59]
}
const COUNTRIES = Object.keys(DATA);

const MEDAL_COLORS = [
    appTheme.PaleOrange, // Gold - does not show at all, series starts with "appTheme.PaleBlue"
    appTheme.PaleBlue, // Silver
    appTheme.MutedRed // Bronze
]

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        drawSeriesBehindAxis: true,
        title: "Winter Olympic medals per existing country (TOP 10)",
        titleStyle: {
            fontSize: 24,
            color: "white"
        }
    });

    const xAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRange: new NumberRange(-1, 10),
        axisAlignment: EAxisAlignment.Left,
        autoTicks: false,
        majorDelta: 1,
        useNativeText: true, // Norway will be outmost, Finland innermost
        flippedCoordinates: true,
        innerRadius: 0.1, // donut hole
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        startAngle: Math.PI / 2,
        polarLabelMode: EPolarLabelMode.Horizontal
    });
    xAxis.labelProvider = new TextLabelProvider({
        labels: Object.keys(DATA),
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,

        flippedCoordinates: true,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        drawMajorTickLines: false,
        labelPrecision: 0,
        useNativeText: true,
        autoTicks: false,
        majorDelta: 25,
        startAngle: Math.PI / 2,
        // totalAngle: Math.PI * 3 / 2
    });
    sciChartSurface.yAxes.add(yAxis);

    const collection = new PolarStackedColumnCollection(wasmContext);

    for(let i = 0; i < 3; i++){
        const polarColumn = new PolarStackedColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: Array.from({ length: COUNTRIES.length }, (_, i) => i),
                yValues: COUNTRIES.map(country => DATA[country][i])
            }),
            // stroke: "white",
            fill: MEDAL_COLORS[i],
        });
        collection.add(polarColumn);
    }

    sciChartSurface.renderableSeries.add(collection);

    // CHART MODIFIERS
    sciChartSurface.chartModifiers.add(
        new PolarPanModifier({
            xyDirection: EXyDirection.XyDirection,
            zoomSize: true,
            growFactor: 1
        })
    );
    sciChartSurface.chartModifiers.add(new PolarZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};