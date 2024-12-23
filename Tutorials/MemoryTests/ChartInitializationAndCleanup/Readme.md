# SciChart.js Chart Initialization and Cleanup Test

The purpose of this app is to serve as a testing boilerplate for charts to check for memory consumption and potential leaks.  
It allows to create surfaces of different types (2D and 3D) with different `wasmContext` ownership options:

- Single - a surface with a separate `wasmContext` ( initialized via `createSingle`)
- Multi - a surface with a shared `wasmContext` ( initialized via `createSingle`)

Also it allows to delete surfaces one by one or simultaneously.
There are also an option to delete shared `wasmContext` (both 2D and 3D) and test `autoDisposeWasmContext` options.

The app demonstrates a usage of internal memory and performance debug utils.  
The Memory Debug utils require the app to be run in development mode.

Before running the example get familiarized with related documentation:

[Memory Best Practices](https://www.scichart.com/documentation/js/current/webframe.html#MemoryBestPractices.html)  
[Memory Leak Debugging](https://www.scichart.com/documentation/js/current/webframe.html#MemoryLeakDebugging.html)

## Running the project

Setup:
`npm install`

Run in development mode:
`npm run dev`
Run in production mode:
`npm run build`
`npm start`

## How to use

We recommend testing this example both in a regular manner and by trying to force the garbage collection.
Also, perform testing on a freshly opened tab with incognito mode.

Prepare the browser dev tools to be able to force a garbage collection and taking a heap snapshot.

### Data Series update without initial capacity

Force garbage collection and make a heap snapshot with dev tools.
Press some "Create Chart" buttons to initialize surfaces.
Then use appropriate "Delete" buttons.
During the process consider making snapshots, logging debug output.

Experiment with different params
