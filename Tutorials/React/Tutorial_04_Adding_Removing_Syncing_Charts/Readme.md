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

## Step 3: Creating the Chart Initialization Function

The chart initialization function creates a simple chart with X and Y axes:

```javascript
const simpleChart = async (divElement, chartId) => {
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    divElement,
    {
      title: `Chart ${chartId}`,
      titleStyle: { fontSize: 16 },
      theme: new SciChartJsNavyTheme(),
    }
  );
  sciChartSurface.xAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "X Axis",
      axisTitleStyle: { fontSize: 12 },
    })
  );
  sciChartSurface.yAxes.add(
    new NumericAxis(wasmContext, {
      axisTitle: "Y Axis",
      axisTitleStyle: { fontSize: 12 },
    })
  );

  return { sciChartSurface };
};
```

## Step 4: Creating the Dynamic Charts React Component

The App component manages an array of charts and provides UI controls to add/remove charts:

```javascript
function App() {
  const [charts, setCharts] = useState([0, 1]); // Initialize with 2 charts

  const addChart = () => {
    setCharts([...charts, charts.length]);
  };

  const removeChart = () => {
    if (charts.length > 0) {
      setCharts(charts.slice(0, -1));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>&lt;SciChartReact/&gt; chart groups</h1>
      </header>
      <div
        style={{
          display: "flex",
          justifyContent: "left",
          backgroundColor: "lightgrey",
          padding: "10px",
        }}
      >
        <button onClick={addChart} style={{ margin: "0 10px" }}>
          Add Chart
        </button>
        <button onClick={removeChart} style={{ margin: "0 10px" }}>
          Remove Chart
        </button>
      </div>
      <div style={{ height: "600px" }}>
        <SciChartGroup>
          {charts.map((chartId) => (
            <SciChartReact
              key={chartId}
              initChart={(div) => simpleChart(div, chartId)}
              style={{ height: `${100 / charts.length}%` }}
            />
          ))}
        </SciChartGroup>
      </div>
    </div>
  );
}
```

The component uses:

- React useState to track the charts array
- SciChartGroup to synchronize all child charts
- Dynamic height calculation based on number of charts
- Add/Remove buttons to modify the charts array
- Each chart is initialized with the simpleChart function

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
