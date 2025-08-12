# Polar Sunburst Chart

## Overview

This example demonstrates how to create an interactive **Polar Sunburst Chart** using SciChart.js, with multiple levels and interaction-driven animations. The chart visualizes hierarchical data through concentric rings of `PolarColumnRenderableSeries`, where each segment represents a node in the tree structure.

## Technologies Used

-   SciChart.js – High performance WebGL charting library
-   TypeScript – Used for type safety and better developer experience
-   WebAssembly – For high-performance computations
-   React/Angular/Vanilla JS – Framework-specific implementations available

## Code Explanation

The implementation processes hierarchical JSON data into level-wise flat arrays using `getDataById()`. Each level is rendered as a separate `PolarColumnRenderableSeries` with angular size corresponding to value and radial distance encoding depth. Key components include:

1. **Core Chart Setup**:

    - `SciChartPolarSurface` creates the polar chart surface
    - `PolarNumericAxis` for angular (x) and radial (y) axes
    - Initial setup with hidden axes and defined visible ranges

2. **Data Processing**:

    - `sunburstData.ts` contains the hierarchical dataset
    - `getDataById()` transforms hierarchical data into flat arrays for each level
    - `getElementById()` retrieves specific nodes from the hierarchy

3. **Rendering**:

    - `drawSeriesFn()` handles dynamic series generation for each hierarchy level
    - `PolarColumnRenderableSeries` displays segments with custom styling
    - `SunburstPaletteProvider` dynamically adjusts colors based on selection state

4. **Interactivity**:

    - `PolarDataPointSelectionModifier` enables drill-down/up functionality
    - `PolarCursorModifier` provides tooltips with node information
    - `GenericAnimation` creates smooth transitions between hierarchy levels

5. **Custom Classes**:
    - `SunburstMetadata` stores node-specific visual properties
    - `SunburstPaletteProvider` implements custom coloring logic

## Customization

Key customization aspects in this example include:

1. **Animation Configuration**:

    - Drill-down animations use `GenericAnimation` with `easing.inOutSine`
    - Duration set to 2000ms for smooth transitions
    - Animated properties include visible range and start angle

2. **Visual Styling**:

    - `SunburstPaletteProvider` implements custom coloring logic:
        - Selected nodes use semi-transparent fill (`colorArgbWithOpacity`)
        - Non-selected nodes use solid fill (`colorArgb`)
    - Data labels display both node name and value with custom formatting

3. **Hierarchy Navigation**:

    - Clicking segments drills down to children
    - Clicking inner segments drills up to parent
    - Current level tracking via `nodeId` array

4. **Performance Optimizations**:
    - Proper cleanup of series during navigation
    - Async initialization pattern for WebAssembly context
    - Efficient memory management with explicit disposal

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

For framework-specific implementations (React, Angular), refer to the corresponding component files in the repository. The example follows best practices for each framework, including proper resource cleanup and component encapsulation.
