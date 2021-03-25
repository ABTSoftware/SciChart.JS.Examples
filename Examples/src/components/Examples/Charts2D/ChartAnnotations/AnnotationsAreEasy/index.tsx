import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { TextAnnotation } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { EAnnotationLayer } from "scichart/Charting/Visuals/Annotations/IAnnotation";
import { HorizontalLineAnnotation } from "scichart/Charting/Visuals/Annotations/HorizontalLineAnnotation";
import { ELabelPlacement } from "scichart/types/LabelPlacement";
import { VerticalLineAnnotation } from "scichart/Charting/Visuals/Annotations/VerticalLineAnnotation";
import { AxisMarkerAnnotation } from "scichart/Charting/Visuals/Annotations/AxisMarkerAnnotation";
import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create an XAxis and YAxis
    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 10);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(0, 10);
    sciChartSurface.yAxes.add(yAxis);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    // Add the Annotations
    const CustomAnnotationSvgString = [
        '<svg width="300" height="100">',
        "   <g>",
        '       <rect x="0" y="0" width="100%" height="100%"',
        ' stroke="red" stroke-width="10" fill="orange"/>',
        '       <text x="50%" y="50%" dominant-baseline="middle"',
        ' text-anchor="middle" font-family="Verdana" font-size="26" fill="blue">SVG ANNOTATION</text>',
        "   </g>",
        "</svg>"
    ].join("");
    sciChartSurface.annotations.add(
        // Add TextAnnotations in the top left of the chart
        new TextAnnotation({ text: "Annotations are Easy!", fontSize: 24, x1: 0.3, y1: 9.7 }),
        new TextAnnotation({ text: "You can create text", fontSize: 18, x1: 1, y1: 9 }),

        // Add TextAnnotations with anchor points
        new TextAnnotation({
            text: "Anchor Center (X1, Y1)",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
            x1: 5,
            y1: 8
        }),
        new TextAnnotation({
            text: "Anchor Right",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Right,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            x1: 5,
            y1: 8
        }),
        new TextAnnotation({
            text: "or Anchor Left",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            x1: 5,
            y1: 8
        }),

        // Watermark with CoordinateMode Relative
        new TextAnnotation({
            text: "Create Watermarks",
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            x1: 0.5,
            y1: 0.5,
            fontSize: 56,
            fontWeight: "Bold",
            textColor: "#FFFFFF22",
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            annotationLayer: EAnnotationLayer.BelowChart
        }),

        // Lines
        new TextAnnotation({ fontSize: 12, text: "You can draw lines", x1: 0.3, y1: 6.3 }),

        new LineAnnotation({ stroke: "#555555", strokeThickness: 2, x1: 1, x2: 2, y1: 4, y2: 6 }),
        new LineAnnotation({ stroke: "#555555", strokeThickness: 2, x1: 1.2, x2: 2.5, y1: 3.8, y2: 6 }),

        // Boxes
        new TextAnnotation({ fontSize: 12, text: "Draw Boxes", x1: 3.3, y1: 6.3 }),

        new BoxAnnotation({ fill: "#279B2755", stroke: "#279B27", strokeThickness: 1, x1: 3.5, x2: 5, y1: 4, y2: 5 }),
        new BoxAnnotation({
            fill: "#FF191955",
            stroke: "#FF1919",
            strokeThickness: 1,
            x1: 4,
            x2: 5.5,
            y1: 4.5,
            y2: 5.5
        }),
        new BoxAnnotation({ fill: "#1964FF55", stroke: "#1964FF", strokeThickness: 1, x1: 4.5, x2: 6, y1: 5, y2: 6 }),

        // Horizontal Lines

        // Horizontal line not fully stretched: set X1 property
        new HorizontalLineAnnotation({
            labelPlacement: ELabelPlacement.TopLeft,
            labelValue: "Right aligned, with text on left",
            showLabel: true,
            stroke: "Orange",
            strokeThickness: 2,
            x1: 5, // Omitting X will make the annotation stretch to fit
            y1: 3.2 // The Y-value of the HorizontalLineAnnotation
        }),

        // Horizontal line stretched horizontally
        new HorizontalLineAnnotation({
            labelPlacement: ELabelPlacement.Axis,
            showLabel: true,
            stroke: "Orange",
            strokeThickness: 2,
            y1: 2.8 // The Y-value of the HorizontalLineAnnotation
        }),

        // Vertical lines

        // Horizontal line not fully stretched: set X1 property
        new VerticalLineAnnotation({
            labelPlacement: ELabelPlacement.Axis,
            showLabel: true,
            stroke: "Brown",
            strokeThickness: 2,
            x1: 9,
            axisLabelFill: "Brown"
        }),

        // Horizontal line stretched horizontally
        new VerticalLineAnnotation({
            labelPlacement: ELabelPlacement.TopRight,
            labelValue: "Top aligned",
            showLabel: true,
            stroke: "Brown",
            strokeThickness: 2,
            x1: 9.5,
            axisLabelFill: "Brown"
        }),

        // Axis Markers

        new AxisMarkerAnnotation({
            y1: 5.2,
            fontSize: 12,
            fontStyle: "Bold"
        }),

        // Custom shapes

        new TextAnnotation({ fontSize: 12, text: "Or custom shapes using SVG", x1: 7, y1: 6.3 }),
        getBuyMarkerAnnotation(8, 5.5),
        getSellMarkerAnnotation(7.5, 5),

        new CustomAnnotation({
            x1: 1,
            y1: 2.5,
            svgString: CustomAnnotationSvgString
        })
    );

    return { sciChartSurface, wasmContext };
};

const getBuyMarkerAnnotationSvgString = [
    '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">',
    '<g transform="translate(-53.867218,-75.091687)">',
    '<path style="fill:#1cb61c;',
    "fill-opacity:0.34117647;stroke:#00b400;stroke-width:1px;",
    'stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"',
    'd="m 55.47431,83.481251 c 7.158904,-7.408333 7.158904,',
    "-7.408333 7.158904,-7.408333 l 7.158906,7.408333",
    ' H 66.212668 V 94.593756 H 59.053761 V 83.481251 Z"',
    "/>",
    "</g>",
    "</svg>"
].join("");
// Returns a CustomAnnotation that represents a buy marker arrow
// The CustomAnnotation supports SVG as content. Using Inkscape or similar you can create SVG content for annotations
const getBuyMarkerAnnotation = (x1: number, y1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString: getBuyMarkerAnnotationSvgString
    });
};

const getSellMarkerAnnotationSvgString = [
    '<svg id="Capa_1" xmlns="http://www.w3.org/2000/svg">',
    '<g transform="translate(-54.616083,-75.548914)">',
    '<path style="fill:#b22020;fill-opacity:0.34117648;stroke:#990000;stroke-width:1px;',
    'stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"',
    'd="m 55.47431,87.025547 c 7.158904,7.408333',
    " 7.158904,7.408333 7.158904,7.408333 L 69.79212,",
    '87.025547 H 66.212668 V 75.913042 h -7.158907 v 11.112505 z"',
    "/>",
    "</g>",
    "</svg>"
].join("");
// Returns a CustomAnnotation that represents a sell marker arrow
// The CustomAnnotation supports SVG as content. Using Inkscape or similar you can create SVG content for annotations
const getSellMarkerAnnotation = (x1: number, y1: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        svgString: getSellMarkerAnnotationSvgString
    });
};

export default function AnnotationsAreEasy() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
