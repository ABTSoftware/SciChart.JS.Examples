# Nuxt.js SciChart.js Boilerplate App

Simple Nuxt3 Demo Application with SciChart library.

## Trial licensing

Ensure you have followed steps from our [getting-started](https://www.scichart.com/getting-started-scichart-js) guide to get a trial!

## Wasm file deployment

SciChart.js has a Wasm (webAssembly) and Data file which must be deployed to output folders for correct operation of our Js chart library.

Nuxt requires *.data file and .wasm file to be in output folder /public/*

To do this, we use npm package copy-files-from-to and copy-files-from-to.json with this config

```
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
      "to": "./public/scichart2d.wasm"
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
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

