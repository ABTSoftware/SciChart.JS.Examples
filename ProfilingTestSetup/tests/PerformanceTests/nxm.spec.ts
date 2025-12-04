import {
    EUpdateIntervalBaseline,
    TCollectedMetrics,
    TSetupOptions,
    TTestOptions
} from "../../src/types";
import { test } from "./fixtures";
import { ESeriesType } from "scichart";
import { EInitializerType } from "../../src/InitializerTypes";

const defaultArgs: Omit<TTestOptions, "seriesNumber" | "seriesType" | "dataSeriesCapacity"> = {
    shouldUseCreateSingle: false,
    dataChunkSize: 1000,
    subChartsNumber: 0,
    drawLabels: false,
    initializerType: EInitializerType.Default,
    enableMemoryTracing: false, // TODO SCJS-2292
    enableRenderTracing: true,
    maxRunDuration: 1000 * 3,
    updatesNumber: 10,
    syncDataUpdateWithFrameRate: true,
    updateInterval: undefined,
    intervalBaseline: EUpdateIntervalBaseline.PaintEnd
    // Variables in this test suite:
    // seriesType: ESeriesType.LineSeries,
    // seriesNumber: 1,
    // dataSeriesCapacity: 500,
};

const seriesTypesVariations = Object.values(ESeriesType).filter(
    t =>
        ![
            ESeriesType.UniformHeatmapSeries,
            ESeriesType.NonUniformHeatmapSeries,
            ESeriesType.UniformContoursSeries,
            ESeriesType.TriangleSeries,
            ESeriesType.BoxPlotSeries,
            ESeriesType.Custom
        ].includes(t) &&
        !t.startsWith("Polar") &&
        !t.includes("Stacked")
);

// const seriesTypesVariations = [
//     // ESeriesType.UniformHeatmapSeries,
//     // ESeriesType.NonUniformHeatmapSeries,
//     // ESeriesType.UniformContoursSeries,

//     ESeriesType.LineSegmentSeries,
//     ESeriesType.RectangleSeries,
//     ESeriesType.TriangleSeries,
//     ESeriesType.TextSeries,
//     ESeriesType.BubbleSeries,
//     ESeriesType.ErrorBarsSeries

//     // ESeriesType.BoxPlotSeries,
// ];

const dataPointsNumberVariations = [
    100, 500, 1000
    // 2000, 4000, 20000
];
const seriesNumberVariations = [
    1, 100
    //  500,
    //  1000
];

seriesTypesVariations.forEach(seriesType => {
    const argsForTestCases: TTestOptions[] = dataPointsNumberVariations.flatMap(
        dataSeriesCapacity =>
            seriesNumberVariations.flatMap(seriesNumber => {
                return {
                    ...defaultArgs,
                    dataSeriesCapacity,
                    seriesNumber,
                    seriesType
                };
            })
    );

    test.describe(seriesType, () => {
        argsForTestCases.forEach(args => {
            const testTitle = `${args.seriesNumber}x${args.dataSeriesCapacity}`;
            test(testTitle, async ({ page, pageLoadMetrics }) => {
                const testInfo = test.info();

                const evaluationStart = performance.now();
                const evaluationResult = await page.evaluate<TCollectedMetrics, TTestOptions>(
                    (params: TTestOptions) => {
                        // @ts-ignore
                        return window.initExample(params);
                    },
                    args
                );
                const evaluationEnd = performance.now();
                const evaluationDuration = evaluationEnd - evaluationStart;

                // Attach evaluation result as JSON
                await testInfo.attach("evaluation-result", {
                    body: JSON.stringify(
                        {
                            ...evaluationResult,
                            evaluationDuration,
                            pageLoadDuration: pageLoadMetrics.pageLoadDuration,
                            domReadyDuration: pageLoadMetrics.domReadyDuration
                        },
                        null,
                        2
                    ),
                    contentType: "application/json"
                });
            });
        });
    });
});
