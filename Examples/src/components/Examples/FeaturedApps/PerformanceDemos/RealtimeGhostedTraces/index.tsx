import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { GlowEffect } from "scichart/Charting/Visuals/RenderableSeries/GlowEffect";
import { Point } from "scichart/Core/Point";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { fillNoisySinewave, getNoisySinewave } from "scichart/utils/math";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";

const AMPLITUDE = 200;

const divElementId = "chart";

let timerId: NodeJS.Timeout;

const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 900);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(-300, 300);
    sciChartSurface.yAxes.add(yAxis);

    const addSeries = (stroke: string) => {
        const amplitude = Math.random() * AMPLITUDE;
        const effect = new GlowEffect(wasmContext, {
            range: 0,
            intensity: 0.5,
            color: "#FF0000",
            offset: new Point(10, 10)
        });
        const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke, effect });
        lineSeries.strokeThickness = 3;
        sciChartSurface.renderableSeries.add(lineSeries);
        const [xValues, yValues] = getNoisySinewave(500, 900, 7, amplitude, 30);
        lineSeries.dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
        return lineSeries;
    };

    const series1 = addSeries("rgba(192, 192, 192, 1)");
    const series2 = addSeries("rgba(192, 192, 192, 0.9)");
    const series3 = addSeries("rgba(192, 192, 192, 0.8)");
    const series4 = addSeries("rgba(192, 192, 192, 0.7)");
    const series5 = addSeries("rgba(192, 192, 192, 0.6)");
    const series6 = addSeries("rgba(192, 192, 192, 0.5)");
    const series7 = addSeries("rgba(192, 192, 192, 0.4)");
    const series8 = addSeries("rgba(192, 192, 192, 0.3)");
    const series9 = addSeries("rgba(192, 192, 192, 0.2)");
    const series10 = addSeries("rgba(192, 192, 192, 0.1)");

    const reassignRenderableSeries = () => {
        series10.dataSeries = series9.dataSeries;
        series9.dataSeries = series8.dataSeries;
        series8.dataSeries = series7.dataSeries;
        series7.dataSeries = series6.dataSeries;
        series6.dataSeries = series5.dataSeries;
        series5.dataSeries = series4.dataSeries;
        series4.dataSeries = series3.dataSeries;
        series3.dataSeries = series2.dataSeries;
        series2.dataSeries = series1.dataSeries;

        const amplitude = Math.random() * AMPLITUDE;
        const dataSeries = new XyDataSeries(wasmContext);
        fillNoisySinewave(500, 900, 7, amplitude, 30, dataSeries);
        series1.dataSeries = dataSeries;

        timerId = setTimeout(reassignRenderableSeries, 20);
    };

    const stopAnimation = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };
    document.getElementById("stopAnimation").addEventListener("click", stopAnimation);

    // Buttons for chart
    const startAnimation = () => {
        if (timerId) {
            stopAnimation();
        }
        reassignRenderableSeries();
    };
    document.getElementById("startAnimation").addEventListener("click", startAnimation);

    return { wasmContext, sciChartSurface, controls: { startAnimation, stopAnimation} };
};

let scs: SciChartSurface;
let autoStartTimerId: NodeJS.Timeout;

export default function RealtimeGhostedTraces() {
    const [showButtons, setShowButtons] = React.useState(false);
    const [controls, setControls] = React.useState({ startAnimation: () => {}, stopAnimation: () => {} });


    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
            setShowButtons(true);
            setControls(res.controls);
            autoStartTimerId = setTimeout(res.controls.startAnimation, 3000);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            controls.stopAnimation();
            clearTimeout(timerId);
            clearTimeout(autoStartTimerId);
            scs?.delete();
        }
    }, []);

    return (
        <React.Fragment>
            <div id={divElementId} style={{ maxWidth: 900 }} />
            <div style={{ marginTop: 20, display: showButtons ? "block" : "none" }}>
                <button id="startAnimation">Start</button>
                <button id="stopAnimation" style={{ marginLeft: 10 }}>
                    Stop
                </button>
            </div>
        </React.Fragment>
    );
}
