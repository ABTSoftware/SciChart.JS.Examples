import {
    HeatmapColorMap,
    HeatmapLegend,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    UniformContoursRenderableSeries,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    zeroArray2D,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create an X & Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false }));

    const heatmapWidth = 30;
    const heatmapHeight = 20;

    const colorPaletteMin = 0;
    const colorPaletteMax = 200;

    // Create a Heatmap Data-series. Pass heatValues as a number[][] to the UniformHeatmapDataSeries
    // const initialZValues = generateExampleData(3, heatmapWidth, heatmapHeight, colorPaletteMax);


    const initialZValues = generateMediterraneanHeatmap(3000, 2000)

    console.log(initialZValues)
    
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        zValues: initialZValues,
        xStart: 0,
        xStep: 1,
        yStart: 0,
        yStep: 1,
    });

    // Add the contours series and add to the chart
    // sciChartSurface.renderableSeries.add(
    //     new UniformContoursRenderableSeries(wasmContext, {
    //         dataSeries: heatmapDataSeries,
    //         zMin: 20,
    //         zMax: colorPaletteMax,
    //         zStep: 20,
    //         zOffset: 1,
    //         strokeThickness: 1,
    //         stroke: appTheme.PaleSkyBlue,
    //     })
    // );

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
                    { offset: 0, color: appTheme.DarkIndigo },
                ],
            }),
        })
    );

    // Add interaction
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface };
};

export const drawHeatmapLegend = async (rootElement: string | HTMLDivElement) => {
    const { heatmapLegend, wasmContext } = await HeatmapLegend.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            sciChartBackground: appTheme.DarkIndigo + "BB",
            loadingAnimationBackground: appTheme.DarkIndigo + "BB",
        },
        yAxisOptions: {
            isInnerAxis: true,
            labelStyle: {
                fontSize: 12,
                color: appTheme.ForegroundColor,
            },
            axisBorder: {
                borderRight: 1,
                color: appTheme.ForegroundColor + "77",
            },
            majorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 6,
                strokeThickness: 1,
            },
            minorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 3,
                strokeThickness: 1,
            },
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
                { offset: 0, color: appTheme.DarkIndigo },
            ],
        },
    });

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};

// This function generates data for the heatmap with contours series example
function generateExampleData(index: number, heatmapWidth: number, heatmapHeight: number, colorPaletteMax: number) {
    const zValues = zeroArray2D([heatmapHeight, heatmapWidth]);

    const fifty = heatmapWidth / 6

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


function generateMediterraneanHeatmap(width: number, height: number): number[][] {
  const grid: number[][] = [];
  
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      // Mediterranean bounds: 30-45°N, -6-36°E
      const lat = 30 + (y / height) * 15;  // 30°N to 45°N (north to south)
      const lon = -6 + (x / width) * 42;   // -6°E to 36°E (west to east)
      
      let value = 1; // Default sea/low value
      
      // Land mask for Mediterranean countries using simplified geography
      // Higher values for land (Spain, Italy, Greece, Turkey, North Africa)
      if (lat > 36 && lat < 44 && lon > -2 && lon < 20) value = 150; // Spain/France/Italy
      if (lat > 34 && lat < 42 && lon > 18 && lon < 30) value += 40;  // Greece/Adriatic
      if (lat > 37 && lat < 41 && lon > 22 && lon < 36) value += 30;  // Turkey/Aegean
      if (lat > 30 && lat < 37 && lon > -2 && lon < 25) value += 50;  // North Africa
      
      // Mountain effects (lower values)
      if (lat > 41 && lon > 6 && lon < 14) value -= 30;  // Alps
      if (lat > 38 && lon > 20 && lon < 25) value -= 25; // Balkans
      
      // Coastal gradients (smooth land-sea transition)
      const landDist = Math.abs(value - 1) / 100;
      value = 1 + landDist * 199;
      
      // Add realistic variation + clamp 1-200
      value += (Math.sin(x * 0.05) * Math.cos(y * 0.07) * 20);
      value = Math.max(1, Math.min(200, Math.round(value)));
      
      row.push(value);
    }
    grid.push(row);
  }
  
  return grid;
}