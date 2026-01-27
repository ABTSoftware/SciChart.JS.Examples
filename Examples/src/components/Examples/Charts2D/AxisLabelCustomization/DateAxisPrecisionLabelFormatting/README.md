# Date Axis Precision Label Formatting

## Overview

This example demonstrates how to customize specific label formats on a High Precision Date Axis using external libraries like date-fns. It shows advanced customization of DateTimeNumericAxis for nanosecond precision while integrating standard date formatting libraries. [DateTimeNumericAxis Docs](https://www.scichart.com/documentation/js/current/DateTimeNumericAxis.html)

## Technologies Used

-   SciChart.js – High performance charting library
-   React – For React integration with SciChartReact wrapper
-   date-fns – For custom date formatting in wide and precise labels
-   TypeScript – Used throughout the implementation
-   Material-UI – For React toggle switch control

## Code Explanation

The core logic resides in the `drawExample` function which initializes a SciChartSurface with a DateTimeNumericAxis configured for nanosecond precision via `EDatePrecision.Nanoseconds` and `dateOffset`. It generates synthetic signal data across four clusters (damped ringing, frequency chirp, amplitude modulation, heartbeat) using nanosecond timestamps relative to a 2025 start date, rendered as a FastLineRenderableSeries with point markers. A SmartDateLabelProvider is customized by overriding `formatDateWide` and `formatDatePrecise` methods: wide labels use date-fns for contextual formatting (e.g., "MMM dd, yyyy HH:mm:ss"), while precise labels handle sub-second precision manually by calculating ticks within seconds for ns/µs/ms suffixes. The React component adds a toggle switch to swap between custom date-fns and SciChart defaults, invalidating the surface for live updates, with standard zoom modifiers and a NativeTextAnnotation for guidance. [SmartDateLabelProvider Docs](https://www.scichart.com/documentation/js/current/typedoc/classes/smartdatelabelprovider.html)

## Customization

The key customization handles the precision challenge where JavaScript Date limits to milliseconds but SciChart supports nanoseconds: `rawValue` in `formatDatePrecise` extracts sub-second offsets via `ticksWithinSecond / tps` (time per second), appending formatted ns/µs/ms to seconds (e.g., "03:12345ns"). The `toUTC` helper converts dates for internal UTC consistency, and `highPrecisionLabelMode: EHighPrecisionLabelMode.Suffix` enables suffix formatting. Toggle logic via `setUseDateFns` dynamically rebinds methods and refreshes labels at runtime, demonstrating runtime label provider updates uncommon in basic SciChart examples.

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

This will launch the demo application, allowing you to explore various examples, including the one in question.

For more detailed instructions, refer to the [SciChart.JS.Examples README](https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/README.md). [github](https://github.com/abtsoftware/scichart.js.examples)