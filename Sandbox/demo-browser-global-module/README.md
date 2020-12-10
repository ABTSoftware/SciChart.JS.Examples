# SciChart.js as a Browser Global Module Boilerplate App

Please note to use scichart.js you need to have a server to serve html. Just opening a html file will produce an error "Access to XMLHttpRequest from origin 'null' has been blocked by CORS policy". This happens because to load data XMLHttpRequest is used.

## How to run project

* `npm install`
* `npm start`

## How to add scichart.browser.js to your project

1. Add script pointing to a specific version into the **head** section of your html file. For instance to add version 1.0.1331 add this script:
```html
<script src="https://cdn.jsdelivr.net/npm/scichart@1.0.1331/_wasm/scichart.browser.js" crossorigin="anonymous"></script>
```
2. Download data files for this specific version for 2D (and for 3D if you use 3D charts) and put them into html root folder on your web server. For example to download data files for version 1.0.1331 use these links
   - `https://cdn.jsdelivr.net/npm/scichart@1.0.1331/_wasm/scichart2d.data`
   - `https://cdn.jsdelivr.net/npm/scichart@1.0.1331/_wasm/scichart3d.data`
3. Create a chart
