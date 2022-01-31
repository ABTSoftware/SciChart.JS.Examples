import * as React from "react";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import classes from "../../../../Examples/Examples.module.scss";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ILineAnnotationOptions, LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { CustomAnnotation, ICustomAnnotationOptions } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { IAnnotation } from "scichart/Charting/Visuals/Annotations/IAnnotation";
import { GenericAnimation } from "scichart/Core/Animations/GenericAnimation";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import Button from "@material-ui/core/Button/Button";
import { NumberRange } from "scichart/Core/NumberRange";

const divElementId = "chart";

const getChartData = () => {
    const xValues: number[] = [];
    const yValues: number[] = [];
    const y1Values: number[] = [];

    for (let i = 0; i <= 1000; i++) {
        const x = 0.1 * i;
        xValues.push(x);
        yValues.push(Math.sin(x * 0.09));
        y1Values.push(Math.cos(x * 0.05) + 2);
    }
    return {
        xValues,
        yValues,
        y1Values
    };
};

export const drawExample = async () => {
    const { xValues, yValues, y1Values } = getChartData();

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJSLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-1.0, 100.0) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(-2.0, 3.5) }));

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            strokeThickness: 4,
            stroke: "#05445E"
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: 4,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values }),
            stroke: "#189AB4"
        })
    );

    const { animatedAnnotation, pointSinAnnotation, pointCosAnnotation } = buildAnnotations(xValues, yValues, y1Values);
    sciChartSurface.annotations.add(animatedAnnotation, pointSinAnnotation, pointCosAnnotation);

    const { animation, animationSinPoint, animationCosPoint } = buildGenericAnimations(
        { xValues, yValues, y1Values },
        { animatedAnnotation, pointSinAnnotation, pointCosAnnotation }
    );

    const startAnimation = () => {
        sciChartSurface.addAnimation(animation);
        sciChartSurface.addAnimation(animationSinPoint);
        sciChartSurface.addAnimation(animationCosPoint);
    }

    return { sciChartSurface, animations: { animation, animationSinPoint, animationCosPoint }, startAnimation };
};

const buildAnnotations = (xValues: number[], yValues: number[], y1Values: number[]) => {
    const svg = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20" heigh="20" xml:space="preserve"><circle cx="10" cy="10" r="10" fill="#145DA0"/></svg>';

    const animatedAnnotation = new LineAnnotation({
        x1: xValues[0],
        y1: yValues[0],
        x2: xValues[0],
        y2: y1Values[0],
        stroke: "#145DA0",
        strokeThickness: 3
    });

    const pointSinAnnotation = new CustomAnnotation({
        x1: xValues[0],
        y1: yValues[0],
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        svgString: svg
    });

    const pointCosAnnotation = new CustomAnnotation({
        x1: xValues[0],
        y1: y1Values[0],
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        svgString: svg
    });
    return { animatedAnnotation, pointSinAnnotation, pointCosAnnotation };
};

const buildGenericAnimations = (
    data: { xValues: number[]; yValues: number[]; y1Values: number[] },
    annotations: { animatedAnnotation: IAnnotation; pointSinAnnotation: IAnnotation; pointCosAnnotation: IAnnotation }
) => {
    const ANIMATION_DURATION: number = 3000;
    let random: number = Math.random();

    let isAdditionalAnnotationDrawed: boolean = false;
    const animation = new GenericAnimation<ILineAnnotationOptions>({
        from: { x1: data.xValues[0], y1: data.yValues[0], x2: data.xValues[0], y2: data.y1Values[0] },
        to: {
            x1: data.xValues[data.xValues.length - 1],
            y1: data.yValues[data.yValues.length - 1],
            x2: data.xValues[data.xValues.length - 1],
            y2: data.y1Values[data.y1Values.length - 1]
        },
        duration: ANIMATION_DURATION,
        ease: easing.inOutSine,
        onAnimate: (from, to, progress) => {
            const point = Math.floor(data.xValues.length * progress);
            annotations.animatedAnnotation.x1 = data.xValues[point];
            annotations.animatedAnnotation.y1 = data.yValues[point];
            annotations.animatedAnnotation.x2 = data.xValues[point];
            annotations.animatedAnnotation.y2 = data.y1Values[point];
        },
        onCompleted: () => {
            isAdditionalAnnotationDrawed = false;
            random = Math.random();
            animation.reset();
        }
    });

    const animationSinPoint = new GenericAnimation<ICustomAnnotationOptions>({
        from: { x1: data.xValues[0], y1: data.yValues[0] },
        to: { x1: data.xValues[data.xValues.length - 1], y1: data.yValues[data.yValues.length - 1] },
        duration: ANIMATION_DURATION,
        ease: easing.inOutSine,
        onAnimate: (from, to, progress) => {
            const point = Math.floor(data.xValues.length * progress);
            annotations.pointSinAnnotation.x1 = data.xValues[point];
            annotations.pointSinAnnotation.y1 = data.yValues[point];
        },
        onCompleted: () => {
            animationSinPoint.reset();
        }
    });

    const animationCosPoint = new GenericAnimation<ICustomAnnotationOptions>({
        from: { x1: data.xValues[0], y1: data.y1Values[0] },
        to: { x1: data.xValues[data.xValues.length - 1], y1: data.y1Values[data.y1Values.length - 1] },
        duration: ANIMATION_DURATION,
        ease: easing.inOutSine,
        onAnimate: (from, to, progress) => {
            const point = Math.floor(data.xValues.length * progress);
            annotations.pointCosAnnotation.x1 = data.xValues[point];
            annotations.pointCosAnnotation.y1 = data.y1Values[point];
        },
        onCompleted: () => {
            animationCosPoint.reset();
        }
    });

    return { animation, animationSinPoint, animationCosPoint };
};

let scs: SciChartSurface;
let animation: GenericAnimation<ILineAnnotationOptions>;
let animationSinPoint: GenericAnimation<ICustomAnnotationOptions>;
let animationCosPoint: GenericAnimation<ICustomAnnotationOptions>;
let startAnimation: () => void;

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function GenericAnimations() {
    const [isStarted, setStarted] = React.useState<boolean>(false);
    const [isCanceled, setCanceled] = React.useState<boolean>(false);
    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            scs = res.sciChartSurface;
            animation = res.animations.animation;
            animationSinPoint = res.animations.animationSinPoint;
            animationCosPoint = res.animations.animationCosPoint;
            startAnimation = res.startAnimation;
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => scs?.delete();
    }, []);

    const handleStartClick = () => {
        setStarted(true);
        startAnimation();
    }

    const handleRestartClick = () => {
        cancelAnimations();
        startAnimation();
        animation?.reset();
        animationCosPoint?.reset();
        animationSinPoint?.reset();
        setStarted(true);
        setCanceled(false);
    };

    const handleCancelClick = () => {
        cancelAnimations();
        setStarted(false);
        setCanceled(true);
    };

    const cancelAnimations = () => {
        animation?.cancel();
        animationCosPoint?.cancel();
        animationSinPoint?.cancel();
    }

    return (
        <>
            <div id={divElementId} className={classes.ChartWrapper} />
            <div className={classes.ButtonsWrapper}>
                <Button className={classes.ButtonsText} size="medium" onClick={handleStartClick} disabled={isStarted || isCanceled}>
                    start
                </Button>
                <Button className={classes.ButtonsText} size="medium" onClick={handleCancelClick} disabled={!isStarted || isCanceled}>
                    cancel
                </Button>
                <Button className={classes.ButtonsText} size="medium" onClick={handleRestartClick} disabled={!isCanceled}>
                    restart
                </Button>
            </div>
        </>
    );
}
