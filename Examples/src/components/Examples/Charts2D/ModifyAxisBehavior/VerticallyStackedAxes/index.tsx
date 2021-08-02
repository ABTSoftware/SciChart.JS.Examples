import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { YAxisDragModifier } from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import { XAxisDragModifier } from "scichart/Charting/ChartModifiers/XAxisDragModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import { TSciChart } from "scichart/types/TSciChart";
import { PinchZoomModifier } from "scichart/Charting/ChartModifiers/PinchZoomModifier";
import { NumberRange } from "scichart/Core/NumberRange";
import { LeftAlignedOuterVerticallyStackedAxisLayoutStrategy } from "scichart/Charting/LayoutManager/LeftAlignedOuterVerticallyStackedAxisLayoutStrategy";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { EXyDirection } from "scichart/types/XyDirection";


const divElementId = "chart1";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    sciChartSurface.layoutManager.leftOuterAxesLayoutStrategy =
        new LeftAlignedOuterVerticallyStackedAxisLayoutStrategy();
        
    const yAxis1 = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
    const yAxis2 = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
    const yAxis3 = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
    const xAxis1 = new NumericAxis(wasmContext);

    const ID_X_AXIS_1 = "xAxis1";
    const ID_Y_AXIS_1 = "yAxis1";
    const ID_Y_AXIS_2 = "yAxis2";
    const ID_Y_AXIS_3 = "yAxis3";

    xAxis1.id = ID_X_AXIS_1;
    xAxis1.axisAlignment = EAxisAlignment.Top;
    sciChartSurface.xAxes.add(xAxis1);

    yAxis1.id = ID_Y_AXIS_1;
    yAxis1.axisAlignment = EAxisAlignment.Left;
    sciChartSurface.yAxes.add(yAxis1);

    yAxis2.id = ID_Y_AXIS_2;
    yAxis2.axisAlignment = EAxisAlignment.Left;
    yAxis2.axisBorder.borderTop = 20;
    yAxis2.axisBorder.borderBottom = 20;
    sciChartSurface.yAxes.add(yAxis2);

    yAxis3.id = ID_Y_AXIS_3;
    yAxis3.axisAlignment = EAxisAlignment.Left;
    sciChartSurface.yAxes.add(yAxis3);

    const lineSeries1 = new FastLineRenderableSeries(wasmContext);
    lineSeries1.yAxisId = ID_Y_AXIS_1;
    lineSeries1.xAxisId = ID_X_AXIS_1;
    lineSeries1.stroke = "yellow";

    const lineSeries2 = new FastLineRenderableSeries(wasmContext);
    lineSeries2.yAxisId = ID_Y_AXIS_2;
    lineSeries2.xAxisId = ID_X_AXIS_1;
    lineSeries2.stroke = "red";

    const lineSeries3 = new FastLineRenderableSeries(wasmContext);
    lineSeries3.yAxisId = ID_Y_AXIS_3;
    lineSeries3.xAxisId = ID_X_AXIS_1;
    lineSeries3.stroke = "blue";

    sciChartSurface.renderableSeries.add(lineSeries1);
    sciChartSurface.renderableSeries.add(lineSeries2);
    sciChartSurface.renderableSeries.add(lineSeries3);

    lineSeries1.dataSeries = getSinewave(wasmContext, 0, 3, 1, 0, 1000, 10);
    lineSeries2.dataSeries = getSinewave(wasmContext, 0, 3, 2, 0, 1000, 10);
    lineSeries3.dataSeries = getSinewave(wasmContext, 0, 3, 3, 0, 1000, 10);

    sciChartSurface.zoomExtents();

    // Optional: Add some interactivity modifiers to enable zooming and panning
    sciChartSurface.chartModifiers.add(
        new YAxisDragModifier(),
        new XAxisDragModifier(),
        new RubberBandXyZoomModifier({xyDirection: EXyDirection.XDirection}),
        new ZoomExtentsModifier()
    );

    return { sciChartSurface, wasmContext };
};

export default function VerticallyStackedAxes() {
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

function getSinewave(
    wasmContext: TSciChart,
    pad: number,
    amplitude: number,
    phase: number,
    dampingFactor: number,
    pointCount: number,
    freq: number
) {
    const dataSeries = new XyDataSeries(wasmContext);

    for (let i = 0; i < pad; i++) {
        const time = 10 * i / pointCount;
        dataSeries.append(time, 0);
    }

    for (let i = pad, j = 0; i < pointCount; i++, j++) {
        const time = 10 * i / pointCount;
        const wn = 2 * Math.PI / (pointCount / freq);

        const d = amplitude * Math.sin(j * wn + phase);
        dataSeries.append(time, d);

        amplitude *= (1.0 - dampingFactor);
    }

    return dataSeries;
}
