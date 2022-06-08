# vue-scichart-demo

Vue 3.0 project with TypeScript

## Trial licensing

Ensure you have followed steps from our [getting-started](https://www.scichart.com/getting-started-scichart-js) guide to get a trial!

## Wasm file deployment

SciChart.js has a Wasm (webAssembly) and Data file which must be deployed to output folders for correct operation of our Js chart library.

Vue.js requires *.data file to be in the /public output folder, and *.wasm files to be in the /public/js folder. This is done using the copy-files-to-from npm package:

```
 // copy-files-to-from.json
 {
  "copyFilesSettings": {
    "whenFileExists": "overwrite"
  },
  "copyFiles": [
    {
      "from": "./node_modules/scichart/_wasm/scichart2d.data",
      "to": "./public/scichart2d.data"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart2d.wasm",
      "to": "./public/js/scichart2d.wasm"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart3d.data",
      "to": "./public/scichart3d.data"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart3d.wasm",
      "to": "./public/js/scichart3d.wasm"
    }
  ]
}

 // package.json
 {
  // ...
  "scripts": {
    "copyWasm": "copy-files-from-to --config copy-files-from-to.json",
    "dev": "npm run copyWasm && vue-cli-service serve",
    "build": "npm run copyWasm && vue-cli-service build",
    // ... 
  },
  // ... 
  "devDependencies": {
    "copy-files-from-to": "^3.2.1",
  }
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
npm start
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

* [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
* [Javascript / npm tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2002%20-%20Adding%20Series%20and%20Data.html): using npm, webpack, and scichart.js, create static and dynamic charts with zooming, panning tooltips and more
* [Vanilla Javascript tutorials](https://www.scichart.com/documentation/js/current/Tutorial%2001%20-%20Including%20SciChart.js%20in%20an%20HTML%20Page.html): using only vanilla javascript and HTML,
* [Official scichart.js demos](https://demo.scichart.com): view our demos online! Full github source code also available at [github.com/abtsoftware/scichart.js.examples](https://github.com/abtsoftware/scichart.js.examples)

