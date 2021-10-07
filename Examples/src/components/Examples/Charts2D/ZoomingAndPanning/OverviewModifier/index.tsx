import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { NumberRange } from "scichart/Core/NumberRange";
import { EZoomState } from "scichart/types/ZoomState";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartOverview } from "scichart/Charting/Visuals/SciChartOverview";
import classes from "../../../../Examples/Examples.module.scss";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { EAutoRange } from "scichart/types/AutoRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EExecuteOn } from "scichart/types/ExecuteOn";
import { ESeriesType } from "scichart/types/SeriesType";
import { SciChartJSDarkTheme } from "scichart/Charting/Themes/SciChartJSDarkTheme";

export const divElementId = "chart";
export const divOverviewId = "overview";

export const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {});
    const POINTS = 10000;

    const xAxis = new NumericAxis(wasmContext, {
        id: "xAxis",
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(3000, 4000),
        autoRange: EAutoRange.Never
    });
    xAxis.labelProvider.precision = 0;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        id: "yAxis",
        axisAlignment: EAxisAlignment.Left,
        visibleRange: new NumberRange(-5000, 5000),
        autoRange: EAutoRange.Always
    });
    yAxis.labelProvider.precision = 0;
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    const dataSeries2 = new XyDataSeries(wasmContext);
    const rendSeries = new FastLineRenderableSeries(wasmContext, { dataSeries, strokeThickness: 2 });
    const rendSeries2 = new XyScatterRenderableSeries(wasmContext, { dataSeries: dataSeries2, strokeThickness: 5 });
    rendSeries.xAxisId = xAxis.id;
    rendSeries.yAxisId = yAxis.id;
    rendSeries2.xAxisId = xAxis.id;
    rendSeries2.yAxisId = yAxis.id;
    sciChartSurface.renderableSeries.add(rendSeries);
    sciChartSurface.renderableSeries.add(rendSeries2);
    rendSeries.stroke = "#99EE99FF";
    rendSeries2.pointMarker = new EllipsePointMarker(wasmContext);

    const generateDataSeries = (dataSeries: XyDataSeries) => {
        const xValues = new Array(POINTS);
        const yValues = new Array(POINTS);
        let prevYValue = 0;
        for (let i = 0; i < POINTS; i++) {
            const curYValue = Math.random() * 10 - 5;

            xValues[i] = i;
            yValues[i] = prevYValue + curYValue;

            prevYValue += curYValue;
        }

        dataSeries.appendRange(xValues, yValues);
    };

    generateDataSeries(dataSeries);
    generateDataSeries(dataSeries2);

    const rubberBand = new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton });
    const zoomPanModifier = new ZoomPanModifier();

    sciChartSurface.chartModifiers.add(zoomPanModifier);
    sciChartSurface.chartModifiers.add(rubberBand);
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    // Add Overview
    const overview = await SciChartOverview.create(sciChartSurface, divOverviewId, {
        mainAxisId: xAxis.id,
        secondaryAxisId: yAxis.id
    });
    
    return sciChartSurface;
};

let scs: SciChartSurface;

export default function Overview() {
    React.useEffect(() => {
        (async () => {
            scs = await drawExample();
        })();
        return () => {
            scs?.delete();
        };
    }, []);

    return (<div style={{ display: "flex", flexDirection: "column", maxWidth: 800 }}>
    <div id={divElementId} style={{ flexBasis: 400, flexGrow: 1, flexShrink: 1 }} />
    <div id={divOverviewId} style={{ flexBasis: 100, flexGrow: 1, flexShrink: 1 }} />
</div>

    )
}
