import { appTheme } from "../../../theme";
import {
    AnimationToken,
    CustomAnnotation,
    DoubleAnimator,
    easing,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    FastMountainRenderableSeries,
    GradientParams,
    NumericAxis,
    NumberRange,
    Point,
    TEasingFn,
    SciChartSurface,
    XyDataSeries,
} from "scichart";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

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
        yValues: initialValues.yValues,
    });
    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            dataSeries,
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.VividSkyBlue + "77", offset: 0 },
                { color: "Transparent", offset: 1 },
            ]),
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 4,
        })
    );

    // The animated pulsing dot at the end of the chart is rendered with this SVG annotation
    const svgString = `<svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100%" height="100%" fill="transparent"/>
            <circle cx="25" cy="25" fill="${appTheme.VividTeal}" r="5" stroke="${appTheme.VividTeal}">
                <animate attributeName="r" from="5" to="25" dur="1s" begin="0s" repeatCount="indefinite"/>
                <animate attributeName="opacity" from="1" to="0" dur="1s" begin="0s" repeatCount="indefinite"/>
            </circle>
            <circle cx="25" cy="25" fill="${appTheme.VividSkyBlue}" r="5"/>
        </svg>`;
    const pulsingDotAnnotation = new CustomAnnotation({
        x1: initialValues.xValues[initialValues.xValues.length - 1],
        y1: initialValues.yValues[initialValues.yValues.length - 1],
        xCoordShift: 0,
        yCoordShift: 0,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        svgString,
    });

    sciChartSurface.annotations.add(pulsingDotAnnotation);

    let timerId: NodeJS.Timeout;
    let animationToken: AnimationToken;
    // This function performs animation on any XyDataSeries, animating the latest point only
    // Be careful of reentrancy, e.g. calling animateXy more than once before previous animation has finished
    // might require special handling
    const animateXy = (xyDataSeries: XyDataSeries, endX: number, endY: number, duration: number, ease: TEasingFn) => {
        const count = xyDataSeries.count();
        const startX = xyDataSeries.getNativeXValues().get(count - 1);
        const startY = xyDataSeries.getNativeYValues().get(count - 1);

        // use the DoubleAnimator class in scichart/Core/Animations/ to setup an animation from 0...1
        animationToken = DoubleAnimator.animate(
            0,
            1,
            duration,
            (interpolationFactor) => {
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
            ease
        );
    };

    // This is the loop where we add a new X,Y point and animate every 1 second to demonstrate animations
    const runAddDataOnTimeout = () => {
        if (sciChartSurface?.isDeleted) {
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

    const handleStop = () => {
        animationToken?.cancelAnimation();
        clearTimeout(timerId);
        timerId = undefined;
    };

    return { sciChartSurface, wasmContext, controls: { handleStart, handleStop } };
};
