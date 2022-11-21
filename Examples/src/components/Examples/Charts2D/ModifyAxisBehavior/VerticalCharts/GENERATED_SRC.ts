export const code = `import * as React from "react";
import {NumberRange} from "scichart/Core/NumberRange";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {EHorizontalAnchorPoint, EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {SplineLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/SplineLineRenderableSeries";
import {RandomWalkGenerator} from "../../../ExampleData/RandomWalkGenerator";
import {EllipsePointMarker} from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";

const divElementId2 = "chart2";

const drawExample = async () => {
    const {
        wasmContext,
        sciChartSurface
    } = await SciChartSurface.create(divElementId2, {theme: appTheme.SciChartJsTheme});

    // Setting an XAxis on the Left or Right
    // and YAxis on the Top or Bottom
    // causes the chart and series to be rotated vertically
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "X Axis with Alignment = Left",
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.1, 0.1)
    }));

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        axisTitle: "Y Axis with Alignment = Bottom",
        axisAlignment: EAxisAlignment.Bottom,
        growBy: new NumberRange(0.1, 0.1)
    }));

    // Generate some data. xValues/yValues are just arrays of numbers
    const generator = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(100);
    const xValues = generator.xValues;
    const yValues = generator.yValues;

    // Add a line series to the chart. This will be drawn vertically.
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {xValues, yValues}),
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 9,
                height: 9,
                fill: appTheme.ForegroundColor,
                stroke: appTheme.VividOrange
            }),
            strokeThickness: 5,
            stroke: appTheme.VividOrange
        })
    );

    // Add title / instructions
    sciChartSurface.annotations.add(new TextAnnotation({
        x1: 0.0,
        yCoordShift: 10,
        y1: 0.5,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        fontSize: 16,
        opacity: .77,
        textColor: appTheme.ForegroundColor,
        text: "To rotate a chart in SciChart.js, set XAxis.alignment = Left/Right and YAxis.alignment=Top/Bottom"
    }))

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    return {wasmContext, sciChartSurface};
};

export default function VerticalCharts() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId2} className={classes.ChartWrapper}/>;
}
`;