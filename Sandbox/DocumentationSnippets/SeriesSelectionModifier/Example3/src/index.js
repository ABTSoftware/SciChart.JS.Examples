import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {NumberRange} from "scichart/Core/NumberRange";
import {SeriesSelectionModifier} from "scichart/Charting/ChartModifiers/SeriesSelectionModifier";
import {LineAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/LineAnimation";
import {easing} from "scichart/Core/Animations/EasingFunctions";
import {ScatterAnimation} from "scichart/Charting/Visuals/RenderableSeries/Animations/ScatterAnimation";

async function initSciChart() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create("scichart-div-id");

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    const defaultStroke = "SteelBlue";
    const defaultFill = "LightSteelBlue";

    const applyStyle = (series, isSelected, isHovered) => {
        series.stroke = isSelected && isHovered ? "#FFBB99" :
            isSelected ? "#FFF" :
                isHovered ? "#FF7733" :
                    defaultStroke;
        series.pointMarker.stroke = series.stroke;
        series.pointMarker.fill = isSelected && isHovered ? "#FFBB99" :
            isSelected ? "#FFF" :
                isHovered ? "#FF7733" :
                    defaultFill;
    };

    const applyStyleWithAnimation = (series, isSelected, isHovered) => {
        const stroke = isSelected && isHovered ? "#FFBB99" :
            isSelected ? "#FFF" :
                isHovered ? "#FF7733" :
                    defaultStroke;
        const fill = isSelected && isHovered ? "#FFBB99" :
            isSelected ? "#FFF" :
                isHovered ? "#FF7733" :
                    defaultFill;
        const strokeThickness = isSelected ? 3 : 2;

        series.enqueueAnimation(new LineAnimation({
            styles: {
                stroke,
                strokeThickness,
                pointMarker: { stroke, fill }
            },
            duration: 250,
            ease: easing.outQuad
        }));
    };

    // Create a chart with line series with a point-marker
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        stroke: defaultStroke,
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 10,
            height: 10,
            strokeThickness: 2,
            stroke: defaultStroke,
            fill: defaultFill}),
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            yValues: [4.3, 5.3, 6, 6.3, 6, 5.2, 4.5, 4.6, 5, 6, 7, 8]
        }),

        // Apply a style to the series on selected and hovered
        onSelectedChanged: sourceSeries => {
            applyStyleWithAnimation(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
        },

        onHoveredChanged: sourceSeries => {
            applyStyleWithAnimation(sourceSeries, sourceSeries.isSelected, sourceSeries.isHovered);
        }
    }));

    // Add the DatapointSelectionModifier to the chart
    sciChartSurface.chartModifiers.add(new SeriesSelectionModifier( {
        enableSelection: true,
        enableHover: true,
    }));
}

initSciChart();
