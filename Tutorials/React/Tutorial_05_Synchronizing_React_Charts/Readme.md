# SciChart.js React Dynamic Charts Demo

This example demonstrates how to dynamically add and remove synchronized charts using SciChart.js with React. The demo shows how to use the SciChartGroup component to synchronize multiple charts and manage them dynamically through UI controls.

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Step 1: Adding SciChart to your React Application

If you haven't already done so, add SciChart.js to your react application.
Additionally, we recommend using the official [React wrapper for SciChart](https://www.npmjs.com/package/scichart-react)

```javascript
npm install scichart scichart-react
```

## Step 2: Webpack Configuration

SciChart.js uses WebAssembly files which must be served. The webpack configuration needs to handle both CSS files and WASM files:

```javascript
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.jsx",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "" },
        { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
        { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
        { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
        { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
      ],
    }),
  ],
};
```

## Step 3: Core Components Architecture

The application consists of several key components working together to create synchronized, dynamic charts:

### App.jsx - React Component Management

The main App component orchestrates the chart creation and synchronization:

- Uses React useState to manage charts array and AxisSynchronizer state
- Provides UI controls for adding/removing charts
- Wraps charts in SciChartGroup for coordination
- Handles chart lifecycle with onInit/onDelete callbacks
- Manages data fetching and axis synchronization

```javascript
const [charts, setCharts] = useState([0, 1]); // Initialize with 2 charts
const [axisSynchronizer, setAxisSynchronizer] = useState(
  new AxisSynchroniser()
);
```

### initChart.js - Chart Configuration

Creates and configures individual chart instances:

- Initializes SciChartSurface with styling and borders
- Configures NumericAxis for X and Y axes
- Adds interactive modifiers:
  - ZoomPanModifier for drag operations
  - MouseWheelZoomModifier for zoom
  - ZoomExtentsModifier for reset
  - RolloverModifier for tooltips
- Provides setData function for updating chart data with animations

### AxisSynchronizer.js - Chart Coordination

Manages synchronized behavior between charts:

- Maintains collection of axes to synchronize
- Handles visibleRangeChanged events
- Propagates range changes across charts
- Provides methods for adding/removing axes as charts change

## Step 4: Data Flow and Chart Lifecycle

### Data Simulation Layer

The application simulates real-world data fetching:

- RandomWalkGenerator creates time-series data
- DataManager wraps generator with Promise-based API
- Simulates network delay with setTimeout
- Caches generators and data by chart ID

### Chart Lifecycle Management

Charts are managed through React component lifecycle:

```javascript
<SciChartReact
  key={chartId}
  initChart={(div) => initChart(div, chartId, "chartGroupId")}
  onInit={(initResult) => {
    // Fetch and set data
    dataManager.fetchData(chartId).then((data) => {
      initResult.setData(data.xValues, data.yValues);
    });
    // Register with axis synchronizer
    axisSynchronizer.addAxis(initResult.sciChartSurface.xAxes.get(0));
  }}
  onDelete={(initResult) => {
    // Cleanup axis synchronization
    axisSynchronizer.removeAxis(initResult.sciChartSurface.xAxes.get(0));
  }}
/>
```

This architecture ensures:

- Proper initialization of charts with simulated data
- Synchronized zooming and panning across charts
- Clean cleanup when charts are removed
- Smooth animations when data changes

# Running the example

```
npm install
npm start
```

# Learn More

For more information about SciChart.js features and capabilities:

- [SciChart.js Documentation](https://www.scichart.com/documentation/js/current/webframe.html)
- [Official Examples](https://demo.scichart.com)
- [GitHub Examples Repository](https://github.com/abtsoftware/scichart.js.examples)
