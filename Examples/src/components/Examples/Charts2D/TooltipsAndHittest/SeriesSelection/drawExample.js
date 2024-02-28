import { appTheme } from "scichart-example-dependencies";
import {
    ECoordinateMode,
    EHorizontalAnchorPoint,
    NumericAxis,
    NumberRange,
    SciChartSurface,
    SplineLineRenderableSeries,
    TextAnnotation,
    XyDataSeries,
    SeriesSelectionModifier,
    AUTO_COLOR,
    EPointMarkerType,
    LegendModifier,
    GenericAnimation,
} from "scichart";
// Generate some data for the example
const dataSize = 30;
const xValues = [];
const yValues = [];
const y1Values = [];
const y2Values = [];
const y3Values = [];
const y4Values = [];
for (let i = 0; i < dataSize; i++) {
    xValues.push(i);
    y4Values.push(Math.random());
    y3Values.push(Math.random() + 1);
    y2Values.push(Math.random() + 1.8);
    y1Values.push(Math.random() + 2.5);
    yValues.push(Math.random() + 3.6);
}
// Custom function called when series is hovered
const onHoveredChanged = (sourceSeries, isHovered) => {
    console.log(`Series ${sourceSeries.dataSeries.dataSeriesName} isHovered=${isHovered}`);
    const targetSeriesOpacity = 1;
    const otherSeriesOpacity = isHovered ? 0.3 : 1;
    const sciChartSurface = sourceSeries.parentSurface;
    const otherSeries = sciChartSurface.renderableSeries.asArray().filter((rs) => rs !== sourceSeries);
    // Use the genericanimations feature to animate opacity on the hovered series
    // TODO: SciChart devs will think of a way to make this code more succinct!
    sciChartSurface.addAnimation(
        new GenericAnimation({
            from: sourceSeries.opacity,
            to: targetSeriesOpacity,
            duration: 100,
            onAnimate: (from, to, progress) => {
                const opacity = (to - from) * progress + from;
                sourceSeries.opacity = opacity;
                sourceSeries.pointMarker.opacity = opacity;
            },
        })
    );
    // Dim opacity on the other non-hovered series
    sciChartSurface.addAnimation(
        new GenericAnimation({
            from: otherSeries[0].opacity,
            to: otherSeriesOpacity,
            duration: 100,
            onAnimate: (from, to, progress) => {
                const opacity = (to - from) * progress + from;
                otherSeries.forEach((rs) => {
                    rs.opacity = opacity;
                    rs.pointMarker.opacity = opacity;
                });
            },
        })
    );
};
// Custom function called when a series is selected or deselected
const onSelectedChanged = (sourceSeries, isSelected) => {
    console.log(`Series ${sourceSeries.dataSeries.dataSeriesName} isSelected=${isSelected}`);
    // When selected, set the stroke = white, or reset previous value
    const targetSeriesStroke = isSelected ? appTheme.ForegroundColor : sourceSeries.pointMarker.fill;
    sourceSeries.stroke = targetSeriesStroke;
    sourceSeries.pointMarker.stroke = targetSeriesStroke;
};
export const drawExample = async (rootElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            growBy: new NumberRange(0.1, 0.1),
        })
    );
    sciChartSurface.chartModifiers.add(
        new SeriesSelectionModifier({
            enableHover: true,
            enableSelection: true,
        })
    );
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues, dataSeriesName: "First Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 },
            },
            strokeThickness: 3,
            onHoveredChanged,
            onSelectedChanged,
        })
    );
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values, dataSeriesName: "Second Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 },
            },
            strokeThickness: 3,
            onHoveredChanged,
            onSelectedChanged,
        })
    );
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y2Values, dataSeriesName: "Third Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 },
            },
            strokeThickness: 3,
            onHoveredChanged,
            onSelectedChanged,
        })
    );
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y3Values, dataSeriesName: "Fourth Series" }),
            pointMarker: {
                type: EPointMarkerType.Ellipse,
                options: { fill: AUTO_COLOR, stroke: AUTO_COLOR, strokeThickness: 3, width: 20, height: 20 },
            },
            strokeThickness: 3,
            onHoveredChanged,
            onSelectedChanged,
        })
    );
    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Hover, Click & Select to animate style!",
            fontSize: 20,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );
    // Add a legend to the chart
    sciChartSurface.chartModifiers.add(new LegendModifier());
    return { sciChartSurface, wasmContext };
};
