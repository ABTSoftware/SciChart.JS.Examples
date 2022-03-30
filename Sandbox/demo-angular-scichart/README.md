# Angular SciChart.js Boilerplate App

Simple Angular Demo Application with SciChart library.

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
