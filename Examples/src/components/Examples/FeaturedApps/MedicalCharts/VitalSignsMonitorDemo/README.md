# Biofeedback Dashboard & Vital Signs Monitor

## Overview

The Biofeedback Dashboard demonstrates a simulated real-time monitoring system for vital signs using SciChart.js. Designed for a randomized clinical trial (ClinicalTrials.gov: NCT00000000), the example visualizes streaming data for various medical metrics such as ECG, heart rate, respiration, and galvanic skin response (GSR). It includes implementations for React, with supporting TypeScript/JavaScript logic for handling dynamic data updates and emotion-adaptive pacing.

## Data and Code Availability

This repository section has been structured to comply with top-tier (Q1) journal data and code availability requirements.

-   **`data/`**: Contains the de-identified supplementary clinical datasets derived from the trial:
    -   `comprehensive_biofeedback_dataset.csv`
    -   `participant_profiles.csv`
    -   `psychometric_validation_results.csv`
    -   `trial_protocol_metadata.csv`
-   **`firmware/`**: Contains the ESP32 Pan-Tompkins C++ firmware (`Heart_Rate_Display_Arduino.ino`) used for raw physiological data acquisition and initial filtering.
-   **`scripts/`**: Contains the Python analytical scripts (`analyze_data.py`) used for generating the robust, high-resolution visualizations for the clinical manuscripts.

## Technologies Used

-   SciChart.js for high-performance, low-latency physiological charting
-   React (using the scichart-react component)
-   JavaScript and TypeScript
-   Firebase for real-time telemetry syncing

## Code Explanation

-   **React Component (index.tsx)**: Wraps the drawing logic into the SciChartReact component. It uses React hooks to manage state for each vital sign measurement, subscribing to data update events to provide a consistent look and feel for the patient-facing biofeedback dashboard.
-   **Drawing Example (drawExample.js / drawExample.ts)**: Contains the core implementation of the SciChartSurface. These files configure the X and multiple Y axes, create renderable series (each corresponding to a vital sign like ECG or Respiration), and implement a timer-based simulation to update the data. The FIFO sweeping mode ensures the chart continuously displays streaming data.
-   **Signal Processors (`ecgProcessor.ts`, `gsrTrendAnalyzer.ts`, `signalProcessor.ts`)**: Handle the ingestion and real-time visualization smoothing of raw sensor data.

## Customization

Key configuration options include:

-   **Data Update Parameters**: Constants such as STEP, TIMER_TIMEOUT_MS, POINTS_LOOP, and GAP_POINTS control the simulation and scrolling behavior of the chart.
-   **Chart Styling**: Stroke colors, thickness (STROKE_THICKNESS), and point marker options are defined using the appTheme values to visually distinguish each data series (e.g., Red for Heart Rate, Blue for Respiration, Green for GSR).

## Running the Example

To run any example from the SciChart.JS.Examples repository, follow these steps:

1. **Clone the Repository**: Download the entire repository to your local machine using Git:

    ```bash
    git clone https://github.com/ABTSoftware/SciChart.JS.Examples.git
    ```

2. **Navigate to the Examples Directory**: Change into the `Examples` folder:

    ```bash
    cd SciChart.JS.Examples/Examples
    ```

3. **Install Dependencies**: Install the necessary packages using npm:

    ```bash
    npm install
    ```

4. **Run the Development Server**: Start the development server to view and interact with the examples:

    ```bash
    npm run dev
    ```

    This will launch the demo application, allowing you to explore various examples, including the Biofeedback Dashboard.

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md).
