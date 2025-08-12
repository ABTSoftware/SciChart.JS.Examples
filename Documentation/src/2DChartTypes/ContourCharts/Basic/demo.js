import * as SciChart from "scichart";

// This function generates data for the heatmap series example
function generateExampleData(index, heatmapWidth, heatmapHeight, colorPaletteMax) {
    const { zeroArray2D } = SciChart;
    // or, import { zeroArray2D } from "SciChart";

    const zValues = zeroArray2D([heatmapHeight, heatmapWidth]);

    const angle = (Math.PI * 2 * index) / 30;
    let smallValue = 0;
    for (let x = 0; x < heatmapWidth; x++) {
        for (let y = 0; y < heatmapHeight; y++) {
            const v =
                (1 + Math.sin(x * 0.04 + angle)) * 50 +
                (1 + Math.sin(y * 0.1 + angle)) * 50 * (1 + Math.sin(angle * 2));
            const cx = heatmapWidth / 2;
            const cy = heatmapHeight / 2;
            const r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
            const exp = Math.max(0, 1 - r * 0.008);
            const zValue = v * exp;
            zValues[y][x] = zValue > colorPaletteMax ? colorPaletteMax : zValue;
            zValues[y][x] += smallValue;
        }

        smallValue += 0.001;
    }

    return zValues;
}

async function simpleContoursChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a contour plot with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        HeatmapColorMap,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        UniformContoursRenderableSeries,
        SciChartJsNavyTheme
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Create a SciChartSurface with X & Y Axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const WIDTH = 300;
    const HEIGHT = 200;
    const colorPaletteMax = 200;

    // Create a Heatmap Data-series. zValues are heatValues as a 2D Array (number[][])
    // Open the Codepen below to see the definition of this function
    const zValues = generateExampleData(3, WIDTH, HEIGHT, colorPaletteMax);

    // Create the uniform heatmap data series. Pass heatValues as number[][]
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        // 2d zValues array. Dimensions [height][width]
        zValues,
        // xStart, xStep, yStart, yStep defines the x,y position
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1
    });

    // Create a Contours RenderableSeries with the same data
    const contourSeries = new UniformContoursRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        zMin: 20,
        zMax: colorPaletteMax,
        zStep: 20
    });

    // Add it to the scichartsurface
    sciChartSurface.renderableSeries.add(contourSeries);

    // Create a background heatmap series with the same data and add to the chart
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        opacity: 0.5,
        useLinearTextureFiltering: false,
        // See heatmap documentation for description of how colormaps work
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: colorPaletteMax,
            gradientStops: [
                { offset: 1, color: "#EC0F6C" },
                { offset: 0.9, color: "#F48420" },
                { offset: 0.7, color: "#DC7969" },
                { offset: 0.5, color: "#67BDAF" },
                { offset: 0.3, color: "#50C7E0" },
                { offset: 0.2, color: "#264B93" },
                { offset: 0, color: "#14233C" }
            ]
        })
    });

    // Add to the SciChartSurface
    sciChartSurface.renderableSeries.add(heatmapSeries);
    // ...
    // #endregion

    // Add zooming, panning for the example
    const { ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
}

simpleContoursChart("scichart-root");

async function builderExample(divElementId) {
    // #region ExampleB
    // Demonstrates how to create a line chart with SciChart.js using the Builder API
    const { chartBuilder, ESeriesType, HeatmapColorMap, EThemeProviderType } = SciChart;

    // or, for npm, import { chartBuilder, ... } from "scichart"

    const WIDTH = 300;
    const HEIGHT = 200;
    const colorPaletteMax = 200;

    // Create a Heatmap Data-series. zValues are heatValues as a 2D Array (number[][])
    // Open the Codepen below to see the definition of this function
    const zValues = generateExampleData(3, WIDTH, HEIGHT, colorPaletteMax);

    const colorMap = new HeatmapColorMap({
        minimum: 0,
        maximum: colorPaletteMax,
        gradientStops: [
            { offset: 1, color: "#EC0F6C" },
            { offset: 0.9, color: "#F48420" },
            { offset: 0.7, color: "#DC7969" },
            { offset: 0.5, color: "#67BDAF" },
            { offset: 0.3, color: "#50C7E0" },
            { offset: 0.2, color: "#264B93" },
            { offset: 0, color: "#14233C" }
        ]
    });

    const { wasmContext, sciChartSurface } = await chartBuilder.build2DChart(divElementId, {
        surface: { theme: { type: EThemeProviderType.Dark } },
        series: [
            {
                type: ESeriesType.UniformContoursSeries,
                options: {
                    zMin: 20,
                    zMax: colorPaletteMax,
                    zStep: 20
                },
                heatmapData: {
                    zValues,
                    xStart: 0,
                    xStep: 1,
                    yStart: 0,
                    yStep: 1
                }
            },
            {
                type: ESeriesType.UniformHeatmapSeries,
                options: { colorMap, opacity: 0.5 },
                heatmapData: {
                    zValues,
                    xStart: 0,
                    xStep: 1,
                    yStart: 0,
                    yStep: 1
                }
            }
        ]
    });
    // #endregion
}

if (location.search.includes("builder=1")) builderExample("scichart-root");
