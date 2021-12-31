import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { GenericAnimation } from "scichart/Core/Animations/GenericAnimation";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { DoubleAnimator } from "scichart/Core/Animations/DoubleAnimator";

async function drawAnnotationAnimationsChart(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
        theme: new SciChartJSLightTheme()
    });
    // Setup axes
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 5) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 5) }));
    // Setup annotations
    const lineAnnotation = new LineAnnotation({ stroke: "#FF6600", strokeThickness: 3, x1: 0.0, x2: 0.5, y1: 0.5, y2: 0.0 });
    sciChartSurface.annotations.add(lineAnnotation);
    // Setup animations
    const lineAnimation = new GenericAnimation({
        from: { x1: 0.0, x2: 0.5, y1: 0.5, y2: 0.0 },
        to: { x1: 4.5, x2: 5.0, y1: 5.0, y2: 4.5 },
        duration: 4000,
        ease: easing.inOutSine,
        onAnimate: (from, to, progress) => {
            lineAnnotation.x1 = DoubleAnimator.interpolate(from.x1, to.x1, progress);
            lineAnnotation.y1 = DoubleAnimator.interpolate(from.x2, to.x2, progress);
            lineAnnotation.x2 = DoubleAnimator.interpolate(from.y1, to.y1, progress);
            lineAnnotation.y2 = DoubleAnimator.interpolate(from.y2, to.y2, progress);
        },
        onCompleted: () => {
            console.log("Line Animation Completed");
        }
    });
    sciChartSurface.addAnimation(lineAnimation);
}

drawAnnotationAnimationsChart("scichart");
