import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { ENumericFormat } from "scichart/Charting/Visuals/Axis/LabelProvider/NumericLabelProvider";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { StackedColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/StackedColumnRenderableSeries";
import { StackedColumnCollection } from "scichart/Charting/Visuals/RenderableSeries/StackedColumnCollection";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { ELegendOrientation, ELegendPlacement } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";

const xValues = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
const tomatoesData = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];
const cucumberData = [16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17];
const pepperData = [7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16];

const divElementId = "chart";

const drawExample = async () => {
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);
    const xAxis = new NumericAxis(wasmContext);
    xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext);
    yAxis.growBy = new NumberRange(0, 0.2);
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: tomatoesData, dataSeriesName: "Tomato" });
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: cucumberData, dataSeriesName: "Cucumber" });
    const dataSeries3 = new XyDataSeries(wasmContext, { xValues, yValues: pepperData, dataSeriesName: "Pepper" });
    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries1.fill = "#dc443f";
    rendSeries1.stroke = "black";
    rendSeries1.strokeThickness = 1;
    rendSeries1.dataSeries = dataSeries1;
    rendSeries1.rolloverModifierProps.markerColor = "#b83735";
    rendSeries1.rolloverModifierProps.tooltipColor = "#dc443f";
    rendSeries1.rolloverModifierProps.tooltipTextColor = "#fff";
    rendSeries1.stackedGroupId = "one";

    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries2.fill = "#aad34f";
    rendSeries2.stroke = "black";
    rendSeries2.strokeThickness = 1;
    rendSeries2.dataSeries = dataSeries2;
    rendSeries2.rolloverModifierProps.markerColor = "#87a73e";
    rendSeries2.rolloverModifierProps.tooltipColor = "#aad34f";
    rendSeries2.rolloverModifierProps.tooltipTextColor = "#000";
    rendSeries2.stackedGroupId = "two";

    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries3.fill = "#8562b4";
    rendSeries3.stroke = "black";
    rendSeries3.strokeThickness = 1;
    rendSeries3.dataSeries = dataSeries3;
    rendSeries3.rolloverModifierProps.markerColor = "#715195";
    rendSeries3.rolloverModifierProps.tooltipColor = "#8562b4";
    rendSeries3.rolloverModifierProps.tooltipTextColor = "#fff";
    rendSeries3.stackedGroupId = "three";

    const verticallyStackedColumnCollection = new StackedColumnCollection(wasmContext);
    verticallyStackedColumnCollection.dataPointWidth = 0.5;
    verticallyStackedColumnCollection.add(rendSeries1, rendSeries2, rendSeries3);

    sciChartSurface.renderableSeries.add(verticallyStackedColumnCollection);

    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    sciChartSurface.chartModifiers.add(new RolloverModifier({ rolloverLineStroke: "#228B22" }));
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopRight,
            orientation: ELegendOrientation.Horizontal,
            showLegend: true,
            showCheckboxes: true,
            showSeriesMarkers: true,
        })
    );
    return { wasmContext, sciChartSurface };
};

export default function StackedColumnSideBySide() {
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
