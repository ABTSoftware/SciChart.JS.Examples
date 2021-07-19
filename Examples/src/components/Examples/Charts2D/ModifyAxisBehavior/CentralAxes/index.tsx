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
} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/LayoutManager/CentralAxesLayoutManager";
import {EInnerAxisPlacementCoordinateMode} from "../../../../../../../../scichart.dev/Web/src/SciChart/lib/Charting/LayoutManager/EInnerAxisPlacementCoordinateMode";

const divElementId = "chart1";

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    const yAxis1 = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });
    const xAxis1 = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });

    // Optional parameters to control exact placement of the axis
    // Below: These are defaults, but we specify them for completeness of the example
    // Relative coordinate mode and 0.5 means 'place half way'
    const options: ICentralAxesLayoutManagerOptions = {
        horizontalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
        verticalAxisPositionCoordinateMode: EInnerAxisPlacementCoordinateMode.Relative,
        horizontalAxisPosition: 0.5,
        verticalAxisPosition: 0.5,
    };
    sciChartSurface.layoutManager = new CentralAxesLayoutManager(options);

    xAxis1.isInnerAxis = true;
    xAxis1.visibleRange = new NumberRange(-5, 5);
    xAxis1.axisAlignment = EAxisAlignment.Top;
    xAxis1.majorTickLineStyle.strokeThickness = 2;
    xAxis1.majorTickLineStyle.color = "white";
    xAxis1.labelStyle.color = "white";
    xAxis1.axisBorder.borderTop = 2;
    xAxis1.axisBorder.color = "white";
    sciChartSurface.xAxes.add(xAxis1);

    yAxis1.isInnerAxis = true;
    yAxis1.visibleRange = new NumberRange(-5, 5);
    yAxis1.axisAlignment = EAxisAlignment.Left;
    yAxis1.majorTickLineStyle.strokeThickness = 2;
    yAxis1.majorTickLineStyle.color = "white";
    yAxis1.labelStyle.color = "white";
    yAxis1.axisBorder.borderLeft = 2;
    yAxis1.axisBorder.color = "white";
    sciChartSurface.yAxes.add(yAxis1);

    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        drawNaNAs: ELineDrawMode.PolyLine,
        isDigitalLine: false
    });

    lineSeries.stroke = "Steelblue";
    lineSeries.dataSeries = getButterflyCurve(wasmContext, 20000);

    sciChartSurface.renderableSeries.add(lineSeries);


    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new PinchZoomModifier(),
        new MouseWheelZoomModifier(),
    );

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
