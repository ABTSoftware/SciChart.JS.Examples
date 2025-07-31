# Animated Columns Chart

## Overview

This example demonstrates how to create an animated column chart visualizing ATP tennis rankings over time using SciChart.js. The implementation uses [FastRectangleRenderableSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/fastrectanglerenderableseries.html) with custom coloring by country and smooth animations between yearly data updates.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- Vanilla JavaScript – Core implementation
- TypeScript – Type definitions
- WebGL – For GPU-accelerated rendering

## Code Explanation

The example centers around the `drawExample` function which creates a [SciChartSurface](https://www.scichart.com/documentation/js/current/typedoc/classes/scichartsurface.html) with a flipped [NumericAxis](https://www.scichart.com/documentation/js/current/typedoc/classes/numericaxis.html) for rankings display. Key components include:

1. **Data Structure**: Uses ATP rankings data with player metadata (rank, name, country)
2. **Custom Palette Provider**: The `CountryPaletteProvider` class assigns colors based on player nationality
3. **Animation System**: Implements smooth transitions between yearly data using [ColumnAnimation](https://www.scichart.com/documentation/js/current/typedoc/classes/columnanimation.html) with easing functions
4. **Data Series Management**: Uses [XyxDataSeries](https://www.scichart.com/documentation/js/current/typedoc/classes/xydataseries.html) with start/end values for precise column positioning
5. **Dynamic Updates**: The `updateData` function handles transitions between years while preserving animation continuity

## Customization

Key non-obvious customizations in this example:

1. **Flipped Y-Axis**: Configured with `flippedCoordinates: true` to display #1 ranking at the top
2. **Column Positioning**: Uses `EColumnMode.StartEnd` and `EColumnYMode.CenterHeight` for precise control over column dimensions
3. **Data Label Formatting**: Custom metadata selector displays player names and countries in labels
4. **Animation Chaining**: The `onCompleted` callback in `ColumnAnimation` triggers the next year's update
5. **Edge Case Handling**: The update logic manages both new entries (animating in from off-screen) and departing entries (animating out)

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Example**:
    ```bash
    cd SciChart.JS.Examples/Examples/src/components/Charts2D/v4Charts/AnimatedColumns
    ```

3. **Install Dependencies**:
    ```bash
    npm install
    ```

4. **Run Development Server**:
    ```bash
    npm run dev
    ```

For framework-specific implementations (React, Angular), refer to the corresponding files in the example directory.