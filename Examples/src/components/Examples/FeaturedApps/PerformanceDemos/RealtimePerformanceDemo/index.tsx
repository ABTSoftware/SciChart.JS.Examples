import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {GlowEffect} from "scichart/Charting/Visuals/RenderableSeries/GlowEffect";
import {Point} from "scichart/Core/Point";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {fillNoisySinewave, getNoisySinewave} from "scichart/utils/math";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {EAutoRange} from "scichart/types/AutoRange";
import {RandomWalkGenerator} from "../../../RandomWalkGenerator";

const AMPLITUDE = 200;

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    // Create an XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always}));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { autoRange: EAutoRange.Always}));

    // Create some DataSeries
    const dataSeries = new XyDataSeries(wasmContext);

    // Create a RenderableSeries
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries,
        stroke: "Red",
        strokeThickness: 2
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // This class generates some data for our example
    // It generates a random walk, which is a lnine which increases or decreases by a random value
    // each data-point
    const randomWalk = new RandomWalkGenerator(0);

    let timerId: NodeJS.Timeout;

    // Function called when the user clicks stopDemo button
    const stopDemo = () => {
        clearTimeout(timerId);
        timerId = undefined;
        randomWalk.reset();
    };
    document.getElementById("stopDemo").addEventListener("click", stopDemo);

    // Function called when the user clicks startDemo button
    const startDemo = () => {
        // // tslint:disable-next-line:no-debugger
        // debugger;
        if (!timerId) {
            const updateFunc = () => {
                if (dataSeries.count() >= 1E6) {
                    stopDemo();
                    return;
                }
                // Get the next 10 random walk x,y values
                const {xValues, yValues} = randomWalk.getRandomWalkSeries(1000);

                // Append these to the dataSeries. This will cause the chart to redraw
                dataSeries.appendRange(xValues, yValues);

                timerId = setTimeout(updateFunc, 10);
            };

            timerId = setTimeout(updateFunc, 10);
        }
    };
    document.getElementById("startDemo").addEventListener("click", startDemo);


    return { wasmContext, sciChartSurface };
};

export default function RealtimePerformanceDemo() {
    const [showButtons, setShowButtons] = React.useState(false);
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setShowButtons(true);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <React.Fragment>
            <div id={divElementId} style={{ maxWidth: 900 }} />
            <div style={{ marginTop: 20, display: showButtons ? "block" : "none" }}>
                <button id="startDemo">Start</button>
                <button id="stopDemo" style={{ marginLeft: 10 }}>
                    Stop
                </button>
            </div>
        </React.Fragment>
    );
}
