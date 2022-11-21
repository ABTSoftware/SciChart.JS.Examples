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
import classes from "../../../../Examples/Examples.module.scss";
import {appTheme} from "../../../theme";
import SciChartImage from "./scichart-logo-white.jpg";

const divElementId = "chart";

const getImageAnnotation = (x1: number, y1: number, image: any, width: number, height: number): CustomAnnotation => {
    return new CustomAnnotation({
        x1,
        y1,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        svgString: \`<svg width="\${width}" height="\${height}" xmlns="http://www.w3.org/2000/svg" style="background-color:transparent">
                        <image href="\${image}" height="\${height}" width="\${width}"/>
                    </svg>\`
    });
};

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create an X,Y axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, 10)
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, 10)
    }));

    const textColor = appTheme.ForegroundColor;

    const text1 = new TextAnnotation({ text: "Editable Chart Annotations", fontSize: 24, x1: 0.3, y1: 9.7, textColor });
    const text2 = new TextAnnotation({ text: "Click, Drag and Resize annotations with the mouse", fontSize: 18, x1: 0.5, y1: 9, textColor });

    const horizontalLineAnnotation1 = new HorizontalLineAnnotation({
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        y1: 5,
        x1: 5,
        showLabel: true,
        labelPlacement: ELabelPlacement.TopLeft,
        labelValue: "Not Editable"
    });
    const horizontalLineAnnotation2 = new HorizontalLineAnnotation({
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        y1: 4,
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        labelValue: "Draggable HorizontalLineAnnotation",
        axisLabelFill: appTheme.VividSkyBlue,
        axisLabelStroke: appTheme.ForegroundColor,
        isEditable: true
    });

    const verticalLineAnnotation = new VerticalLineAnnotation({
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        x1: 9,
        showLabel: true,
        labelPlacement: ELabelPlacement.TopRight,
        labelValue: "Draggable VerticalLineAnnotation",
        axisLabelFill: appTheme.VividSkyBlue,
        axisLabelStroke: appTheme.ForegroundColor,
        isEditable: true
    });

    const lineAnnotation = new LineAnnotation({
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        x1: 5.5,
        x2: 7.0,
        y1: 6.0,
        y2: 9.0,
        isEditable: true
    });

    const boxAnnotation = new BoxAnnotation({
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 1,
        fill: appTheme.VividSkyBlue + "33",
        x1: 1.0,
        x2: 4.0,
        y1: 5.0,
        y2: 7.0,
        isEditable: true
    });

    const imageAnnotation = getImageAnnotation(7, 7, SciChartImage, 241, 62);
    imageAnnotation.isEditable = true;

    const textAnnotation = new TextAnnotation({
        x1: 1,
        y1: 2,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        textColor,
        fontSize: 26,
        fontFamily: "Arial",
        text: "Unmovable text",
        isEditable: false
    });

    const textAnnotationSciChart = new TextAnnotation({
        x1: 1,
        y1: 3,
        xCoordinateMode: ECoordinateMode.DataValue,
        yCoordinateMode: ECoordinateMode.DataValue,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        textColor,
        fontSize: 26,
        fontFamily: "Arial",
        text: "Moveable TextAnnotation",
        isEditable: true
    });

    sciChartSurface.annotations.add(
        text1,
        text2,
        horizontalLineAnnotation1,
        horizontalLineAnnotation2,
        verticalLineAnnotation,
        lineAnnotation,
        boxAnnotation,
        imageAnnotation,
        textAnnotation,
        textAnnotationSciChart,
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

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

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
`;