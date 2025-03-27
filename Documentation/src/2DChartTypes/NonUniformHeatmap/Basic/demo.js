function generateHeatmapData() {
    const heatmapWidth = 7;
    const heatmapHeight = 4;

    // generate a 2D zValues [width][height] array
    const zValues = Array.from(Array(heatmapHeight));
    zValues.forEach((row, index, collection) => {
        collection[index] = Array.from(Array(heatmapWidth));
    });
    for (let x = 0; x < heatmapWidth; x++) {
        for (let y = 0; y < heatmapHeight; y++) {
            zValues[y][x] = 3.5 * ((heatmapHeight - y) * (heatmapWidth - x));
        }
    }
    return zValues;
}

async function nonUniformHeatmapChart(divElementId) {
    // #Region ExampleA
    // Demonstrates how to create a uniform heatmap chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        HeatmapColorMap,
        NonUniformHeatmapRenderableSeries,
        NonUniformHeatmapDataSeries,
        SciChartJsNavyTheme,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Create a SciChartSurface with X & Y Axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // The data for the heatmap is a 2d Array of zValues [height][width]
    // for example:
    //   const zValues = [
    //     [0, 2, 3.4],
    //     [5, 3, 4],
    //     [3, 1.5, -1],
    //   ];
    const zValues = generateHeatmapData();

    // arrays with cell offsets
    const xRangeOffsetsSource = [0, 10, 20, 26, 36, 60, 72, 84];
    const yRangeOffsetsSource = [100, 250, 390, 410, 600];

    // mapping functions that will calculate cell offsets based on heatmap width and height (zValues dimension sizes)
    const xCellOffsets = (i) => xRangeOffsetsSource[i];
    const yCellOffsets = (i) => yRangeOffsetsSource[i];

    // Create the non-uniform heatmap series
    const heatmapSeries = new NonUniformHeatmapRenderableSeries(wasmContext, {
        // Pass in the 2d zValues array and x/yCellOffsets to give x,y positions
        dataSeries: new NonUniformHeatmapDataSeries(wasmContext, { zValues, xCellOffsets, yCellOffsets }),
        // zValues mapped to colours using the colorMap.
        // zValue[y][x] when compared to HeatmapColorMap.maximum corresponds to gradientstop offset=1
        // zValue[y][x] when compared to HeatmapColorMap.minimum corresponds to gradientstop offset=0
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 100,
            gradientStops: [
                { offset: 0, color: "#14233C" },
                { offset: 0.2, color: "#264B93" },
                { offset: 0.3, color: "#50C7E0" },
                { offset: 0.5, color: "#67BDAF" },
                { offset: 0.7, color: "#DC7969" },
                { offset: 0.9, color: "#F48420" },
                { offset: 1, color: "#EC0F6C" },
            ],
        }),
        // optional settings
        opacity: 0.77,
        // values outside of the colorMap.min/max will be filled with the colours at edge of the colormap
        fillValuesOutOfRange: true,
        // Optional datalabels may be placed in cell
        dataLabels: {
            style: { fontFamily: "Arial", fontSize: 16 },
            color: "White",
        },
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);
    // #endregion

    // Add zooming, panning for the example
    const { ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
}

nonUniformHeatmapChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, HeatmapColorMap, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const zValues = generateHeatmapData();

    // arrays with cell offsets
    const xRangeOffsetsSource = [0, 10, 20, 26, 36, 60, 72, 84];
    const yRangeOffsetsSource = [100, 250, 390, 410, 600];

    // mapping functions that will calculate cell offsets based on heatmap width and height (zValues dimension sizes)
    const xCellOffsets = (i) => xRangeOffsetsSource[i];
    const yCellOffsets = (i) => yRangeOffsetsSource[i];

    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: 100,
        gradientStops: [
            { offset: 0, color: "#14233C" },
            { offset: 0.2, color: "#264B93" },
            { offset: 0.3, color: "#50C7E0" },
            { offset: 0.5, color: "#67BDAF" },
            { offset: 0.7, color: "#DC7969" },
            { offset: 0.9, color: "#F48420" },
            { offset: 1, color: "#EC0F6C" },
        ],
    });

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: {
            type: ESeriesType.NonUniformHeatmapSeries,
            options: {
                colorMap,
                dataLabels: {
                    style: { fontFamily: "Arial", fontSize: 16 },
                    color: "White",
                },
            },
            heatmapData: {
                zValues,
                xCellOffsets,
                yCellOffsets,
            },
        },
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
