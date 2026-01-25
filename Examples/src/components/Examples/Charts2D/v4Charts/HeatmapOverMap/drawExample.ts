import {
    FastLineRenderableSeries,
    HeatmapColorMap,
    HeatmapLegend,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    SciChartSurface,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";

/** Earthquake data structure from CSV */
interface EarthquakeData {
    latitude: number;
    longitude: number;
    magnitude: number;
    depth: number;
}

/** Base URL for fetching data files - handles both local and production environments */
const baseUrl =
    typeof window !== "undefined" &&
    !window.location.hostname.includes("scichart.com") &&
    !window.location.hostname.includes("localhost")
        ? "https://www.scichart.com/demo"
        : "";

/**
 * Creates a heatmap visualization of earthquake data overlaid on a world map.
 * The heatmap displays earthquake magnitudes using a color gradient from black (no activity)
 * to red (highest magnitude).
 */
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // World coordinate bounds (standard lat/lon ranges)
    const worldBounds = {
        minLat: -90,
        maxLat: 90,
        minLon: -180,
        maxLon: 180,
    };

    // Configure axes with world coordinate bounds (hidden for clean map appearance)
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            isVisible: false,
            visibleRange: new NumberRange(worldBounds.minLon, worldBounds.maxLon),
        })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            isVisible: false,
            visibleRange: new NumberRange(worldBounds.minLat, worldBounds.maxLat),
        })
    );

    // Heatmap resolution
    const heatmapWidth = 600;
    const heatmapHeight = 400;

    // Magnitude range for color mapping (Richter scale)
    const colorPaletteMin = 0;
    const colorPaletteMax = 10;

    // Load earthquake data and world map outlines
    const earthquakeData = await fetchEarthquakeData();
    const convertedData = await fetch(baseUrl + "worldConverted.json").then((response) => response.json());

    // Define coordinate bounds for the world map data
    const minX = -180;
    const maxX = 180;
    const minY = -90;
    const maxY = 90;

    // Transform world map coordinates to match the chart's coordinate system
    const transformedOutlines = convertedData.map((d: any) => {
        return d.outline.map((point: number[]) => {
            const scaledX =
                worldBounds.minLon + ((point[0] - minX) / (maxX - minX)) * (worldBounds.maxLon - worldBounds.minLon);
            const scaledY =
                worldBounds.minLat + ((point[1] - minY) / (maxY - minY)) * (worldBounds.maxLat - worldBounds.minLat);
            return [scaledX, scaledY];
        });
    });

    // Create line series for country/continent outlines
    const outlinesSC = transformedOutlines.map((outline: number[][]) => {
        const xVals = outline.map((d: number[]) => d[0]);
        const yVals = outline.map((d: number[]) => d[1]);

        return new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: xVals,
                yValues: yVals,
            }),
            stroke: "#ffffff",
            strokeThickness: 2,
            opacity: 1,
        });
    });

    sciChartSurface.renderableSeries.add(...outlinesSC);

    // Generate heatmap from earthquake data
    const initialZValues = generateEarthquakeHeatmap(earthquakeData, heatmapWidth, heatmapHeight);

    // Reverse Y-axis to match geographic orientation (north at top)
    const reversedZValues = initialZValues.slice().reverse();

    // Create heatmap data series with world coordinate mapping
    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        zValues: reversedZValues,
        xStart: worldBounds.minLon,
        xStep: (worldBounds.maxLon - worldBounds.minLon) / heatmapWidth,
        yStart: worldBounds.minLat,
        yStep: (worldBounds.maxLat - worldBounds.minLat) / heatmapHeight,
    });

    // Add heatmap with semi-transparent overlay
    sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, {
            dataSeries: heatmapDataSeries,
            useLinearTextureFiltering: false,
            opacity: 0.5,
            colorMap: new HeatmapColorMap({
                minimum: colorPaletteMin,
                maximum: colorPaletteMax,
                gradientStops: [
                    { offset: 1, color: "#FF0000" }, // Red - highest magnitude
                    { offset: 0.8, color: "#FF4500" }, // Orange-red
                    { offset: 0.6, color: "#FFA500" }, // Orange
                    { offset: 0.4, color: "#FFFF00" }, // Yellow
                    { offset: 0.2, color: "#90EE90" }, // Light green
                    { offset: 0, color: "#000000" }, // Black - no activity
                ],
            }),
        })
    );

    // Add interactive chart modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface };
};

/**
 * Creates a heatmap legend showing the magnitude color scale.
 */
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
            maximum: 10,
            gradientStops: [
                { offset: 1, color: "#FF0000" }, // Red - highest magnitude
                { offset: 0.8, color: "#FF4500" }, // Orange-red
                { offset: 0.6, color: "#FFA500" }, // Orange
                { offset: 0.4, color: "#FFFF00" }, // Yellow
                { offset: 0.2, color: "#90EE90" }, // Light green
                { offset: 0, color: "#0001FF" }, // Blue - no activity
            ],
        },
    });

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};

/** Fetches earthquake data from CSV file */
async function fetchEarthquakeData(): Promise<EarthquakeData[]> {
    try {
        const response = await fetch(baseUrl + "earthquakes-23k.csv");
        const csvText = await response.text();
        return parseEarthquakeCSV(csvText);
    } catch (error) {
        console.error("Error fetching earthquake data:", error);
        return [];
    }
}

/** Parses CSV text into earthquake data objects */
function parseEarthquakeCSV(csvText: string): EarthquakeData[] {
    const lines = csvText.trim().split("\n");
    const earthquakes: EarthquakeData[] = [];

    // CSV format: Date,Latitude,Longitude,Magnitude (skip header row)
    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(",");

        if (columns.length >= 4) {
            const latitude = parseFloat(columns[1]);
            const longitude = parseFloat(columns[2]);
            const magnitude = parseFloat(columns[3]);

            // Validate geographic bounds and magnitude
            if (
                !isNaN(latitude) &&
                !isNaN(longitude) &&
                !isNaN(magnitude) &&
                latitude >= -90 &&
                latitude <= 90 &&
                longitude >= -180 &&
                longitude <= 180 &&
                magnitude >= 0
            ) {
                earthquakes.push({
                    latitude,
                    longitude,
                    magnitude,
                    depth: 0, // Not available in this dataset
                });
            }
        }
    }

    return earthquakes;
}

/** Generates a heatmap grid from earthquake data */
function generateEarthquakeHeatmap(earthquakes: EarthquakeData[], width: number, height: number): number[][] {
    // Initialize grid with zeros
    const grid: number[][] = [];
    for (let y = 0; y < height; y++) {
        grid.push(new Array(width).fill(0));
    }

    if (earthquakes.length === 0) {
        return grid;
    }

    // World map bounds
    const minLat = -90;
    const maxLat = 90;
    const minLon = -180;
    const maxLon = 180;

    // Map each earthquake to a grid cell
    earthquakes.forEach((earthquake) => {
        // Convert lat/lon to grid coordinates
        const x = Math.floor(((earthquake.longitude - minLon) / (maxLon - minLon)) * width);
        const y = Math.floor(((maxLat - earthquake.latitude) / (maxLat - minLat)) * height); // Flip Y for proper orientation

        if (x >= 0 && x < width && y >= 0 && y < height) {
            // Use maximum magnitude when multiple earthquakes fall in the same cell
            grid[y][x] = Math.max(grid[y][x], earthquake.magnitude);
        }
    });

    return smoothHeatmap(grid, width, height);
}

/** Applies a 3x3 averaging filter to smooth the heatmap */
function smoothHeatmap(grid: number[][], width: number, height: number): number[][] {
    const smoothed: number[][] = [];

    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            let sum = 0;
            let count = 0;

            // Average with neighboring cells (3x3 kernel)
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    const ny = y + dy;
                    const nx = x + dx;

                    if (ny >= 0 && ny < height && nx >= 0 && nx < width) {
                        sum += grid[ny][nx];
                        count++;
                    }
                }
            }

            row.push(count > 0 ? sum / count : 0);
        }
        smoothed.push(row);
    }

    return smoothed;
}
