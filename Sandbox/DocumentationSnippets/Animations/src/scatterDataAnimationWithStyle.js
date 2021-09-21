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

export async function scatterDataAnimationWithStyle(divId) {
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
    const animateDataAndStyle = () => {
        const xValues = Array.from({length: 5}, () => Math.random() * 5);
        const yValues = Array.from({length: 5}, () => Math.random() * 5);

        const randomColor = () => '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
        const fillColor = randomColor();
        const strokeColor = randomColor();
        const size = Math.random() * 12 + 5;
        const pointMarkers = [EPointMarkerType.Ellipse, EPointMarkerType.Triangle, EPointMarkerType.Square];
        const randomMarker = () => pointMarkers[Math.floor(Math.random() * 3)];

        scatterSeries.runAnimation(new ScatterAnimation({
            duration: 500,
            ease: easing.outQuad,
            styles: {
                pointMarker: {
                    type: randomMarker(),
                    width: size,
                    height: size,
                    strokeThickness: 3,
                    stroke: strokeColor,
                    fill: fillColor
                }
            },
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
        }));

        setTimeout(animateDataAndStyle, 1000);
    };

    setTimeout(animateDataAndStyle, 1000);
}

