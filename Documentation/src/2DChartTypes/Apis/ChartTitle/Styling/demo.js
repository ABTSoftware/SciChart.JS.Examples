async function titleStyling(divElementId) {
    // Demonstrates how to style a basic chart title in SciChart.js
    const { SciChartSurface, SciChartJsNavyTheme, NumericAxis } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add chart title
    sciChartSurface.title = "Chart Title";

    // Apply some styling to the chart title
    sciChartSurface.titleStyle = {
        fontSize: 30,
        fontFamily: "Arial",
        color: "#EC0F6C",
        fontWeight: "900",
        fontStyle: "italic",
    };
}

titleStyling("scichart-root");
