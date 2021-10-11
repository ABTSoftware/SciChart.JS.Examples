export const code = `import * as React from "react";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { DoubleAnimator } from "scichart/Core/Animations/DoubleAnimator";
import { GradientParams } from "scichart/Core/GradientParams";
import { Point } from "scichart/Core/Point";
import { easing, TEasingFn } from "scichart/Core/Animations/EasingFunctions";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { RandomWalkGenerator } from "../../../../../../../Sandbox/CustomerExamples/AnimateXyValuesOnSeries/src/RandomWalkGenerator";
import classes from "../../../../Examples/Examples.module.scss";
import { AnimationToken } from "scichart/Core/AnimationToken";

export const divElementId = "chart";

let timerId: NodeJS.Timeout;
let animationToken: AnimationToken;

export const drawExample = async () => {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    //this is only for nice looking source code
    const svgString = [
        '<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">',
        '<rect x="0" y="0" width="100%" height="100%"',
        'fill="transparent"/><circle cx="20" cy="20" fill="steelblue" r="1" stroke="steelblue"><animate attributeName="r" from="0" to="20" dur="1s"',
        'begin="0s" repeatCount="indefinite"/><animate attributeName="opacity" from="1" to="0" dur="1s"',
        'begin="0s" repeatCount="indefinite"/></circle><circle cx="20" cy="20" fill="steelblue" r="5"/></svg>'
    ].join("");

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });
    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Generate some initial random data for the example
    const generator = new RandomWalkGenerator();
    const initialValues = generator.getRandomWalkSeries(50);

    // Add a mountain series with initial data
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues: initialValues.xValues,
        yValues: initialValues.yValues
    });
    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            dataSeries,
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: "rgba(70,130,180,1)", offset: 0 },
                { color: "rgba(70,130,180,0.2)", offset: 1 }
            ]),
            stroke: "SteelBlue",
            strokeThickness: 5
        })
    );

    const pulsingDotAnnotation = new CustomAnnotation({
        x1: initialValues.xValues[initialValues.xValues.length - 1],
        y1: initialValues.yValues[initialValues.yValues.length - 1],
        xCoordShift: 0,
        yCoordShift: 0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        svgString: svgString
    });

    sciChartSurface.annotations.add(pulsingDotAnnotation);

    // This function performs animation on any XyDataSeries, animating the latest point only
    // Be careful of reentrancy, e.g. calling animateXy more than once before previous animation has finished
    // might require special handling
    const animateXy = (xyDataSeries: XyDataSeries, endX: number, endY: number, duration: number, easing: TEasingFn) => {
        const count = xyDataSeries.count();
        const startX = xyDataSeries.getNativeXValues().get(count - 1);
        const startY = xyDataSeries.getNativeYValues().get(count - 1);

        // use the DoubleAnimator class in scichart/Core/Animations/ to setup an animation from 0...1
        animationToken = DoubleAnimator.animate(
            0,
            1,
            duration,
            interpolationFactor => {
                // Using the interpolation factor (ranges from 0..1) compute the X,Y value now
                const currentX = (endX - startX) * interpolationFactor + startX;
                const currentY = (endY - startY) * interpolationFactor + startY;

                // Update X,Y value by direct access to the inner webassembly arrays
                xyDataSeries.getNativeXValues().set(count - 1, currentX);
                xyDataSeries.getNativeYValues().set(count - 1, currentY);

                // update location of pulsing dot
                pulsingDotAnnotation.x1 = currentX;
                pulsingDotAnnotation.y1 = currentY;

                // Force redraw
                // can use xyDataSeries.notifyDataChanged();
                // to just update, but if we want to zoom to fit, we must use zoomExtents
                sciChartSurface.zoomExtents();
            },
            () => {
                // Animation complete, append the point
                xyDataSeries.append(endX, endY);
            },
            easing
        );
    };

    // This is the loop where we add a new X,Y point and animate every 1 second to demonstrate animations
    const runAddDataOnTimeout = () => {
        if (scs?.isDeleted) {
            return;
        }
        const generated = generator.getRandomWalkSeries(1);
        const x = generated.xValues[0];
        const y = generated.yValues[0];
        animateXy(dataSeries, x, y, 250, easing.outExpo);
        timerId = setTimeout(runAddDataOnTimeout, 1000);
    };

    const handleStart = () => {
        if (timerId) {
            handleStop();
        }
        runAddDataOnTimeout();
    };

    return { sciChartSurface, wasmContext, controls: { handleStart, handleStop } };
};

const handleStop = () => {
    animationToken?.cancelAnimation();
    clearTimeout(timerId);
    timerId = undefined;
};

let scs: SciChartSurface;

export default function RealtimeMountainChart() {
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
            res.controls.handleStart();
        })();

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            handleStop();
            scs?.delete();
        };
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
`;