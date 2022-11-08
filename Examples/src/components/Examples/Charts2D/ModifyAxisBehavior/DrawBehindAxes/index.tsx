import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import { ELineDrawMode } from "scichart/Charting/Drawing/WebGlRenderContext2D";
import { NumberRange } from "scichart/Core/NumberRange";
import { PinchZoomModifier } from "scichart/Charting/ChartModifiers/PinchZoomModifier";
import { appTheme } from "../../../theme";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import { TextAnnotation } from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import { EHorizontalAnchorPoint } from "scichart/types/AnchorPoint";
import { ECoordinateMode } from "scichart/Charting/Visuals/Annotations/AnnotationBase";

const divElementId = "chart1";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });

    // When true, Series are drawn behind axis (Axis inside chart)
    sciChartSurface.drawSeriesBehindAxis = true;

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        visibleRange: new NumberRange(28.0, 42.6),
        axisTitle: "X Axis",
        labelStyle: {
            fontSize: 20,
        },
        axisBorder: {
            borderTop: 0,
            color: appTheme.PaleSkyBlue + "33",
        },
    }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        visibleRange: new NumberRange(-40.0, 140.0),
        axisTitle: "Y Axis",
        labelStyle: {
            fontSize: 20,
        },
        axisBorder: {
            borderLeft: 0,
            color: appTheme.PaleSkyBlue + "33",
        },
    }));

    const xValues = [];
    const yValues = [];
    const y1Values = [];

    for (let i = 0; i < 100; i += 0.1) {
        xValues.push(i);
        yValues.push(Math.tan(i));
        y1Values.push(Math.cos(i * 100) * 5);
    }

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        drawNaNAs: ELineDrawMode.PolyLine,
        strokeThickness: 5,
        stroke: "rgba(255, 134, 72, .47)",
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues })
    }));

    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        drawNaNAs: ELineDrawMode.PolyLine,
        strokeThickness: 3,
        stroke: "rgba(50, 134, 72, .47)",
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values })
    }))

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new PinchZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomPanModifier());

    // Add title annotation
    const titleAnnotation = new TextAnnotation({
        text: "SciChartSurface with Series Drawn Behind Axis",
        fontSize: 20,
        fontWeight: "Bold",
        textColor: appTheme.ForegroundColor,
        x1: 0.5,
        y1: 0,
        yCoordShift: 10,
        opacity: 0.77,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
    });
    sciChartSurface.annotations.add(titleAnnotation);

    return { sciChartSurface, wasmContext, titleAnnotation };
};

export default function DrawBehindAxes() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [titleAnnotation, setTitleAnnotation] = React.useState<TextAnnotation>();
    const [preset, setPreset] = React.useState<number>(0);

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setTitleAnnotation(res.titleAnnotation);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const handleToggleButtonChanged = (event: any, value: number) => {
        setPreset(value);
        sciChartSurface.drawSeriesBehindAxis = value === 0;
        titleAnnotation.text = value === 0 ? "SciChartSurface with Series Drawn Behind Axis" : "SciChartSurface with Series clipped to Viewport";
        sciChartSurface.yAxes.get(0).axisBorder.borderLeft = value;
        sciChartSurface.xAxes.get(0).axisBorder.borderTop = value;
    };

    return (<div className={classes.ChartWrapper} style={{background: appTheme.DarkIndigo, }}>
            <div id={divElementId} style={{height: "calc(100% - 100px)", width: "100%"}}/>
            <ToggleButtonGroup
                style={{height: "100px", padding: "10",}}
                exclusive
                value={preset}
                onChange={handleToggleButtonChanged}
                size="medium" color="primary" aria-label="small outlined button group">
                <ToggleButton value={0} style={{color: appTheme.ForegroundColor}}>
                    Draw Series behind Axis
                </ToggleButton>
                <ToggleButton value={1} style={{color: appTheme.ForegroundColor}}>
                    Clip series at Viewport Edge
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );;
}
