import * as React from "react";
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
import { EWrapTo, NativeTextAnnotation } from "scichart/Charting/Visuals/Annotations/NativeTextAnnotation";
import { CreateAnnotationModifier } from "./CreateAnnotationModifier";
import { EAnnotationType } from "scichart/Charting/Visuals/Annotations/IAnnotation";
import { AnnotationClickEventArgs } from "scichart/Charting/Visuals/Annotations/AnnotationClickEventArgs";
import { EExecuteOn } from "scichart/types/ExecuteOn";

const divElementId = "chart";

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

    const text1 = new TextAnnotation({ text: "Create Annotations Dynamically", fontSize: 24, x1: 0.3, y1: 9.7, textColor });
    const text2 = new TextAnnotation({ text: "Click and Drag to create annotations with the mouse", fontSize: 18, x1: 0.5, y1: 9, textColor });

    sciChartSurface.annotations.add(
        text1,
        text2,
    );

    const createMod = new CreateAnnotationModifier();

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(createMod);

    return { sciChartSurface, wasmContext };
};

export default function DynamicAnnotaions() {
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
