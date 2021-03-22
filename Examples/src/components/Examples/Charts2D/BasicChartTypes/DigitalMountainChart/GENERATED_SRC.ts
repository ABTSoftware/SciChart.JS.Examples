export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import classes from "../../../../Examples/Examples.module.scss";
import { WaveAnimation } from "../../../../../../../../SciChart.Dev/Web/src/SciChart/lib/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";

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
            growBy: new NumberRange(0.05, 0.05),
            axisTitle: "Y-Axis",
            labelFormat: ENumericFormat.Decimal_2
        })
    );

    // Create a Mountain Series and add to the chart
    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        stroke: "#4682b4",
        strokeThickness: 2,
        zeroLineY: 0.0,
        fill: "rgba(176, 196, 222, 0.7)", // when a solid color is required, use fill
        // when a gradient is required, use fillLinearGradient
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70,130,180,1)", offset: 0 },
            { color: "rgba(70,130,180,0.2)", offset: 1 }
        ]),
        isDigitalLine: true,
        animation: new WaveAnimation({ duration: 1000, fadeEffect: true, zeroLine: 0 })
    });
    sciChartSurface.renderableSeries.add(mountainSeries);

    // Create some Xy data and assign to the mountain series
    const dataSeries = new XyDataSeries(wasmContext);
    const POINTS = 100;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= POINTS; i++) {
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

export default function DigitalMountainChart() {
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
`;