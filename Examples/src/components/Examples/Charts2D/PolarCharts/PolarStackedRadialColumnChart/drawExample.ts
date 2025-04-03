import {
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    EXyDirection,
    PolarCategoryAxis,
    TextLabelProvider,
    PolarStackedColumnCollection,
    PolarStackedColumnRenderableSeries,
    EPolarLabelMode,
    WaveAnimation,
    PolarLegendModifier,
    ELegendPlacement,
    Thickness,
    ETitlePosition,
    GradientParams,
    Point
} from "scichart";
import { appTheme } from "../../../theme";

const DATA: Record<string, number[]> = {
    "Norway": [122, 125, 111],
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

const MEDALS = [
    {
        type: "Gold",
        color: appTheme.MutedOrange,
    },
    {
        type: "Silver",
        color: appTheme.PaleBlue,
    },
    {
        type: "Bronze",
        color: appTheme.MutedRed,
    }
];

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Winter Olympic medals per country",
        titleStyle: {
            fontSize: 24,
        }
    });

    // Create Polar, Radial axes
    const xAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(-1, 9),
        autoTicks: false,
        labelStyle: {
            color: "white",
        },
        majorDelta: 1,
        useNativeText: true,
        flippedCoordinates: true, // Norway will be outermost, Finland innermost
        zoomExtentsToInitialRange: true,
        innerRadius: 0.1, // donut hole
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        startAngle: Math.PI,
    });
    xAxis.labelProvider = new TextLabelProvider({
        labels: Object.keys(DATA),
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        flippedCoordinates: true,
        labelPrecision: 0,
        useNativeText: true,
        autoTicks: false,
        majorDelta: 25,
        startAngle: Math.PI,
        totalAngle: Math.PI * 3 / 2 // 270 degrees, 3/4 of the circle
    });
    sciChartSurface.yAxes.add(yAxis);

    // SERIES
    const collection = new PolarStackedColumnCollection(wasmContext);
    // collection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });
    
    const xValues = Array.from({ length: COUNTRIES.length }, (_, i) => i);
    for(let i = 0; i < 3; i++){
        const polarColumn = new PolarStackedColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues: COUNTRIES.map(country => DATA[country][i]),
                dataSeriesName: MEDALS[i].type,
            }),
            stroke: "white",
            strokeThickness: 1,
            fill: MEDALS[i].color, // keep the "fill" although overriden by "fillLinearGradient" for legend marker color
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: MEDALS[i].color, offset: 0.5 },
                { color: "#333333", offset: 1 },
            ]),
        });
        collection.add(polarColumn);
    }

    sciChartSurface.renderableSeries.add(collection);

    // MODIFIERS
    sciChartSurface.chartModifiers.add(
        new PolarPanModifier({
            xyDirection: EXyDirection.XyDirection,
            zoomSize: true,
            growFactor: 1
        }),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier(),
        new PolarLegendModifier({
            placement: ELegendPlacement.TopLeft,
            backgroundColor: "rgba(0,0,0,0.3)",
            showCheckboxes: true,
        })
    );

    return { sciChartSurface, wasmContext };
};