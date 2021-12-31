import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { GenericAnimation } from "scichart/Core/Animations/GenericAnimation";
import { easing } from "scichart/Core/Animations/EasingFunctions";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";

const initialData = {
    xValues: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    yValues: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
};

const getData = () => {
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < initialData.xValues.length; i++) {
        xValues.push(Math.random() * 5) + 1;
        yValues.push(Math.random() * 5) + 1;
    }
    return {
        xValues,
        yValues
    }
}

const interpolateNumber = (from, to, progress) => {
    if (progress < 0) return from;
    if (progress > 1) return to;
    return from + (to - from) * progress;
};

async function drawDataPointAnimationsChart(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
        theme: new SciChartJSLightTheme()
    });

    // Setup axes
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 6) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 6) }));

    // setup data
    const dataSeries = new XyDataSeries(wasmContext, initialData);
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            fill: "#189AB4",
            strokeThickness: 0
        })
    });

    sciChartSurface.renderableSeries.add(scatterSeries);

    // Setup animations
    const dataAnimation = new GenericAnimation({
        from: initialData,
        to: getData(),
        duration: 1000,
        ease: easing.inOutSine,
        onAnimate: (from, to, progress) => {
            from.xValues.forEach((value, index) => {
                const x = interpolateNumber(value, to.xValues[index], progress);
                const y = interpolateNumber(from.yValues[index], to.yValues[index], progress);
                dataSeries.updateXy(index, x, y);
            });
        },
        onCompleted: () => {
            dataAnimation.from = dataAnimation.to;
            dataAnimation.to = getData();
            dataAnimation.reset();
            scatterSeries.pointMarker.width += 3;
            scatterSeries.pointMarker.height += 3;
            console.log("Data Point Animation Completed");
        }
    });
    sciChartSurface.addAnimation(dataAnimation);
}

drawDataPointAnimationsChart("scichart");