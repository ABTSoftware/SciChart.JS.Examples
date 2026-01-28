# High Performance SVG Cursor

## Overview

This example demonstrates the **Decoupled Render Loop** in SciChart.js. Even with **1 Million Points** and a complex Gradient Palette causing frame drops on the main chart, the **SVG Cursor** remains smooth at 60 FPS because it does not trigger a WebGL redraw.

## Technologies Used

-   SciChart.js – High performance charting library
-   WebGL – For rendering 1 million scatter points
-   SVG – For decoupled cursor rendering layer
-   TypeScript – Custom palette provider implementation
-   Vanilla JavaScript – Core chart implementation

## Code Explanation

The example centers on the `drawExample` function which generates a SciChartSurface with 1 million scatter points forming a bounded cloud between Y=-500 and Y=500. Key components include:

-   **Data Generation**: Creates `Float64Array` for 1M xValues (sequential indices) and yValues (random distribution).
-   **Scatter Series**: Uses `XyScatterRenderableSeries` with tiny `EllipsePointMarker` (1x1 pixels) and a custom `GradientPaletteProvider`.
-   **Axes**: Numeric X axis with engineering format, Y axis with 1% growBy padding.
-   **Interactivity**: `ZoomExtentsModifier`, `MouseWheelZoomModifier` for basic navigation.
-   **Dynamic Modifiers**: Toggles between `CursorModifier` and `RolloverModifier` with `isSvgOnly` property controlling SVG vs Native rendering. See [CursorModifier Overview](https://www.scichart.com/documentation/js/v5/2d-charts/chart-modifier-api/cursor-modifier/cursor-modifier-overview/).
-   **State Management**: `rebuildActiveModifier()` function handles switching modes while preserving accent color styling.

The metadata file defines example configuration including framework subtitles and documentation links.

## Customization

Several advanced customizations make this example unique:

-   **GradientPaletteProvider**: Custom class extending `DefaultPaletteProvider` that implements `IPointMarkerPaletteProvider`. Pre-calculates color channels from hex strings using `parseColorToUIntArgb()` and `extractColorChannels()`. Performs linear interpolation (lerp) between Indigo (low Y) and VividOrange (high Y) colors per-point based on Y-value fraction within the data range.
-   **Decoupled SVG Rendering**: `isSvgOnly: true` on modifiers draws crosshairs/tooltips to a separate SVG layer above WebGL canvas, preventing mouse movement from triggering expensive WebGL redraws.
-   **Performance Simulation**: Tiny point markers + per-point gradient shading intentionally create heavy rendering load (15-30 FPS chart) to demonstrate smooth 60 FPS cursor interaction.
-   **Dynamic Tooltip**: Custom `tooltipDataTemplate` in RolloverModifier returns formatted X/Y coordinate strings.
-   **Control API**: Exposed `setSvgMode()` and `toggleUseCursorOrRollover()` functions allow runtime switching between Native/SVG and Cursor/Rollover modes.

## Running the Example

To run any example from the SciChart.JS.Examples repository, follow these steps:

1. **Clone the Repository**: Download the entire repository to your local machine using Git:

```bash
git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
```

2. **Navigate to the Examples Directory**: Change into the `Examples` folder:

```bash
cd SciChart.JS.Examples/Examples
```

3. **Install Dependencies**: Install the necessary packages using npm:

```bash
npm install
```

4. **Run the Development Server**: Start the development server to view and interact with the examples:

```bash
npm run dev
```

This will launch the demo application, allowing you to explore various examples, including the one in question.

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
