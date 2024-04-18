import {
    HeatmapColorMap, HeatmapLegend, MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries, zeroArray2D, ZoomExtentsModifier, ZoomPanModifier
} from "scichart";
import {appTheme} from "scichart-example-dependencies";
import {makeStyles} from "@material-ui/core/styles";

export const divElementId = "chart";
export const divHeatmapLegend = "heatmapLegend";
const MAX_SERIES = 100;
const WIDTH = 300;
const HEIGHT = 200;

// Draws a Heatmap chart in real-time over the <div id={divElementId}>
export const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Add XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    const initialZValues: number[][] = generateExampleData(WIDTH, HEIGHT, 200, 20, MAX_SERIES);
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
        zValues: initialZValues
    });

    // Create a Heatmap RenderableSeries with the color map. ColorMap.minimum/maximum defines the values in
    // HeatmapDataSeries which correspond to gradient stops at 0..1
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        useLinearTextureFiltering: false,
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 200,
            gradientStops: [
                { offset: 1, color: appTheme.VividPink },
                { offset: 0.9, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.MutedRed },
                { offset: 0.5, color: appTheme.VividGreen },
                { offset: 0.3, color: appTheme.VividSkyBlue },
                { offset: 0.2, color: appTheme.Indigo },
                { offset: 0, color: appTheme.DarkIndigo }
            ]
        })
    });

    // Add heatmap to the chart
    sciChartSurface.renderableSeries.add(heatmapSeries);

    // Add interaction
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    // Functions for running the example in real-time
    let timerId: NodeJS.Timeout;
    let updateIndex: number = 0;

    const updateChart = () => {
        // Cycle through pre-generated data on timer tick
        const newZValues = generateExampleData(WIDTH, HEIGHT, 200, updateIndex++, MAX_SERIES);
        // Update the heatmap z-values
        heatmapDataSeries.setZValues(newZValues);
        if (updateIndex >= MAX_SERIES) {
            updateIndex = 0;
        }
        timerId = setTimeout(updateChart, 20);
    };

    const startDemo = () => {
        if (!timerId) {
            updateChart();
        }
    };

    const stopDemo = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };

    return { sciChartSurface, wasmContext, heatmapDataSeries, controls: { startDemo, stopDemo } };
};

// Draws a Heatmap legend over the <div id={divHeatmapLegend}></div>
export const drawHeatmapLegend = async () => {
    const { heatmapLegend, wasmContext } = await HeatmapLegend.create(divHeatmapLegend, {
        theme: {
            ...appTheme.SciChartJsTheme,
            sciChartBackground: appTheme.DarkIndigo + "BB",
            loadingAnimationBackground: appTheme.DarkIndigo + "BB"
        },
        yAxisOptions: {
            axisBorder: {
                borderLeft: 1,
                color: appTheme.ForegroundColor + "77"
            },
            majorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 6,
                strokeThickness: 1
            },
            minorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 3,
                strokeThickness: 1
            }
        },
        colorMap: {
            minimum: 0,
            maximum: 200,
            gradientStops: [
                { offset: 1, color: appTheme.VividPink },
                { offset: 0.9, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.MutedRed },
                { offset: 0.5, color: appTheme.VividGreen },
                { offset: 0.3, color: appTheme.VividSkyBlue },
                { offset: 0.2, color: appTheme.Indigo },
                { offset: 0, color: appTheme.DarkIndigo }
            ]
        }
    });

    return heatmapLegend;
};

// This function generates data for the heatmap series example
// because data-generation is not trivial, we generate once before the example starts
// so you can see the speed & power of SciChart.js
function generateExampleData(
    width: number,
    height: number,
    cpMax: number,
    index: number,
    maxIndex: number
): number[][] {
    // Returns a 2-dimensional javascript array [height (y)] [width (x)] size
    const zValues = zeroArray2D([height, width]);

    // math.round but to X digits
    function roundTo(number: number, digits: number) {
        return number;
        // return parseFloat(number.toFixed(digits));
    }

    const angle = roundTo(Math.PI * 2 * index, 3) / maxIndex;

    // When appending data to a 2D Array for the heatmap, the order of appending (X,Y) does not matter
    // but when accessing the zValues[][] array, we set data [y] then [x]
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const v =
                (1 + roundTo(Math.sin(x * 0.04 + angle), 3)) * 50 +
                (1 + roundTo(Math.sin(y * 0.1 + angle), 3)) * 50 * (1 + roundTo(Math.sin(angle * 2), 3));
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
