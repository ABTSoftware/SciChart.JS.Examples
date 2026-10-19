# SciChart.js Demo Application Source

This folder contains the source for the demo app for SciChart.js, viewable online at [demo.scichart.com](https://demo.scichart.com).

[![SciChart.js Demo - JavaScript Chart library](https://www.scichart.com/wp-content/uploads/2022/12/scichart-js-demo-home-scaled.jpg)](https://demo.scichart.com)

## Compiling & Running

1. Clone the repository to your PC or Mac
2. `cd examples` and `npm install`
3. to run the application `npm run dev`
4. Open https://localhost:8080 to see the demo!

_**Note:** This will run the application in development mode._

## Licensing the SciChart.js demo app

Since version 3.2 SciChart.js runs by default with a FREE Community License. No need to sign up, start a trial, or enter a license key. This is for non-commercial use, and limited time commercial evaluation. For all the details on community licensing, including who can use it, features and restrictions, check out the [community licensing](https://www.scichart.com/community-licensing/) page.

If you are a paid customer with an activated license, just make sure the SciChart Licensing Wizard is running, and SciChart.js will automatically pick up and use your development license. For more details on how to activate see [scichart.com/licensing-scichart-js](https://www.scichart.com/licensing-scichart-js/).

To purchase a full commercial license, visit [store.scichart.com](https://store.scichart.com) or [contact sales](mailto://sales@scichart.com).

## Running in production mode (client & Server)

Some of the demos require client & server to be running. To run the demo app in prod mode:

1. Clone the repository to your PC or Mac
2. `cd examples` and `npm install`
3. compile the application `npm run build`
4. now run the application `npm start`
5. Now open https://localhost:3000/demo to see the demo! Note that in production mode the app runs with a base path of /demo

## Standalone example projects and styles

The source viewer, StackBlitz and CodeSandbox use the same project generator. React and JavaScript projects include a Vite entry point, HTML, TypeScript configuration and an import-derived `package.json`; Angular projects include their CLI configuration. Shared helpers are copied beside the example with relative imports, without exposing application folder paths.

`npm run build` generates readable, example-specific CSS after copying the server sources. Each registered example gets `build/Examples/<example>/.sandbox-styles/react/styles.css`, with separate `javascript` and `angular` variants when those entries exist. Generation scans the entry and its imported helpers, keeps the shared UI rules and CSS variables they use, and merges CSS files from the example directory and imported components. Exported projects contain one `src/styles.css`, imported by the React/JavaScript entry or referenced by `angular.json`; original example files are left intact.

Development does not write generated stylesheets. Before the first production build, the source API can preview the shared CSS plus local styles; run `npm run build` to refresh the trimmed exports after source or CSS changes.

Run `npm run checkSandboxExports` to verify every available framework's imports, stylesheet and dependency manifest. Downloaded projects run with `npm install`, `npm run start` and `npm run build`. SciChart WASM, hosted image assets and demos using remote datasets or websocket services require an internet connection.

With the production server running, `node scripts/checkSsrSource.cjs http://localhost:3000` verifies source HTML before hydration, trailing-slash/query URL variants, and the StackBlitz/CodeSandbox payloads without creating hosted projects.

## Adding a new example to the demo app

We've prepared a readme for how to add a new example/demo to the demo app.

Find this at [../Readme-AddNewExample.md](../README-AddNewExample.md)

## Reporting issues or requesting demos/features

If you find an issue in SciChart, please report it. You can do that either here under Issues, or at [scichart.com/contact-us](https://scichart.com/contact-us).
