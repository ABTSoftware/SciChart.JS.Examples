import * as React from "react";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { EAutoRange } from "scichart/types/AutoRange";
import classes from "../../../Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new CategoryAxis(wasmContext, { 
        // Rotation is in degrees clockwise
        rotation: 90, 
        // Turn up the number of major ticks (default is 10)
        maxAutoTicks: 30, 
        // Turn off minor gridlines, since majors are now closer together
        drawMinorGridLines: false 
    });
    sciChartSurface.xAxes.add(xAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    const startTime = new Date(2020,0,1).getTime() / 1000;
    let y = 100;
    for (let i = 0; i < 50; i++) {
        const x = startTime + i * 24 * 60 * 60;
        y = y + Math.random() - 0.5;
        dataSeries.append(x, y);
    }
    
    const lineSeries = new FastMountainRenderableSeries(wasmContext, 
        { 
            dataSeries,
            stroke: "#4682b4",
            strokeThickness: 2,
            zeroLineY: 0.0,
            fill: "rgba(176, 196, 222, 0.7)", // when a solid color is required, use fill
            // when a gradient is required, use fillLinearGradient
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: "rgba(70,130,180,1)", offset: 0 },
                { color: "rgba(70,130,180,0.2)", offset: 1 }
            ]),
            animation: new WaveAnimation({ duration: 1000, fadeEffect: true, zeroLine: 0 })
        });
    sciChartSurface.renderableSeries.add(lineSeries);

    const yAxis = new NumericAxis(wasmContext, { autoRange: EAutoRange.Always });
    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function RotatedLabels() {
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
