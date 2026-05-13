import { createExampleInfo } from "../../../exampleInfoUtils";
import { IExampleMetadata } from "../../../IExampleMetadata";

const markdownContent = `
## JavaScript Map Chart with Heatmap overlay

This example demonstrates how to create a **Heatmap visualization of earthquake data** overlaid on a world map using SciChart.js.

### Key Features

- **World Map Overlay**: Country/continent outlines rendered using \`FastLineRenderableSeries\` with white strokes
- **Earthquake Heatmap**: \`UniformHeatmapRenderableSeries\` displays earthquake magnitudes with a color gradient from black (no activity) through green, yellow, orange to red (highest magnitude)
- **Real Data**: Loads ~23,000 earthquake records from CSV and world map boundaries from JSON
- **Smoothing Algorithm**: Applies a 3x3 averaging filter to create a visually appealing heatmap
- **Interactive**: Supports zoom, pan, and mouse wheel zoom via chart modifiers
- **Heatmap Legend**: Separate legend component showing the magnitude color scale (0-10 Richter scale)

### How It Works

- **1.** Earthquake data is fetched from a CSV file and parsed to extract latitude, longitude, and magnitude
- **2.**  Each earthquake is mapped to a grid cell based on its geographic coordinates
- **3.**  The maximum magnitude is used when multiple earthquakes fall in the same cell
- **4.**  A smoothing pass averages neighboring cells for better visualization
- **5.**  The heatmap is rendered with 50% opacity over the world map outlines`;

const metaData: IExampleMetadata =
    //// This metadata is computer generated - do not edit!
    {
        reactComponent: "HeatmapOverMap",
        id: "chart2D_v4Charts_HeatmapOverMap",
        imagePath: "javascript-heatmap-chart-earthquakes.jpg",
        description: "",
        tips: [],
        frameworks: {
            javascript: {
                subtitle:
                    "This examples combines a **JavaScript Map Chart with a Heatmap** to show the distribution of earthquakes around the world.",
                title: "JavaScript Map Chart with Heatmap overlay",
                pageTitle: "JavaScript Map Chart with Heatmap overlay",
                metaDescription:
                    "Design a highly dynamic JavaScript Map Chart with Heatmap overlay with SciChart's feature-rich JavaScript Chart Library. Get your free demo today.",
                markdownContent,
            },
            react: {
                subtitle:
                    "This examples combines a **React Map Chart with a Heatmap** to show the distribution of earthquakes around the world.",
                title: "React Map Chart with Heatmap overlay",
                pageTitle: "React Map Chart with Heatmap overlay",
                metaDescription:
                    "Design a highly dynamic React Map Chart with Heatmap overlay with SciChart's feature-rich JavaScript Chart Library. Get your free demo today.",
                markdownContent,
            },
            angular: {
                subtitle:
                    "This examples combines a **Angular Map Chart with a Heatmap** to show the distribution of earthquakes around the world.",
                title: "Angular Map Chart with Heatmap overlay",
                pageTitle: "Angular Map Chart with Heatmap overlay",
                metaDescription:
                    "Design a highly dynamic Angular Map Chart with Heatmap overlay with SciChart's feature-rich JavaScript Chart Library. Get your free demo today.",
                markdownContent,
            },
        },
        documentationLinks: [
            {
                href: "https://www.scichart.com/documentation/js/v5/2d-charts/chart-types/uniform-heatmap-renderable-series/uniform-heatmap-chart-type/",
                title: "The specific page for the JavaScript Heatmap Chart documentation will help you to get started",
                linkTitle: "JavaScript Heatmap Chart Documentation",
            },
        ],
        path: "heatmap-over-map",
        metaKeywords: "map, heatmap, earthquakes, chart, javascript, webgl, canvas",
        onWebsite: true,
        filepath: "Charts2D/v4Charts/HeatmapOverMap",
        thumbnailImage: "javascript-heatmap-chart-earthquakes.jpg",
        sandboxConfig: {},
        markdownContent: null,
        pageLayout: "default",
        extraDependencies: {},
    };
//// End of computer generated metadata

const bigHeatmapExample = createExampleInfo(metaData);
export default bigHeatmapExample;
