# SciChart.js as a Browser Global Module

## How to run project

Please note to use scichart.js you need to have a server to serve html. Just opening a html file will produce an error "Access to XMLHttpRequest from origin 'null' has been blocked by CORS policy". This happens because to load data XMLHttpRequest is used.

To run the project, use:

- `npm install`
- `npm start`

![Annotations Demo](img/line-chart.png)

## How to add SciChart.js as a browser global to your project

1. Add a script pointing to a specific version into the **head** section of your html file. This is
   what [src/client/index.html](src/client/index.html) does — for version `6.0.0-alpha.196`:

```html
<script
  src="https://cdn.jsdelivr.net/npm/scichart@6.0.0-alpha.196/index.min.js"
  crossorigin="anonymous"
></script>
```

Either bundle works and both define the same `SciChart` global: `index.min.js`, or
`_glue/scichart.browser.js` (this moved from `_wasm/` to `_glue/` in v6).

2. Create a chart
3. Serve the html file to get this result

## SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
- [SciChart.js Documentation](https://www.scichart.com/javascript-chart-documentation): user manual, tutorials, API documentation
- [Official scichart.js demos](https://scichart.com/demo/): view our demos online! Full github source code also available at [github.com/ABTSoftware/SciChart.JS.Examples](https://github.com/ABTSoftware/SciChart.JS.Examples)
