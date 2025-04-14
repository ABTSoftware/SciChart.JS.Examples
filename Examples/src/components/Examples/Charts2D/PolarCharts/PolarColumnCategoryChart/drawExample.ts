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
    EPolarLabelMode,
    PolarCategoryAxis,
    DefaultPaletteProvider,
    parseColorToUIntArgb,
    EStrokePaletteMode,
    WaveAnimation,
    Thickness
} from "scichart";
import { appTheme } from "../../../theme";

// Custom PaletteProvider for column series which colours datapoints above a threshold
class ColumnPaletteProvider extends DefaultPaletteProvider {
    private threshold: number;
    private positiveFillColor: number;
    private positiveStroke: number;

    private negativeFillColor: number;
    private negativeStroke: number;

    constructor(threshold: number) {
        super();
        this.strokePaletteMode = EStrokePaletteMode.SOLID;
        this.threshold = threshold;
        this.positiveStroke = parseColorToUIntArgb(appTheme.VividRed);
        this.positiveFillColor = parseColorToUIntArgb(appTheme.VividRed, 127);
        this.negativeStroke = parseColorToUIntArgb(appTheme.VividBlue);
        this.negativeFillColor = parseColorToUIntArgb(appTheme.VividBlue, 127); // 127/255 opacity
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
        return yValue < this.threshold 
            ? this.positiveStroke 
            : this.negativeStroke;
    }

    overrideFillArgb(xValue: number, yValue: number, index: number, opacity: number, metadata: any) {
        return yValue < this.threshold 
            ? this.positiveFillColor 
            : this.negativeFillColor;
    }
}

const DATA_UK = {
    labels: [
        "Poultry", "Fruit", "Milk", "Cheese", "Pizza", "Meat", "Cereals",
        "Eggs", "Oats", "Lamb", "Butter", "Chocolate", "Sheep", "OliveOil"
    ],
    data: [
        -18.5, -12.5, -11.7, -9.2, -7.2, -6.8, -5.9, 
        7.8, 9.1, 10.2, 10.2, 11.7, 17.6, 22.1
    ]
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Cunsumer prices relative to past year in UK, 2024",
        titleStyle: {
            fontSize: 24,
        }
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(
            DATA_UK.data.reduce((a, b) => Math.min(a, b), 0), 
            DATA_UK.data.reduce((a, b) => Math.max(a, b), 0) + 4 // +4 to have space for the topmost datalabel
        ),
        drawMinorTickLines: false,
        drawMajorTickLines: false,
        useNativeText: true,
        drawMinorGridLines: false,
        zoomExtentsToInitialRange: true,
        majorGridLineStyle: {
            strokeDashArray: [6, 6],
            strokeThickness: 1,
            color: "gray"
        },
        labelPostfix: "%",
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
        innerRadius: 0.15,
        startAngle: Math.PI / 2,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarCategoryAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,
        visibleRange: new NumberRange(-1, DATA_UK.data.length),
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        useNativeText: true,
        zoomExtentsToInitialRange: true,
        flippedCoordinates: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
        totalAngle: Math.PI * 2,
        startAngle: Math.PI / 2,
        autoTicks: false,
        majorDelta: 1,
        labels: DATA_UK.labels
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: DATA_UK.data.length }, (_, i) => i),
            yValues: DATA_UK.data
        }),
        // dataLabels: {
        //     style: {
        //         fontSize: 14,
        //     },
        //     color: "white",
        //     precision: 0,
        // },
        dataPointWidth: 0.6,
        strokeThickness: 2,
        paletteProvider: new ColumnPaletteProvider(0), 
        animation: new WaveAnimation({ duration: 800, zeroLine: 0, fadeEffect: true }),
    });
    sciChartSurface.renderableSeries.add(polarColumn);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};