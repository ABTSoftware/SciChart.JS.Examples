import * as React from "react";
import { TWebAssemblyChart } from "scichart/Charting/Visuals/SciChartSurface";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { TSciChart } from "scichart/types/TSciChart";
import { IXyDataSeriesOptions, XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartSurface } from "scichart";
import { CursorModifier } from "scichart/Charting/ChartModifiers/CursorModifier";
import { EColor } from "scichart/types/Color";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { ENumericFormat } from "scichart/types/NumericFormat";

const divElementId = "chart";

const createDataSeries = (wasmContext2: TSciChart, index: number, options?: IXyDataSeriesOptions) => {
    const sigma = Math.pow(0.6, index);
    const dataSeries = new XyDataSeries(wasmContext2, options);
    for (let i = 0; i < 100; i++) {
        const grow = 1 + i / 99;
        dataSeries.append(i, Math.sin((Math.PI * i) / 15) * grow * sigma);
    }
    return dataSeries;
};

const drawExample = async (): Promise<TWebAssemblyChart> => {
    const colorsArr = [EColor.Green, EColor.LightGrey];

    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
    xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        growBy: new NumberRange(0.1, 0.1),
        axisAlignment: EAxisAlignment.Left
    });
    yAxis.labelProvider.numericFormat = ENumericFormat.Decimal_2;
    sciChartSurface.yAxes.add(yAxis);

    // Create some data
    const firstSeriesData = createDataSeries(wasmContext, 0, { dataSeriesName: "Sinewave Green" });
    const secondSeriesData = createDataSeries(wasmContext, 1);

    // Create some line series and add to the chart
    const renderableSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: colorsArr[0],
        strokeThickness: 3,
        dataSeries: firstSeriesData,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 5,
            height: 5,
            strokeThickness: 2,
            fill: "white",
            stroke: colorsArr[0]
        })
    });
    sciChartSurface.renderableSeries.add(renderableSeries1);

    const renderableSeries2 = new FastLineRenderableSeries(wasmContext, {
        stroke: colorsArr[1],
        strokeThickness: 3,
        dataSeries: secondSeriesData,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 5,
            height: 5,
            strokeThickness: 2,
            fill: "white",
            stroke: colorsArr[1]
        })
    });
    sciChartSurface.renderableSeries.add(renderableSeries2);

    // Here is where we add cursor behaviour
    //
    sciChartSurface.chartModifiers.add(
        // Add the CursorModifier (crosshairs) behaviour
        new CursorModifier({
            crosshairStroke: "red",
            crosshairStrokeThickness: 1,
            tooltipContainerBackground: "#000",
            tooltipTextStroke: "Blue",
            showTooltip: true,
            axisLabelsFill: "orange",
            axisLabelsStroke: "green"
        }),
        // Add further zooming and panning behaviours
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );

    sciChartSurface.zoomExtents();
    return { sciChartSurface, wasmContext };
};

export default function UsingCursorModifierTooltips() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return (
        <div>
            <div id={divElementId} style={{ maxWidth: 900 }} />
        </div>
    );
}
