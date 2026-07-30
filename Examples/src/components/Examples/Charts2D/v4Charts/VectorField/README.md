# Vector Field Chart

## Overview

This example demonstrates a **JavaScript Vector Field** implementation using SciChart.js. It visualizes mathematical vector fields with directional arrows, combining `FastLineSegmentRenderableSeries` for vector lines and `FastTriangleRenderableSeries` for arrowheads. The chart features gradient-colored line segments and interactive zoom/pan functionality.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   Custom PaletteProvider – For gradient-colored line segments
-   CentralAxesLayoutManager – For centered axis layout
-   WebGL-accelerated rendering

## Code Explanation

The core implementation is in the `drawExample` function which:

1. Creates a `SciChartSurface` with a centered axis layout using `CentralAxesLayoutManager`
2. Generates vector field data by calculating polynomial transformations (x² - y² - 4 and 2xy)
3. Uses `FastLineSegmentRenderableSeries` with a custom `LineSegmentPaletteProvider` to render gradient-colored vectors
4. Adds directional arrowheads using `FastTriangleRenderableSeries` via the `addArrowheads` utility function
5. Includes interactive modifiers:
    - `ZoomPanModifier` for panning and zooming
    - `ZoomExtentsModifier` to reset the view
    - `MouseWheelZoomModifier` for scroll zoom
    - `CursorModifier` with custom tooltip showing vector coordinates

Key components:

-   `LineSegmentPaletteProvider`: Implements `IStrokePaletteProvider` to alternate colors between vector start/end points
-   `addArrowheads`: Utility function that calculates triangle positions for vector tips
-   Custom tooltip template showing both start and end coordinates of vectors

## Customization

The example includes several non-standard customizations:

1. **CentralAxesLayoutManager**: Unlike typical charts, this uses a centered axis layout for better vector field visualization
2. **Polynomial Vector Field**: The example implements a specific mathematical vector field (x² - y² - 4, 2xy) but can be adapted for other functions
3. **Arrowhead Generation**: The `addArrowheads` function includes configurable parameters:
    - `arrowLength`: Controls size of arrowheads (default 0.2)
    - `arrowAngle`: Controls the spread angle of arrowheads (default π/12)
4. **Gradient Line Segments**: The palette provider uses `EStrokePaletteMode.GRADIENT` to create smooth color transitions between vectors

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Examples Directory**:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**:

    ```bash
    npm install
    ```

4. **Run the Development Server**:
    ```bash
    npm run dev
    ```

For more details, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
