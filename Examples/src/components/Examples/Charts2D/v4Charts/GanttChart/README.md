# Gantt Chart

## Overview

This example demonstrates how to create a **JavaScript Gantt Chart** using SciChart.js, with the following features: DataLabels, Rounded corners, Gradient-palette fill, and startup animations. It visualizes project timelines with task completion percentages in a performant WebGL-rendered chart.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   TypeScript – Used for type safety and better developer experience
-   WebGL – For hardware-accelerated rendering

## Code Explanation

The example centers around the `drawExample` function which creates a `SciChartSurface` with a `CategoryAxis` for task names and a `DateTimeNumericAxis` for the timeline. Key components include:

1. **Data Preparation**:

    - The `prepareGanttData` function converts project task data (start/end dates and completion percentages) into the `XyxyDataSeries` format required by SciChart.js
    - Task dates are converted from Date objects to timestamps for rendering
    - Tasks are displayed in reverse order (top to bottom) for better visual hierarchy

2. **Series Configuration**:

    - Uses `FastRectangleRenderableSeries` with `EColumnMode.StartEnd` and `EColumnYMode.TopBottom` for precise task positioning
    - Implements rounded corners (4px radius) and semi-transparent fill (opacity: 0.5)
    - Displays completion percentages as data labels centered on each task bar

3. **Interactivity**:
    - Horizontal zooming via `ZoomPanModifier` constrained to X-direction only
    - Custom tooltips showing task start/end dates through a `TCursorTooltipDataTemplate`
    - `CursorModifier` for hover interactions with custom styling

## Customization

Key customization points in this example include:

1. **Data Label Formatting**:

    ```typescript
    dataLabels: {
        color: appTheme.ForegroundColor,
        style: { fontSize: 14 },
        verticalTextPosition: EVerticalTextPosition.Center,
        horizontalTextPosition: EHorizontalTextPosition.Center,
        metaDataSelector: (md) => {
            const metadata = md as { percentComplete: number };
            return `${metadata.percentComplete.toString()} %`;
        }
    }
    ```

2. **Task Bar Styling**:

    - Corner radius can be adjusted via `topCornerRadius` and `bottomCornerRadius` properties
    - Opacity controlled through the `opacity` property (0.5 in this example)
    - Stroke color and thickness configurable via `stroke` and `strokeThickness`

3. **Axis Configuration**:
    - CategoryAxis uses reversed labels and custom styling for better readability
    - DateTimeNumericAxis formats dates as DD/MM and automatically handles date ranges

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
