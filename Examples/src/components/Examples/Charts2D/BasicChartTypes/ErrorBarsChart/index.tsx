import * as React from "react";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartSurface } from "scichart";
import { NumberRange } from "scichart/Core/NumberRange";

import classes from "../../../../Examples/Examples.module.scss";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { HlcDataSeries } from "scichart/Charting/Model/HlcDataSeries";
import { PinchZoomModifier } from "scichart/Charting/ChartModifiers/PinchZoomModifier";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { FastErrorBarsRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastErrorBarsRenderableSeries";
import { ShadowEffect } from "scichart/Charting/Visuals/RenderableSeries/ShadowEffect";
import { SplineLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/SplineLineRenderableSeries";
import { Point } from "scichart/Core/Point";
import { EErrorMode } from "scichart/types/ErrorMode";
import { EErrorDirection } from "scichart/types/ErrorDirection";
import { EDataPointWidthMode } from "scichart/types/DataPointWidthMode";
import { EAnimationType } from "scichart/types/AnimationType";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, { visibleRange: new NumberRange(-3, 22) });
    const yAxis = new NumericAxis(wasmContext, { visibleRange: new NumberRange(-2, 3) });

    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.xAxes.add(xAxis);

    // add optional line series
    const lineSeries = new SplineLineRenderableSeries(wasmContext, {
        strokeThickness: 5,
        stroke: "#185aa1",
        isDigitalLine: false,
        effect: new ShadowEffect(wasmContext, {
            range: 0.5,
            brightness: 1,
            offset: new Point(50, 10)
        }),
        animation: { type: EAnimationType.Wave, options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 1000 } },
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    // define Error Bars Series
    const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        errorMode: EErrorMode.Both,
        errorDirection: EErrorDirection.Vertical,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.8,
        strokeThickness: 5,
        stroke: "#54b347",
        animation: { type: EAnimationType.Wave, options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 1000 } },
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 7,
            height: 7,
            fill: "#e08019",
            stroke: "#006400",
        })
    });
    sciChartSurface.renderableSeries.add(errorBarsSeries);

    // generate data for series
    const dataSeries = new XyDataSeries(wasmContext, { containsNaN: true });
    const hlcSeries = new HlcDataSeries(wasmContext);

    for (let i = 0; i < 20; i++) {
        const x = i;
        const y = Math.sin(i) * 5 / (i + 1);
        const highValue = y + ((i % 4) + 1) * 0.1;
        const lowValue = y - ((i % 3) + 1) * 0.1;
        dataSeries.append(x, y);
        hlcSeries.append(x, y, highValue, lowValue);
    }
    lineSeries.dataSeries = dataSeries;
    errorBarsSeries.dataSeries = hlcSeries;

    // add some interactivity
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new PinchZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface };
};

// React component needed as our examples app is react.
export default function ErrorBarsChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <div id={divElementId} className={classes.ChartWrapper} />
    );
}
