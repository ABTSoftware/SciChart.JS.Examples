async function multilineTitle(divElementId) {
    // Demonstrates how to add multiline chart title in SciChart.js
    const { SciChartSurface, SciChartJsNavyTheme, NumericAxis, EMultiLineAlignment } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(
        divElementId,
        {
            theme: new SciChartJsNavyTheme(),
        }
    );
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add multiline chart title
    sciChartSurface.title = ["First line", "Second line", "Third line"];

    // Modify multiline text related options for the title
    sciChartSurface.titleStyle ={
        multilineAlignment: EMultiLineAlignment.Right,
        lineSpacing: 1.5
    }
}

multilineTitle("scichart-root");
