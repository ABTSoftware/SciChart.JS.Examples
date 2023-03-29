import * as React from "react";
import {
    XyDataSeries,
    XyzDataSeries,
    NumericAxis,
    FastBubbleRenderableSeries,
    SciChartSurface,
    NumberRange,
    EllipsePointMarker,
    EFillPaletteMode,
    EStrokePaletteMode,
    IPointMarkerPaletteProvider,
    TPointMarkerArgb,
    IRenderableSeries,
    IPointMetadata,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    parseColorToUIntArgb,
    SplineLineRenderableSeries,
    SweepAnimation
} from "scichart";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";


const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface with X,Y Axis
    const {
        sciChartSurface,
        wasmContext
    } = await SciChartSurface.create(divElementId, {theme: appTheme.SciChartJsTheme});
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {growBy: new NumberRange(0.05, 0.05)}));

    // Create some data
    const xValues = [];
    const yValues = [];
    const zValues = [];
    let prevYValue = 0;
    for (let i = 0; i < 20; i++) {
        const curYValue = Math.sin(i) * 10 + 5;
        const size = Math.sin(i) * 60 + 3;

        xValues.push(i);
        yValues.push(prevYValue + curYValue);
        zValues.push(size);

        prevYValue += curYValue;
    }

    // Create and add a line series to the chart
    sciChartSurface.renderableSeries.add(new SplineLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {xValues, yValues}),
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 3,
        animation: new SweepAnimation({duration: 500})
    }));

    // Create and add a Bubble series to the chart
    // The Bubble series requires a special dataseries type called XyzDataSeries with X,Y and Z (size) values
    sciChartSurface.renderableSeries.add(new FastBubbleRenderableSeries(wasmContext, {
        dataSeries: new XyzDataSeries(wasmContext, {xValues, yValues, zValues}),
        // Pointmarker defines the marker shown per-bubble point. This will be scaled according to z-value
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            strokeThickness: 0,
            fill: appTheme.VividSkyBlue + "77"
        }),
        // Optional: Allows per-point colouring of bubble stroke
        paletteProvider: new BubblePaletteProvider(appTheme.VividOrange),
        animation: new SweepAnimation({delay: 200, duration: 500, fadeEffect: true})
    }));

    // Add some zooming and panning behaviour
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return {sciChartSurface, wasmContext};
};

/**
 * Optional: An example PaletteProvider which implements IPointMarkerPaletteProvider
 * This can be attached to Scatter or Bubble series to change the stroke or fill
 * of the series point-markers conditionally
 */
class BubblePaletteProvider implements IPointMarkerPaletteProvider {
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    private readonly fillArgb: number;

    constructor(fillHexString: string) {
        this.fillArgb = parseColorToUIntArgb(fillHexString);
    }

    public onAttached(parentSeries: IRenderableSeries): void {
    }

    public onDetached(): void {
    }

    public overridePointMarkerArgb(xValue: number, yValue: number, index: number, opacity?: number, metadata?: IPointMetadata): TPointMarkerArgb {
        return xValue >= 8 && xValue <= 12 ? {fill: this.fillArgb, stroke: this.fillArgb} : undefined;
    }
}

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function BubbleChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper}/>;
}
