# Next.js Scichart Demo

Shows how to use SciChart.js in a Next.js project with TypeScript.

This example demonstrates a basic setup from scratch for SciChart.

---

There are also important points to consider:

- SciChart.JS is a client side library (requires browser Web APIs to run), thus the initialization and configuration code should be executed on the client;
- A chart initialization is an async operation and should be handled accordingly;
- SciChart related resources may require an explicit cleanup depending on use case. [Memory Best Practices](https://www.scichart.com/documentation/js/v5/2d-charts/performance-tips/memory-best-practices/);
- NextJS has the `React.StrictMode` enabled by default in dev mode. There many different scenarios where this may cause unexpected effects such as double chart initialization. As a result you might experience performance degradation, memory leaks, invalid object references, and more.

To simplify dealing with the mentioned pitfalls we have created [the official React Wrapper for SciChart](https://www.npmjs.com/package/scichart-react), which is referenced in an alternative approach above.
Also see [SciChart.React introduction blog post](https://www.scichart.com/blog/react-charts-with-scichart-js/)

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Wasm file deployment

SciChart.js has a Wasm (webAssembly) and Data file which must be deployed to output folders for correct operation of our Js chart library.

So we must make sure they are copied to the [./public](./public) folder.
For this we use the `copyWasm` script which executes the npm package copy-files-from-to (see copy-files-from-to.json) to move `scichart.wasm` and `scichart-nosimd.wasm`. One binary serves both the 2D and the 3D engine.

Then we can specify the URLs where to fetch those files via `SciChartSurface.configure`.

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
- [SciChart.js Documentation](www.scichart.com/javascript-chart-documentation): user manual, tutorials, API documentation
- [Official scichart.js demos](https://scichart.com/demo/): view our demos online! Full github source code also available at [github.com/ABTSoftware/SciChart.JS.Examples](https://github.com/ABTSoftware/SciChart.JS.Examples)
