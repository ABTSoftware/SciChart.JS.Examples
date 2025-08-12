# Polar Gauge Chart

## Overview

This example demonstrates how to create multiple **JavaScript Polar Gauge Charts** using SciChart.js, showcasing two different approaches to draw the gauge: either with **PolarColumnRenderableSeries** or **PolarArcAnnotation**. The implementation features six distinct gauge variations, each demonstrating different styling, pointer types, and threshold visualizations.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   React – For React integration
-   Angular – For Angular integration
-   TypeScript – Used in Angular and Vanilla examples
-   WebGL – For high-performance rendering

## Code Explanation

The example consists of six different gauge implementations (`gauge1` to `gauge6`), each demonstrating unique polar gauge configurations:

1. **Gauge1**: Uses `PolarArcAnnotation` for segmented colored arcs and `PolarPointerAnnotation` for value indication
2. **Gauge2**: Implements a gauge using `PolarColumnRenderableSeries` for a single filled sector
3. **Gauge3**: Features dual-axis labeling with `EPolarLabelMode.Parallel` and `EPolarLabelMode.Horizontal`
4. **Gauge4**: Shows a single-value progress arc with dynamic pointer and centered text display
5. **Gauge5**: Implements conditional arc rendering based on threshold values
6. **Gauge6**: Includes tick marks and danger zone highlighting

Key components used across implementations:

-   `SciChartPolarSurface`: The base polar chart surface
-   `PolarNumericAxis`: Configured with `EPolarAxisMode.Radial` or `EPolarAxisMode.Angular`
-   `PolarPointerAnnotation`: For gauge needle/pointer visualization
-   `PolarArcAnnotation`: For arc segments and background fills
-   `TextAnnotation`/`NativeTextAnnotation`: For label display

## Customization

Notable customizations in this example include:

1. **Pointer Customization**:

    - Gauge4 implements a custom pill-shaped pointer using `getPointerArrowSvg` override
    - Gauge6 uses `isStrokeAboveCenter` and `strokeLineJoin` for pointer styling

2. **Conditional Rendering**:

    - Gauge5 dynamically shows/hides arc segments based on pointer value thresholds

3. **Axis Configuration**:

    - Gauge3 demonstrates dual angular axes with different label modes
    - Gauge6 implements custom major/minor tick styling with `tickSize` and `strokeThickness`

4. **Annotation Layers**:

    - Several gauges use `EAnnotationLayer.Background` to control rendering order

5. **Gradient Fills**:
    - Gauge2 uses `fillLinearGradient` on its `PolarColumnRenderableSeries`

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
