export const code = `import * as React from "react";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { ScatterAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/ScatterAnimation";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import classes from "../../../../Examples/Examples.module.scss";
import { appTheme } from "../../../theme";
import {PaletteFactory} from "scichart/Charting/Model/PaletteFactory";
import {GradientParams} from "scichart/Core/GradientParams";
import {Point} from "scichart/Core/Point";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";

const divElementId = "chart";
let timerId: NodeJS.Timeout;

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    const length = 120;

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, length),
        growBy: new NumberRange(0.1, 0.1)
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, length),
        growBy: new NumberRange(0.1, 0.1)
    }));

    let xValues = Array.from(Array(length).keys());
    let yValues = Array.from({ length }, () => 0.5 * length);

    // Create a scatter series with some initial data
    const scatterSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues
        }),
        strokeThickness: 2,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 11,
            height: 11,
            fill: appTheme.VividSkyBlue,
            strokeThickness: 0,
        }),
        paletteProvider: PaletteFactory.createGradient(wasmContext, new GradientParams(new Point(0, 0), new Point(1, 1), [
            { offset: 0, color: "#36B8E6" },
            { offset: 0.2, color: "#5D8CC2" },
            { offset: 0.4, color: "#8166A2" },
            { offset: 0.6, color: "#AE418C" },
            { offset: 1.0, color: "#CA5B79" }
        ]), { enableStroke: true, enablePointMarkers: true, strokeOpacity: 0.67 })
    });
    sciChartSurface.renderableSeries.add(scatterSeries);

    // Update data using data animations
    const animateData = () => {
        xValues = Array.from({ length }, () => Math.random() * length);
        yValues = Array.from({ length }, () => Math.random() * length);

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
`;