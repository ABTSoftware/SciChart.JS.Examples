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
import { UniformContoursRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/UniformContoursRenderableSeries";
import classes from "../../../../Examples/Examples.module.scss";

const divElementId = "chart";

const drawExample = async () => {
    // Create a SciChartSurface with X,Y Axis
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const heatmapWidth = 300;
    const heatmapHeight = 200;

    const colorPaletteMin = 0;
    const colorPaletteMax = 200;

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    const initialZValues: number[][] = createSeries(3, heatmapWidth, heatmapHeight, colorPaletteMax);
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, 0, 1, 0, 1, initialZValues);

    // Create a Contours RenderableSeries with the same data
    const contourSeries = new UniformContoursRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        zMin: 20,
        zMax: colorPaletteMax,
        zStep: 20,
        strokeThickness: 1,
        stroke: "#C6E6FF"
    });

    // Add the contours to the chart
    sciChartSurface.renderableSeries.add(contourSeries);

    // Create a background heatmap series with the same data and add to the chart
    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        dataSeries: heatmapDataSeries,
        useLinearTextureFiltering: false,
        opacity: 0.8,
        colorMap: new HeatmapColorMap({
            minimum: colorPaletteMin,
            maximum: colorPaletteMax,
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

    return { sciChartSurface };
};

// This function generates data for the heatmap with contours series example
function createSeries(index: number, heatmapWidth: number, heatmapHeight: number, colorPaletteMax: number) {
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

export default function ContourChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
