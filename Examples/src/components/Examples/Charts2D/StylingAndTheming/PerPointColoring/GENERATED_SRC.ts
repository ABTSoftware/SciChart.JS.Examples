export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { TSciChart } from "scichart/types/TSciChart";
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IPointMarkerPaletteProvider,
    IStrokePaletteProvider,
    TPointMarkerArgb,
} from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";

// tslint:disable:no-empty
// tslint:disable:max-classes-per-file

const divElementId = "chart";

const createLineData = (wasmContext: TSciChart) => {
    const xyDataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 250; i++) {
        xyDataSeries.append(i, Math.sin(i * 0.05));
    }
    return xyDataSeries;
};

const createMountainData = (wasmContext: TSciChart) => {
    const xyDataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 250; i++) {
        xyDataSeries.append(i, Math.sin(i * 0.05) * Math.sin((i + 50) * 0.002));
    }
    return xyDataSeries;
};

const createScatterData = (wasmContext: TSciChart) => {
    const xyDataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 100; i++) {
        xyDataSeries.append(i * 2.5, Math.sin((i + 50) * 0.05));
    }
    return xyDataSeries;
};

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create XAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis",
            growBy: new NumberRange(0.1, 0.1),
        })
    );

    // Create YAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Right Y Axis",
            growBy: new NumberRange(0.1, 0.1),
        })
    );

    // Create a line series with a PaletteProvider. See implementation of LinePaletteProvider below
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            stroke: "SteelBlue",
            strokeThickness: 5,
            dataSeries: createLineData(wasmContext),
            // The LinePaletteProvider (declared below) implements per-point coloring for line series
            paletteProvider: new LinePaletteProvider("#55FF55", yValue => yValue > 0.5),
        })
    );

    // Create a mountain series with PaletteProvider. See implementation of MountainPaletteProvider below
    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            stroke: "#B0C4DE",
            fill: "#B0C4DE55",
            strokeThickness: 5,
            dataSeries: createMountainData(wasmContext),
            // The MountainPaletteProvider (declared below) implements per-point coloring for mountain series
            paletteProvider: new MountainPaletteProvider("#FF555533", "#FF5555", yValue => yValue > 0.1),
        })
    );

    // Create a Scatter series with PaletteProvider. See implementation of ScatterPaletteProvider below
    sciChartSurface.renderableSeries.add(
        new XyScatterRenderableSeries(wasmContext, {
            dataSeries: createScatterData(wasmContext),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 7,
                height: 7,
                strokeThickness: 2,
                fill: "#FF6600",
                stroke: "white",
            }),
            // The ScatterPaletteProvider (declared below) implements per-point coloring for scatter series
            paletteProvider: new ScatterPaletteProvider("#FF6600", "white", yValue => yValue < -0.8),
        })
    );

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
};

/**
 * An example PaletteProvider which implements IStrokePaletteProvider.
 * This can be attached to line, mountain, column or candlestick series to change the stroke of the series conditionally
 */
class LinePaletteProvider implements IStrokePaletteProvider {
    /**
     * This property chooses how colors are blended when they change
     */
    readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.GRADIENT;
    private stroke: number;
    private rule: (yValue: number) => boolean;

    constructor(stroke: string, rule: (yValue: number) => boolean) {
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
    }

    onAttached(parentSeries: IRenderableSeries): void {}
    onDetached(): void {}

    /**
     * Called by SciChart and may be used to override the color of a line segment or
     * stroke outline in various chart types.
     * @remarks WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE
     * @param renderSeries
     * @param xValue the current XValue
     * @param yValue the current YValue
     * @param index the current index to the data
     * @returns an ARGB color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
     */
    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        // Conditional logic for coloring here. Returning 'undefined' means 'use default renderableSeries.stroke'
        // else, we can return a color of choice.
        //
        // Note that colors returned are Argb format as number. There are helper functions which can convert from Html
        // color codes to Argb format.
        //
        // Performance considerations: overrideStrokeArgb is called per-point on the series when drawing.
        // Caching color values and doing minimal logic in this function will help performance
        return this.rule(yValue) ? this.stroke : undefined;
    }
}

/**
 * An example PaletteProvider which implements IStrokePaletteProvider and IFillPaletteProvider
 * This can be attached to line, mountain, column or candlestick series to change the stroke or fill
 * of the series conditionally
 */
class MountainPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    /**
     * This property chooses how stroke colors are blended when they change
     */
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.GRADIENT;
    /**
     * This property chooses how fills are blended when they change
     */
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.GRADIENT;
    private readonly stroke: number;
    private readonly fill: number;
    private readonly rule: (yValue: number) => boolean;

    constructor(fill: string, stroke: string, rule: (yValue: number) => boolean) {
        this.rule = rule;
        this.fill = parseColorToUIntArgb(fill);
        this.stroke = parseColorToUIntArgb(stroke);
    }

    onAttached(parentSeries: IRenderableSeries): void {}
    onDetached(): void {}
    /**
     * Called by SciChart and may be used to override the color of filled polygon in various chart types.
     * @remarks WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE
     * @param renderSeries
     * @returns an ARGB color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
     */
    overrideFillArgb(xValue: number, yValue: number, index: number): number {
        return this.rule(yValue) ? this.fill : undefined;
    }
    /**
     * Called by SciChart and may be used to override the color of a line segment or
     * stroke outline in various chart types.
     * @remarks WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE
     * @returns an ARGB color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
     */
    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return this.rule(yValue) ? this.stroke : undefined;
    }
}

/**
 * An example PaletteProvider which implements IPointMarkerPaletteProvider
 * This can be attached to scatter series to change the stroke or fill
 * of the series conditionally
 */
class ScatterPaletteProvider implements IPointMarkerPaletteProvider {
    readonly strokePaletteMode: EStrokePaletteMode;
    private readonly stroke: number;
    private readonly fill: number;
    private readonly rule: (yValue: number) => boolean;

    constructor(stroke: string, fill: string, rule: (yValue: number) => boolean) {
        this.rule = rule;
        this.stroke = parseColorToUIntArgb(stroke);
        this.fill = parseColorToUIntArgb(fill);
    }

    onAttached(parentSeries: IRenderableSeries): void {}

    onDetached(): void {}

    overridePointMarkerArgb(xValue: number, yValue: number, index: number): TPointMarkerArgb {
        if (this.rule(yValue)) {
            return {
                fill: this.fill,
                stroke: this.stroke,
            };
        }
        return undefined;
    }
}

export default function StylingInCode() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
`;