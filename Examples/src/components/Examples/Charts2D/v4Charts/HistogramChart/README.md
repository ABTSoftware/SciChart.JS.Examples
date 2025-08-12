# Histogram Chart

## Overview

This example demonstrates how to create a **JavaScript Histogram Chart** using SciChart.js, by leveraging the **FastRectangleRenderableSeries**, and its `customTextureOptions` property to have a custom tiling texture fill. The chart visualizes Europe's population distribution by age range with custom stick-figure textures and data labels.

## Technologies Used

-   SciChart.js – High performance WebGL/Canvas charting library
-   Vanilla JavaScript – For plain JavaScript implementation
-   TypeScript – Used for type safety and better developer experience

## Code Explanation

The example centers around the `drawExample` function which creates a SciChartSurface with configured axes and a FastRectangleRenderableSeries. Key components include:

1. **Data Preparation**:

    - The `prepareRectangleData()` function aggregates population data into age ranges defined by `BREAK_POINTS`
    - Uses XyxyDataSeries with `columnXMode: EColumnMode.StartEnd` and `columnYMode: EColumnYMode.TopBottom` to define rectangle positions

2. **Custom Texture Implementation**:

    - `StickFigureTextureOptions` class implements ICustomTextureOptions to create patterned fills with stick figures
    - Dynamically adjusts texture size during zoom via `layoutMeasured` subscription

3. **Axis Configuration**:

    - X-axis shows age ranges with custom label formatting
    - Y-axis uses engineering notation for population counts
    - Both axes are styled with custom fonts and colors

4. **Series Styling**:
    - Uses corner radii (topCornerRadius: 8) for rounded top edges
    - Implements data labels with engineering formatting
    - Applies custom opacity (0.8) and stroke colors

## Customization

Key customizations in this example include:

1. **Dynamic Texture Scaling**:

    ```typescript
    sciChartSurface.layoutMeasured.subscribe((data) => {
        const width = xAxis.getCurrentCoordinateCalculator().getCoordWidth(5);
        const height = yAxis.getCurrentCoordinateCalculator().getCoordWidth(10000000);
        rectangleSeries.customTextureOptions = new StickFigureTextureOptions({
            stroke: appTheme.MutedBlue,
            repeat: true,
            textureWidth: width,
            textureHeight: height,
        });
    });
    ```

    This ensures the stick figure patterns maintain proper proportions during zooming.

2. **Custom Label Formatting**:

    ```typescript
    xAxis.labelProvider.formatLabel = (value: number) => {
        if (BREAK_POINTS.includes(value)) return value.toString();
        if (value === 100) return "100+";
        return null;
    };
    ```

    Only shows labels at breakpoints for cleaner presentation.

3. **Stick Figure Drawing**:
   The `createTexture()` method in StickFigureTextureOptions uses proportional calculations to draw figures that scale with texture dimensions while maintaining proper body proportions.

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

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
