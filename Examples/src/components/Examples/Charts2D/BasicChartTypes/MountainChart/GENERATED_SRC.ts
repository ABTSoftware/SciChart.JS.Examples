export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { NumberRange } from "scichart/Core/NumberRange";
import { ENumericFormat } from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider,
} from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Top,
            axisTitle: "X-Axis",
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.05, 0.05),
            axisTitle: "Y-Axis",
            labelFormat: ENumericFormat.Decimal_2,
        })
    );

    // Create a Mountain Series and add to the chart
    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        stroke: "#4682b4",
        strokeThickness: 5,
        zeroLineY: 0.0,
        fill: "rgba(176, 196, 222, 0.7)", // is not used, because we have fillLinearGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70,130,180,1)", offset: 0 },
            { color: "rgba(70,130,180,0.2)", offset: 1 },
        ]),
        // Optional: Allows per-point colouring of mountain fill and stroke
        // paletteProvider: new MountainPaletteProvider(),
    });
    sciChartSurface.renderableSeries.add(mountainSeries);

    // Create some Xy data and assign to the mountain series
    const dataSeries = new XyDataSeries(wasmContext);
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
        dataSeries.append(i, Math.abs(Math.sin(i * STEP)));
    }
    mountainSeries.dataSeries = dataSeries;

    // Optional: Add some interactivity to the chart
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier({ fill: "#228B2255", stroke: "#228B22CC", strokeThickness: 3 })
    );
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

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
    private fillColor: number = parseColorToUIntArgb("FF0000");
    private strokeColor: number = parseColorToUIntArgb("FF000077");

    onAttached(parentSeries: IRenderableSeries): void {}
    onDetached(): void {}
    /**
     * Called by SciChart and may be used to override the color of filled polygon in various chart types.
     * @remarks WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE
     * @param renderSeries
     * @returns an ARGB color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
     */
    overrideFillArgb(xValue: number, yValue: number, index: number): number {
        return yValue > 0.8 ? this.fillColor : undefined;
    }
    /**
     * Called by SciChart and may be used to override the color of a line segment or
     * stroke outline in various chart types.
     * @remarks WARNING: CALLED PER-VERTEX, MAY RESULT IN PERFORMANCE DEGREDATION IF COMPLEX CODE EXECUTED HERE
     * @returns an ARGB color code, e.g. 0xFFFF0000 would be red, or 'undefined' for default colouring
     */
    overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        return yValue > 0.8 ? this.strokeColor : undefined;
    }
}

export default function MountainChart() {
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