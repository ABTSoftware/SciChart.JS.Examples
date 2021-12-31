import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { GenericAnimation } from "scichart/Core/Animations/GenericAnimation";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { DoubleAnimator } from "scichart/Core/Animations/DoubleAnimator";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { TextAnnotation } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";

async function drawAnnotationAnimationsChart(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
        theme: new SciChartJSLightTheme()
    });
    // Setup axes
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 5) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 5) }));
    // Setup annotations
    const boxAnnotation = new BoxAnnotation({
        stroke: "#189AB4",
        strokeThickness: 1,
        fill: "rgba(255,50,50,0.3)",
        x1: 0.5,
        x2: 4.5,
        y1: 0.5,
        y2: 4.5
    });
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" viewBox="0 0 30 30" version="1.1">
    <g id="surface1">
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(29.803922%,76.470588%,94.901961%);fill-opacity:1;" d="M 15.878906 16.179688 L 21.492188 16.179688 L 22.953125 17.445312 L 25.695312 17.445312 L 28.75 18.949219 L 28.75 20 L 26.3125 20 L 26.3125 20.4375 L 23.679688 20.4375 L 23.679688 20 L 12.328125 20 L 10.367188 18.617188 L 3.1875 17.546875 L 1.523438 11.539062 L 2.003906 11.539062 L 5 16.617188 L 15.886719 16.617188 Z M 15.878906 16.179688 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(3.921569%,33.333333%,49.803922%);fill-opacity:1;" d="M 7.726562 24.175781 L 11.671875 24.175781 L 11.671875 25.054688 L 7.726562 25.054688 Z M 7.726562 24.175781 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(3.921569%,33.333333%,49.803922%);fill-opacity:1;" d="M 12.550781 24.175781 L 13.429688 24.175781 L 13.429688 25.054688 L 12.550781 25.054688 Z M 12.550781 24.175781 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(3.921569%,33.333333%,49.803922%);fill-opacity:1;" d="M 18.46875 4.945312 L 22.414062 4.945312 L 22.414062 5.824219 L 18.46875 5.824219 Z M 18.46875 4.945312 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(3.921569%,33.333333%,49.803922%);fill-opacity:1;" d="M 16.710938 4.945312 L 17.589844 4.945312 L 17.589844 5.824219 L 16.710938 5.824219 Z M 16.710938 4.945312 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(3.921569%,33.333333%,49.803922%);fill-opacity:1;" d="M 24.554688 20 L 25.4375 20 L 25.4375 20.875 L 24.554688 20.875 Z M 24.554688 20 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(29.803922%,76.470588%,94.901961%);fill-opacity:1;" d="M 15.878906 10.5 L 16.765625 10.5 L 16.765625 11.558594 L 15.878906 11.558594 Z M 15.878906 10.5 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(81.176471%,94.509804%,100%);fill-opacity:1;" d="M 15.25 13.976562 L 10.605469 13.976562 L 12.75 12.4375 L 17.355469 12.4375 Z M 15.25 13.976562 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(81.176471%,94.509804%,100%);fill-opacity:1;" d="M 23.28125 16.5625 L 20.476562 14.132812 L 20.476562 12.96875 L 24.621094 16.5625 Z M 23.28125 16.5625 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(3.921569%,33.333333%,49.803922%);fill-opacity:1;" d="M 26.039062 16.632812 L 20.203125 11.558594 L 17.640625 11.558594 L 17.640625 9.621094 L 16.761719 9.621094 L 16.761719 8.914062 L 25.921875 10.117188 L 26.039062 9.246094 L 19.6875 8.40625 L 26.03125 7.570312 L 25.914062 6.695312 L 16.324219 7.96875 L 6.726562 6.703125 L 6.609375 7.578125 L 12.957031 8.414062 L 6.609375 9.253906 L 6.726562 10.125 L 15.886719 8.917969 L 15.886719 9.628906 L 15.007812 9.628906 L 15.007812 11.566406 L 12.46875 11.566406 L 9.09375 13.980469 L 7.628906 13.980469 L 7.628906 14.859375 L 15.539062 14.859375 L 18.851562 12.445312 L 19.59375 12.445312 L 19.59375 14.539062 L 22.945312 17.449219 L 25.6875 17.449219 L 28.746094 18.953125 L 28.746094 20.003906 L 26.308594 20.003906 L 26.308594 20.882812 L 28.746094 20.882812 L 28.746094 21.765625 L 14.835938 21.765625 L 13.578125 20.882812 L 23.671875 20.882812 L 23.671875 20.003906 L 12.328125 20.003906 L 10.359375 18.621094 L 3.1875 17.546875 L 1.523438 11.539062 L 2 11.539062 L 4.992188 16.617188 L 15.878906 16.617188 L 15.878906 15.738281 L 5.496094 15.738281 L 2.5 10.660156 L 0.367188 10.660156 L 2.492188 18.335938 L 10.023438 19.453125 L 14.554688 22.640625 L 18.460938 22.640625 L 17.5625 23.554688 L 18.179688 24.175781 L 19.71875 22.640625 L 24.21875 22.640625 L 23.296875 23.554688 L 23.917969 24.175781 L 25.453125 22.640625 L 29.632812 22.640625 L 29.632812 18.398438 Z M 15.878906 10.5 L 16.765625 10.5 L 16.765625 11.558594 L 15.878906 11.558594 Z M 15.25 13.976562 L 10.605469 13.976562 L 12.75 12.4375 L 17.359375 12.4375 Z M 23.28125 16.5625 L 20.476562 14.132812 L 20.476562 12.964844 L 24.621094 16.5625 Z M 23.28125 16.5625 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(3.921569%,33.333333%,49.803922%);fill-opacity:1;" d="M 16.765625 15.738281 L 17.640625 15.738281 L 17.640625 16.617188 L 16.765625 16.617188 Z M 16.765625 15.738281 "/>
    <path style=" stroke:none;fill-rule:nonzero;fill:rgb(3.921569%,33.333333%,49.803922%);fill-opacity:1;" d="M 5.871094 13.976562 L 6.75 13.976562 L 6.75 14.851562 L 5.871094 14.851562 Z M 5.871094 13.976562 "/>
    </g>
    </svg>`;
    const customAnnotation = new CustomAnnotation({
        x1: 0.25,
        y1: 4.75,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString
    });
    sciChartSurface.annotations.add(boxAnnotation, customAnnotation);


    document.getElementById("svgBtn").addEventListener("click", () => {
        startSvgAnimation();
    });

    document.getElementById("boxBtn").addEventListener("click", () => {
        startBoxAnimation();
    });

    const SVG_STEPS = [{ x: 0.25, y: 4.75 }, { x: 4.75, y: 4.75 }, { x: 4.75, y: 0.25 }, { x: 0.25, y: 0.25 }];
    let indexStep = 1;
    const startSvgAnimation = () => {
        const animation = new GenericAnimation({
            from: { x1: SVG_STEPS[0].x, y1: SVG_STEPS[0].y },
            to: { x1: SVG_STEPS[indexStep].x, y1: SVG_STEPS[indexStep].y },
            duration: 2000,
            ease: easing.linear,
            onAnimate: (from, to, progress) => {
                customAnnotation.x1 = from.x1 + (to.x1 - from.x1) * progress;
                customAnnotation.y1 = from.y1 + (to.y1 - from.y1) * progress;
                updateSvgUI(progress, customAnnotation.x1, customAnnotation.y1);
            },
            onCompleted: () => {
                indexStep < SVG_STEPS.length - 1 ? indexStep++ : indexStep = 0;
                animation.from = animation.to;
                animation.to = { x1: SVG_STEPS[indexStep].x, y1: SVG_STEPS[indexStep].y };
                animation.reset();
                const countEl = document.getElementById("svgInfo").querySelector("span");
                countEl.innerHTML = +countEl.innerHTML + 1;
            }
        });
        sciChartSurface.addAnimation(animation);
    };
    const startBoxAnimation = () => {
        const animation = new GenericAnimation({
            from: {
                x1: 0.5,
                x2: 4.5,
                y1: 0.5,
                y2: 4.5
            },
            to: {
                x1: 2.5,
                x2: 2.5,
                y1: 2.5,
                y2: 2.5,
            },
            duration: 8000,
            ease: easing.linear,
            onAnimate: (from, to, progress) => {
                boxAnnotation.x1 = from.x1 + (to.x1 - from.x1) * progress;
                boxAnnotation.y1 = from.y1 + (to.y1 - from.y1) * progress;
                boxAnnotation.x2 = from.x2 + (to.x2 - from.x2) * progress;
                boxAnnotation.y2 = from.y2 + (to.y2 - from.y2) * progress;
                updateBoxUI(progress, boxAnnotation.x1, boxAnnotation.y1, boxAnnotation.x2, boxAnnotation.y2);
            },
            onCompleted: () => {
                const from = animation.from;
                const to = animation.to;
                animation.from = to;
                animation.to = from;
                animation.reset();
                const countEl = document.getElementById("boxInfo").querySelector("span");
                countEl.innerHTML = +countEl.innerHTML + 1;
            }
        });
        sciChartSurface.addAnimation(animation);
    };
    const updateSvgUI = (progress, x, y) => {
        document.getElementById("svgProgress").innerHTML = Math.round(progress * 100) + '%';
        document.getElementById("svgSpinner").style.width = Math.round(progress * 100) + '%';
        document.getElementById("svgXCoord").innerHTML = 'X: ' + parseFloat(x).toFixed(2);
        document.getElementById("svgYCoord").innerHTML = 'Y: ' + parseFloat(y).toFixed(2);
    };
    const updateBoxUI = (progress, x1, y1, x2, y2) => {
        document.getElementById("boxProgress").innerHTML = Math.round(progress * 100) + '%';
        document.getElementById("boxSpinner").style.width = Math.round(progress * 100) + '%';
        document.getElementById("boxX1Coord").innerHTML = 'X1: ' + parseFloat(x1).toFixed(2);
        document.getElementById("boxY1Coord").innerHTML = 'Y1: ' + parseFloat(y1).toFixed(2);
        document.getElementById("boxX2Coord").innerHTML = 'X2: ' + parseFloat(x2).toFixed(2);
        document.getElementById("boxY2Coord").innerHTML = 'Y2: ' + parseFloat(y2).toFixed(2);
        
    }
}

drawAnnotationAnimationsChart("scichart");
