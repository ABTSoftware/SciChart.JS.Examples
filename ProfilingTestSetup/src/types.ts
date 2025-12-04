import { ESeriesType } from "scichart";
import { EInitializerType } from "./InitializerTypes";

export type TUpdateSetup = {
    /** Could synchronize with frame rate or do multiple updates per frame */
    syncDataUpdateWithFrameRate: boolean;
    /** Number of total data updates (not including initial) */
    updatesNumber: number | undefined;
    /**  Minimum interval between data updates */
    updateInterval: number | undefined;
    /**  Defines how to measure interval between updates */
    intervalBaseline: EUpdateIntervalBaseline;
    /** Max allowed time for updates (not including initial) */
    maxRunDuration: number;
};

export type TChartInitializerOptions = {
    shouldUseCreateSingle: boolean;
    dataSeriesCapacity: number;
    dataChunkSize: number;
    seriesNumber: number;
    subChartsNumber: number;
    drawLabels: boolean;
    seriesType: ESeriesType;
    enableMemoryTracing: boolean;
    enableRenderTracing: boolean;
} & TUpdateSetup;

export type TSetupOptions = TChartInitializerOptions & {
    initializerType: EInitializerType;
};

export enum EUpdateIntervalBaseline {
    PrevUpdateStart = "PrevUpdateStart",
    PaintEnd = "PaintEnd"
}

export type TTestOptions = TSetupOptions & {};

export type TInitializationPerformanceTimestamps = {
    engineInitializationStart: DOMHighResTimeStamp;
    engineInitializationEnd: DOMHighResTimeStamp;
    surfaceInitializationStart: DOMHighResTimeStamp;
    surfaceInitializationEnd: DOMHighResTimeStamp;
    dataGenerationStart: DOMHighResTimeStamp;
    dataGenerationEnd: DOMHighResTimeStamp;
    dataUpdateStart: DOMHighResTimeStamp;
    dataUpdateEnd: DOMHighResTimeStamp;
    renderStart: DOMHighResTimeStamp;
    renderToWebGlEnd: DOMHighResTimeStamp;
    renderEnd: DOMHighResTimeStamp;
    paintEnd: DOMHighResTimeStamp;
};

export type TPerformanceTimestamps = {
    dataGenerationStart: DOMHighResTimeStamp[];
    dataUpdateStart: DOMHighResTimeStamp[];
    dataUpdateEnd: DOMHighResTimeStamp[];
    preRenderStart: DOMHighResTimeStamp[];
    renderToWebGl: DOMHighResTimeStamp[];
    renderEnd: DOMHighResTimeStamp[];
    framePainted: DOMHighResTimeStamp[];
};

export type TBrowserAnimationFrameData = {
    animationFrameStartTimestamps: DOMHighResTimeStamp[];
    animationFrameEndTimestamps: DOMHighResTimeStamp[];
};

export type TCollectedPerformanceData = TPerformanceTimestamps & {
    id: string;
};

export type TCollectedInitializationPerformanceData = TInitializationPerformanceTimestamps & {
    id: string;
};

export type MemoryUsageLogEntry = {
    name: string;
    timestamp: DOMHighResTimeStamp;
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
    HEAPF64: number;
};

export type NetworkResourceMetrics = {
    wasmLoadStart: number;
    wasmLoadEnd: number;
    wasmLoadDuration: number;
    bundleLoadStart: number;
    bundleLoadEnd: number;
    bundleLoadDuration: number;
};

export type TCollectedMetrics = {
    initExampleStart: number;
    initExampleEnd: number;
    evaluationDuration?: number;
    pageLoadDuration?: number;
    domReadyDuration?: number;
    initializationPerformanceData: TCollectedInitializationPerformanceData[];
    performanceData: TCollectedPerformanceData[];
    memoryData: MemoryUsageLogEntry[];
    networkMetrics: NetworkResourceMetrics;
    browserAnimationFrameData: {
        animationFrameStartTimestamps: DOMHighResTimeStamp[];
        animationFrameEndTimestamps: DOMHighResTimeStamp[];
    };
};

type AsArray<T> = {
    [K in keyof T]: T[K][];
};

export type MemoryStatsData = AsArray<MemoryUsageLogEntry> & {};

export interface JsonTestResult {
    title: string;
    file: string;
    line: number;
    column: number;
    status: string;
    duration: number;
    error?: {
        message: string;
        stack?: string;
    };
    retries: number;
    startTime: string;
    attachments: Array<{
        name: string;
        path?: string;
        contentType: string;
        body?: any;
    }>;
}

export interface JsonSuiteResult {
    title: string;
    file?: string;
    tests: JsonTestResult[];
    suites: JsonSuiteResult[];
}

export interface JsonReport {
    config: {
        rootDir: string;
        workers: number;
        retries: number;
    };
    stats: {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        flaky: number;
        duration: number;
    };
    suites: JsonSuiteResult[];
    startTime: string;
    endTime?: string;
}
