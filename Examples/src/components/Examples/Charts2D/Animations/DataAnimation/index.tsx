import * as React from "react";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { ScatterAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/ScatterAnimation";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart";
let timerId: NodeJS.Timeout;

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-0.5, 5.5) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-0.5, 5.5) }));

    // Create a scatter series with some initial data
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5],
            yValues: [1.3, 2.3, 4, 3.3, 4.5]
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 11,
            height: 11,
            fill: "#FF3333BB",
            strokeThickness: 0
        })
    });
    sciChartSurface.renderableSeries.add(scatterSeries);

    // Update data using data animations
    const animateData = () => {
        const xValues = Array.from({ length: 5 }, () => Math.random() * 5);
        const yValues = Array.from({ length: 5 }, () => Math.random() * 5);

        scatterSeries.runAnimation(
            new ScatterAnimation({
                duration: 500,
                ease: easing.outQuad,
                dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
            })
        );

        timerId = setTimeout(animateData, 1000);
    };
    timerId = setTimeout(animateData, 1000);

    return { wasmContext, sciChartSurface };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function DataAnimation() {
    React.useEffect(() => {
        let sciChartSurface: SciChartSurface;
        (async () => {
            const res = await drawExample();
            sciChartSurface = res.sciChartSurface;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            clearTimeout(timerId);
            sciChartSurface?.delete();
        };
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
