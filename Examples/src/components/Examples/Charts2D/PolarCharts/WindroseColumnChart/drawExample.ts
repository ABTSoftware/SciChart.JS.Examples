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
    NumericLabelProvider
} from "scichart";
import { appTheme } from "../../../theme";

function getRandomWalkInBounds(min: number, max: number, count: number) {
    const result = [min];
    for (let i = 1; i < count; i++) {
        const next = result[i - 1] + Math.random() - 0.5;
        result.push(Math.min(max, Math.max(min, next)));
    }
    return result;
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

const COLUMN_COUNT = 36;

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        drawSeriesBehindAxis: true
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Right,
        polarAxisMode: EPolarAxisMode.Radial,
        drawLabels: false,
        drawMinorGridLines: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        innerRadius: 0.1 // donut hole
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
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const xValues = Array.from({length: COLUMN_COUNT}, (_, i) => i * 360 / COLUMN_COUNT); // [0, 10, ..., 350],
    const yValues = [
        getRandomWalkInBounds(1, 2, COLUMN_COUNT),
        getRandomWalkInBounds(0.3, 1, COLUMN_COUNT),
        getRandomWalkInBounds(0.3, 1, COLUMN_COUNT),
        getRandomWalkInBounds(0.4, 1, COLUMN_COUNT),
        getRandomWalkInBounds(0.5, 2, COLUMN_COUNT),
        getRandomWalkInBounds(0.2, 2, COLUMN_COUNT),
        getRandomWalkInBounds(1, 2, COLUMN_COUNT) ////// not included, but adds to the visible range 
    ];

    const COLORS = [
        // appTheme.VividRed, ///// not included
        appTheme.DarkIndigo,
        appTheme.Indigo,
        appTheme.VividSkyBlue,
        appTheme.VividGreen,
        appTheme.MutedRed,
        appTheme.VividOrange,
        appTheme.VividPink,
        "#FFF"
    ]

    const collection = new PolarStackedColumnCollection(wasmContext);

    for(let i = 0; i < yValues.length; i++) {
        const dataSeries = new XyDataSeries(wasmContext, { xValues, yValues: yValues[i] });
        const polarColumn = new PolarStackedColumnRenderableSeries(wasmContext, {
            dataSeries,
            fill: COLORS[i],
            // column stroke ??
        });
        collection.add(polarColumn);
    }
    sciChartSurface.renderableSeries.add(collection);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    // sciChartSurface.zoomExtents(); // this breaks the visibleRange
    return { sciChartSurface, wasmContext };
};