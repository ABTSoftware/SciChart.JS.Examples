import * as SciChart from "scichart";

// This function generates data for the heatmap series example
function generateExampleData(width, height, cpMax, index, maxIndex) {
    const { zeroArray2D } = SciChart;
    // or, import { zeroArray2D } from "SciChart";

    // Returns a 2-dimensional javascript array [height (y)] [width (x)] size
    const zValues = zeroArray2D([height, width]);

    const angle = (Math.PI * 2 * index) / maxIndex;

    // When appending data to a 2D Array for the heatmap, the order of appending (X,Y) does not matter
    // but when accessing the zValues[][] array, we set data [y] then [x]
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const v =
                (1 + Math.sin(x * 0.02 + angle)) * 50 +
                (1 + Math.sin(y * 0.05 + angle)) * 50 * (1 + Math.sin(angle * 2));
            const cx = width / 2;
            const cy = height / 2;
            const r = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy));
            const exp = Math.max(0, 1 - r * 0.008);
            const zValue = v * exp + Math.random() * 10;
            zValues[y][x] = zValue > cpMax ? cpMax : zValue;
        }
    }
    return zValues;
}

async function heatmapColorMaps(divElementId) {
    // Demonstrates how to create a uniform heatmap chart with SciChart.js
    const {
        SciChartSurface,
        NumericAxis,
        HeatmapColorMap,
        UniformHeatmapDataSeries,
        UniformHeatmapRenderableSeries,
        SciChartJsNavyTheme,
        NumberRange
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    // Create a SciChartSurface with X & Y Axis
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(150, 350) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { visibleRange: new NumberRange(80, 200) }));

    const WIDTH = 500;
    const HEIGHT = 300;
    const MAX_SERIES = 200;
    let index = 20;

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    // Open the Codepen below to see the definition of this function
    const initialZValues = generateExampleData(WIDTH, HEIGHT, 200, index, MAX_SERIES);
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: initialZValues
    });

    // #region ExampleA
    // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
    // HeatmapDataSeries which correspond to gradient stops at 0..1
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        useLinearTextureFiltering: false,
        fillValuesOutOfRange: true,
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 200,
            gradientStops: [
                { offset: 1, color: "#EC0F6C" },
                { offset: 0.9, color: "#F48420" },
                { offset: 0.7, color: "#DC7969" },
                { offset: 0.5, color: "#67BDAF" },
                { offset: 0.3, color: "#50C7E0" },
                { offset: 0.2, color: "#264B9377" }, // Start to fade out the transparency here
                { offset: 0, color: "Transparent" } // Set the zero value as Transparent. Corresponds to zValue <= minimum
            ]
        })
    });

    sciChartSurface.renderableSeries.add(heatmapSeries);
    // #endregion

    // Add zooming, panning for the example
    const { ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier } = SciChart;
    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier(), new MouseWheelZoomModifier());
}

heatmapColorMaps("scichart-root");

async function heatmapLegend(divElementId) {
    // #region ExampleB
    const { HeatmapLegend, SciChartJsNavyTheme } = SciChart;
    const { heatmapLegend, wasmContext } = await HeatmapLegend.create(divElementId, {
        theme: {
            ...new SciChartJsNavyTheme(),
            sciChartBackground: "#14233CBB",
            loadingAnimationBackground: "#14233CBB"
        },
        yAxisOptions: {
            axisBorder: {
                borderLeft: 1,
                color: "#FFFFFF77"
            },
            majorTickLineStyle: {
                color: "White",
                tickSize: 6,
                strokeThickness: 1
            },
            minorTickLineStyle: {
                color: "White",
                tickSize: 3,
                strokeThickness: 1
            }
        },
        colorMap: {
            minimum: 0,
            maximum: 200,
            gradientStops: [
                { offset: 1, color: "#EC0F6C" },
                { offset: 0.9, color: "#F48420" },
                { offset: 0.7, color: "#DC7969" },
                { offset: 0.5, color: "#67BDAF" },
                { offset: 0.3, color: "#50C7E0" },
                { offset: 0.2, color: "#264B9377" }, // Start to fade out the transparency here
                { offset: 0, color: "Transparent" } // Set the zero value as Transparent. Corresponds to zValue <= minimum
            ]
        }
    });
    // #endregion
}

heatmapLegend("legend-root");
