import {
    expect,
    PlaywrightTestArgs,
    PlaywrightTestOptions,
    PlaywrightWorkerArgs,
    PlaywrightWorkerOptions
} from "@playwright/test";
import {
    EUpdateIntervalBaseline,
    TCollectedMetrics,
    TSetupOptions,
    TTestOptions
} from "../src/types";
import { test } from "./fixtures";
import { ESeriesType } from "scichart";
import { EInitializerType } from "../src/InitializerTypes";

// TODO this a draft test example

test("get started link", async ({
    page
}: PlaywrightTestArgs &
    PlaywrightTestOptions & {
        forEachTest: void;
    } & PlaywrightWorkerArgs &
    PlaywrightWorkerOptions) => {
    const testInfo = test.info();

    const args: TTestOptions = {
        shouldUseCreateSingle: true,
        updateInterval: 16,
        dataSeriesCapacity: 10000,
        dataChunkSize: 1000,
        seriesNumber: 1,
        subChartsNumber: 0,
        drawLabels: false,
        seriesType: ESeriesType.LineSeries,
        maxRunDuration: 3000 * 1,
        initializerType: EInitializerType.Default,
        enableMemoryTracing: true,
        enableRenderTracing: true,
        enableConsoleOutput: false,
        surfacesNumber: 1,
        updatesNumber: 10,
        syncDataUpdateWithFrameRate: true,
        intervalBaseline: EUpdateIntervalBaseline.PaintEnd
    };

    const evaluationResult = await page.evaluate<TCollectedMetrics, TTestOptions>(
        (params: TTestOptions) => {
            // @ts-ignore
            return window.initExample(params);
        },
        args
    );

    // console.log("evaluationResult", evaluationResult);

    // const initialMemoryLogEntry = evaluationResult.memoryData[0];
    // const initialUsedMemory = initialMemoryLogEntry.usedJSHeapSize;

    // const finalMemoryLogEntry = evaluationResult.memoryData[evaluationResult.memoryData.length - 1];
    // const finalUsedMemory = finalMemoryLogEntry.usedJSHeapSize;

    // console.log("memoryData", evaluationResult.memoryData)
    // console.log("initialUsedMemory", initialUsedMemory)
    // console.log("finalUsedMemory", finalUsedMemory)

    // expect(finalUsedMemory / initialUsedMemory > 1.2).toBeTruthy;

    // Attach evaluation result as JSON
    await testInfo.attach("evaluation-result", {
        body: JSON.stringify(evaluationResult, null, 2),
        contentType: "application/json"
    });

    // await page.waitForTimeout(1000);

    // const title = testInfo.title;
    // const snapshotName = title.split(" ").join("-").toLowerCase();
    // await page.pdf({ path: "./report.pdf", printBackground: true, scale: 1, preferCSSPageSize: true, width: 1280, height: 720 });
    // await page.screenshot({ path: `./${snapshotName}-screenshot.png` });

    // await page.waitForTimeout(1000 * 1000);

    // await expect(page).toHaveScreenshot("page.png");
});
