export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { LineAnnotation } from "scichart/Charting/Visuals/Annotations/LineAnnotation";
import { HorizontalLineAnnotation } from "scichart/Charting/Visuals/Annotations/HorizontalLineAnnotation";
import { VerticalLineAnnotation } from "scichart/Charting/Visuals/Annotations/VerticalLineAnnotation";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { TextAnnotation } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { ELabelPlacement } from "scichart/types/LabelPlacement";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";

const divElementId = "chart";

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    const xAxis = new NumericAxis(wasmContext);
    xAxis.visibleRange = new NumberRange(0, 10);

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    yAxis.visibleRange = new NumberRange(0, 10);

    sciChartSurface.yAxes.add(yAxis);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    const horizontalLineAnnotation1 = new HorizontalLineAnnotation({
        stroke: "#FF6600",
        strokeThickness: 3,
        y1: 5,
        x1: 5,
        showLabel: true,
        labelPlacement: ELabelPlacement.TopLeft,
        labelValue: "Not Editable"
    });
    const horizontalLineAnnotation2 = new HorizontalLineAnnotation({
        stroke: "#FF6600",
        strokeThickness: 3,
        y1: 4,
        x1: 5,
        showLabel: true,
        labelPlacement: ELabelPlacement.TopLeft,
        labelValue: "Editable",
        isEditable: true
    });

    const verticalLineAnnotation = new VerticalLineAnnotation({
        stroke: "#FF6600",
        strokeThickness: 3,
        x1: 9,
        y1: 3,
        showLabel: true,
        isEditable: true
    });

    sciChartSurface.annotations.add(
        horizontalLineAnnotation1,
        horizontalLineAnnotation2,
        verticalLineAnnotation,
        new LineAnnotation({
            stroke: "#B73225",
            strokeThickness: 3,
            x1: 1.0,
            x2: 4.0,
            y1: 9.0,
            y2: 8.0,
            isEditable: true
        }),

        new BoxAnnotation({
            stroke: "#4DA8DA",
            strokeThickness: 1,
            fill: "#007CC766",
            x1: 1.0,
            x2: 4.0,
            y1: 5.0,
            y2: 7.0,
            isEditable: true
        }),

        new CustomAnnotation({
            x1: 5,
            y1: 9,
            xCoordShift: 0,
            yCoordShift: 0,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            svgString:
                ' <svg width="50" height="50"  xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" style="fill:#39603D"><animate attributeName="rx" values="0;25;0" dur="2s" repeatCount="indefinite" color="#ffffff" /></rect></svg>',
            isEditable: true
        }),
        new TextAnnotation({
            x1: 1,
            y1: 3,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            textColor: "#F1B24A",
            fontSize: 26,
            fontFamily: "Times New Roman",
            text: "SciChart is the best library",
            isEditable: true
        }),
        new TextAnnotation({
            x1: 1,
            y1: 2,
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            textColor: "#F1B24A",
            fontSize: 26,
            fontFamily: "Times New Roman",
            text: "Unmovable text",
            isEditable: false
        })
    );

    return { sciChartSurface, wasmContext };
};

export default function EditableAnnotaions() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
`;
