const { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, SciChartJsNavyTheme } = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function dataSeriesApi(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // #region ExampleA
    // import { SciChartSurface, XyDataSeries, FastLineRenderableSeries ... } from "scichart"

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
    }

    // Create a DataSeries
    const xyDataSeries = new XyDataSeries(wasmContext, {
        // Optional: pass X,Y values to DataSeries constructor for fast initialization
        // each are Arrays of numbers or Float64Array (typed array for best performance)
        xValues,
        yValues,
    });

    // Create a renderableSeries and assign the dataSeries
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: xyDataSeries,
    });

    // add to the chart
    sciChartSurface.renderableSeries.add(lineSeries);
    // #endregion
}

dataSeriesApi("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create and assign a dataSeries with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType, XyDataSeries } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const xValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.LineSeries,
                // This section creates a DataSeries with X,Y values
                xyData: {
                    xValues,
                    yValues,
                },
                options: {
                    stroke: "#FF6600",
                    strokeThickness: 2,
                },
            },
        ],
    });

    // However this is also valid (either xyData, or onew XyDataSeries)
    // sciChartSurface.renderableSeries.get(0).dataSeries = new XyDataSeries(wasmContext, { xValues, yValues });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
