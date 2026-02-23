import { TCollectedPerformanceData, TCollectedInitializationPerformanceData } from "../src/types";

export interface SurfacePerformanceMetrics {
    averageRenderDuration: number;
    totalRenders: number;
    minRenderDuration: number;
    maxRenderDuration: number;
    averageDataGenerationDuration: number;
    averageDataUpdateDuration: number;
    averageRenderToWebGlDuration: number;
    averageCopyToCanvasDuration: number;
    averageFPS: number;
    totalDataUpdates: number;
}

export interface InitializationMetrics {
    engineInitDuration: number;
    surfaceInitDuration: number;
    dataGenerationDuration: number;
    dataUpdateDuration: number;
    renderDuration: number;
    webGlRenderDuration: number;
    copyToCanvasDuration: number;
    totalInitDuration: number;
}

export interface AverageRenderDurations {
    [surfaceId: string]: SurfacePerformanceMetrics;
}

export function parseInitializationData(
    initData: TCollectedInitializationPerformanceData[]
): Map<string, InitializationMetrics> {
    const result = new Map<string, InitializationMetrics>();

    initData.forEach(data => {
        const {
            id,
            engineInitializationStart,
            engineInitializationEnd,
            surfaceInitializationStart,
            surfaceInitializationEnd,
            dataGenerationStart,
            dataGenerationEnd,
            dataUpdateStart,
            dataUpdateEnd,
            renderStart,
            renderToWebGlEnd,
            renderEnd,
            paintEnd
        } = data;

        const metrics: InitializationMetrics = {
            engineInitDuration: engineInitializationEnd - engineInitializationStart,
            surfaceInitDuration: surfaceInitializationEnd - surfaceInitializationStart,
            dataGenerationDuration: dataGenerationEnd - dataGenerationStart,
            dataUpdateDuration: dataUpdateEnd - dataUpdateStart,
            renderDuration: renderEnd - renderStart,
            webGlRenderDuration: renderToWebGlEnd - renderStart,
            copyToCanvasDuration: renderEnd - renderToWebGlEnd,
            totalInitDuration: paintEnd - engineInitializationStart
        };

        result.set(id, metrics);
    });

    return result;
}

export function parsePerformanceData(
    performanceData: TCollectedPerformanceData[]
): AverageRenderDurations {
    const result: AverageRenderDurations = {};

    performanceData.forEach(data => {
        const {
            id,
            dataGenerationStart,
            dataUpdateStart,
            dataUpdateEnd,
            preRenderStart,
            renderToWebGl,
            renderEnd,
            framePainted
        } = data;

        // Calculate various durations for each frame
        const renderDurations: number[] = [];
        const dataGenerationDurations: number[] = [];
        const dataUpdateDurations: number[] = [];
        const renderToWebGlDurations: number[] = [];
        const copyToCanvasDurations: number[] = [];
        const frameIntervals: number[] = [];

        const minLength = Math.min(
            preRenderStart.length,
            renderEnd.length,
            dataGenerationStart.length,
            dataUpdateStart.length,
            dataUpdateEnd.length,
            renderToWebGl.length
        );

        for (let i = 0; i < minLength; i++) {
            // Render duration: from preRenderStart to renderEnd
            renderDurations.push(renderEnd[i] - preRenderStart[i]);

            // Data generation duration: from dataGenerationStart to dataUpdateStart
            dataGenerationDurations.push(dataUpdateStart[i] - dataGenerationStart[i]);

            // Data update duration: from dataUpdateStart to dataUpdateEnd
            dataUpdateDurations.push(dataUpdateEnd[i] - dataUpdateStart[i]);

            // Render to WebGL duration: from preRenderStart to renderToWebGl
            renderToWebGlDurations.push(renderToWebGl[i] - preRenderStart[i]);

            // Copy to Canvas duration: from renderToWebGl to renderEnd
            copyToCanvasDurations.push(renderEnd[i] - renderToWebGl[i]);

            // Frame intervals for FPS calculation (time between frame painted events)
            if (i > 0 && framePainted.length > i) {
                frameIntervals.push(framePainted[i] - framePainted[i - 1]);
            }
        }

        if (renderDurations.length > 0) {
            const calculateAverage = (arr: number[]) =>
                arr.length > 0 ? arr.reduce((sum, val) => sum + val, 0) / arr.length : 0;

            // Calculate average FPS from frame intervals
            const avgFrameInterval = calculateAverage(frameIntervals);
            const averageFPS = avgFrameInterval > 0 ? 1000 / avgFrameInterval : 0;

            result[id] = {
                averageRenderDuration: calculateAverage(renderDurations),
                totalRenders: renderDurations.length,
                minRenderDuration: Math.min(...renderDurations),
                maxRenderDuration: Math.max(...renderDurations),
                averageDataGenerationDuration: calculateAverage(dataGenerationDurations),
                averageDataUpdateDuration: calculateAverage(dataUpdateDurations),
                averageRenderToWebGlDuration: calculateAverage(renderToWebGlDurations),
                averageCopyToCanvasDuration: calculateAverage(copyToCanvasDurations),
                averageFPS: averageFPS,
                totalDataUpdates: dataUpdateDurations.length
            };
        }
    });

    return result;
}
