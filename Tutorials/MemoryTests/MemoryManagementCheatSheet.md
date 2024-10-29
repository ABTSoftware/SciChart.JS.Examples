# Memory Management Cheat Sheet

There are documentation pages that we recommend to get familiarized with:  
https://www.scichart.com/documentation/js/current/webframe.html#MemoryBestPractices.html  
https://www.scichart.com/documentation/js/current/webframe.html#DataSeries_DeletingMemory.html

In addition, the following sections repeat or expand the topics of the other documentation pages.
Also, they mention and demonstrate some important and useful tips to be aware of.

## Chart cleanup

### Surface Initialization with Shared and Individual WASM Context

2D and 3D charts created with SciChart use an engine loaded as a WASM module, which we usually reference as `wasmContext`.
There are 2 types of WASM module usage in the charts:

- using a shared `wasmContext` for multiple chart surfaces of the same type (2D or 3D); could be referred to as "multi-chart"
- using a separate `wasmContext` per chart surface; a.k.a. "createSingle-chart"

There are also a couple of methods that can be used to initialize a surface of each type:

- A "multi-chart" can be initialized with `SciChartSurface.create` (or `SciChart3DSurface.create` for 3D);  
  and via the Builder API.
- While "single-chart", correspondingly, is initialized with `SciChartSurface.createSingle` (or `SciChart3DSurface.createSingle` for 3D);  
  and via the Builder API with the `createSingle` option.

### Surface Elements and WASM Context disposal

### Deleting a surface

To dispose of a chart and allow the memory it uses to be freed call the delete method on the surface instance.  
Additionally, you can pass a boolean flag to specify if the internal HTML elements should also be destroyed.

```typescript
sciChartSurface.delete(true);
```

Upon deletion, a `createSingle` chart also destroys the bound `wasmContext`.

A `multi` chart, on the other hand, won't destroy the context by default.  
This behaviour allows us to avoid context recreation.  
However, it is configurable via the **autoDisposeWasmContext** property that disposes of a `shared wasmContext` after all of the multi-charts bound to it are deleted.

```typescript
// for 2D charts
SciChartSurface.autoDisposeWasmContext = true;
// for 3D charts
SciChart3DSurface.autoDisposeWasmContext = true;
```

The **wasmContextDisposeTimeout** property allows one to add a wait time before deleting a wasmContext to check if any new surfaces were instantiated.

```typescript
// for 2D charts
SciChartSurface.wasmContextDisposeTimeout = 1000; // value in milliseconds
// for 3D charts
SciChart3DSurface.wasmContextDisposeTimeout = 1000; // value in milliseconds
```

Also, the `shared wasmContext` could be deleted manually with **disposeSharedWasmContext**.

```typescript
// delete 2D chart context
SciChartSurface.disposeSharedWasmContext();
// delete 3D chart context
SciChart3DSurface.disposeSharedWasmContext();
```

After the surface and context are destroyed, it is up to the Garbage Collector to clean up the memory.  
(refer to "WASM Memory. Deleting vs Releasing Releasing Memory back to the OS" section)  
For testing purposes, the garbage collection could be forced as described [here](#try-forcing-the-garbage-collection).

A surface when deleted will also delete all of the related **attached** entities such as Renderable Series, Modifiers, Annotations, Providers, etc...  
The detached ones should be deleted manually.

### WASM Memory. Deleting vs Releasing Releasing Memory back to the OS

An important behaviour to understand is that for the memory to be freed the deleted objects should be disposed of by Garbage Collector.

Along with the engine, SciChart creates other internal structures within the `wasmContext`.  
The browser provides a required chunk of memory to accommodate the `wasmContext` heap, but the heap doesn't support shrinking.  
So the WASM memory allocated for some of the chart-related entities would be freed only when the whole wasmContext is disposed.

---

Side note.  
Some objects still could be collected without being explicitly deleted, this could lead to a memory leak.  
Refer to the [Memory Debugging docs](https://www.scichart.com/documentation/js/current/webframe.html#MemoryLeakDebugging.html) and "collectedNotDeleted" objects in the memory debug log output.

---

### Deleting renderable and disposable entities (Series, Annotations, Modifiers, Providers, Axes, SubCharts)

There is a common pitfall when trying to remove entities from a chart.
It is important to understand the difference between detaching items and deleting them.
For example:

```typescript
// removes the series from the surface
sciChartSurface.renderableSeries.clear();

// removes the series from the surface and deletes the series
sciChartSurface.renderableSeries.clear(true);

// Or remove and delete the series individually
sciChartSurface.renderableSeries.asArray().forEach((rs) => {
  rs.delete();
});

sciChartSurface.renderableSeries.clear();
```

Notice, deleting the Renderable Series also deletes the attached Data Series.
The same principle applies to other collections on a surface.

Most importantly, note the behaviour on Data Series:

```typescript
// empty the data stored in vectors (xValues, yValues, etc.) and set the size to 0;
// keeps the reserved capacity and allows to reuse the dataSeries
dataSeries.clear();

// release the memory and makes the dataSeries unusable
dataSeries.delete();
```

### Surface deletion Deletables List

SciChart allows to subscribe arbitrary objects that implement an IDeletable interface (have a "delete" method) to be deleted along with the surface.

```typescript
sciChartSurface.addDeletable({
  delete: () => stopAnimation(),
});
```

## Memory fragmentation

According to the info provided above and in the previous sections, there arises a problem of _Memory Fragmentation_.  
While the `wasmContext` heap may have free chunks of memory, creating new entities that couldn't fit into the chunks will cause the heap to grow.

The easiest way to hit this problem is to append points to Data Series causing the underlying vectors to resize via reallocation.
See the Data Series Management section for approaches to deal with the issue.

## Data Series Management

There are some techniques to enhance the memory footprint along with the performance of series rendering.

### Data Series Capacity

To avoid redundant reallocation when appending data to Data Series, the **capacity** property could be set when appropriate.

```typescript
// create Data Series with initial capacity of 100000 elements
const dataSeries = new XyDataSeries(wasmContext, { capacity: 100000 });
```

### Realtime Updates and FIFO

Find at https://www.scichart.com/documentation/js/current/webframe.html#DataSeries_RealtimeUpdates.html

### Reusing Data Series

A single Data Series instance could be used by multiple Renderable Series simultaneously.  
For example, we apply this trick for the `SciChartOverview`.

### Creating a pool of Data Series

As you create a Data Series instance once, it may be more efficient to reuse it rather than create a new one.  
So, in a situation where one needs to remove some renderable Series from the chart and add some other renderable Series,  
it might be better to keep the original `dataSeries` instance by detaching them from the parent renderable series, replacing the values, and attaching them to the new renderable series.
Or even keeping the original renderable series and just updating the necessary properties.

## Caching

By default SciChart caches axis labels.
This could be toggled per axis via the **useCache** property on the label provider

```typescript
xAxis.labelProvider.useCache = false;
yAxis.labelProvider.useCache = false;
```

## Debugging Memory usage and leaks

The dev tools provided by browsers are pretty useful for debugging memory leaks,  
however, it may be often unclear what is the origin of the residual objects.  
Sometimes, it even could be the browser's internal constructs.

So to identify the bottleneck of an issue one needs to identify an area that requires analysis.  
Sometimes it could be limitations of a tool such as SciChart, sometimes it could be an incorrect usage of a tool or other issues with the application logic.
If having suspicions of a possible memory leak in SciChart.JS implementation,
as an initial investigation step you can use our internal util provided with the library.  
We have an example of [SciChart-related memory debugging process](https://www.scichart.com/documentation/js/current/webframe.html#MemoryLeakDebugging.html)

Below are a few more important tips for proper debugging.

### IDs of deletable objects

Make sure to provide some custom readable and unique IDs to the chart elements (surfaces, axes, renderable series, data series, annotations, modifiers, etc...),  
as those may be used for naming entries in Memory Debug output.

### Try forcing the garbage collection.

The time when the garbage collector disposes of the object is not deterministic,  
so the uncollected objects list may be not empty even after all of the chart-related things were properly deleted.

So to test that there are no hanging references that may cause memory leaks we can force the collection using the browser dev tools.

In Firefox navigate to `about:memory` and use buttons in the `Free memory` section.

In Chromium-based browsers open the `Memory` tab in dev-tools where you'll find an appropriate `Collect Garbage` button.  
Or use the `window.gc()` API by running the Chromium with `--js-flags=--expose-gc`

Sometimes, reloading the page may leave some residual entities on the tab.
Ideally, perform testing in a freshly opened tab with incognito mode.

### Dev tools may cause memory leaks.

Also note that opened dev-tools could affect the garbage collection, and prevent some references from being collected.  
This is probably due to some buggy behaviour or other internal browser logic.

### Performance efficiency effect on garbage collection

High-performance load off a webpage may affect the garbage collection by blocking the runtime with multiple intensive tasks.  
Thus it is important to be aware of potential bottlenecks while executing JS code.  
Some situations we have faced so far included nonoptimal JS array usage.  
Dev tools and Memory Debug Mode could cause some performance overhead as well.

More info on the subject can be found with the _Major and Minor GC_ topic query.

Check out SciChart-related [performance tips](./PerformanceCheatSheet.md)

## Cleanup in framework based components

There are different examples of component implementation for some frameworks.  
The main thing is to call the init and cleanup from the appropriate lifecycle methods,
and ensure that the init async operation is handled properly.

https://github.com/ABTSoftware/SciChart.JS.Examples/tree/master/BoilerPlates  
https://www.npmjs.com/package/scichart-angular  
https://www.npmjs.com/package/scichart-react

Extra hint: The `scichart-react` package also provides the `SciChartMemoryDebugWrapper` component that enables Memory Debug Mode.  
Currently, it only adds a checkbox to toggle the conditional rendering of its children and a button to log the Memory Debug state.

```tsx
<SciChartMemoryDebugWrapper>
  <App />
</SciChartMemoryDebugWrapper>
```
