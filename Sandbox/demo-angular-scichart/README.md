# Angular SciChart.js Boilerplate App

Simple Angular Demo Application with SciChart library.

## Trial licensing

Ensure you have followed steps from our [getting-started](https://www.scichart.com/getting-started-scichart-js) guide to get a trial!

## Wasm file deployment

SciChart.js has a Wasm (webAssembly) and Data file which must be deployed to output folders for correct operation of our Js chart library.

Angular requires *.data file and wasm file to be in output folder /src/*

To do this, we use npm package copy-files-from-to and copy-files-from-to.json with this config

```
{
  "copyFilesSettings": {
    "whenFileExists": "overwrite"
  },
  "copyFiles": [
    {
      "from": "./node_modules/scichart/_wasm/scichart2d.data",
      "to": "./src/scichart2d.data"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart2d.wasm",
      "to": "./src/scichart2d.wasm"
    }
  ]
}
```

This is executed when building. See package.json scripts:

```
  "scripts": {
    "copyWasm": "copy-files-from-to --config copy-files-from-to.json",
    "start": "npm run copyWasm && ng serve",
    "build": "npm run copyWasm && ng build",
  },
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm start
```

### Compiles and minifies for production
```
npm run build
```

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

 * [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
 * [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
 * [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
 * [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)
