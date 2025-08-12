import * as SciChart from "scichart";

async function basicChartTitle(divElementId) {
    // Demonstrates how to add a basic chart title in SciChart.js
    const { SciChartSurface, SciChartJsNavyTheme, NumericAxis } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add chart title
    sciChartSurface.title = "Chart Title";
}

basicChartTitle("scichart-root");
