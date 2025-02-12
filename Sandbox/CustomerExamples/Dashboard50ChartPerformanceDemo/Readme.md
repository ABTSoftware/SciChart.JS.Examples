# 100 Chart Draggable Dashboard Performance Demo in React/TypeScript

This application demonstrates the exceptional performance capabilities of SciChart.js by rendering 100 real-time, draggable charts simultaneously in a dynamic dashboard environment. Each chart displays live-updating data with configurable update rates, showcasing SciChart.js's ability to handle high-frequency data updates across multiple chart instances while maintaining smooth performance.

The dashboard implements various performance optimization features including WebGL text rendering, label caching, and intelligent chart freezing when out of viewport. Users can interactively toggle these features through the control panel, providing immediate visual feedback on their performance impact. The application utilizes React for component management, TypeScript for type safety, and WebGL-powered SciChart.js for high-performance rendering.

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

## Step 2: Wasm file deployment

SciChart.js uses WebAssembly files which must be served. The easiest way to do this is to copy the wasm files from the node_modules/scichart/\_wasm folder to your output folder.

e.g. with webpack.config.js:

```
 plugins: [
    new CopyPlugin({
      patterns: [
        { from: "src/index.html", to: "" },
        { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
        { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
        { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
        { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" },
      ],
    })
  ],
```

> Note: other methods to [load wasm from CDN](https://www.scichart.com/documentation/js/current/webframe.html#Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html) are available to simplify getting started

## Step 3: Key Implementation Features

### Performance Optimization Features

Charts can be configured with various performance settings through the ChartSpec interface:

```typescript
export interface ChartSpec extends Positionable {
  drawLabels: boolean; // Toggle axis labels
  useNativeText: boolean; // Use WebGL text rendering
  cacheLabels: boolean; // Enable label caching
  reduceAxisElements: boolean; // Reduce number of axis elements
  hideOutOfView: boolean; // Freeze charts when out of viewport
}
```

### Draggable Chart Panels

Each chart is wrapped in a DraggablePanel component that enables drag-and-drop functionality:

```typescript
export function DraggablePanel({
  children,
  positionable,
  width,
}: DraggablePanelProps) {
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newPosition = {
        left: e.clientX - dragOffset.x + window.scrollX,
        top: e.clientY - dragOffset.y + window.scrollY,
      };
      setPosition(newPosition);
      setIsDragged(true);
      positionable.position = newPosition;
    }
  };
}
```

### Chart Component Lifecycle

In `ChartPanel.tsx`, each chart is wrapped in a `<SciChartReact/>` component which manages component lifecycle and cleanup:

```typescript
export const ChartPanel: React.FC<ChartPanelProps> = ({ chartSpec, style }) => {
  // Key changes force re-creation when chart properties change
  const chartKey = `${chartSpec.drawLabels}-${chartSpec.useNativeText}-${chartSpec.reduceAxisElements}-${chartSpec.cacheLabels}`;

  return (
    <SciChartReact
      key={chartKey}
      initChart={async (rootElement) => initChart(rootElement, chartSpec)}
      onDelete={(initResult) => initResult.onDeleteChart()}
      style={style}
    />
  );
};
```

### Chart Initialization and Optimization

The `initChart` function configures each chart with performance optimizations:

```typescript
export const initChart = async (
  rootElement: string | HTMLDivElement,
  spec: ChartSpec
) => {
  // Apply optimization settings
  if (spec.reduceAxisElements) {
    SciChartDefaults.useNativeText = true;
    SciChartDefaults.useSharedCache = true;
  }

  const axisOptions = {
    useNativeText: spec.useNativeText, // WebGL text rendering
    useSharedCache: spec.cacheLabels, // Label caching
    drawMinorGridLines: !spec.reduceAxisElements, // Reduce elements in the axis
    maxAutoTicks: spec.reduceAxisElements ? 5 : undefined,
    drawLabels: spec.drawLabels, // Set if labels are drawn
  };
};
```

### Viewport Optimization

In `initChart.ts`, when `ChartSpec.hideOutOfView` is enabled, Charts use `IntersectionObserver` API to pause rendering when scrolled out of view:

```typescript
if (spec.hideOutOfView) {
  observeVisibility(sciChartSurface.domChartRoot, (isVisible) => {
    if (!isVisible && !sciChartSurface.isSuspended) {
      sciChartSurface.suspendUpdates();
    } else if (isVisible && sciChartSurface.isSuspended) {
      sciChartSurface.resume();
    }
  });
}
```

## Step 4: Performance Monitoring

The application includes real-time FPS monitoring to measure rendering performance:

```typescript
export const FpsControl: React.FC = () => {
  useEffect(() => {
    const calculateFps = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastUpdateTime >= 500) {
        const fps = (frameCount * 1000) / (currentTime - lastUpdateTime);
        setFps(fps);
      }
      requestAnimationFrame(calculateFps);
    };
  }, []);

  return <div>FPS: {fps.toFixed(2)}</div>;
};
```

# Running the example

```
npm install
npm start
```

We recommend trying out the various options to see the impact on performance in SciChart.js.

For 100 charts, when optimal settings are enabled, the browser will update at 60 FPS.

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes community licensing details, first steps and more
- [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
- [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
- [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
