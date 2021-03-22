export const code = `import * as React from "react";
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
import classes from "../../../../Examples/Examples.module.scss";
import { SweepAnimation } from "../../../../../../../../SciChart.Dev/Web/src/SciChart/lib/Charting/Visuals/RenderableSeries/Animations/SweepAnimation";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    // Create an xAxis, yAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));

    // Create 3 DataSeries for our 3 stacked mountains
    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: y1Values });
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: y2Values });
    const dataSeries3 = new XyDataSeries(wasmContext, { xValues, yValues: y3Values });

    // Create the three Stacked Mountain series
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

    // Group these StackedMountain series together in a StackedMountainCollection
    const stackedMountainCollection = new StackedMountainCollection(wasmContext);
    stackedMountainCollection.isOneHundredPercent = true;
    stackedMountainCollection.add(rendSeries1, rendSeries2, rendSeries3);
    stackedMountainCollection.animation = new SweepAnimation({ duration: 1000, fadeEffect: true });

    // Add the StackedMountainCollection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    sciChartSurface.chartModifiers.add(new RolloverModifier({ rolloverLineStroke: "#228B22" }));
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showLegend: true,
            showCheckboxes: true,
            showSeriesMarkers: true
        })
    );
    return { wasmContext, sciChartSurface };
};

export default function StackedMountainChart() {
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