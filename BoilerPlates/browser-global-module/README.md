# SciChart.js as a Browser Global Module

## How to run project

Please note to use scichart.js you need to have a server to serve html. Just opening a html file will produce an error "Access to XMLHttpRequest from origin 'null' has been blocked by CORS policy". This happens because to load data XMLHttpRequest is used.

To run the project, use:

- `npm install`
- `npm start`

![Annotations Demo](img/line-chart.png)

## How to add scichart.browser.js to your project

1. Add script pointing to a specific version into the **head** section of your html file. For instance to add version `5.0.0` add this script:

```html
<script
  src="https://cdn.jsdelivr.net/npm/scichart@5.0.0/_wasm/scichart.browser.js"
  crossorigin="anonymous"
></script>
```

2. Create a chart
3. Serve the html file to get this result

## SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
- [SciChart.js Documentation](www.scichart.com/javascript-chart-documentation): user manual, tutorials, API documentation
- [Official scichart.js demos](https://scichart.com/demo/): view our demos online! Full github source code also available at [github.com/ABTSoftware/SciChart.JS.Examples](https://github.com/ABTSoftware/SciChart.JS.Examples)
