# SciChart.JS Addons

This package serves a container for a collection of useful logic that could be used alongside the core `scichart` library.
At the moment, the utils within it are experimental and are used for demonstration purposes.
This is also a work in progress. Let us know if you find it useful or need some guidance.

## Performance Measurement Modifier

**Related Links:**

- [Performance Cheat Sheet](../Tutorials/MemoryTests/PerformanceCheatSheet.md) - Comprehensive guide on performance optimization and debugging
- [perf-tools-demo](../perf-tools-demo) - Example application demonstrating the usage of Performance Measurement Modifier

**Description**

The `PerformanceMeasurementModifier` is a powerful tool for measuring and analyzing the performance of SciChart.JS applications. It provides a draggable control bar with various recording and export options, along with a settings dialog for configuration.

### Features

- **Real-time Performance Tracking**: Record performance metrics during chart rendering and interactions
- **Flexible Recording Modes**:
  - Single frame recording for one-time measurements
  - Continuous recording for extended performance analysis
- **Customizable Tracking**: Select which performance mark types to track
- **Data Export**: Export collected performance data in JSON format for further analysis
- **Visual Control Bar**: Draggable and resizable control bar with intuitive controls

### Usage

#### Usage from Examples App

1. Add a dependency into Examples/package.json
   `"scichart-addons": "../Addons",`
2. Run `npm i` in Addons
3. Run `npm i` in Examples
4. Then uncomment its usage at Examples/src/components/AppRouter/ChartControlWrapper.tsx:35

The modifier will be shown when opening a fullscreen version of an example.

```typescript
import { PerformanceMeasurementModifier } from "scichart-addons";
import { EPerformanceMarkType } from "scichart";

// Add the modifier to your chart
const performanceModifier = new PerformanceMeasurementModifier({
  // Optional: specify which marks to track from EPerformanceMarkType enum
  // By default, all available mark types are tracked
  trackedMarkTypes: Object.values(EPerformanceMarkType),
  autoInvalidate: false, // Optional: auto-invalidate chart during recording
  verbose: false, // Optional: enable verbose logging
});

sciChartSurface.chartModifiers.add(performanceModifier);
```

### Control Bar

The control bar appears as a draggable overlay on your chart with the following controls:

#### Action Buttons

- **Record Single Frame** (red circle): Records performance data for a single redraw request
- **Start/Stop Recording** (green play/stop): Toggles continuous performance recording
- **Invalidate** (refresh icon): Manually triggers a chart invalidation
- **Export All** (blue upload): Exports all collected performance data to JSON
- **Export Filtered** (green upload with checkmark): Exports filtered data for the current surface and selected mark types
- **Clear** (red trash): Clears all collected performance data
- **Settings** (gear icon): Opens the settings dialog

#### Settings Dialog

Click the settings button to open a dialog with configuration options:

- **Auto Invalidate**: Automatically invalidate the chart when recording starts
- **Verbose**: Enable detailed console logging during performance measurement
- **Tracked Mark Types**: Multi-select dropdown to choose which performance marks to track from the `EPerformanceMarkType` enum

### Using Collected Data with the Profiler

The performance data exported by this modifier can be analyzed using the SciChart Profiler tool:

1. **Record Performance Data**: Use the modifier to record performance metrics during your application's operation
2. **Export Data**: Click "Export All" or "Export Filtered" to download a JSON file containing the performance measurements
3. **Load in Profiler**: Import the JSON file into the SciChart Profiler for detailed visualization and analysis
4. **Analyze Results**: The Profiler will display timing information, identify bottlenecks, and help optimize your chart's performance

### Performance Mark Types

The modifier tracks performance marks defined in the `EPerformanceMarkType` enum from the SciChart library. The enum contains various mark types that represent different phases of chart rendering and interaction.

By default, all available mark types from the enum are tracked. You can customize which marks to track by passing specific enum values in the `trackedMarkTypes` array.

To see all available mark types, use:

```typescript
console.log(Object.values(EPerformanceMarkType));
```

### Custom Performance Marks

In addition to the built-in `EPerformanceMarkType` marks, you can track custom performance marks for application-specific operations. This is useful for measuring performance of your own code that interacts with SciChart.

#### Adding Custom Marks

Custom marks can be added using the `PerformanceDebugHelper.mark()` method. Marks should come in pairs (Start/End) with matching `relatedId`:

```typescript
import { PerformanceDebugHelper } from "scichart";

const appendData = () => {
  // Mark the start of a custom operation
  const startMark = PerformanceDebugHelper.mark("DataPrepareStart", {
    contextId: sciChartSurface.id,
  });

  // Your custom operation (e.g., data preparation)
  const xValues = generateXValues();
  const yValues = generateYValues();

  // Mark the end of the operation
  PerformanceDebugHelper.mark("DataPrepareEnd", {
    relatedId: startMark?.detail?.relatedId,
    contextId: sciChartSurface.id,
  });

  xyDataSeries.appendRange(xValues, yValues);
};
```

#### Tracking Custom Marks

To track your custom marks with the Performance Measurement Modifier, include the custom mark names (without "Start" or "End" suffix) in the `trackedMarkTypes` array:

```typescript
const performanceModifier = new PerformanceMeasurementModifier({
  trackedMarkTypes: [
    ...Object.values(EPerformanceMarkType), // Include all built-in marks
    "DataPrepare", // Add your custom mark type
    "CustomOperation", // Add more custom marks as needed
  ],
  autoInvalidate: false,
  verbose: false,
});
```

The modifier will automatically match your custom marks with their Start/End pairs and include them in the performance measurements and exports.

**Note:** Custom marks follow the same naming convention as built-in marks - use a descriptive name and append "Start" or "End" when calling `PerformanceDebugHelper.mark()`.

For more details on performance debugging and custom marks, see the [Performance Cheat Sheet](../../Tutorials/MemoryTests/PerformanceCheatSheet.md#custom-performance-checkpoints).

### Performance Overhead Warning

⚠️ **Important:** Using the Performance Measurement Modifier and the underlying `PerformanceDebugHelper` adds overhead to your application's execution and memory usage.

**Key Considerations:**

- **Development Use Only**: This tool is intended for development and debugging purposes only. Do not use it in production environments.
- **Execution Overhead**: Performance tracking adds computational overhead that can affect the measurements themselves. The recorded timings may not perfectly reflect production performance.
- **Memory Usage**: Storing performance marks and measures consumes memory. Long recording sessions or tracking many mark types can significantly increase memory usage.
- **Data Cleanup**: Remember to clear collected performance data regularly using the "Clear" button or by calling `PerformanceDebugHelper.clear()` to prevent memory buildup.
- **Browser Performance API**: The modifier uses the browser's [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API), which has its own overhead and limitations.

**Best Practices:**

- Use short recording sessions focused on specific operations
- Clear data between test runs
- Disable the modifier when not actively debugging performance
- Consider the overhead when interpreting results

For more information about performance debugging overhead, see the [Performance Cheat Sheet - Performance Debugging Overhead and Cleanup](../../Tutorials/MemoryTests/PerformanceCheatSheet.md#performance-debugging-overhead-and-cleanup).

### Tips

- Use **single frame recording** for quick performance checks
- Use **continuous recording** to capture performance over time or during specific user interactions
- **Filter tracked marks** to focus on specific aspects of performance
- **Export filtered data** to reduce file size and focus analysis on relevant metrics
- The control bar can be **dragged** to reposition it and **resized** by dragging the right edge
