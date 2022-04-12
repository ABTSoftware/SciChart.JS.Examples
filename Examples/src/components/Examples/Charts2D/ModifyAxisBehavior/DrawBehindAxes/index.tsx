import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { NumberRange } from "scichart/Core/NumberRange";
import { PinchZoomModifier } from "scichart/Charting/ChartModifiers/PinchZoomModifier";

const divElementId = "chart1";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // When true, Series are drawn behind axis (Axis inside chart)
    sciChartSurface.drawSeriesBehindAxis = true;

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        visibleRange: new NumberRange(35.0, 42.6),
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        visibleRange: new NumberRange(-5.0, 90.0),
    }));

    const xValues = [];
    const yValues = [];
    const y1Values = [];

    for (let i = 0; i < 100; i += 0.1) {
        xValues.push(i);
        yValues.push(Math.tan(i));
        y1Values.push(Math.cos(i * 100) * 5);
    }

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        drawNaNAs: ELineDrawMode.PolyLine,
        strokeThickness: 5,
        stroke: "rgba(255, 134, 72, .47)",
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
    }));

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        drawNaNAs: ELineDrawMode.PolyLine,
        strokeThickness: 3,
        stroke: "rgba(50, 134, 72, .47)",
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values })
    }))

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new PinchZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier());

    return { sciChartSurface, wasmContext };
};

export default function DrawBehindAxes() {
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
