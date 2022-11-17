import * as React from "react";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart";
import { UniformHeatmapDataSeries } from "scichart/Charting/Model/UniformHeatmapDataSeries";
import { UniformHeatmapRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries";
import { HeatmapColorMap } from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { zeroArray2D } from "scichart/utils/zeroArray2D";
import classes from "../../../../Examples/Examples.module.scss";
import { Button } from "@material-ui/core";
import { appTheme } from "../../../theme";
import { HeatmapLegend } from "scichart/Charting/Visuals/HeatmapLegend";

const divElementId = "chart";
const divHeatmapLegend = "heatmapLegend";
const cachedHeatmapDataForExample: number[][][] = [];
const MAX_SERIES = 100;
const WIDTH = 300;
const HEIGHT = 200;

const drawExample = async () => {
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
        xStart: 100,
        xStep: 1,
        yStart: 100,
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

    return { sciChartSurface, wasmContext, heatmapDataSeries };
};

const drawHeatmapLegend = async () => {
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
    const zValues = zeroArray2D([height, width]);
    // math.round but to X digits
    function roundTo(number: number, digits: number) {
        return number;
        // return parseFloat(number.toFixed(digits));
    }
    const angle = roundTo(Math.PI * 2 * index, 3) / maxIndex;

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
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

let timerId: NodeJS.Timeout;
let updateIndex: number = 0;
let heatmapDataSeries: UniformHeatmapDataSeries;

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function HeatmapChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();
    const [heatmapLegend, setHeatmapLegend] = React.useState<HeatmapLegend>();

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

    const handleStart = () => {
        if (!timerId) {
            updateChart();
        }
    };

    const handleStop = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            const legend = await drawHeatmapLegend();
            setSciChartSurface(res.sciChartSurface);
            setHeatmapLegend(legend);
            heatmapDataSeries = res.heatmapDataSeries;
            handleStart();
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            handleStop();
            sciChartSurface?.delete();
            heatmapLegend?.delete();
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div id={divElementId} style={{ width: "100%", height: "100%" }}></div>
            <div
                id={divHeatmapLegend}
                style={{ position: "absolute", height: "95%", width: "100px", top: 0, right: "75px", margin: "20" }}
            ></div>
            <div style={{ position: "absolute", left: "10px", top: "10px", margin: "20" }}>
                <div className={classes.ButtonsWrapper}>
                    <Button onClick={handleStart}>Start</Button>
                    <Button onClick={handleStop}>Stop</Button>
                </div>
            </div>
        </div>
    );
}
