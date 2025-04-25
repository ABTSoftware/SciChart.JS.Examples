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
    EPolarLabelMode,
    PolarColumnRenderableSeries,
    EStrokePaletteMode,
    parseColorToUIntArgb,
    DefaultPaletteProvider,
    Thickness,
    EColumnDataLabelPosition,
    WaveAnimation,
    PolarArcZoomModifier
} from "scichart";
import { appTheme } from "../../../theme";

class ColumnPaletteProvider extends DefaultPaletteProvider {
    private readonly strokePalette: number[];
    private readonly fillPalette: number[];

    constructor() {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;

        this.strokePalette = [
            parseColorToUIntArgb(appTheme.VividPink),
            parseColorToUIntArgb(appTheme.MutedRed),
            parseColorToUIntArgb(appTheme.VividOrange),
            parseColorToUIntArgb(appTheme.VividSkyBlue),
            parseColorToUIntArgb(appTheme.Indigo),
        ];

        this.fillPalette = [
            parseColorToUIntArgb(appTheme.VividPink + "88"),
            parseColorToUIntArgb(appTheme.MutedRed + "88"),
            parseColorToUIntArgb(appTheme.VividOrange + "88"),
            parseColorToUIntArgb(appTheme.VividSkyBlue + "88"),
            parseColorToUIntArgb(appTheme.Indigo + "88"), // fills have 50% opacity
        ];
    }

    private getThresholdIndex(yValue: number): number {
        // Clamp value between 0 and 99, then divide into 5 equal parts
        const clamped = Math.max(0, Math.min(99, yValue));
        return Math.floor(clamped / 20);
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
        const idx = this.getThresholdIndex(yValue);
        return this.strokePalette[idx];
    }

    overrideFillArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
        const idx = this.getThresholdIndex(yValue);
        return this.fillPalette[idx];
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme
    });

    const xAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(0.5, 15),
        polarLabelMode: EPolarLabelMode.Horizontal,

        flippedCoordinates: true,
        zoomExtentsToInitialRange: true,
        autoTicks: false,
        majorDelta: 1,
        useNativeText: true,
        labelStyle: {
            padding: new Thickness(4, 4, 4, 4)
        },

        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorGridLines: true,
        drawMajorTickLines: false,
        labelPrecision: 0,
        innerRadius: 0.2, // donut hole
        startAngle: 0 // start at 9 o'clock (since we are have flipped coorinates and default "0" is at 3 o'clock)
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 100),
        zoomExtentsToInitialRange: true,

        flippedCoordinates: true,

        drawMajorGridLines: true,
        drawMinorTickLines: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        labelPrecision: 0,
        useNativeText: true,
        autoTicks: false,
        majorDelta: 10,
        
        totalAngle: Math.PI,        
        startAngle: 0,        
    });
    sciChartSurface.yAxes.add(yAxis);

    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: 15 }, (_, i) => i + 1),
            yValues: [90, 18, 71, 32, 82, 92, 51, 25, 6, 38, 61, 84, 45, 21, 88]
        }),
        dataPointWidth: 0.8,
        paletteProvider: new ColumnPaletteProvider(),
        dataLabels: {
            color: "white",
            style: {
                fontSize: 12,
                padding: new Thickness(0, 0, 0, 0),
            },
            precision: 0,
            labelYPositionMode: EColumnDataLabelPosition.Inside,
            polarLabelMode: EPolarLabelMode.Parallel,
        }, 
        animation: new WaveAnimation({ duration: 500 })
    });

    sciChartSurface.renderableSeries.add(polarColumn);

    // CHART MODIFIERS
    sciChartSurface.chartModifiers.add(
        new PolarArcZoomModifier()
    );
    sciChartSurface.chartModifiers.add(new PolarZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new PolarMouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};