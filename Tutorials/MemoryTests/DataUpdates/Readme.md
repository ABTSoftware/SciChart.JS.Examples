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

### Data Series update without initial capacity

First, we will test the case with a data series created without initial capacity.
So leave the inputs in the default state.
Force garbage collection and make a heap snapshot with dev tools.
Press "Create Chart" to initialize a surface.
Force garbage collection and make a heap snapshot again.
The difference in the heap size would consist of SciChart-related objects. Note that a part of the space is allocated for the WASM heap. WASM heap in its turn can also have allocated and free segments.

Press "Append data" to add data points to the chart.
If the WASM heap doesn't have enough space to store the added points, it will grow causing the total memory usage to increase.

Press make a memory snapshot again. You are likely to see the mentioned heap size increase.

Repeat the append and snapshot steps to see memory increasing again.

### Data Series update with initial capacity

Now, open the page in a new tab let's try the same with "Set initial capacity" checked.
After appending new points twice the memory should remain the same as before initialization since we already preallocated the space for it.
Also, notice the total memory footprint which should be smaller than in the previous example.

---

Experiment with different params
