import {
    FastLineRenderableSeries,
    HeatmapColorMap,
    HeatmapLegend,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    UniformContoursRenderableSeries,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    XyDataSeries,
    zeroArray2D,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme } from "../../../theme";

// Interface for earthquake data
interface EarthquakeData {
    latitude: number;
    longitude: number;
    magnitude: number;
    depth: number;
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create an X & Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { isVisible: false }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { isVisible: false }));

    const heatmapWidth = 3000;
    const heatmapHeight = 2000;

    const colorPaletteMin = 0;
    const colorPaletteMax = 10; // Max magnitude for earthquakes

    // Fetch and process earthquake data
    console.log("Fetching earthquake data...");
    const earthquakeData = await fetchEarthquakeData();

    const baseUrl =
        typeof window !== "undefined" &&
        !window.location.hostname.includes("scichart.com") &&
        !window.location.hostname.includes("localhost")
            ? "https://www.scichart.com/demo"
            : "";

    const convertedData = await fetch(baseUrl + "worldConverted.json").then((response) => response.json());


    // console.log({convertedData})

    let outlines: number[][][] = [];

    convertedData.forEach((d: any) => {
        outlines.push(d.outline);
    });

    // outline
    const outlinesSC = outlines.map((outline) => {
        const xVals = outline.map((d) => d[0]);
        const yVals = outline.map((d) => d[1]);

        //FastMountainRenderableSeries
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, {
                xValues: xVals,
                yValues: yVals,
            }),
            stroke: "black", //appTheme.VividSkyBlue,
            strokeThickness: 2,
            opacity: 1,
            // fill: "rgba(100, 149, 237, 1)",
            // zeroLineY: calculatePolygonCenter(outline)[1],
        });

        return lineSeries;
    });

    sciChartSurface.renderableSeries.add(...outlinesSC);

    console.log(`Loaded ${earthquakeData.length} earthquake records`);

    // Generate heatmap from earthquake data
    const initialZValues = generateEarthquakeHeatmap(earthquakeData, heatmapWidth, heatmapHeight);

    console.log("Generated earthquake heatmap data");

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
                    { offset: 1, color: "#FF0000" }, // Red for highest magnitude
                    { offset: 0.8, color: "#FF4500" }, // Orange-red
                    { offset: 0.6, color: "#FFA500" }, // Orange
                    { offset: 0.4, color: "#FFFF00" }, // Yellow
                    { offset: 0.2, color: "#90EE90" }, // Light green
                    { offset: 0, color: "#0000FF" }, // Blue for lowest/no activity
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
            maximum: 10,
            gradientStops: [
                { offset: 1, color: "#FF0000" }, // Red for highest magnitude
                { offset: 0.8, color: "#FF4500" }, // Orange-red
                { offset: 0.6, color: "#FFA500" }, // Orange
                { offset: 0.4, color: "#FFFF00" }, // Yellow
                { offset: 0.2, color: "#90EE90" }, // Light green
                { offset: 0, color: "#0000FF" }, // Blue for lowest/no activity
            ],
        },
    });

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};

// This function generates data for the heatmap with contours series example
function generateExampleData(index: number, heatmapWidth: number, heatmapHeight: number, colorPaletteMax: number) {
    const zValues = zeroArray2D([heatmapHeight, heatmapWidth]);

    const fifty = heatmapWidth / 6;

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

// Function to fetch earthquake data from CSV
async function fetchEarthquakeData(): Promise<EarthquakeData[]> {
    try {
        const response = await fetch("https://raw.githubusercontent.com/plotly/datasets/master/earthquakes-23k.csv");
        const csvText = await response.text();

        return parseEarthquakeCSV(csvText);
    } catch (error) {
        console.error("Error fetching earthquake data:", error);
        // Return empty array if fetch fails
        return [];
    }
}

// Function to parse CSV data
function parseEarthquakeCSV(csvText: string): EarthquakeData[] {
    const lines = csvText.trim().split("\n");
    const earthquakes: EarthquakeData[] = [];

    // Skip header row (Date,Latitude,Longitude,Magnitude)
    for (let i = 1; i < lines.length; i++) {
        const columns = lines[i].split(",");

        if (columns.length >= 4) {
            // CSV format: Date,Latitude,Longitude,Magnitude
            const latitude = parseFloat(columns[1]); // Column 1: Latitude
            const longitude = parseFloat(columns[2]); // Column 2: Longitude
            const magnitude = parseFloat(columns[3]); // Column 3: Magnitude

            // Validate data - ensure proper geographic bounds
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
                    depth: 0, // Depth not available in this dataset
                });
            }
        }
    }

    return earthquakes;
}

// Function to generate heatmap from earthquake data
function generateEarthquakeHeatmap(earthquakes: EarthquakeData[], width: number, height: number): number[][] {
    // Initialize grid with zeros
    const grid: number[][] = [];
    for (let y = 0; y < height; y++) {
        grid.push(new Array(width).fill(0));
    }

    if (earthquakes.length === 0) {
        return grid;
    }

    // Use world map bounds: Latitude -90 to 90, Longitude -180 to 180
    const minLat = -90;
    const maxLat = 90;
    const minLon = -180;
    const maxLon = 180;

    console.log(`Using world map bounds: Lat ${minLat} to ${maxLat}, Lon ${minLon} to ${maxLon}`);
    console.log(`Processing ${earthquakes.length} earthquakes`);

    // Map earthquakes to grid using world coordinates
    earthquakes.forEach((earthquake) => {
        // Convert lat/lon to grid coordinates (0-based)
        const x = Math.floor(((earthquake.longitude - minLon) / (maxLon - minLon)) * width);
        const y = Math.floor(((maxLat - earthquake.latitude) / (maxLat - minLat)) * height); // Flip Y for proper orientation

        // Ensure coordinates are within bounds
        if (x >= 0 && x < width && y >= 0 && y < height) {
            // Use maximum magnitude for overlapping earthquakes in same cell
            grid[y][x] = Math.max(grid[y][x], earthquake.magnitude);
        }
    });

    // Apply smoothing to make the heatmap more visually appealing
    return smoothHeatmap(grid, width, height);
}

// Function to smooth the heatmap data
function smoothHeatmap(grid: number[][], width: number, height: number): number[][] {
    const smoothed: number[][] = [];

    for (let y = 0; y < height; y++) {
        const row: number[] = [];
        for (let x = 0; x < width; x++) {
            let sum = 0;
            let count = 0;

            // Average with neighboring cells
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
