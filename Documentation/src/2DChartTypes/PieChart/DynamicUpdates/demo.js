import * as SciChart from "scichart";

async function updatingPieChart(divElementId) {
    // Demonstrates how to create a pie chart with SciChart.js
    const { SciChartPieSurface, EPieType, SciChartJsNavyTheme, PieSegment } = SciChart;

    // or, for npm, import { SciChartPieSurface, ... } from "scichart"

    // #region ExampleA
    // Create a Pie Chart
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        pieType: EPieType.Pie,
        animate: true,
        animationFrames: 30
    });

    // Disable the legend for this example
    sciChartPieSurface.legend.showLegend = false;

    // Create pie segments and add to the chart
    const pieSegment1 = new PieSegment({
        color: "#F48420",
        value: 5
    });
    const pieSegment2 = new PieSegment({
        color: "#30BC9A",
        value: 10
    });
    const pieSegment3 = new PieSegment({
        color: "#EC0F6C",
        value: 15
    });
    const pieSegment4 = new PieSegment({
        color: "#50C7E0",
        value: 20
    });
    sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);

    // Dynamically update the pie segments
    const updateFunc = () => {
        pieSegment1.value = Math.random() * 20 + 10;
        pieSegment2.value = Math.random() * 20 + 10;
        pieSegment3.value = Math.random() * 20 + 10;
        pieSegment4.value = Math.random() * 20 + 10;
        setTimeout(() => updateFunc(), 1500);
    };

    setTimeout(updateFunc, 1000);
    // #endregion
}

updatingPieChart("scichart-root");
