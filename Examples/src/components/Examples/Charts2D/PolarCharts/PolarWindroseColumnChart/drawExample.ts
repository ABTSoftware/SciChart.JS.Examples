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
    PolarStackedColumnCollection,
    PolarStackedColumnRenderableSeries,
    TFormatLabelFn,
    NumericLabelProvider,
    EDataPointWidthMode,
    WaveAnimation
} from "scichart";
import { appTheme } from "../../../theme";

function getBiasedRandomWalkInBounds(min: number, max: number, count: number) {
    // Generate the base random walk
    const baseValues = [min];
    for (let i = 1; i < count; i++) {
        const next = baseValues[i - 1] + Math.random() - 0.5;
        baseValues.push(Math.min(max, Math.max(min, next)));
    }

    // Apply an angular bias so that the random walk values become
    return baseValues.map((val, i) => {
        const angle = (i * 360) / count;
        const angleRad = (angle * Math.PI) / 180;
        // bias ranges from 0.5 to 1.5: peaks at 0°/180°, dips at 90°/270°
        const bias = 1 + 0.3 * Math.sin(2 * angleRad);
        return val * bias;
    });
}

/**
 * Custom label provider that displays compass directions at 45 degree intervals,  
 * if any label value is NOT from `[0, 45, 90, 135, 180, 225, 270, 315]` it will be a decimal.
 */
class CustomNESWLabelProvider extends NumericLabelProvider {
    public LABELS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    public get formatLabel(): TFormatLabelFn {
        return (dataValue: number) => {
            if (dataValue % 45 === 0) {
                return this.LABELS[dataValue / 45];
            }
            return dataValue.toFixed(0) + "°";
        };
    }
}

const COLUMN_COUNT = 24;

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        labelStyle: {
            color: "white"
        },
        startAngle: Math.PI / 2, // draw labels at 12 o'clock
        autoTicks: false,
        majorDelta: 1,
        labelPrecision: 0,
        innerRadius: 0.05 // center hole
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        visibleRange: new NumberRange(0, 360),
        flippedCoordinates: true, // go clockwise
        startAngle: Math.PI / 2, // start at 12 o'clock
        axisAlignment: EAxisAlignment.Top,
        useNativeText: true,
        labelProvider: new CustomNESWLabelProvider(),
        autoTicks: false,
        majorDelta: 15,
        zoomExtentsToInitialRange: true
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const xValues = Array.from({length: COLUMN_COUNT}, (_, i) => i * 360 / COLUMN_COUNT); // [0, 10, ..., 350],
    const yValues = [
        getBiasedRandomWalkInBounds(1, 2, COLUMN_COUNT),
        getBiasedRandomWalkInBounds(0.3, 1, COLUMN_COUNT),
        getBiasedRandomWalkInBounds(0.3, 1, COLUMN_COUNT),
        getBiasedRandomWalkInBounds(0.5, 2, COLUMN_COUNT),
        getBiasedRandomWalkInBounds(0.2, 0.4, COLUMN_COUNT),
    ];

    const COLORS = [
        appTheme.DarkIndigo,
        appTheme.Indigo,
        appTheme.VividGreen,
        appTheme.VividOrange,
        appTheme.VividPink,
    ]

    const collection = new PolarStackedColumnCollection(wasmContext, {
        isOneHundredPercent: false,
    });
    collection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });
    
    for(let i = 0; i < yValues.length; i++) {
        const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues: yValues[i] });
        const polarColumn = new PolarStackedColumnRenderableSeries(wasmContext, {
            dataSeries,
            fill: COLORS[i],
            stroke: appTheme.DarkIndigo,
            strokeThickness: 2,
            dataPointWidthMode: EDataPointWidthMode.Range,
        });
        collection.add(polarColumn);
    }
    sciChartSurface.renderableSeries.add(collection);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};