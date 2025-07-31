# Ordered Rendering Example

## Overview

This example demonstrates how to create an **Ordered Rendering** visualization using SciChart.js. It features multiple **FastBandRenderableSeries** with annotations that can be reordered dynamically, showing how elements can be rendered between series layers for advanced visual effects.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- TypeScript – Used for type-safe implementation

## Code Explanation

The example creates a SciChartSurface with X and Y axes, then generates three band series with sinusoidal data. Key components include:

1. **Band Series Creation**:
   - Three `FastBandRenderableSeries` are created with different vertical offsets
   - Each uses `XyyDataSeries` for upper/lower band boundaries
   - Series are styled with different colors and opacity

2. **Annotations**:
   - `NativeTextAnnotation` labels (1., 2., 3.) are positioned relative to each band
   - A main text annotation explains the rendering order concept
   - A `BoxAnnotation` provides background for the main text

3. **Dynamic Rendering Order**:
   - An animation cycles through render orders (0.5 to 4.0)
   - The `changeOrder` function allows toggling series rendering order
   - Annotations use `renderLayer: EDefaultRenderLayer.SeriesLayer` to appear between series

4. **Interactivity**:
   - Standard modifiers (ZoomExtents, ZoomPan, MouseWheelZoom) are included
   - The example demonstrates how to control rendering order programmatically

## Customization

Key customization aspects in this example:

1. **Render Layer Control**:
   - The example explicitly sets `renderLayer` on annotations to `EDefaultRenderLayer.SeriesLayer`
   - This allows annotations to render between series rather than above/below all series

2. **Render Order Animation**:
   - A `GenericAnimation` dynamically updates the `renderOrder` property
   - The animation smoothly transitions between different render orders
   - The text annotation updates to display the current render order value

3. **Relative Positioning**:
   - Annotations use `xCoordinateMode: ECoordinateMode.Relative` for responsive positioning
   - The `renderNextTo` property ensures labels stay aligned with their respective series

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