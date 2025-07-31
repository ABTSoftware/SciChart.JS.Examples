# Polar Uniform Heatmap Ultrasound Chart

## Overview

This example demonstrates how to create a **JavaScript Polar Ultrasound Heatmap** in SciChart.js, by taking a 2D array of data points as hex values between **00** and **FF**, and displaying them in a polar heatmap. The chart visualizes fetal ultrasound data at 31 weeks in a polar coordinate system with intensity values mapped to a color gradient.

## Technologies Used

- SciChart.js – High performance WebGL charting library
- Polar coordinate system – For sector-based ultrasound visualization
- Heatmap rendering – Using PolarUniformHeatmapRenderableSeries
- CSV data parsing – Loading hexadecimal intensity values from a file

## Code Explanation

The example centers around the `drawExample` function which creates a polar surface with specialized configuration:

1. **Polar Surface Setup**:
   - Uses `SciChartPolarSurface.create()` to initialize the chart with a medical-themed title
   - Configures a 60-degree sector view (Math.PI/3) starting at 240 degrees

2. **Axes Configuration**:
   - Angular axis (`PolarNumericAxis`) with `EPolarAxisMode.Angular` for degree-based measurements
   - Radial axis (`PolarNumericAxis`) with `EPolarAxisMode.Radial` for distance measurements
   - Custom start angles and inner radius settings for medical imaging requirements

3. **Heatmap Data**:
   - Loads data from CSV via `parseCSV()` which converts hexadecimal values (00-FF) to decimal
   - Uses `UniformHeatmapDataSeries` with `PolarUniformHeatmapRenderableSeries` for efficient rendering
   - Applies a transparent-to-white `HeatmapColorMap` gradient for ultrasound visualization

4. **Medical Annotations**:
   - Adds `LineArrowAnnotation` for marking head diameter and femur length measurements
   - Configures white arrows with adjustable positions for anatomical reference

5. **Interactivity**:
   - Includes polar-specific modifiers: `PolarMouseWheelZoomModifier`, `PolarZoomExtentsModifier`, and `PolarPanModifier`

## Customization

Key medical imaging-specific customizations include:

1. **Sector Limitation**:
   - The chart displays only a 60-degree sector (Math.PI/3) via `totalAngle` property
   - Start angle is precisely calculated to begin at 240 degrees: `(Math.PI * 3 / 2) - (Math.PI / 6)`

2. **Data Parsing**:
   - Custom `parseCSV()` function handles hexadecimal values (00-FF) from the ultrasound data file
   - Converts hex to decimal values using `parseInt(value, 16)`

3. **Medical Annotations**:
   - Precisely positioned `LineArrowAnnotation` elements with medical measurement coordinates
   - Configurable arrow styles including `headWidth` and `headLength` for clear anatomical marking

4. **Visual Styling**:
   - Heatmap opacity set to 0.8 for semi-transparent overlay effect
   - Radial axis uses `innerRadius: 0.4` to create a donut-style visualization area

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

For framework-specific implementations (React, Angular), refer to the corresponding component files in the repository. The example demonstrates integration patterns for each framework while maintaining the core ultrasound visualization functionality.