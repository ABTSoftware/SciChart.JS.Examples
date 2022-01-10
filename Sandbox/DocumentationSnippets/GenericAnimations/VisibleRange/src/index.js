import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { GenericAnimation } from "scichart/Core/Animations/GenericAnimation";
import { NumberRangeAnimator } from "scichart/Core/Animations/NumberRangeAnimator";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";

const getChartData = () => {
    const xValues = [];
    const yValues = [];
    const y1Values = [];

    for (let i = 0; i <= 1000; i++) {
        const x = 0.1 * i;
        xValues.push(x);
        yValues.push(Math.sin(x * 0.09));
    }
    return {
        xValues,
        yValues,
        y1Values
    };
};

const buildFrom = (xAxis, yAxis) => ({
    minX: xAxis.visibleRange.min,
    maxX: xAxis.visibleRange.max,
    minY: yAxis.visibleRange.min,
    maxY: yAxis.visibleRange.max
});

const buildTo = (xAxis, yAxis) => ({
    minX: xAxis.visibleRange.min + (Math.random() * 10 + 1) * (Math.random() > .5 ? 1 : -1),
    maxX: xAxis.visibleRange.max + (Math.random() * 10 + 1) * (Math.random() > .5 ? 1 : -1),
    minY: yAxis.visibleRange.min - Math.random(),
    maxY: yAxis.visibleRange.max + Math.random(),
});

async function drawVisibleRangeAnimationsChart(divId) {
    const { xValues, yValues, y1Values } = getChartData();

    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
        theme: new SciChartJSLightTheme()
    });

    // Setup axes
    const xAxis = new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 100) });
    const yAxis = new NumericAxis(wasmContext, { visibleRange: new NumberRange(-1, 1.5) });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    
    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        fill: "rgba(176, 196, 222, 1)",
        stroke: "#4682b4",
        strokeThickness: 2,
        dataPointWidth: 0.5,
        opacity: 0.7
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < 200; i++) {
        dataSeries.append(i, 2 * Math.sin(i * 0.2));
    }
    columnSeries.dataSeries = dataSeries;

    // Setup animations
    const visibleRangeAnimation = new GenericAnimation({
        from: buildFrom(xAxis, yAxis),
        to: buildTo(xAxis, yAxis),
        duration: 3000,
        delay: 6000,
        ease: easing.inSine,
        onAnimate: (from, to, progress) => {
            const xInterpolate = NumberRangeAnimator.interpolate(new NumberRange(from.minX, from.maxX), new NumberRange(to.minX, to.maxX), progress);
            const yInterpolate = NumberRangeAnimator.interpolate(new NumberRange(from.minY, from.maxY), new NumberRange(to.minY, to.maxY), progress);
            xAxis.visibleRange.min = xInterpolate.min;
            xAxis.visibleRange.max = xInterpolate.max;

            yAxis.visibleRange.min = yInterpolate.min;
            yAxis.visibleRange.max = yInterpolate.max;
        },
        onCompleted: () => {
            visibleRangeAnimation.delay = 0;
            visibleRangeAnimation.from = visibleRangeAnimation.to;
            visibleRangeAnimation.to = buildTo(xAxis, yAxis);
            visibleRangeAnimation.reset();
        }
    });
    sciChartSurface.addAnimation(visibleRangeAnimation);
}

drawVisibleRangeAnimationsChart("scichart");
