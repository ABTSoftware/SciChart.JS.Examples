# Next.js Scichart Demo

Shows how to use SciChart.js in a Next.js project with TypeScript

## Trial licensing

Ensure you have followed steps from our [getting-started](https://www.scichart.com/getting-started-scichart-js) guide to get a trial!

## Wasm file deployment

SciChart.js has a Wasm (webAssembly) and Data file which must be deployed to output folders for correct operation of our Js chart library.

Next.js requires \*.data file to be in /public and wasm file to be in the build output .next/static/chunks/pages

To do this, we use next.config.js and webpack to copy the wasm file

```
// next.config.js
webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    const destWasmFolder = "static/chunks/pages";
    config.plugins.push(new CopyPlugin({
        patterns: [
            { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: destWasmFolder },
        ]
    }),)

    // Important: return the modified config
    return config
}
```

Also the npm package copy-files-from-to (see copy-foiles-from-to.json) to move scichart2d.data

If building 3D Charts ensure that 3D wasm files and 3D Data are also copied to the output directory.

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
