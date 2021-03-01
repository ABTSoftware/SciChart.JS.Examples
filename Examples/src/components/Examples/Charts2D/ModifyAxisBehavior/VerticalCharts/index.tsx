import * as React from "react";
import { NumberRange } from "scichart/Core/NumberRange";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import classes from "../../../../Examples/Examples.module.scss";

const divElementId2 = "chart2";

const X_TITLE = "X Axis";
const Y_TITLE = "Y Axis";

// Chart data for y=sin(x*0.1)
const xValues: number[] = [];
const yValues: number[] = [];
for (let i = 0; i <= 100; i++) {
    const x = 0.1 * i;
    xValues.push(x);
    yValues.push(Math.sin(x));
}

const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId2);

    // Setting an XAxis on the Left or Right
    // and YAxis on the Top or Bottom
    // causes the chart and series to be rotated vertically
    const xAxis = new NumericAxis(wasmContext);
    xAxis.axisAlignment = EAxisAlignment.Left;
    xAxis.axisTitle = X_TITLE;
    xAxis.growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.axisAlignment = EAxisAlignment.Top;
    yAxis.axisTitle = Y_TITLE;
    yAxis.growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.yAxes.add(yAxis);

    // An axis may be optionally flipped using flippedCoordinates property
    xAxis.flippedCoordinates = true;

    // Add a series with sinewave. This will be drawn vertically.
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            stroke: "#ff6600"
        })
    );

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(new RolloverModifier({ isVerticalChart: true }));

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface };
};

export default function VerticalCharts() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId2} className={classes.ChartWrapper} />;
}
