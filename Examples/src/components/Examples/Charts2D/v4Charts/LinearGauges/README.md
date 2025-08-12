# Linear Gauges

## Overview

This example demonstrates how to create **JavaScript Linear Gauges** using SciChart.js, featuring DataLabels, Rounded corners, Gradient-palette fill, and startup animations. The implementation showcases six different gauge variations with vertical and horizontal orientations.

## Technologies Used

-   SciChart.js - High performance WebGL charting library
-   WebGL - For accelerated rendering
-   TypeScript - Used in the implementation
-   SVG - For custom axis labels and annotations

## Code Explanation

The example provides six distinct gauge implementations (`gauge1` through `gauge6`) that demonstrate different styling and functionality:

1. **Gauge Construction**: Each gauge is built using `FastRectangleRenderableSeries` with `XyxyDataSeries` or `XyyDataSeries` to define rectangular regions. The series use `EColumnMode.StartEnd` and `EColumnYMode.TopBottom` modes for precise positioning.

2. **Custom Palette Providers**: The example implements `IFillPaletteProvider` interfaces to create custom color segments in the gauges. The `RectangleFillPaletteProvider` class maps specific colors to different value ranges.

3. **Annotations**: Text and arrow annotations are added using `TextAnnotation` and `LineArrowAnnotation` to indicate values and create visual indicators.

4. **Orientation Variants**:

    - Vertical gauges (gauge1, gauge2, gauge4)
    - Horizontal gauges (gauge3, gauge5)
    - Animated gauge (gauge6) with periodic value updates

5. **Custom Axis Rendering**: The example includes a `CustomAxisRenderer` class that extends `AxisRenderer` to create styled SVG labels with rounded rectangles.

## Customization

Key customization aspects in this example include:

1. **Gradient Fills**: Gauge2 demonstrates linear gradient fills using `GradientParams` with multiple color stops.

2. **Dynamic Updates**: Gauge6 features animated transitions between different value sets using `setInterval` to periodically update the data series.

3. **Custom Label Styling**: The `CustomAxisRenderer` implements SVG-based labels with rounded rectangles and precise text positioning, overriding the default WebGL text rendering.

4. **Segmented Coloring**: The palette providers enable complex coloring logic, such as in gauge5 where values ≤20 are green and >20 are red.

5. **Responsive Layout**: The gauges use `NumberRange` with growBy properties to ensure proper padding and responsive behavior.

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
