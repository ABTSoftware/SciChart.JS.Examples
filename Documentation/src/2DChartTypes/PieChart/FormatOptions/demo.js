import * as SciChart from "scichart";

async function formatPieChart(divElementId) {
    // Demonstrates how to create a pie chart with SciChart.js
    const { SciChartPieSurface, Point, SciChartJsNavyTheme, PieSegment, PieLabelProvider, EPieType } = SciChart;

    // or, for npm, import { SciChartPieSurface, ... } from "scichart"

    // #region ExampleA
    // Create a Pie Chart
    const sciChartPieSurface = await SciChartPieSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        pieType: EPieType.Pie,
        animate: true,
        seriesSpacing: 5
    });
    // Set this to adjust the radial position of the labels
    // When positioning outside the pie, you may want to make further fine adjustments to label positions using the labelOffset as shown below
    sciChartPieSurface.labelRadiusAdjustment = 1.7;

    // set default label style
    sciChartPieSurface.labelStyle = { fontSize: 14, color: "White" };

    // labelProvider on the surface will be used if an override is not set on a segment
    sciChartPieSurface.labelProvider.getSegmentText = (segment, total) =>
        `<span>${segment.text}<span><br/><span>${segment.value.toFixed(0)} (${((100 * segment.value) / total).toFixed(
            1
        )}%)</span>`;

    const pieSegment1 = new PieSegment({
        color: "#F48420",
        value: 40,
        text: "Oranges",
        radiusAdjustment: 1.05,
        labelOffset: new Point(10, 0),
        // labelStyles can be overridden per segment.
        // These will be merged onto the surface style so the resulting style here is fontSize: 14, color: "#f8f682"
        labelStyle: { color: "#F48420" }
    });

    const pieSegment2 = new PieSegment({
        color: "#30BC9A",
        value: 10,
        text: "Apples",
        radiusAdjustment: 1.1,
        labelOffset: new Point(0, -20)
    });
    // If you set a property on the segment labelProvider, it will override the one on the surface
    pieSegment2.labelProvider.getSegmentText = (segment, total) => "Some Apples";

    // You can also pass labelProvider options in on the constructor.
    const pieSegment3 = new PieSegment({
        color: "#EC0F6C",
        value: 20,
        text: "Strawberries",
        labelProvider: new PieLabelProvider({ labelPrefix: "Strawberries: " }),
        labelOffset: new Point(-25, 0),
        labelStyle: { color: "#EC0F6C" }
    });

    const pieSegment4 = new PieSegment({
        color: "#50C7E0",
        value: 15,
        text: "Grapes"
    });
    // Overriding a property on the segment labelProvider implicitly creates a new default PieLabelProvider that overries the one set on the surface
    pieSegment4.labelProvider.formatLabel = dataValue => dataValue.toFixed(2) + "%";

    sciChartPieSurface.pieSegments.add(pieSegment1, pieSegment2, pieSegment3, pieSegment4);
    // #endregion
}

formatPieChart("scichart-root");
