import { MemoryUsageHelper, SciChartSurface } from "scichart";

// windows.gc could be enabled with special flag in chromium
console.log("window.gc support =", !!window.gc);
// @ts-ignore This feature should be supported in Chromium
console.log("performance.memory support =", !!performance.memory);

export const logMemory = () => {
    window.gc && window.gc();

    MemoryUsageHelper.objectRegistry?.log();
};

export const logPerformance = () => {
    const allPerformanceMarks = performance.getEntriesByType("mark");
    console.log(allPerformanceMarks);
};
