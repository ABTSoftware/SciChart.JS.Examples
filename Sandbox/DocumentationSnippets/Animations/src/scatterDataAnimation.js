import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import {XyScatterRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import {SciChartJSLightTheme} from "scichart/Charting/Themes/SciChartJSLightTheme";
import {ScatterAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/ScatterAnimation";
import { easing} from "scichart/Core/Animations/EasingFunctions";
import {EPointMarkerType} from "scichart/types/PointMarkerType";

export async function scatterDataAnimation(divId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divId, {
        theme: new SciChartJSLightTheme()
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 5) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, 5) }));

    // Create a scatter series with some initial data
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5],
            yValues: [1.3, 2.3, 4, 3.3, 4.5]
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 11, height: 11, fill: "#FF3333BB", strokeThickness: 0
        })
    });
    sciChartSurface.renderableSeries.add(scatterSeries);

    // Update data using data animations
    const animateData = () => {
        const xValues = Array.from({length: 5}, () => Math.random() * 5);
        const yValues = Array.from({length: 5}, () => Math.random() * 5);

        scatterSeries.runAnimation(new ScatterAnimation({
            duration: 500,
            ease: easing.outQuad,
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
        }));

        setTimeout(animateData, 1000);
    };

    setTimeout(animateData, 1000);
}

