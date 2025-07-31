# Polar Gauge FIFO Dashboard

## Overview

This example demonstrates how to create a **JavaScript Polar Gauge Fifo Dashboard** using SciChart.js, which displays Polar Gauge Charts for the current values, and a cartesian historical FIFO view. The implementation combines polar and cartesian charts in a single dashboard with real-time updates.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- Polar Charts – For gauge visualization
- FIFO (First-In-First-Out) Charts – For historical data streaming
- React/Angular/JavaScript – Framework-specific implementations available

## Code Explanation

The example is structured around two main chart types:

1. **Polar Gauge Charts**:
   - Created using `SciChartPolarSubSurface` with `PolarNumericAxis` configured in radial and angular modes
   - Visual elements include `PolarArcAnnotation` for gauge segments and `NativeTextAnnotation` for centered values
   - Dynamic color changes based on value thresholds (green/orange/pink)
   - Smooth needle animations using frame-by-frame updates

2. **FIFO Charts**:
   - Implemented with `SciChartSubSurface` and `FastLineRenderableSeries`
   - Uses `XyDataSeries` with `fifoCapacity` for efficient memory management
   - Features `DateTimeNumericAxis` for time-series data

Key functions include:
- `drawGaugeSubchart()`: Creates and manages polar gauge components
- `drawFifoSubchart()`: Handles FIFO chart initialization and updates
- `animateGaugeArc()`: Provides smooth transitions between values
- `updateGaugeValue()`: Optimized value updates with color threshold checks

## Customization

Notable customization points in this example:

1. **Gauge Configuration**:
   - `totalAngle` and `startAngle` properties control the gauge arc span (1.4π radians)
   - Color thresholds are defined in `gradientColors` and `columnYValues` arrays
   - Radial positioning uses `x1`/`x2` values (7-9.4 for background, 9.7-10 for segments)

2. **Performance Optimizations**:
   - Conditional rendering checks (`if (valueArc.y2 !== newVal)`)
   - FIFO buffer with 100-point capacity for memory efficiency
   - Frame-by-frame animation at ~60 FPS using `setTimeout`

3. **Layout Management**:
   - Relative positioning via `Rect` coordinates (0-1 range)
   - Transparent backgrounds for seamless integration
   - Responsive design through relative surface positioning

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

For framework-specific implementations (React/Angular), refer to the corresponding component files in the repository.