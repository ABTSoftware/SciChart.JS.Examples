export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { NumberRange } from "scichart/Core/NumberRange";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";
import { SplineMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/SplineMountainRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Top,
            axisTitle: "X-Axis"
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            growBy: new NumberRange(0.05, 0.2),
            axisTitle: "Y-Axis",
            labelFormat: ENumericFormat.Decimal_2
        })
    );

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
    const yValues = [50, 35, 61, 58, 50, 50, 40, 53, 55, 23, 45, 12, 59, 60];

    // Create an XyDataSeries as data source
    const xyDataSeries = new XyDataSeries(wasmContext);
    xyDataSeries.appendRange(xValues, yValues);

    // Create a Mountain Series and add to the chart
    const mountainSeries = new SplineMountainRenderableSeries(wasmContext, {
        interpolationPoints: 10, // Sets number of points to interpolate to smooth the line
        stroke: "#4682b4",
        strokeThickness: 5,
        zeroLineY: 0.0,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70,130,180,1)", offset: 0 },
            { color: "rgba(70,130,180,0.2)", offset: 1 }
        ]),
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, stroke: "#006400", fill: "#FFFFFF" }),
        dataSeries: xyDataSeries,
        animation: new WaveAnimation({ duration: 1000, fadeEffect: false, zeroLine: 10 })
    });
    sciChartSurface.renderableSeries.add(mountainSeries);

    // Optional: Add some interactivity to the chart
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(
        new RubberBandXyZoomModifier({ fill: "#228B2255", stroke: "#228B22CC", strokeThickness: 3 })
    );
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

let scs: SciChartSurface;

export default function SplineMountainChart() {
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => scs?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
`;