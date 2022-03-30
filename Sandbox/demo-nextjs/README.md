# Next.js Scichart Demo

Shows how to use SciChart.js in a Next.js project with TypeScript

## Wasm file deployment

SciChart.js has a Wasm (webAssembly) and Data file which must be deployed to output folders for correct operation of our Js chart library.

Next.js requires *.data file to be in /public and wasm file to be in the build output .next/static/chunks/pages

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
