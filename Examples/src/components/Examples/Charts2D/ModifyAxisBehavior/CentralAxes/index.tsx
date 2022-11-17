import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {EAxisAlignment} from "scichart/types/AxisAlignment";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import classes from "../../../../Examples/Examples.module.scss";
import {TSciChart} from "scichart/types/TSciChart";
import {ELineDrawMode} from "scichart/Charting/Drawing/WebGlRenderContext2D";
import {NumberRange} from "scichart/Core/NumberRange";
import {PinchZoomModifier} from "scichart/Charting/ChartModifiers/PinchZoomModifier";
import {
    CentralAxesLayoutManager,
    ICentralAxesLayoutManagerOptions
} from "scichart/Charting/LayoutManager/CentralAxesLayoutManager";
import {EInnerAxisPlacementCoordinateMode} from "scichart/Charting/LayoutManager/EInnerAxisPlacementCoordinateMode";
import {appTheme} from "../../../theme";
import {EAnimationType} from "scichart/types/AnimationType";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {EHorizontalAnchorPoint} from "scichart/types/AnchorPoint";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";

const divElementId = "chart1";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Optional parameters to control exact placement of the axis
    // Below: These are defaults, but we specify them for completeness of the example
    // Relative coordinate mode and 0.5 means 'place half way'
    const options: ICentralAxesLayoutManagerOptions = {
        horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
        verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
        horizontalAxisPosition: 0.5,
        verticalAxisPosition: 0.5
    };

    // Control the placement of the axis by specifying CentralAxesLayoutManager
    // and isInnerAxis property
    sciChartSurface.layoutManager = new CentralAxesLayoutManager(options);

    // Configure x,y axis with central layout - oscilloscope style
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-5, 5),
        isInnerAxis: true, // required for central axis
        axisAlignment: EAxisAlignment.Top,
        labelStyle: {
            color: appTheme.PaleSkyBlue,
        },
        axisBorder: {
            borderTop: 1,
            color: appTheme.VividSkyBlue
        }
    }));

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-5, 5),
        isInnerAxis: true, // required for central axis
        axisAlignment: EAxisAlignment.Left,
        labelStyle: {
            color: appTheme.PaleSkyBlue,
        },
        axisBorder: {
            borderLeft: 1,
            color: appTheme.VividSkyBlue
        }
    }));

    // Add a line series
    sciChartSurface.renderableSeries.add(new FastLineRenderableSeries(wasmContext, {
        drawNaNAs: ELineDrawMode.PolyLine,
        dataSeries: getButterflyCurve(wasmContext, 20000),
        isDigitalLine: false,
        stroke: appTheme.VividTeal,
        animation: { type: EAnimationType.Fade, options: { duration: 500 }}
    }));

    // Add title annotation
    sciChartSurface.annotations.add(new TextAnnotation({
        text: "SciChart.js allows axis layout customisation including Central axis",
        fontSize: 16,
        textColor: appTheme.ForegroundColor,
        x1: 0,
        xCoordShift: 10,
        y1: 0,
        yCoordShift: 10,
        opacity: 0.77,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
    }));

    // Add some interaction modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new PinchZoomModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier());

    return { sciChartSurface, wasmContext };
};

export default function CentralAxes() {
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

function getButterflyCurve(wasmContext: TSciChart, count: number = 2000) {
    const temp = 0.01;
    const dataSeries = new XyDataSeries(wasmContext);
    for (let i = 0; i < count; i++) {
        const t = i * temp;

        const multiplier = Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5);

        const x = Math.sin(t) * multiplier;
        const y = Math.cos(t) * multiplier;
        dataSeries.append(x, y);
    }
    return dataSeries;
}
