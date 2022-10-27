import * as React from "react";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {SciChartSurface} from "scichart";
import {NumberRange} from "scichart/Core/NumberRange";

import classes from "../../../../Examples/Examples.module.scss";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {HlcDataSeries} from "scichart/Charting/Model/HlcDataSeries";
import {PinchZoomModifier} from "scichart/Charting/ChartModifiers/PinchZoomModifier";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {FastErrorBarsRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastErrorBarsRenderableSeries";
import {SplineLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/SplineLineRenderableSeries";
import {EErrorMode} from "scichart/types/ErrorMode";
import {EErrorDirection} from "scichart/types/ErrorDirection";
import {EDataPointWidthMode} from "scichart/types/DataPointWidthMode";
import {EAnimationType} from "scichart/types/AnimationType";
import {appTheme} from "../../../theme";
import {
    SplineMountainRenderableSeries
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/Visuals/RenderableSeries/SplineMountainRenderableSeries";
import {GradientParams} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Core/GradientParams";
import {Point} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Core/Point";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Xy values for the data
    const xValues = [0, 1, 2, 2.5, 4.5, 5, 6, 7, 8];
    const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];

    const randomError = () => Math.random() * 0.2 + 0.2;
    // Low high error (absolute values)
    const lowValues = yValues.map(y => y - randomError());
    const highValues = yValues.map(y => y + randomError());

    // Left/right error (absolute values)
    const leftValues = xValues.map(x => x - randomError());
    const rightValues = xValues.map(x => x + randomError());

    // add optional mountain series. We use Spline type, for higher performance use FastLine or FastMountainRenderableSeries
    const lineSeries = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        strokeThickness: 5,
        stroke: appTheme.VividSkyBlue,
        fillLinearGradient: new GradientParams(new Point(0,0), new Point(0,1), [
            { offset: 0, color: appTheme.VividSkyBlue + "77" },
            { offset: 1, color: "Transparent" }
        ]),
        animation: { type: EAnimationType.Sweep, options: { zeroLine: -1, pointDurationFraction: 0.5, duration: 500 } },
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Define Horizontal Error Bars Series, Error bars require HLC data with absolute values for error whiskers
    const errorBarsHorizontalSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: new HlcDataSeries(wasmContext, { xValues, yValues, highValues: leftValues, lowValues: rightValues }),
        errorMode: EErrorMode.Both,
        errorDirection: EErrorDirection.Horizontal,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.3,
        strokeThickness: 4,
        stroke: appTheme.VividSkyBlue + "77",
        animation: { type: EAnimationType.Sweep, options: { zeroLine: 0, pointDurationFraction: 0.5, duration: 500 } },
    });
    sciChartSurface.renderableSeries.add(errorBarsHorizontalSeries);

    // Define Vertical Error Bars Series, Error bars require HLC data with absolute values for error whiskers
    const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: new HlcDataSeries(wasmContext, { xValues, yValues, highValues, lowValues }),
        errorMode: EErrorMode.Both,
        errorDirection: EErrorDirection.Vertical,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.3,
        strokeThickness: 4,
        stroke: appTheme.VividSkyBlue,
        animation: { type: EAnimationType.Sweep, options: { zeroLine: 0, pointDurationFraction: 0.5, duration: 500 } },
        // Add optional pointmarker (or use separate XyScatterRenderableSeries)
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
            strokeThickness: 0,
            fill: appTheme.VividOrange,
        }),
    });
    sciChartSurface.renderableSeries.add(errorBarsSeries);

    // add some interactivity
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new PinchZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

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
