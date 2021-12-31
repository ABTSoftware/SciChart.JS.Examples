import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { GenericAnimation } from "scichart/Core/Animations/GenericAnimation";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";

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

    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            strokeThickness: 4,
            stroke: "#05445E"
        })
    );
    // Setup animations
    const visibleRangeAnimation = new GenericAnimation({
        from: buildFrom(xAxis, yAxis),
        to: buildTo(xAxis, yAxis),
        duration: 3000,
        delay: 6000,
        ease: easing.inSine,
        onAnimate: (from, to, progress) => {
            xAxis.visibleRange.min = from.minX + (to.minX - from.minX) * progress;
            xAxis.visibleRange.max = from.maxX + (to.maxX - from.maxX) * progress;
            yAxis.visibleRange.min = from.minY + (to.minY - from.minY) * progress;
            yAxis.visibleRange.max = from.maxY + (to.maxY - from.maxY) * progress;
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
