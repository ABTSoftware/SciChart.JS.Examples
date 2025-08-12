import * as SciChart from "scichart";

// Seeded random approximation (required for tests / data generation consistency)
let randomSeed = 0;
function random() {
    const x = Math.sin(randomSeed++) * 10000;
    return x - Math.floor(x);
}

// Function to return data for the fan chart
function getVarianceData() {
    const varianceData = [];
    const startDate = 1546300800; // 1st Jan 2019
    const dateStep = 1546387200 - startDate; // one day;

    const length = 10;
    let yLast = 10;
    for (let i = 0; i < length; i++) {
        const date = startDate + dateStep * i;

        const y = yLast + (random() - 0.48);
        yLast = y;

        let varMax = NaN;
        let var4 = NaN;
        let var3 = NaN;
        let var2 = NaN;
        let var1 = NaN;
        let varMin = NaN;

        if (i > 4) {
            varMax = y + (i - 5) * 0.3;
            var4 = y + (i - 5) * 0.2;
            var3 = y + (i - 5) * 0.1;
            var2 = y - (i - 5) * 0.1;
            var1 = y - (i - 5) * 0.2;
            varMin = y - (i - 5) * 0.3;
        }

        varianceData.push({ date, actual: y, varMax, var4, var3, var2, var1, varMin });
    }

    return varianceData;
}

async function simpleFanChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a fan chart using SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        FastBandRenderableSeries,
        XyDataSeries,
        XyyDataSeries,
        SciChartJsNavyTheme
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // get data for the fan chart
    // format is [{ date, actual, varMax, var4, var3, var2, var1, varMin }]
    const varianceData = getVarianceData();
    const xValues = varianceData.map(v => v.date);

    // Add a line series with the Xy data (the actual data)
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues: varianceData.map(v => v.actual) }),
            stroke: "#EC0F6C"
        })
    );

    // Add band series with progressively higher opacity for the fan variance data
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, {
                xValues,
                yValues: varianceData.map(v => v.varMin),
                y1Values: varianceData.map(v => v.varMax)
            }),
            opacity: 0.15,
            fill: "#EC0F6C",
            strokeY1: "#00000000"
        })
    );
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, {
                xValues,
                yValues: varianceData.map(v => v.var1),
                y1Values: varianceData.map(v => v.var4)
            }),
            opacity: 0.33,
            fill: "#EC0F6C",
            strokeY1: "#00000000"
        })
    );
    sciChartSurface.renderableSeries.add(
        new FastBandRenderableSeries(wasmContext, {
            dataSeries: new XyyDataSeries(wasmContext, {
                xValues,
                yValues: varianceData.map(v => v.var2),
                y1Values: varianceData.map(v => v.var3)
            }),
            opacity: 0.5,
            fill: "#EC0F6C",
            strokeY1: "#00000000"
        })
    );
    // #endregion

    // Optional: add zooming, panning for the example
    const { MouseWheelZoomModifier, ZoomPanModifier, ZoomExtentsModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier(), new ZoomPanModifier(), new ZoomExtentsModifier());
}

simpleFanChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a band chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    // get data for the fan chart
    // format is [{ date, actual, varMax, var4, var3, var2, var1, varMin }]
    const varianceData = getVarianceData();

    // Convert to arrays expected by scichart.js. There are more efficient ways to do this!
    const xValues = varianceData.map(v => v.date);
    const yValues = varianceData.map(v => v.actual);
    const varMinValues = varianceData.map(v => v.varMin);
    const varMaxValues = varianceData.map(v => v.varMax);
    const var1Values = varianceData.map(v => v.var1);
    const var2Values = varianceData.map(v => v.var2);
    const var3Values = varianceData.map(v => v.var3);
    const var4Values = varianceData.map(v => v.var4);

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.LineSeries,
                xyData: { xValues, yValues },
                options: {
                    stroke: "#EC0F6C"
                }
            },
            {
                type: ESeriesType.BandSeries,
                xyyData: { xValues, yValues: varMinValues, y1Values: varMaxValues },
                options: {
                    opacity: 0.15,
                    fill: "#EC0F6C",
                    strokeY1: "#00000000"
                }
            },
            {
                type: ESeriesType.BandSeries,
                xyyData: { xValues, yValues: var1Values, y1Values: var4Values },
                options: {
                    opacity: 0.33,
                    fill: "#EC0F6C",
                    strokeY1: "#00000000"
                }
            },
            {
                type: ESeriesType.BandSeries,
                xyyData: { xValues, yValues: var2Values, y1Values: var3Values },
                options: {
                    opacity: 0.5,
                    fill: "#EC0F6C",
                    strokeY1: "#00000000"
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
