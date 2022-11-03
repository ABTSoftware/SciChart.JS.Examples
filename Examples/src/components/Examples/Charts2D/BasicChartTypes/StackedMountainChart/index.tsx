import * as React from "react";
import { SciChartSurface } from "scichart";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { xValues, y1Values, y2Values, y3Values, y4Values } from "./data/stackedMountainChartData";
import { StackedMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainRenderableSeries";
import { StackedMountainCollection } from "scichart/Charting/Visuals/RenderableSeries/StackedMountainCollection";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { LegendModifier } from "scichart/Charting/ChartModifiers/LegendModifier";
import { ELegendOrientation, ELegendPlacement } from "scichart/Charting/Visuals/Legend/SciChartLegendBase";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import classes from "../../../../Examples/Examples.module.scss";
import { appTheme } from "../../../theme";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId,
        {
            theme: appTheme.SciChartJsTheme,
        });

    // Create an xAxis, yAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { labelPrecision: 0 }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { labelPrecision: 0 }));

    // Create the three Stacked Mountain series
    const stackedMountain1 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y1Values, dataSeriesName: "Apples" }),
        fill: appTheme.VividPurple + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });
    const stackedMountain2 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y2Values, dataSeriesName: "Pears" }),
        fill: appTheme.VividPink + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });
    const stackedMountain3 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y3Values, dataSeriesName: "Oranges" }),
        fill: appTheme.VividSkyBlue + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });
    const stackedMountain4 = new StackedMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: y4Values, dataSeriesName: "Oranges" }),
        fill: appTheme.VividOrange + "AA",
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 2,
    });

    // Group these StackedMountain series together in a StackedMountainCollection
    const stackedMountainCollection = new StackedMountainCollection(wasmContext);
    stackedMountainCollection.add(stackedMountain1, stackedMountain2, stackedMountain3, stackedMountain4);
    stackedMountainCollection.animation = new WaveAnimation({ duration: 600, fadeEffect: true });

    // Add the StackedMountainCollection to the chart
    sciChartSurface.renderableSeries.add(stackedMountainCollection);

    // Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

    // Add a legend to the chart to show the series
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            placement: ELegendPlacement.TopLeft,
            orientation: ELegendOrientation.Vertical,
            showLegend: true,
            showCheckboxes: false,
            showSeriesMarkers: true
        })
    );

    sciChartSurface.zoomExtents();

    return { wasmContext, sciChartSurface, stackedMountainCollection };
};

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function StackedMountainChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [stackedMountainCollection, setStackedMountainCollection] = React.useState<StackedMountainCollection>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setStackedMountainCollection(res.stackedMountainCollection);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const onChecked = () => {
        stackedMountainCollection.isOneHundredPercent = !stackedMountainCollection.isOneHundredPercent;
        sciChartSurface.zoomExtents(200);
    };

    return (<div className={classes.ChartWrapper}>
        <div style={{position: "relative", width: "100%", height: "100%"}}>
            <div id={divElementId} style={{position: "relative", width: "100%", height: "100%"}}/>
            <label style={{position: "absolute", right: "100px", top: "50px",
                border: `1px solid ${appTheme.Indigo}`,
                color: appTheme.ForegroundColor, background: appTheme.Background, padding: "10"}}>
                100% Stacked Mountain?&nbsp;
                <input  type="checkbox" onChange={onChecked}/>
            </label>

        </div>
    </div>);
}
