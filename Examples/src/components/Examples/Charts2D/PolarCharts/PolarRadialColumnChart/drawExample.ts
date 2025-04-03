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
    PolarColumnRenderableSeries,
    GradientParams,
    Point,
    EDataPointWidthMode,
    IStrokePaletteProvider,
    IFillPaletteProvider,
    IRenderableSeries,
    EFillPaletteMode,
    IPointMetadata,
    EStrokePaletteMode,
    parseColorToUIntArgb,
    IPaletteProvider
} from "scichart";
import { appTheme } from "../../../theme";


export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        drawSeriesBehindAxis: true,
        title: "Lighthouse report",
        titleStyle: {
            fontSize: 24,
            color: "white"
        }
    });

    const xAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(0, 4),
        autoTicks: false,
        majorDelta: 1,
        useNativeText: true,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        innerRadius: 0.3, // donut hole
        polarLabelMode: EPolarLabelMode.Horizontal,
        startAngle: Math.PI / 2 // start at 12 o'clock
    });
    xAxis.labelProvider = new TextLabelProvider({
        labels: [
            "Performance",
            "SEO",
            "Accesibilty",
            "Best Practices",
        ]
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 100),

        // flippedCoordinates: true,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        drawMajorTickLines: false,
        labelPrecision: 0,
        useNativeText: true,
        autoTicks: false,
        majorDelta: 10,
        startAngle: Math.PI / 2,        
    });
    sciChartSurface.yAxes.add(yAxis);

    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3],
            yValues: [96, 88, 112, 92]
        }),
        dataPointWidth: 0.8,
        dataPointWidthMode: EDataPointWidthMode.Range,
        strokeThickness: 0,
        fillLinearGradient: new GradientParams(
            new Point(1, 0),
            new Point(0, 0),
            [
                { offset: 0, color: "#DD3333" },
                { offset: 1, color: "#33AA33" },
            ]
        )
    });

    sciChartSurface.renderableSeries.add(polarColumn);

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