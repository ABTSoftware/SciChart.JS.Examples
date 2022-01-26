import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { ILineAnnotationOptions, LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { GenericAnimation } from "scichart/Core/Animations/GenericAnimation";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { DoubleAnimator } from "scichart/Core/Animations/DoubleAnimator";

const interpolateLine = (from: ILineAnnotationOptions, to: ILineAnnotationOptions, interpolationFactor: number) => {
    return {
        x1: DoubleAnimator.interpolate(from.x1, to.x1, interpolationFactor),
        x2: DoubleAnimator.interpolate(from.x2, to.x2, interpolationFactor),
        y1: DoubleAnimator.interpolate(from.y1, to.y1, interpolationFactor),
        y2: DoubleAnimator.interpolate(from.y2, to.y2, interpolationFactor)
    };
};

const getRandomCoords = () => {
    return {
        x1: Math.floor(Math.random() * 3 + 1),
        y1: Math.floor(Math.random() * 3 + 1)
    }
}

async function drawAnnotationAnimationsChart(divId: string) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
        theme: new SciChartJSLightTheme()
    });
    // Setup axes
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 5) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 5) }));
    // Setup annotations
    const lineAnnotation = new LineAnnotation({ stroke: "#FF6600", strokeThickness: 3, x1: 0.0, x2: 0.5, y1: 0.5, y2: 0.0 });
    const secondLineAnnotation = new LineAnnotation({ stroke: "#FF6600", strokeThickness: 3, x1: 0.0, x2: 0.5, y1: 0.5, y2: 0.0 });
    const thirdLineAnnotation = new LineAnnotation({ stroke: "#FF6600", strokeThickness: 3, x1: 0.0, x2: 0.5, y1: 0.5, y2: 0.0 });
    const fourthLineAnnotation = new LineAnnotation({ stroke: "#FF6600", strokeThickness: 3, x1: 0.0, x2: 0.5, y1: 0.5, y2: 0.0 });
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 30 29" version="1.1">
    <g id="surface1">
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(0%,0%,0%);fill-opacity:1;" d="M 29.992188 26.488281 L 29.992188 28.070312 L 0 28.070312 L 0 0.921875 L 1.636719 0.921875 L 1.636719 26.488281 Z M 5.15625 13.300781 C 5.386719 13.300781 5.605469 13.253906 5.8125 13.183594 L 8.84375 17.769531 C 8.421875 18.152344 8.15625 18.695312 8.15625 19.296875 C 8.15625 20.460938 9.132812 21.40625 10.339844 21.40625 C 11.542969 21.40625 12.519531 20.460938 12.519531 19.296875 C 12.519531 18.976562 12.4375 18.671875 12.304688 18.398438 L 16.28125 15.589844 C 16.59375 15.84375 16.988281 16.003906 17.425781 16.003906 C 17.914062 16.003906 18.351562 15.8125 18.671875 15.507812 L 22.742188 17.96875 C 22.53125 18.320312 22.410156 18.726562 22.410156 19.160156 C 22.410156 20.484375 23.523438 21.558594 24.890625 21.558594 C 26.261719 21.558594 27.371094 20.484375 27.371094 19.160156 C 27.371094 17.835938 26.261719 16.761719 24.890625 16.761719 C 24.269531 16.761719 23.699219 16.984375 23.261719 17.351562 L 19.097656 14.835938 C 19.160156 14.664062 19.199219 14.480469 19.199219 14.289062 C 19.199219 13.34375 18.40625 12.578125 17.425781 12.578125 C 16.449219 12.578125 15.65625 13.34375 15.65625 14.289062 C 15.65625 14.527344 15.703125 14.75 15.792969 14.953125 L 11.820312 17.761719 C 11.433594 17.410156 10.914062 17.1875 10.339844 17.1875 C 10.054688 17.1875 9.78125 17.246094 9.53125 17.34375 L 6.503906 12.761719 C 6.851562 12.429688 7.066406 11.964844 7.066406 11.457031 C 7.066406 10.4375 6.210938 9.613281 5.15625 9.613281 C 4.101562 9.613281 3.25 10.4375 3.25 11.457031 C 3.25 12.476562 4.101562 13.300781 5.15625 13.300781 Z M 5.15625 13.300781 "/>
    </g>
    </svg>`;
    const customAnnotation = new CustomAnnotation({
        x1: 2.5,
        y1: 2.5,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString
    });
    sciChartSurface.annotations.add(lineAnnotation);
    sciChartSurface.annotations.add(secondLineAnnotation);
    sciChartSurface.annotations.add(thirdLineAnnotation);
    sciChartSurface.annotations.add(fourthLineAnnotation);
    sciChartSurface.annotations.add(customAnnotation);
    // Setup animations
    const lineAnimation = new GenericAnimation({
        from: { x1: 0.0, x2: 0.5, y1: 0.5, y2: 0.0 },
        to: { x1: 4.5, x2: 5.0, y1: 5.0, y2: 4.5 },
        duration: 4000,
        ease: easing.inOutSine,
        onAnimate: (from, to, progress) => {
            const interpolatedLine = interpolateLine(from, to, progress);
            if (progress > .25) {
                addSecondLineAnimation();
            }
            if (progress > .5) {
                addThirdLineAnimation();
            }
            if (progress > .75) {
                addFourthLineAnimation();
            }
            lineAnnotation.x1 = interpolatedLine.x1;
            lineAnnotation.y1 = interpolatedLine.y1;
            lineAnnotation.x2 = interpolatedLine.x2;
            lineAnnotation.y2 = interpolatedLine.y2;
        },
        onCompleted: () => {
            console.log("Line Animation Completed");
        }
    });
    sciChartSurface.addAnimation(lineAnimation);
    const svgAnimation = new GenericAnimation({
        from: { x1: 2.5, y1: 2.5 },
        to: getRandomCoords(),
        duration: 1500,
        ease: easing.cubic,
        onAnimate: (from, to, progress) => {
            customAnnotation.x1 = from.x1 + (to.x1 - from.x1) * progress;
            customAnnotation.y1 = from.y1 + (to.y1 - from.y1) * progress;
        },
        onCompleted: () => {
            svgAnimation.to = getRandomCoords();
            svgAnimation.reset();
            console.log("SVG Animation Completed");
        }
    });
    sciChartSurface.addAnimation(svgAnimation);
    let isSecondAnimationAdded = false;
    const addSecondLineAnimation = () => {
        if (!isSecondAnimationAdded) {
            addLineAnimation({ x1: 5.0, x2: 3.5, y1: 4.5, y2: 4.0 }, 3000, secondLineAnnotation);
            isSecondAnimationAdded = true;
        }
    };
    let isThirdAnimationAdded = false;
    const addThirdLineAnimation = () => {
        if (!isThirdAnimationAdded) {
            addLineAnimation({ x1: 4.5, x2: 4.0, y1: 5.0, y2: 3.5 }, 2000, thirdLineAnnotation);
            isThirdAnimationAdded = true;
        }
    }
    let isFourthAnimationAdded = false;
    const addFourthLineAnimation = () => {
        if (!isFourthAnimationAdded) {
            addLineAnimation({ x1: 4.0, x2: 3.5, y1: 3.5, y2: 4.0 }, 2000, fourthLineAnnotation);
            isFourthAnimationAdded = true;
        }
    }
    const addLineAnimation = (to: ILineAnnotationOptions, duration: number, annotation: LineAnnotation) => {

        const lineAnimation = new GenericAnimation({
            from: { x1: 0.0, x2: 0.5, y1: 0.5, y2: 0.0 },
            to,
            duration,
            ease: easing.linear,
            onAnimate: (from, to, progress) => {
                const interpolatedLine = interpolateLine(from, to, progress);
                annotation.x1 = interpolatedLine.x1;
                annotation.y1 = interpolatedLine.y1;
                annotation.x2 = interpolatedLine.x2;
                annotation.y2 = interpolatedLine.y2;
            },
            onCompleted: () => {
                console.log("Line Animation Completed");
            }
        });
        sciChartSurface.addAnimation(lineAnimation);
    }
}

drawAnnotationAnimationsChart("scichart");
