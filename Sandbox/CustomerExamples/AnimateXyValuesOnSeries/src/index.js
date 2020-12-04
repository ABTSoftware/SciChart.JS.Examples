import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {NumberRange} from "scichart/Core/NumberRange";
import {RandomWalkGenerator} from "./RandomWalkGenerator";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastMountainRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import * as easing from "scichart";
import {DoubleAnimator} from "scichart/Core/Animations/DoubleAnimator";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";

async function initSciChart() {
    // LICENSING //
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    //
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    //
    // Also, once activated (trial or paid license) having the licensing wizard open on your machine
    // will mean any or all applications you run locally will be fully licensed.

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {growBy: new NumberRange(0.1, 0.1)});
    const yAxis = new NumericAxis(wasmContext, {growBy: new NumberRange(0.1, 0.1)});

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Generate some initial random data for the example
    const generator = new RandomWalkGenerator();
    const initialValues = generator.getRandomWalkSeries(50);

    // Add a mountain series with initial data
    const dataSeries = new XyDataSeries(wasmContext, {xValues: initialValues.xValues, yValues: initialValues.yValues});
    sciChartSurface.renderableSeries.add(new FastMountainRenderableSeries(wasmContext, {
        dataSeries,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: "rgba(70,130,180,1)", offset: 0 },
            { color: "rgba(70,130,180,0.2)", offset: 1 },
        ]),
        stroke: "SteelBlue",
        strokeThickness: 5,
    }));
    console.log(`Append ${initialValues.xValues.length} points to dataseries resulting in count=${dataSeries.count()}`);

    // This function performs animation on any XyDataSeries, animating the latest point only
    // Be careful of reentrancy, e.g. calling animateXy more than once before previous animation has finished
    // might require special handling
    const animateXy = (xyDataSeries, endX, endY, duration, easing) => {
        const count = xyDataSeries.count();
        const startX = xyDataSeries.getNativeXValues().get(count - 1);
        const startY = xyDataSeries.getNativeYValues().get(count - 1);

        // Consider removing console.log for prod
        console.log(`Animate point ${count-1} X from ${startX} to ${endX}`);
        console.log(`Animate point ${count-1} Y from ${startY} to ${endY}`);
        //

        // use the DoubleAnimator class in scichart/Core/Animations/ to setup an animation from 0...1
        DoubleAnimator.animate(0, 1, duration, (interpolationFactor) => {
                // Using the interpolation factor (ranges from 0..1) compute the X,Y value now
                const currentX = (endX - startX) * interpolationFactor + startX;
                const currentY  = (endY - startY) * interpolationFactor + startY;

                // Update X,Y value by direct access to the inner webassembly arrays
                xyDataSeries.getNativeXValues().set(count - 1, currentX);
                xyDataSeries.getNativeYValues().set(count - 1, currentY);

                // Force redraw
                // can use xyDataSeries.notifyDataChanged(); to just update, but if we want to zoom to fit, we must use zoomExtents
                sciChartSurface.zoomExtents();
            },
            () => {
                // Animation complete, append the point
                xyDataSeries.append(endX, endY);
            }, easing);
    };

    // This is the loop where we add a new X,Y point and animate every 1 second to demonstrate animations
    const addData = () => {
        const generated = generator.getRandomWalkSeries(1);
        const x = generated.xValues[0];
        const y = generated.yValues[0];
        console.log("Appending point " + x + ", " + y);
        animateXy(dataSeries, x, y, 250, easing.outExpo);
        setTimeout(addData, 1000);
    };

    addData();
}

initSciChart();
