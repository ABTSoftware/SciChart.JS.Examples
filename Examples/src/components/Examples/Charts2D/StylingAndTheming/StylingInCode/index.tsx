import * as React from "react";
import classes from "../../../../Examples/Examples.module.scss";

import {
    SciChartSurface,
    NumericAxis,
    MouseWheelZoomModifier,
    EAxisAlignment,
    ZoomPanModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    ECoordinateMode
} from "scichart";

const divElementId = "chart";

const drawExample = async () => {

    // Demonstrates how to colour chart parts in code
    // This is better done by themes, where you can also style the loader pre-scichart initialisation
    //
    const chartBackgroundColor = "#E4F5FC";
    const axisBandsFill = "#1F3D6805";
    const axisTitleColor = "#1F3D68";
    const majorGridLineColor = "#264B9355";
    const minorGridLineColor = "#264B9322";
    const axisLabelColor = "#1F3D68";
    const axisBackgroundFill = "#00000000";
    const borderColor = "#1F3D68";

    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divElementId);
    sciChartSurface.background = chartBackgroundColor;

    // Create and style xAxis
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "X Axis",
            drawMajorBands: true,
            axisBandsFill,
            axisTitleStyle: {
                fontSize: 25,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontStyle: "italic",
                color: axisTitleColor
            },
            majorGridLineStyle: {
                strokeThickness: 1,
                color: majorGridLineColor,
                strokeDashArray: [10, 5]
            },
            minorGridLineStyle: {
                strokeThickness: 1,
                color: minorGridLineColor,
                strokeDashArray: [2, 2]
            },
            majorTickLineStyle: {
                strokeThickness: 1,
                color: majorGridLineColor,
                tickSize: 8
            },
            minorTickLineStyle: {
                strokeThickness: 1,
                color: minorGridLineColor,
                tickSize: 4
            },
            labelStyle: {
                fontSize: 16,
                fontWeight: "bold",
                fontStyle: "Italic",
                color: axisLabelColor,
                fontFamily: "Arial"
            },
            backgroundColor: axisBackgroundFill,
            axisBorder: {
                borderTop: 1,
                color: borderColor
            }
        })
    );

    // Create and style left YAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisAlignment: EAxisAlignment.Left,
            axisBandsFill,
            axisTitle: "Left Y Axis",
            axisTitleStyle: {
                fontSize: 25,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontStyle: "italic",
                color: axisTitleColor
            },
            majorGridLineStyle: {
                strokeThickness: 1,
                color: majorGridLineColor,
                strokeDashArray: [10, 5]
            },
            minorGridLineStyle: {
                strokeThickness: 1,
                color: minorGridLineColor,
                strokeDashArray: [2, 2]
            },
            majorTickLineStyle: {
                strokeThickness: 1,
                color: majorGridLineColor,
                tickSize: 8
            },
            minorTickLineStyle: {
                strokeThickness: 1,
                color: minorGridLineColor,
                tickSize: 4
            },
            labelStyle: {
                fontSize: 16,
                fontWeight: "bold",
                fontStyle: "Italic",
                color: axisLabelColor,
                fontFamily: "Arial"
            },
            backgroundColor: axisBackgroundFill,
            axisBorder: {
                borderRight: 1,
                color: borderColor
            }
        })
    );

    // Create and style right YAxis
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            axisTitle: "Right Y Axis",
            axisTitleStyle: {
                fontSize: 25,
                fontFamily: "Montserrat",
                fontWeight: "bold",
                fontStyle: "italic",
                color: axisTitleColor
            },
            axisAlignment: EAxisAlignment.Right,
            majorGridLineStyle: {
                strokeThickness: 1,
                color: majorGridLineColor,
                strokeDashArray: [10, 5]
            },
            minorGridLineStyle: {
                strokeThickness: 1,
                color: minorGridLineColor,
                strokeDashArray: [2, 2]
            },
            majorTickLineStyle: {
                strokeThickness: 1,
                color: majorGridLineColor,
                tickSize: 8
            },
            minorTickLineStyle: {
                strokeThickness: 1,
                color: minorGridLineColor,
                tickSize: 4
            },
            labelStyle: {
                fontSize: 16,
                fontWeight: "bold",
                fontStyle: "Italic",
                color: axisLabelColor,
                fontFamily: "Arial"
            },
            backgroundColor: axisBackgroundFill,
            axisBorder: {
                borderLeft: 1,
                color: borderColor
            }
        })
    );

    // Add title annotation
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Chart with custom style applied in code",
            fontSize: 20,
            fontWeight: "Bold",
            textColor: axisLabelColor,
            x1: 0.5,
            y1: 0,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative
        })
    );

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    return {sciChartSurface, wasmContext};
};
export default function StylingInCode() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper}/>;
}
