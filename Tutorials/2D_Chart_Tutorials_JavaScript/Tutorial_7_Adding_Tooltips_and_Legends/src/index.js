import {SciChartSurface} from "scichart/Charting/Visuals/SciChartSurface";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {XyDataSeries} from "scichart/Charting/model/XyDataSeries";
import {FastLineRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import {RolloverModifier} from "scichart/Charting/ChartModifiers/RolloverModifier";
import {LegendModifier} from "scichart/Charting/ChartModifiers/LegendModifier";
import {CursorModifier} from "scichart/Charting/ChartModifiers/CursorModifier";

async function initSciChart() {
    // LICENSING //
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    //
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    //
    // Also, once activated (trial or paid license) having the licensing wizard open on your machine
    // will mean any or all applications you run locally will be fully licensed.

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.

    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Create 5 dataseries, each with 10k points
    for (let seriesCount = 0; seriesCount < 5; seriesCount++) {
        const xyDataSeries = new XyDataSeries(wasmContext);

        const opacity = (1 - ((seriesCount / 5))).toFixed(2);

        // Populate with some data
        for(let i = 0; i < 10000; i++) {
            xyDataSeries.append(i, Math.sin(i* 0.01) * Math.exp(i*(0.00001*(seriesCount*10+1))));
        }

        // Add and create a line series with this data to the chart
        // Create a line series        
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: xyDataSeries,
            stroke: `rgba(176,196,222,${opacity})`,
            strokeThickness:2
        });
        sciChartSurface.renderableSeries.add(lineSeries);
    }

    // Add a Legend
    sciChartSurface.chartModifiers.add(new LegendModifier({showCheckboxes: true }));

    // Add a tooltip behavior using the RolloverModifier
    const tooltipModifier = new RolloverModifier(wasmContext);
    sciChartSurface.chartModifiers.add(tooltipModifier);
    // Add an event listener to enable/disable the Tooltips
    const inputEnableTooltip = document.getElementById("enable-tooltip");
    inputEnableTooltip.addEventListener("input", (event) => {
        tooltipModifier.isEnabled = inputEnableTooltip.checked;
        console.log("Enabling Tooltip");
    });

    // Add axis label tooltips using CursorModifier
    const cursorModifier = new CursorModifier();
    cursorModifier.axisLabelsFill = "#FFFFFF";
    cursorModifier.axisLabelsStroke = "#00FF00";
    sciChartSurface.chartModifiers.add(cursorModifier);
}

initSciChart();
