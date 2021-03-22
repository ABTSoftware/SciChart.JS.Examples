export const code = `import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
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
import { ENumericFormat } from "scichart/types/NumericFormat";
import classes from "../../../../Examples/Examples.module.scss";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";

const xValues = [1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003];
const porkData = [10, 13, 7, 16, 4, 6, 20, 14, 16, 10, 24, 11];
const vealData = [12, 17, 21, 15, 19, 18, 13, 21, 22, 20, 5, 10];
const tomatoesData = [7, 30, 27, 24, 21, 15, 17, 26, 22, 28, 21, 22];
const cucumberData = [16, 10, 9, 8, 22, 14, 12, 27, 25, 23, 17, 17];
const pepperData = [7, 24, 21, 11, 19, 17, 14, 27, 26, 22, 28, 16];

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId);

    // Create XAxis, YAxis
    const xAxis = new NumericAxis(wasmContext);
    xAxis.labelProvider.numericFormat = ENumericFormat.Decimal_0;
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext);
    yAxis.growBy = new NumberRange(0, 0.1);
    sciChartSurface.yAxes.add(yAxis);

    // Create a selection of DataSeries
    const dataSeries1 = new XyDataSeries(wasmContext, { xValues, yValues: porkData, dataSeriesName: "Pork" });
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues, yValues: vealData, dataSeriesName: "Veal" });
    const dataSeries3 = new XyDataSeries(wasmContext, { xValues, yValues: tomatoesData, dataSeriesName: "Tomato" });
    const dataSeries4 = new XyDataSeries(wasmContext, { xValues, yValues: cucumberData, dataSeriesName: "Cucumber" });
    const dataSeries5 = new XyDataSeries(wasmContext, { xValues, yValues: pepperData, dataSeriesName: "Pepper" });

    // Create 5 RenderableSeries - for each part of the stacked column
    const rendSeries1 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries1.fill = "#226Fb7";
    rendSeries1.strokeThickness = 0;
    rendSeries1.dataSeries = dataSeries1;
    rendSeries1.rolloverModifierProps.markerColor = "#19548b";
    rendSeries1.rolloverModifierProps.tooltipColor = "#226Fb7";
    rendSeries1.rolloverModifierProps.tooltipTextColor = "#fff";
    rendSeries1.stackedGroupId = "Meat";

    const rendSeries2 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries2.fill = "#ff9a2e";
    rendSeries2.strokeThickness = 0;
    rendSeries2.dataSeries = dataSeries2;
    rendSeries2.rolloverModifierProps.markerColor = "#db8428";
    rendSeries2.rolloverModifierProps.tooltipColor = "#ff9a2e";
    rendSeries2.rolloverModifierProps.tooltipTextColor = "#000";
    rendSeries2.stackedGroupId = "Meat";

    const rendSeries3 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries3.fill = "#dc443f";
    rendSeries3.strokeThickness = 0;
    rendSeries3.dataSeries = dataSeries3;
    rendSeries3.rolloverModifierProps.markerColor = "#b83735";
    rendSeries3.rolloverModifierProps.tooltipColor = "#dc443f";
    rendSeries3.rolloverModifierProps.tooltipTextColor = "#fff";
    rendSeries3.stackedGroupId = "Vegetables";

    const rendSeries4 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries4.fill = "#aad34f";
    rendSeries4.dataSeries = dataSeries4;
    rendSeries4.strokeThickness = 0;
    rendSeries4.rolloverModifierProps.markerColor = "#87a73e";
    rendSeries4.rolloverModifierProps.tooltipColor = "#aad34f";
    rendSeries4.rolloverModifierProps.tooltipTextColor = "#000";
    rendSeries4.stackedGroupId = "Vegetables";

    const rendSeries5 = new StackedColumnRenderableSeries(wasmContext);
    rendSeries5.fill = "#8562b4";
    rendSeries5.dataSeries = dataSeries5;
    rendSeries5.strokeThickness = 0;
    rendSeries5.rolloverModifierProps.markerColor = "#715195";
    rendSeries5.rolloverModifierProps.tooltipColor = "#8562b4";
    rendSeries5.rolloverModifierProps.tooltipTextColor = "#fff";
    rendSeries5.stackedGroupId = "Vegetables";

    const verticallyStackedColumnCollection = new StackedColumnCollection(wasmContext);
    verticallyStackedColumnCollection.dataPointWidth = 0.8;
    verticallyStackedColumnCollection.add(rendSeries1, rendSeries2, rendSeries3, rendSeries4, rendSeries5);
    verticallyStackedColumnCollection.animation = new WaveAnimation({ duration: 1000, fadeEffect: true });

    sciChartSurface.renderableSeries.add(verticallyStackedColumnCollection);

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

export default function StackedColumnChart() {
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