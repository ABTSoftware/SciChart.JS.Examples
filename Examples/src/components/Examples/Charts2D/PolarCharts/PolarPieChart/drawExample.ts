import {
    PolarColumnRenderableSeries,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EColor, 
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    Thickness, 
    GradientParams, 
    Point, 
    EPolarLabelMode,
    WaveAnimation,
    XyxDataSeries,
    EColumnMode,
    MetadataPaletteProvider,
    IColorMetadata,
    XDataSeries,
    PolarLegendModifier
} from "scichart";
import { appTheme } from "../../../theme";

const DATA = [
    { label: "React.js", color: appTheme.MutedBlue, value: 45 },
    { label: "Angular", color: appTheme.VividRed, value: 31 },
    { label: "Vue.js", color: appTheme.VividTeal, value: 14 },
    { label: "Svelte", color: appTheme.VividOrange, value: 5 },
    { label: "Next.js", color: appTheme.DarkIndigo, value: 3 },
    { label: "Ember.js", color: appTheme.MutedRed, value: 2 }
];

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Most Popular JS Frameworks 2024",
        titleStyle: {
            fontSize: 24
        }
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        visibleRangeLimit: new NumberRange(0, 1),
        startAngleDegrees: 90,
        isVisible: false
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        startAngleDegrees: 90,
        flippedCoordinates: true,
        isVisible: false
    });
    sciChartSurface.xAxes.add(angularXAxis);

    const metadata: IColorMetadata[] = [];
    const xValues: number[] = [];

    for (let i = 0; i < DATA.length; i++) {
        xValues.push(DATA[i].value);
        metadata.push({ 
            isSelected: false,
            fill: DATA[i].color,
        });
    }

    const polarColumn = new PolarColumnRenderableSeries(wasmContext, {
        dataSeries: new XyxDataSeries(wasmContext, {
            xValues: xValues,
            x1Values: xValues.map((_, i) => xValues[i + 1] || 0),
            yValues: Array(xValues.length).fill(1),
            metadata
        }),
        stroke: "black",
        strokeThickness: 2,
        columnXMode: EColumnMode.StartWidth,
        paletteProvider: new MetadataPaletteProvider(), // use colors from the metadata for each column value
    });

    polarColumn.getXRange = () => {
        return new NumberRange(0, xValues.reduce((a, b) => a + b, 0) / 2);
    };

    sciChartSurface.renderableSeries.add(polarColumn);

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier(),
        new PolarZoomExtentsModifier(),
        new PolarMouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};