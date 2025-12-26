# Nuxt.js SciChart.js Boilerplate App

Simple Nuxt3 Demo Application with SciChart library.

## Licensing

SciChart.js is commercial software with a [free community license](https://scichart.com/community-licensing).

- From SciChart.js v3.2 and onwards, trial licenses are not required. Instead the chart initialises with a [Community License](https://scichart.com/community-licensing)
- For commercial licensing, follow steps from [scichart.com/licensing-scichart-js](https://scichart.com/licensing-scichart-js).

## Wasm file deployment

SciChart.js has a Wasm (webAssembly) file which must be deployed to output folders for correct operation of our Js chart library.

Nuxt requires .wasm file to be in output folder /public/\_

To do this, we use npm package copy-files-from-to and copy-files-from-to.json with this config

```
{
  "copyFilesSettings": {
    "whenFileExists": "overwrite"
  },
  "copyFiles": [
    {
      "from": "./node_modules/scichart/_wasm/scichart2d.wasm",
      "to": "./public/scichart2d.wasm"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart2d-nosimd.wasm",
      "to": "./public/scichart2d.wasm"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart3d.wasm",
      "to": "./public/scichart3d.wasm"
    },
    {
      "from": "./node_modules/scichart/_wasm/scichart3d-nosimd.wasm",
      "to": "./public/scichart3d.wasm"
    }
  ]
}
```

This is executed when building. See package.json scripts:

```
  "scripts": {
    "copyWasm": "copy-files-from-to --config copy-files-from-to.json",
    "build": "npm run copyWasm && nuxt build",
    "dev": "npm run copyWasm && nuxt dev"
  },
```

# Nuxt 3 Minimal Starter

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview

# bun
bun run preview
```

## SciChart.js Tutorials and Getting Started

We have a wealth of information on our site showing how to get started with SciChart.js!

Take a look at:

- [Getting-Started with SciChart.js](https://www.scichart.com/getting-started-scichart-js): includes trial licensing, first steps and more
- [SciChart.js Documentation](www.scichart.com/javascript-chart-documentation): user manual, tutorials, API documentation
- [Official scichart.js demos](https://scichart.com/demo/): view our demos online! Full github source code also available at [github.com/ABTSoftware/SciChart.JS.Examples](https://github.com/ABTSoftware/SciChart.JS.Examples)
