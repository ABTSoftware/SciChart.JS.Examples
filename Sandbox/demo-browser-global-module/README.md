# SciChart.js as a Browser Global Module

Please note to use scichart.js you need to have a server to serve html. Just opening a html file will produce an error "Access to XMLHttpRequest from origin 'null' has been blocked by CORS policy". This happens because to load data XMLHttpRequest is used.

## How to run project

* `npm install`
* `npm start`

![Annotations Demo](img/line-chart.png)

## How to add scichart.browser.js to your project

1. Add script pointing to a specific version into the **head** section of your html file. For instance to add version `2.1.2261` add this script:
```html
<script src="https://cdn.jsdelivr.net/npm/scichart@2.1.2261/_wasm/scichart.browser.js" crossorigin="anonymous"></script>
```
2. Configure SciChartSurface to download .data and .wasm files from the CDN. Library versions in the script and in the configure method must be the same!
```typescript
SciChart.SciChartSurface.configure({
    dataUrl: "https://cdn.jsdelivr.net/npm/scichart@2.1.2261/_wasm/scichart2d.data",
    wasmUrl: "https://cdn.jsdelivr.net/npm/scichart@2.1.2261/_wasm/scichart2d.wasm"
});
```
3. Create a chart

4. Serve the html file to get this result

