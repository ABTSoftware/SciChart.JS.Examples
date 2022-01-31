import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import {
    ILineAnnotationOptions,
    LineAnnotation
} from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { GlowEffect } from "scichart/Charting/Visuals/RenderableSeries/GlowEffect";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
// import { GenericAnimation } from "scichart/Core/Animations/GenericAnimation";
import { NumberRange } from "scichart/Core/NumberRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { colors } from "../utils/colors";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import {
    CustomAnnotation,
    ICustomAnnotationOptions
} from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { axisOptionsCommon, theme } from "../utils/theme";
import { getVerticalChartData } from "../services/data.service";
import { IAnnotation } from "scichart/Charting/Visuals/Annotations/IAnnotation";

export const verticalChart = "verticalChart";

export const drawVerticalChartExample = async () => {
    const { xValues, yValues, y1Values } = getVerticalChartData();

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(verticalChart, { theme });

    const xAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.1, 0.1)
    });
    sciChartSurface.xAxes.add(xAxis);

    const yAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        axisAlignment: EAxisAlignment.Top,
        growBy: new NumberRange(0.1, 0.1)
    });
    yAxis.labelProvider.formatCursorLabel = value => value.toFixed(3);
    yAxis.labelProvider.precision = 2;
    sciChartSurface.yAxes.add(yAxis);

    // An axis may be optionally flipped using flippedCoordinates property
    xAxis.flippedCoordinates = true;

    // Add a series with sinewave. This will be drawn vertically.
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            strokeThickness: 4,
            stroke: colors.primary,
            effect: new GlowEffect(wasmContext, {
                range: 1,
                intensity: 1
            })
        })
    );

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            strokeThickness: 4,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values }),
            stroke: colors.secondary
            // effect: new GlowEffect(wasmContext, {
            //     range: 0,
            //     intensity: 1,
            // })
        })
    );

    const { animatedAnnotation, pointSinAnnotation, pointCosAnnotation } = buildAnnotations(xValues, yValues, y1Values);

    sciChartSurface.annotations.add(animatedAnnotation, pointSinAnnotation, pointCosAnnotation);

    // const { animation, animationSinPoint, animationCosPoint } = buildGenericAnimations(
    //     sciChartSurface,
    //     { xValues, yValues, y1Values },
    //     { animatedAnnotation, pointSinAnnotation, pointCosAnnotation }
    // );

    // sciChartSurface.addAnimation(animation);
    // sciChartSurface.addAnimation(animationSinPoint);
    // sciChartSurface.addAnimation(animationCosPoint);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new RolloverModifier({ rolloverLineStroke: colors.blueSchema[300] }));

    sciChartSurface.zoomExtents();

    return sciChartSurface;
};

const buildAnnotations = (xValues: number[], yValues: number[], y1Values: number[]) => {
    const svg = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20" heigh="20" xml:space="preserve"><circle cx="10" cy="10" r="10" fill="${colors.blueSchema[100]}"/></svg>`;

    const animatedAnnotation = new LineAnnotation({
        x1: xValues[0],
        y1: yValues[0],
        x2: xValues[0],
        y2: y1Values[0],
        stroke: colors.blueSchema[100],
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

// const buildGenericAnimations = (
//     sciChartSurface: SciChartSurface,
//     data: { xValues: number[]; yValues: number[]; y1Values: number[] },
//     annotations: { animatedAnnotation: IAnnotation; pointSinAnnotation: IAnnotation; pointCosAnnotation: IAnnotation }
// ) => {
//     const ANIMATION_DURATION: number = 3000;
//     let random: number = Math.random();

//     let isAdditionalAnnotationDrawed: boolean = false;
//     const animation = new GenericAnimation<ILineAnnotationOptions>({
//         from: { x1: data.xValues[0], y1: data.yValues[0], x2: data.xValues[0], y2: data.y1Values[0] },
//         to: {
//             x1: data.xValues[data.xValues.length - 1],
//             y1: data.yValues[data.yValues.length - 1],
//             x2: data.xValues[data.xValues.length - 1],
//             y2: data.y1Values[data.y1Values.length - 1]
//         },
//         duration: ANIMATION_DURATION,
//         ease: easing.inOutSine,
//         onAnimate: (from, to, progress) => {
//             const point = Math.floor(data.xValues.length * progress);
//             annotations.animatedAnnotation.x1 = data.xValues[point];
//             annotations.animatedAnnotation.y1 = data.yValues[point];
//             annotations.animatedAnnotation.x2 = data.xValues[point];
//             annotations.animatedAnnotation.y2 = data.y1Values[point];
//             if (progress > random && !isAdditionalAnnotationDrawed) {
//                 isAdditionalAnnotationDrawed = true;
//                 sciChartSurface.annotations.add(
//                     new LineAnnotation({
//                         x1: data.xValues[point],
//                         y1: data.yValues[point],
//                         x2: data.xValues[point],
//                         y2: data.y1Values[point],
//                         stroke: colors.blueSchema[random > 0.5 ? 900 : 200],
//                         strokeThickness: 1
//                     })
//                 );
//             }
//         },
//         onCompleted: () => {
//             isAdditionalAnnotationDrawed = false;
//             random = Math.random();
//             animation.reset();
//         }
//     });

//     const animationSinPoint = new GenericAnimation<ICustomAnnotationOptions>({
//         from: { x1: data.xValues[0], y1: data.yValues[0] },
//         to: { x1: data.xValues[data.xValues.length - 1], y1: data.yValues[data.yValues.length - 1] },
//         duration: ANIMATION_DURATION,
//         ease: easing.inOutSine,
//         onAnimate: (from, to, progress) => {
//             const point = Math.floor(data.xValues.length * progress);
//             annotations.pointSinAnnotation.x1 = data.xValues[point];
//             annotations.pointSinAnnotation.y1 = data.yValues[point];
//         },
//         onCompleted: () => {
//             animationSinPoint.reset();
//         }
//     });

//     const animationCosPoint = new GenericAnimation<ICustomAnnotationOptions>({
//         from: { x1: data.xValues[0], y1: data.y1Values[0] },
//         to: { x1: data.xValues[data.xValues.length - 1], y1: data.y1Values[data.y1Values.length - 1] },
//         duration: ANIMATION_DURATION,
//         ease: easing.inOutSine,
//         onAnimate: (from, to, progress) => {
//             const point = Math.floor(data.xValues.length * progress);
//             annotations.pointCosAnnotation.x1 = data.xValues[point];
//             annotations.pointCosAnnotation.y1 = data.y1Values[point];
//         },
//         onCompleted: () => {
//             animationCosPoint.reset();
//         }
//     });

//     return { animation, animationSinPoint, animationCosPoint };
// };
