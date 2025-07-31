# Box Plot Chart

## Overview

This example demonstrates how to create a **Box Plot Chart** using SciChart.js, showcasing four distinct box plot visualizations in sub-surfaces. Each plot displays statistical data distribution through minimum, maximum, median, and quartile values using the **FastBoxPlotRenderableSeries** chart type.

## Technologies Used

- SciChart.js – High performance WebGL/Canvas charting library
- TypeScript – Used for type-safe implementations
- React/Angular/Vanilla JS – Framework-specific integrations available

## Code Explanation

The example centers around the `drawExample` function which creates a `SciChartSurface` with four sub-surfaces using `SciChartSubSurface`. Each sub-surface contains:

1. **Axes Configuration**:
   - First sub-surface uses `CategoryAxis` for X-values and `NumericAxis` for Y-values with `flippedCoordinates: true`
   - Second sub-surface uses dual `NumericAxis` for both X and Y values
   - Axes are configured with `growBy` padding and automatic ranging

2. **Box Plot Series**:
   - Created using `FastBoxPlotRenderableSeries` with `BoxPlotDataSeries` for data storage
   - Each series displays:
     - Minimum/maximum values (whiskers)
     - Lower/upper quartiles (box)
     - Median line
   - Two different `dataPointWidthMode` configurations demonstrated:
     - `EDataPointWidthMode.Relative` (proportional spacing)
     - `EDataPointWidthMode.Range` (fixed width)

3. **Styling Customization**:
   - Independent styling for whiskers, caps, and median lines
   - Semi-transparent fill colors using hex+alpha notation (e.g., `"#color+66"`)
   - Custom stroke dash arrays for whiskers

## Customization

Key non-obvious configurations in this example include:

1. **Coordinate Flipping**:
   - The first sub-surface demonstrates `flippedCoordinates: true` which inverts the X/Y axis positions while maintaining data orientation

2. **Whisker Styling**:
   - Custom `strokeDashArray: [5, 5]` creates dashed whisker lines
   - Separate `stroke` colors for whiskers vs. box outline

3. **Data Point Width Modes**:
   - `EDataPointWidthMode.Relative` (0.5 = 50% of available space)
   - `EDataPointWidthMode.Range` (0.6 = fixed width in axis units)

4. **Sub-Surface Layout**:
   - Precise positioning using `Rect(0, 0, 0.5, 1)` for 50% width splits
   - Independent theme application per sub-surface

## Running the Example

To run this example from the SciChart.JS.Examples repository:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
   ```

2. **Navigate to Examples**:
   ```bash
   cd SciChart.JS.Examples/Examples
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

For framework-specific implementations, refer to:
- [React Documentation](https://www.scichart.com/documentation/js/current/TutorialReusableReactComponent.html)
- [Angular Documentation](https://www.npmjs.com/package/scichart-angular)
- [Box Plot Series Documentation](https://www.scichart.com/documentation/js/current/The%20Box%20Plot%20Series%20Type.html)