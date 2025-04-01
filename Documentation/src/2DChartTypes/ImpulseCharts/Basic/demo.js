import * as SciChart from "scichart";

async function simpleImpulseChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create an Impulse (or Stem, Lollipop) chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastImpulseRenderableSeries,
        XyDataSeries,
        EllipsePointMarker,
        SciChartJsNavyTheme,
        NumberRange
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));

    // Create some data
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.2) * Math.log(i / 100));
    }

    // Create and add a column series
    const impulseSeries = new FastImpulseRenderableSeries(wasmContext, {
        fill: "rgba(176, 196, 222, 0.5)",
        stroke: "rgba(176, 196, 222, 1)",
        strokeThickness: 2,
        size: 10,
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        // Optional: define the pointmarker type. Note: size, stroke, fill properties are on the parent series
        pointMarker: new EllipsePointMarker(wasmContext)
    });

    sciChartSurface.renderableSeries.add(impulseSeries);
    // #endregion
}

simpleImpulseChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, EPointMarkerType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // Create some data
    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(Math.sin(i * 0.2) * Math.log(i / 100));
    }

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.ImpulseSeries,
                xyData: {
                    xValues,
                    yValues
                },
                options: {
                    fill: "rgba(176, 196, 222, 0.5)",
                    stroke: "rgba(176, 196, 222, 1)",
                    strokeThickness: 2,
                    size: 10,
                    pointMarker: { type: EPointMarkerType.Ellipse }
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
