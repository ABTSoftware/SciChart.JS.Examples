import {
    SciChartPolarSurface,
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    XyDataSeries,
    PolarLineRenderableSeries,
    EllipsePointMarker,
    PolarNumericAxis,
    EPolarAxisMode,
    EPolarLabelMode,
    EAxisAlignment,
    EXyDirection,
    GenericAnimation,
    easing,
    NumberRange,
} from "scichart";
import { appTheme } from "../../../theme";

/**
 * Calculate inner radius for the angle to fit nicely into 3 x 2 aspect ratio canvas.
 * Use it for fraction less than 1/4 (quarter of the circle)
 */
const calcRadiusFromAngleFraction = (angleFraction: number) => {
    const totalAngle = 2 * Math.PI * angleFraction;
    const halfAngle = totalAngle / 2;
    return (1 - (4 / 3) * Math.sin(halfAngle)) / Math.cos(halfAngle);
};

export const drawExample = async (
    rootElement: string | HTMLDivElement,
    innerRadius: number,
    totalAngle: number,
    onAnimationUpdate?: (values: { innerRadius: number; totalAngle: number }) => void
) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add axes
    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        drawMinorGridLines: false,
        useNativeText: true,
        drawLabels: true,
        labelPrecision: 0,

        majorGridLineStyle: {
            color: "gray",
            strokeThickness: 1,
        },
        isInnerAxis: true,
        visibleRange: new NumberRange(0, 10),
        zoomExtentsToInitialRange: true,

        innerRadius: innerRadius,
        startAngle: Math.PI / 2,
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const angularXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        polarLabelMode: EPolarLabelMode.Parallel,
        axisAlignment: EAxisAlignment.Top,
        labelPrecision: 0,

        flippedCoordinates: true,
        drawMinorGridLines: false,
        useNativeText: true,

        majorGridLineStyle: {
            color: "gray",
            strokeThickness: 1,
        },

        totalAngle,
        startAngle: Math.PI / 2,
    });
    sciChartSurface.xAxes.add(angularXAxis);

    // Add a basic line series to better visualize the polar chart
    const PETAL_NUMBER = 6;
    const POINTS_PER_PETAL = 100;

    const polarlineSeries = new PolarLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: Array.from({ length: PETAL_NUMBER * POINTS_PER_PETAL + 1 }, (_, i) => i / POINTS_PER_PETAL),
            yValues: Array.from({ length: PETAL_NUMBER * POINTS_PER_PETAL + 1 }, (_, i) => {
                const angleFraction = i / (PETAL_NUMBER * POINTS_PER_PETAL);
                return 5 + 5 * Math.sin(2 * Math.PI * angleFraction * PETAL_NUMBER);
            }),
        }),
        stroke: appTheme.VividOrange,
        interpolateLine: true,
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 8,
            height: 8,
            stroke: appTheme.VividOrange,
            fill: appTheme.DarkIndigo,
        }),
    });
    sciChartSurface.renderableSeries.add(polarlineSeries);

    // customize `zoomExtents` modifier to update frontend sliders via Callback
    const zoomExtentsMod = new PolarZoomExtentsModifier();
    zoomExtentsMod.animationDuration = 200;
    zoomExtentsMod.onZoomExtents = (sciChartSurface) => {
        setTimeout(() => {
            onAnimationUpdate({
                innerRadius: radialYAxis.innerRadius,
                totalAngle: angularXAxis.totalAngle,
            });
        }, 200); // wait for `zoomExtents` animation to complete
        return true;
    };

    sciChartSurface.chartModifiers.add(
        new PolarPanModifier({ xyDirection: EXyDirection.XDirection }),
        new PolarMouseWheelZoomModifier({ growFactor: 0.0002 }),

        // Customise `zoomExtents` modifier to update frontend sliders via `onAnimationUpdate` Callback
        new PolarZoomExtentsModifier({
            animationDuration: 200,
            onZoomExtents: (sciChartSurface) => {
                setTimeout(() => {
                    onAnimationUpdate({
                        innerRadius: radialYAxis.innerRadius,
                        totalAngle: angularXAxis.totalAngle,
                    });
                }, 200); // wait for animation to complete
                return true;
            },
        })
    );

    // Animation which animates a polar surface to look like a Cartesian coordinate system for better understanding
    type polarAnimationOptions = {
        angleFraction: number;
        startAngle: number;
        radius: number;
    };

    const animateAll = (from: polarAnimationOptions, to: polarAnimationOptions, progress: number) => {
        const angleFractionQuarter$ = 1 / 4;
        const totalAngleQuarter$ = 2 * Math.PI * angleFractionQuarter$;
        const beta$ = totalAngleQuarter$ / 2;
        const radius4quarter$ = (1 - (4 / 3) * Math.sin(beta$)) / Math.cos(beta$);
        const startAngleQuarter$ = totalAngleQuarter$ - totalAngleQuarter$ / 2;

        const curFraction$ = from.angleFraction + (to.angleFraction - from.angleFraction) * progress;
        const curTotalAngle$ = 2 * Math.PI * curFraction$;
        angularXAxis.totalAngle = curTotalAngle$;
        const isAFIncreasing$ = to.angleFraction - from.angleFraction > 0;
        if (isAFIncreasing$) {
            if (curFraction$ < angleFractionQuarter$) {
                const progress$ = (curFraction$ - from.angleFraction) / (angleFractionQuarter$ - from.angleFraction);
                const radius$ = calcRadiusFromAngleFraction(curFraction$);
                radialYAxis.innerRadius = radius$;
                const curSA$ = from.startAngle + (startAngleQuarter$ - from.startAngle) * progress$;
                angularXAxis.startAngle = curSA$;
                radialYAxis.startAngle = curSA$;
            } else {
                const progress$ = (curFraction$ - angleFractionQuarter$) / (to.angleFraction - angleFractionQuarter$);
                const radius$ = radius4quarter$ + (to.radius - radius4quarter$) * progress$;
                radialYAxis.innerRadius = radius$;
                const curSA$ = startAngleQuarter$ + (to.startAngle - startAngleQuarter$) * progress$;
                angularXAxis.startAngle = curSA$;
                radialYAxis.startAngle = curSA$;
            }
        } else {
            if (curFraction$ > angleFractionQuarter$) {
                const progress$ = (from.angleFraction - curFraction$) / (from.angleFraction - angleFractionQuarter$);
                const radius$ = from.radius + (radius4quarter$ - from.radius) * progress$;
                radialYAxis.innerRadius = radius$;
                const curSA$ = from.startAngle + (startAngleQuarter$ - from.startAngle) * progress$;
                angularXAxis.startAngle = curSA$;
                radialYAxis.startAngle = curSA$;
            } else {
                const progress$ = (angleFractionQuarter$ - curFraction$) / (angleFractionQuarter$ - to.angleFraction);
                const radius$ = calcRadiusFromAngleFraction(curFraction$);
                radialYAxis.innerRadius = radius$;
                const curSA$ = startAngleQuarter$ + (to.startAngle - startAngleQuarter$) * progress$;
                angularXAxis.startAngle = curSA$;
                radialYAxis.startAngle = curSA$;
            }
        }

        if (onAnimationUpdate) {
            onAnimationUpdate({
                innerRadius: radialYAxis.innerRadius,
                totalAngle: angularXAxis.totalAngle,
            });
        }
    };

    const allAnimation = new GenericAnimation<polarAnimationOptions>({
        from: { angleFraction: 0.0006, startAngle: Math.PI / 2, radius: 0.998 },
        to: { angleFraction: 1, startAngle: 0, radius: 0 },
        onAnimate: animateAll,
        delay: 1000,
        duration: 2000,
        ease: easing.linear,
        onCompleted: () => {
            const tmp = allAnimation.from;
            allAnimation.from = allAnimation.to;
            allAnimation.to = tmp;
            allAnimation.reset();
        },
    });

    return {
        sciChartSurface,
        wasmContext,
        controls: {
            startAnimation: () => {
                allAnimation.reset();
                sciChartSurface.addAnimation(allAnimation);
            },
            endAnimation: () => {
                sciChartSurface.getAnimations().forEach((a) => a.cancel());
            },
            changeInnerRadiusInternal: (value: number) => {
                radialYAxis.innerRadius = value;
            },
            changeTotalAngleInternal: (value: number) => {
                angularXAxis.totalAngle = value;
            },
        },
    };
};
