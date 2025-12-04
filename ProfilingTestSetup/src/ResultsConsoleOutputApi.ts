import { ChartInitializer } from "./ChartInitializer";
import { bytesToMB } from "./helpers";
import { TCollectedPerformanceData } from "./types";

export class ResultsConsoleOutputApi extends ChartInitializer {
    public override outputMemoryUsageLogs(): any {
        console.group(`Memory Usage Logs`);
        this.memoryUsageLogs.forEach(log => {
            const { timestamp, name, usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit, HEAPF64 } =
                log;

            console.group(`Memory State at: ${name}`);

            console.log("usedJSHeapSize", bytesToMB(usedJSHeapSize));
            console.log("totalJSHeapSize", bytesToMB(totalJSHeapSize));
            console.log("jsHeapSizeLimit", bytesToMB(jsHeapSizeLimit));

            console.log("HEAPF64", bytesToMB(HEAPF64));
            console.groupEnd();
        });
        console.groupEnd();
    }

    public override outputPerformanceData(): any {
        console.groupCollapsed("Collected Performance Data");

        this.collectedPerformanceData.forEach(entry => {
            this.outputPerformanceDataForSurface(entry);
        });

        console.groupEnd();
    }

    protected override outputPerformanceDataForSurface(params: TCollectedPerformanceData) {
        const {
            id,
            dataGenerationStart,
            dataUpdateStart,
            dataUpdateEnd,
            preRenderStart,
            renderToWebGl,
            renderEnd,
            framePainted
        } = params;
        if (
            dataGenerationStart.length !== dataUpdateEnd.length ||
            dataUpdateStart.length !== dataUpdateEnd.length
        ) {
            throw new Error("Wrong data!");
        }

        if (preRenderStart.length !== renderEnd.length) {
            throw new Error(`Missing data!`);
        }

        if (renderEnd.length !== framePainted.length) {
            throw new Error(`Missing paint data! ${renderEnd.length} !== ${framePainted.length}`);
        }

        const dataUpdateEntries = dataUpdateStart.map((start, index) => {
            const generationStart = dataGenerationStart[index];
            const end = dataUpdateEnd[index];

            const generationDuration = start - generationStart;
            const updateDuration = end - start;
            const totalDuration = updateDuration + generationDuration;

            return {
                start: generationStart,
                end,
                generationDuration,
                updateDuration,
                duration: totalDuration
            };
        });

        const renderEntries = preRenderStart.map((start, index) => {
            const end = renderEnd[index];
            const duration = end - start;
            // const paint = framePainted[index];
            // const paintDuration = paint - end;
            // const totalDuration = renderDuration + paintDuration;
            return { start, end, duration };
        });

        const timeBetweenPaints = framePainted.map((current, index, collection) => {
            if (index === 0) {
                return NaN;
            }

            const prev = collection[index - 1];
            return current - prev;
        });
        timeBetweenPaints.unshift();

        const avgDataGenerationDuration =
            dataUpdateEntries.reduce((acc, value) => acc + value.generationDuration, 0) /
            dataUpdateEntries.length;
        const avgDataUpdateDuration =
            dataUpdateEntries.reduce((acc, value) => acc + value.updateDuration, 0) /
            dataUpdateEntries.length;
        const avgRenderDuration =
            renderEntries.reduce((acc, value) => acc + value.duration, 0) / renderEntries.length;
        const avgTimeBetweenPaints =
            timeBetweenPaints.reduce((acc, value) => acc + value, 0) / timeBetweenPaints.length;
        const avgFps = 1000 / avgTimeBetweenPaints;

        console.group(`Performance Results for Surface ${id}`);
        console.log("dataUpdateCounter", dataUpdateEntries.length);
        console.log("frames", renderEntries.length);
        console.log("avgDataGenerationDuration", avgDataGenerationDuration);
        console.log("avgDataUpdateDuration", avgDataUpdateDuration);
        console.log("avgRenderDuration", avgRenderDuration);
        console.log("averageFps", avgFps);

        console.groupCollapsed();
        console.table(dataUpdateEntries);
        console.table(renderEntries);
        console.table(timeBetweenPaints);
        console.groupEnd();

        console.groupEnd();
    }

    public outputInitializationPerformanceData(): any {
        console.groupCollapsed("Initialization Performance Data");
        this.initializationPerformanceData.forEach(entry => {
            console.groupCollapsed(`For surface ${entry.id}`);
            console.log(entry);
            console.groupEnd();
        });
        console.groupEnd();
    }
    public outputBrowserAnimationFrameData(): any {
        console.log(this.browserAnimationFrameData);
    }
}
