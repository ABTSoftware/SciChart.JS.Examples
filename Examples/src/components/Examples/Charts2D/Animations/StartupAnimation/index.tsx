import * as React from "react";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import classes from "../../../../Examples/Examples.module.scss";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import { FastBubbleRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastBubbleRenderableSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { XyzDataSeries } from "scichart/Charting/Model/XyzDataSeries";
import { EAnimationType } from "scichart/types/AnimationType";
import { SweepAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";
import { ScaleAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/ScaleAnimation";
import { FadeAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/FadeAnimation";

const divElementId = "chart";

const waveAnimation = new WaveAnimation({
    zeroLine: 0,
    pointDurationFraction: 0.5,
    duration: 1000,
    fadeEffect: true,
    delay: 100
});
const sweepAnimation = new SweepAnimation({ duration: 1000 });
const scaleAnimation = new ScaleAnimation({ duration: 1000, zeroLine: 0 });
const fadeAnimation = new FadeAnimation({ duration: 1500 });

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) }));

    // Bubble Series
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 64,
            height: 64,
            stroke: "orange",
            strokeThickness: 3,
            fill: "#4682b477"
        })
    });
    bubbleSeries.enqueueAnimation(waveAnimation);
    sciChartSurface.renderableSeries.add(bubbleSeries);

    // Line Series
    const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: "#ff6600" });
    lineSeries.strokeThickness = 2;
    sciChartSurface.renderableSeries.add(lineSeries);
    lineSeries.stroke = "green";
    lineSeries.opacity = 0.7;
    lineSeries.enqueueAnimation(waveAnimation);

    // Populate data to both series
    const lineDataSeries = new XyDataSeries(wasmContext);
    const bubbleDataSeries = new XyzDataSeries(wasmContext);
    const POINTS = 20;
    let prevYValue = 0;
    for (let i = 0; i < POINTS; i++) {
        const curYValue = Math.sin(i) * 10 + 5;
        const size = Math.sin(i) * 60 + 3;

        lineDataSeries.append(i, prevYValue + curYValue);
        bubbleDataSeries.append(i, prevYValue + curYValue, size);

        prevYValue += curYValue;
    }

    lineSeries.dataSeries = lineDataSeries;
    bubbleSeries.dataSeries = bubbleDataSeries;

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
};

let scs: SciChartSurface;

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StartupAnimation() {
    const [animationType, setAnimationType] = React.useState<EAnimationType>(EAnimationType.Wave);
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => scs?.delete();
    }, []);

    const handleChangeAnimationType = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newAnimationType = event.target.value as EAnimationType;
        setAnimationType(newAnimationType);
        const allRs = scs.renderableSeries.asArray();
        switch (newAnimationType) {
            case EAnimationType.Wave:
                allRs.forEach(rs => rs.enqueueAnimation(waveAnimation));
                break;
            case EAnimationType.Sweep:
                allRs.forEach(rs => rs.enqueueAnimation(sweepAnimation));
                break;
            case EAnimationType.Scale:
                allRs.forEach(rs => rs.enqueueAnimation(scaleAnimation));
                break;
            case EAnimationType.Fade:
                allRs.forEach(rs => rs.enqueueAnimation(fadeAnimation));
                break;
        }
    };

    return (
        <>
            <div id={divElementId} className={classes.ChartWrapper} />
            <div className={classes.SelectWrapper}>
                <div className={classes.InputSelectWrapper}>
                    <label id="stroke-thickness-label">
                        Startup Animation Type
                        <select id="stroke-thickness" value={animationType} onChange={handleChangeAnimationType}>
                            <option value={EAnimationType.Wave}>WaveAnimation</option>
                            <option value={EAnimationType.Sweep}>SweepAnimation</option>
                            <option value={EAnimationType.Scale}>ScaleAnimation</option>
                            <option value={EAnimationType.Fade}>FadeAnimation</option>
                        </select>
                    </label>
                </div>
            </div>
        </>
    );
}
