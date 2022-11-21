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
import { UniformContoursRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/UniformContoursRenderableSeries";
import classes from "../../../../Examples/Examples.module.scss";
import { appTheme } from "../../../theme";
import { HeatmapLegend } from "scichart/Charting/Visuals/HeatmapLegend";

const divElementId = "chart";
const divHeatmapLegend = "heatmapLegend";

const drawExample = async () => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Create an X & Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const heatmapWidth = 300;
    const heatmapHeight = 200;

    const colorPaletteMin = 0;
    const colorPaletteMax = 200;

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    const initialZValues = generateExampleData(3, heatmapWidth, heatmapHeight, colorPaletteMax);
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        zValues: initialZValues,
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1
    });

    // Add the contours series and add to the chart
    sciChartSurface.renderableSeries.add(
        new UniformContoursRenderableSeries(wasmContext, {
            dataSeries: heatmapDataSeries,
            zMin: 20,
            zMax: colorPaletteMax,
            zStep: 20,
            strokeThickness: 1,
            stroke: appTheme.PaleSkyBlue
        })
    );

    // Create a background heatmap series with the same data and add to the chart
    sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: heatmapDataSeries,
            useLinearTextureFiltering: false,
            opacity: 0.5,
            colorMap: new HeatmapColorMap({
                minimum: colorPaletteMin,
                maximum: colorPaletteMax,
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
        })
    );

    // Add interaction
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface };
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

// This function generates data for the heatmap with contours series example
function generateExampleData(index: number, heatmapWidth: number, heatmapHeight: number, colorPaletteMax: number) {
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
    const [heatmapLegend, setHeatmapLegend] = React.useState<HeatmapLegend>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            const legend = await drawHeatmapLegend();
            setSciChartSurface(res.sciChartSurface);
            setHeatmapLegend(legend);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => {
            sciChartSurface?.delete();
            heatmapLegend?.delete();
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div id={divElementId} style={{ width: "100%", height: "100%" }}></div>
            <div
                id={divHeatmapLegend}
                style={{ position: "absolute", height: "92%", width: "100px", top: 0, right: "70px", margin: "20px" }}
            ></div>
        </div>
    );
}
`;