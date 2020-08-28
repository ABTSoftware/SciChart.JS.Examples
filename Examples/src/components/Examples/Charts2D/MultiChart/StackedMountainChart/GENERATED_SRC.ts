export const code = `
import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { xValues, y1Values, y2Values, y3Values } from "./data/stackedMountainChartData";
import { StackedMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries";
import { StackedMountainCollection } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainCollection";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { ELegendOrientation, ELegendPlacement } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";

const divElementId = "chart";

const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext);
    yAxis.growBy = new NumberRange(0, 0.1);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: y1Values });
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: y2Values });
    const dataSeries3 = new XyDataSeries(wasmContext, { xValues, yValues: y3Values });
    const rendSeries1 = new StackedMountainRenderableSeries(wasmContext);
    rendSeries1.dataSeries = dataSeries1;
    rendSeries1.fill = "#939899";
    rendSeries1.rolloverModifierProps.markerColor = "#7b7e80";
    rendSeries1.rolloverModifierProps.tooltipColor = "rgba(147,152,153,0.7)";
    rendSeries1.rolloverModifierProps.tooltipTextColor = "#000";
    const rendSeries2 = new StackedMountainRenderableSeries(wasmContext);
    rendSeries2.dataSeries = dataSeries2;
    rendSeries2.fill = "#66838d";
    rendSeries2.rolloverModifierProps.markerColor = "#495d65";
    rendSeries2.rolloverModifierProps.tooltipColor = "rgba(102,131,141,0.7)";
    rendSeries2.rolloverModifierProps.tooltipTextColor = "#000";
    const rendSeries3 = new StackedMountainRenderableSeries(wasmContext);
    rendSeries3.dataSeries = dataSeries3;
    rendSeries3.fill = "#368BC1";
    rendSeries3.rolloverModifierProps.markerColor = "#2d739e";
    rendSeries3.rolloverModifierProps.tooltipColor = "rgba(54,139,193,0.7)";
    rendSeries3.rolloverModifierProps.tooltipTextColor = "#000";

    const verticallyStackedMountainCollection = new StackedMountainCollection(wasmContext);
    verticallyStackedMountainCollection.add(rendSeries1, rendSeries2, rendSeries3);

    sciChartSurface.renderableSeries.add(verticallyStackedMountainCollection);

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    sciChartSurface.chartModifiers.add(new RolloverModifier({ stroke: "#228B22" }));
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showLegend: true,
            showCheckboxes: true,
            showSeriesMarkers: true,
        })
    );
    return { wasmContext, sciChartSurface };
};

export default function StackedMountainChart() {
    React.useEffect(() => {
        drawExample();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}

`;
