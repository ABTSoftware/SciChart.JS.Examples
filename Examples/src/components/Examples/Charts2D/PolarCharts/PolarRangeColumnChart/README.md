# Polar Range Column Chart

## Overview

This example demonstrates how to create a **Polar Range Column Chart** using SciChart.js, visualizing monthly minimum and maximum surface temperatures in a polar coordinate system. It uses an `XyyDataSeries` to represent the range (y/y1 values) for each column.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   Polar Chart Components – Including `PolarNumericAxis`, `PolarCategoryAxis`, and `PolarColumnRenderableSeries`
-   Animation – `SweepAnimation` for smooth column rendering
-   Interactive Modifiers – `PolarPanModifier`, `PolarZoomExtentsModifier`, and `PolarMouseWheelZoomModifier`

## Code Explanation

The example centers around the `drawExample` function which creates a `SciChartPolarSurface` with:

1. **Axes Configuration**:

    - A radial `PolarNumericAxis` for temperature values (11-17°C range)
    - An angular `PolarCategoryAxis` for months (12 categories) with custom start angle and clockwise growth

2. **Data Series**:

    - Uses `XyyDataSeries` where:
        - `yValues` represent minimum temperatures
        - `y1Values` represent maximum temperatures
    - Rendered as a `PolarColumnRenderableSeries` with semi-transparent fill

3. **Custom Layout**:

    - `innerRadius: 0.05` creates a donut hole effect
    - `startAngle: Math.PI / 2` begins the chart at 12 o'clock position
    - `flippedCoordinates: true` makes months progress clockwise

4. **Interactivity**:
    - Built-in polar chart modifiers for panning, zooming, and mouse-wheel interaction

## Customization

Key non-obvious configurations include:

1. **Angular Axis Alignment**:

    ```typescript
    startAngle: Math.PI / 2 - Math.PI / 12;
    ```

    This offsets the first month (January) to center it at the 12 o'clock position by subtracting half a month's angle (π/12 radians).

2. **Grid Line Styling**:
   The example deliberately hides major grid lines and shows only minor grid lines for a cleaner look:

    ```typescript
    drawMajorGridLines: false,
    drawMinorGridLines: true
    ```

3. **Temperature Range Lock**:

    ```typescript
    zoomExtentsToInitialRange: true;
    ```

    Ensures zoom operations can't exceed the original 11-17°C range.

4. **Column Width Control**:
    ```typescript
    dataPointWidth: 1;
    ```
    Adjusts the angular width of each column to fill the available space between months.

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

For more details, see the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md) or the [Polar Chart Documentation](https://www.scichart.com/documentation/js/current/webframe.html#The%20Column%20Series%20Type.html).
