# Next.js Scichart Demo

Shows how to use SciChart.js in a Next.js project with TypeScript.

This example demonstrates a basic setup from scratch for SciChart.

---

There are also important points to consider:

- SciChart.JS is a client side library (requires browser Web APIs to run), thus the initialization and configuration code should be executed on the client;
- A chart initialization is an async operation and should be handled accordingly;
- SciChart related resources may require an explicit cleanup depending on use case. [Memory Best Practices](https://www.scichart.com/documentation/js/v5/2d-charts/performance-tips/memory-best-practices/);
- As of v6 the Builder API is lean by default: it only knows the types you have registered. This
  example names its types as enums (`ESeriesType.LineSeries`), so it calls `registerAllTypes()`
  once at module scope. Without it you get an error naming the type that was not registered;
- NextJS has the `React.StrictMode` enabled by default in dev mode. There many different scenarios where this may cause unexpected effects such as double chart initialization. As a result you might experience performance degradation, memory leaks, invalid object references, and more.

To simplify dealing with the mentioned pitfalls we have created [the official React Wrapper for SciChart](https://www.npmjs.com/package/scichart-react), which is referenced in an alternative approach above.
Also see [SciChart.React introduction blog post](https://www.scichart.com/blog/react-charts-with-scichart-js/)

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Wasm file deployment

SciChart.js has Wasm (webAssembly) files which must be deployed to output folders for correct operation of our Js chart library. (There is no separate Data file — since v4 it is embedded in the wasm.)

So we must make sure they are copied to the [./public](./public) folder.
For this we use the `copyWasm` script (see copy-files-from-to.json) to move every wasm file scichart
ships - `scichart.wasm`, `scichart-64.wasm`, `scichart-nosimd.wasm` and their `-charting3d`
counterparts - since the runtime picks whichever the browser can run.

Then we can specify the URL where to fetch those files via `SciChartSurface.configure`. As of v6 a
single wasm binary covers both 2D and 3D charts, and the nosimd / 64-bit variants are derived from
this url, so one entry is enough.

**The recommended basic setup is:**

```typescript
SciChartSurface.configure({
  wasmUrl: "/scichart.wasm",
});
```

It is more predictable and will fetch the files served from the `public` folder as expected.

Find more info at [Deploying Wasm Docs](https://www.scichart.com/documentation/js/v5/2d-charts/surface/deploying-wasm/)

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Run production build

```
npm run build
npm start
```

## SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
- [SciChart.js Documentation](https://www.scichart.com/javascript-chart-documentation): user manual, tutorials, API documentation
- [Official scichart.js demos](https://scichart.com/demo/): view our demos online! Full github source code also available at [github.com/ABTSoftware/SciChart.JS.Examples](https://github.com/ABTSoftware/SciChart.JS.Examples)
