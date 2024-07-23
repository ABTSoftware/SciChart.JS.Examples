# SciChart.js Chart Initialization and Cleanup Test

This example demonstrates how data manipulations affects memory consumption.

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

For a demonstration of the example setup and memory usage behaviour follow these steps:

### FIFO Data Series memory footprint observation example

First of all, get acknowledged with the documentation on [FIFO Data Series]()

Let's try the standard setup of this demo, leave the inputs in the default state.
Force garbage collection and make a heap snapshot with dev tools.
Press "Create Chart" to initialize a surface.
Force garbage collection and make a heap snapshot again.
The difference in the heap size would consist of SciChart-related objects. Note that a part of the space is allocated for the WASM heap. WASM heap in its turn can also have allocated and free segments.

Press "Append data" to manually add data points to the chart,
or press "Toggle Dynamic Update" to enable/disable periodical auto update.

After an arbitrary number of updates happened (and dynamic updates are paused),  
press make a memory snapshot again.  
The expected result is no memory usage footprint increase.

---

Experiment with different params.
Notice that they should be set before a chart is initialized.
