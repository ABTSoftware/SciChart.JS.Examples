# Next.js Scichart Demo

Shows how to use SciChart.js in a Next.js project with TypeScript.

This example demonstrates a basic setup from scratch for SciChart, however there are alternative examples and approaches:

- [Using SciChart.React (recommended)](https://github.com/ABTSoftware/scichart-react/tree/main/demos/scichart-react-next)
- [Old demo with WASM files serve location customization](Sandbox/demo-nextjs)

---

There are also important points to consider:

- SciChart.JS is a client side library (requires browser Web APIs to run), thus the initialization and configuration code should be executed on the client;
- A chart initialization is an async operation and should be handled accordingly;
- SciChart related resources may require an explicit cleanup depending on use case. [Memory Best Practices](https://www.scichart.com/documentation/js/current/webframe.html#MemoryBestPractices.html);
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
For this we use the `copyWasm` script which executes the npm package copy-files-from-to (see copy-files-from-to.json) to move `scichart2d.wasm` and `scichart3d.wasm`.

Then we can specify the URLs where to fetch those files via `SciChartSurface.configure` and `SciChart3DSurface.configure`.

The default configuration is equivalent to following:

```typescript
SciChartSurface.configure({
  wasmUrl: undefined,
});

SciChart3DSurface.configure({
  wasmUrl: undefined,
});
```

And it can result in some relative path resolution complexities, so you will need to make sure the request URLs match the location it they are hosted from.

**On the other hand, the recommended basic setup is:**

```typescript
SciChartSurface.configure({
  wasmUrl: "/scichart2d.wasm",
});

SciChart3DSurface.configure({
  wasmUrl: "/scichart3d.wasm",
});
```

It is more predictable and will fetch the files served from the `public` folder as expected.

Find more info at [Deploying Wasm Docs](https://www.scichart.com/documentation/js/current/Deploying%20Wasm%20or%20WebAssembly%20and%20Data%20Files%20with%20your%20app.html)

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

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
- [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
- [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
- [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
