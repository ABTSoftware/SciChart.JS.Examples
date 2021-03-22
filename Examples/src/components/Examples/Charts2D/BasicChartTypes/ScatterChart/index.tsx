import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {
    EStrokePaletteMode,
    IPointMarkerPaletteProvider,
    TPointMarkerArgb
} from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import classes from "../../../../Examples/Examples.module.scss";
import { ScaleAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/ScaleAnimation";
import { uintArgbColorMultiplyOpacity } from "scichart/utils/colorUtil";

// tslint:disable:no-empty

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create X,Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Create a Scatter Series with EllipsePointMarker
    // Multiple point-marker types are available including Square, Triangle, Cross and Sprite (custom)
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            strokeThickness: 1,
            fill: "steelblue",
            stroke: "LightSteelBlue"
        }),
        // Optional: PaletteProvider feature allows coloring per-point based on a rule
        paletteProvider: new ScatterPaletteProvider(),
        animation: new ScaleAnimation({ duration: 5000, fadeEffect: true })
    });
    sciChartSurface.renderableSeries.add(scatterSeries);

    // Create some Xy data and assign to the Scatter Series
    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 100; i++) {
        dataSeries.append(i, Math.sin(i * 0.1));
    }
    scatterSeries.dataSeries = dataSeries;

    // Optional: Add Interactivity Modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};

/**
 * Optional: Implement a IPointMarkerPaletteProvider which colors every tenth scatter point
 * to demonstrate the PaletteProvider feature
 */
class ScatterPaletteProvider implements IPointMarkerPaletteProvider {
    readonly strokePaletteMode: EStrokePaletteMode;
    private overrideStroke: number = parseColorToUIntArgb("Red");
    private overrideFill: number = parseColorToUIntArgb("DarkRed");
    onAttached(parentSeries: IRenderableSeries): void {}

    onDetached(): void {}

    overridePointMarkerArgb(xValue: number, yValue: number, index: number, opacity: number): TPointMarkerArgb {
        // Y-values which are outside the range +0.5, -0.5 are colored red, while all other values are left default.
        if (yValue >= 0.5 || yValue <= -0.5) {
            const stroke =
                opacity !== undefined
                    ? uintArgbColorMultiplyOpacity(this.overrideStroke, opacity)
                    : this.overrideStroke;
            const fill =
                opacity !== undefined ? uintArgbColorMultiplyOpacity(this.overrideFill, opacity) : this.overrideFill;
            return { stroke, fill };
        }
        // Undefined means use default colors
        return undefined;
    }
}

export default function ScatterChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
