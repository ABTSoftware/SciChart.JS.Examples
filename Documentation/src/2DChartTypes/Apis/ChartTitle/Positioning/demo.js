async function chartTitlePositioning(divElementId) {
    // Demonstrates how to position a chart title in SciChart.js
    const {
        SciChartSurface,
        SciChartJsNavyTheme,
        NumericAxis,
        ETitlePosition,
        ETextAlignment,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(
        divElementId,
        {
            theme: new SciChartJsNavyTheme(),
        }
    );
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Add chart title
    sciChartSurface.title = "Chart Title";

    // Modify title positioning
    sciChartSurface.titleStyle = {
        position: ETitlePosition.Left,
        alignment: ETextAlignment.Right,
        placeWithinChart: true,
    };
}

chartTitlePositioning("scichart-root");
