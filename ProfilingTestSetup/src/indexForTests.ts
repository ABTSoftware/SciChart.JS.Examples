import { TCollectedMetrics, TTestOptions, NetworkResourceMetrics } from "./types";
import { getChartInitializer } from "./chart-creation";
import "./global-chart-configs";

function getNetworkMetrics(): NetworkResourceMetrics {
    const metrics: NetworkResourceMetrics = {
        wasmLoadStart: 0,
        wasmLoadEnd: 0,
        wasmLoadDuration: 0,
        bundleLoadStart: 0,
        bundleLoadEnd: 0,
        bundleLoadDuration: 0
    };

    // Get performance entries for network resources
    const entries = performance.getEntriesByType("resource");

    entries.forEach(entry => {
        const resourceTiming = entry as PerformanceResourceTiming;
        const name = entry.name.toLowerCase();
        const duration = resourceTiming.responseEnd - resourceTiming.startTime;

        // Measure WASM load time
        if (name.includes(".wasm")) {
            if (duration > metrics.wasmLoadDuration) {
                metrics.wasmLoadStart = resourceTiming.startTime;
                metrics.wasmLoadEnd = resourceTiming.responseEnd;
                metrics.wasmLoadDuration = duration;
            }
        }

        // Measure bundle load time (JS files)
        if (name.includes(".js") && !name.includes("node_modules")) {
            if (duration > metrics.bundleLoadDuration) {
                metrics.bundleLoadStart = resourceTiming.startTime;
                metrics.bundleLoadEnd = resourceTiming.responseEnd;
                metrics.bundleLoadDuration = duration;
            }
        }
    });

    return metrics;
}

async function initExample(options: TTestOptions) {
    const initExampleStart = performance.now();
    const chartInitializer = getChartInitializer(options);

    const controls = chartInitializer.getControls();

    await chartInitializer.createChart();

    await controls.toggleAnimate();

    // TODO consider enabling if cleanup required
    // controls.cleanup();

    const memoryData = await chartInitializer.outputMemoryUsageLogs();
    const performanceData = await chartInitializer.outputPerformanceData();
    const initializationPerformanceData =
        await chartInitializer.outputInitializationPerformanceData();

    const browserAnimationFrameData = chartInitializer.browserAnimationFrameData;

    const networkMetrics = getNetworkMetrics();

    const initExampleEnd = performance.now();
    const result: TCollectedMetrics = {
        initExampleStart,
        initExampleEnd,
        initializationPerformanceData,
        memoryData,
        performanceData,
        networkMetrics,
        browserAnimationFrameData
    };
    return result;
}

// @ts-ignore
window.initExample = initExample;
