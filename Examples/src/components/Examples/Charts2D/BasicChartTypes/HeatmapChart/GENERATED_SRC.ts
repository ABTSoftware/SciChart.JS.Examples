export const code = `import * as React from "react";
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
import Box from "../../../../../helpers/shared/Helpers/Box/Box";
import { Button, ButtonGroup } from "@material-ui/core";

const divElementId = "chart";
const cachedHeatmapDataForExample: number[][][] = [];
const MAX_SERIES = 20;
const WIDTH = 300;
const HEIGHT = 200;

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Add XAxis and YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    const initialZValues: number[][] = iterate(WIDTH, HEIGHT, 200, 0, MAX_SERIES);
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
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 200,
            gradientStops: [
                { offset: 0, color: "#00008B" },
                { offset: 0.2, color: "#6495ED" },
                { offset: 0.4, color: "#006400" },
                { offset: 0.6, color: "#7FFF00" },
                { offset: 0.8, color: "#FFFF00" },
                { offset: 1.0, color: "#FF0000" }
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

// This function generates data for the heatmap series example
// because data-generation is not trivial, we generate once before the example starts
// so you can see the speed & power of SciChart.js
function iterate(width: number, height: number, cpMax: number, index: number, maxIndex: number): number[][] {
    const zValues = zeroArray2D([height, width]);
    // math.round but to X digits
    function roundTo(number: number, digits: number) {
        return parseFloat(number.toFixed(digits));
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
            const zValue = v * exp + Math.random() * 50;
            zValues[y][x] = zValue > cpMax ? cpMax : zValue;
        }
    }
    return zValues;
}

let timerId: NodeJS.Timeout;
let updateIndex: number = 0;

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function HeatmapChart() {
    const [heatmapDataSeries, setHeatmapDataSeries] = React.useState<UniformHeatmapDataSeries>();
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
            setHeatmapDataSeries(res.heatmapDataSeries);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    const updateChart = () => {
        timerId = setTimeout(updateChart, 20);
        // Cycle through pre-generated data every 20ms
        const newZValues = cachedHeatmapDataForExample[updateIndex++];
        // Update the heatmap z-values
        heatmapDataSeries.setZValues(newZValues);
        if (updateIndex >= MAX_SERIES) {
            updateIndex = 0;
        }
    };

    const handleStart = () => {
        // Pre-generate data for the example.
        // We do this once since data-generation of complex waveforms is quite heavy.
        if (cachedHeatmapDataForExample.length === 0) {
            for (let i = 1; i < MAX_SERIES; i++) {
                cachedHeatmapDataForExample.push(iterate(WIDTH, HEIGHT, 200, i, MAX_SERIES));
            }
        }

        if (!timerId) {
            updateChart();
        }
    };

    const handleStop = () => {
        clearTimeout(timerId);
        timerId = undefined;
    };

    return (
        <div>
            <div id={divElementId} className={classes.ChartWrapper} />
            <div style={{ marginTop: 20 }}>
                When click Start first time data is being generated, it could take a while
            </div>

            <div>
                <div className={classes.ButtonsWrapper}>
                    <Button onClick={heatmapDataSeries && handleStart}>Start</Button>
                    <Button onClick={heatmapDataSeries && handleStop}>Stop</Button>
                </div>
            </div>
        </div>
    );
}
`;