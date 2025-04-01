import * as SciChart from "scichart";

async function simpleHeatmapChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a uniform heatmap chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        HeatmapColorMap,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        SciChartJsNavyTheme
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Create a SciChartSurface with X & Y Axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));
    // #endregion

    // #region ExampleB
    // Create some data for the heatmap as a 2d array
    // e.g.
    // const zValues = [
    //   [0, 2, 3.4, 2, 1, 5],
    //   [5, 3, 4, 2.2, 7, 4.4],
    //   [3, 1.5, 1, 3, 4, 6.4],
    //   [2, 1.2, 5.4, 4, 3, 5],
    // ];
    //
    const heatmapWidth = 7;
    const heatmapHeight = 4;
    const zValues = Array.from(Array(heatmapHeight));
    zValues.forEach((row, index, collection) => {
        collection[index] = Array.from(Array(heatmapWidth));
    });
    for (let x = 0; x < heatmapWidth; x++) {
        for (let y = 0; y < heatmapHeight; y++) {
            zValues[y][x] = 3.5 * ((heatmapHeight - y) * (heatmapWidth - x));
        }
    }
    // #endregion

    // #region ExampleC
    // Create the uniform heatmap series
    //
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: new UniformHeatmapDataSeries(wasmContext, {
            // 2d zValues array. Dimensions [height][width]
            zValues,
            // xStart, xStep, yStart, yStep defines the x,y position
            xStart: 10,
            xStep: 1,
            yStart: 10,
            yStep: 1
        }),
        // zValues mapped to colours using the colorMap.
        // zValue[y][x] when compared to HeatmapColorMap.maximum corresponds to gradientstop offset=1
        // zValue[y][x] when compared to HeatmapColorMap.minimum corresponds to gradientstop offset=0
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 100,
            gradientStops: [
                { offset: 1, color: "#EC0F6C" },
                { offset: 0.9, color: "#F48420" },
                { offset: 0.7, color: "#DC7969" },
                { offset: 0.5, color: "#67BDAF" },
                { offset: 0.3, color: "#50C7E0" },
                { offset: 0.2, color: "#264B93" },
                { offset: 0, color: "#14233C" }
            ]
        }),
        // Optional datalabels may be placed in cell
        dataLabels: {
            style: { fontFamily: "Default", fontSize: 16 },
            color: "White"
        }
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);
    // ...
    // #endregion

    // Add zooming, panning for the example
    const { ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
}

simpleHeatmapChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleD
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, HeatmapColorMap, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const zValues = [
        [0, 2, 3.4],
        [5, 3, 4],
        [3, 1.5, -1]
    ];

    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 4,
        gradientStops: [
            { offset: 0, color: "yellow" },
            { offset: 0.5, color: "blue" },
            { offset: 1, color: "red" }
        ]
    });

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: {
            type: ESeriesType.UniformHeatmapSeries,
            options: { colorMap },
            heatmapData: {
                zValues,
                xStart: 10,
                xStep: 1,
                yStart: 10,
                yStep: 1
            }
        }
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
