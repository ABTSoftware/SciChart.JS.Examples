import {
    SciChartSurface,
    SciChart3DSurface,
    MemoryUsageHelper,
    PerformanceDebugHelper,
    SciChartDefaults,
    ESeriesType
} from "scichart";
import { wrapCreation, getChartInitializer } from "./chart-creation";
import { logMemory, logPerformance } from "./perfUtils";
import { SubChartsInitializer } from "./custom/SubChartsInitializer";
import { GraphSummaryInitializer } from "./custom/GraphSummaryInitializer";
import { EInitializerType } from "./InitializerTypes";
import { EUpdateIntervalBaseline, TSetupOptions } from "./types";
import { ChartInitializer } from "./ChartInitializer";

const getDataForProfiler = () => {
    const performanceInfoData = [PerformanceDebugHelper.toJSON()];

    // Download the data as a JSON file
    const dataStr = JSON.stringify({ performanceInfoData }, null, 2);
    console.log("Performance Debug Logs", performanceInfoData);

    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `profiler-data-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export function initializeControlBindings(options?: TSetupOptions) {
    let shouldUseCreateSingle = options?.shouldUseCreateSingle ?? false;
    let updateInterval = options?.updateInterval ?? 16;
    let dataSeriesCapacity = options?.dataSeriesCapacity ?? 500;
    let dataChunkSize = options?.dataChunkSize ?? 10;
    let seriesNumber = options?.seriesNumber ?? 20;
    let subChartsNumber = options?.subChartsNumber ?? 64;
    let drawLabels = options?.drawLabels ?? false;
    let seriesType = options?.seriesType ?? ESeriesType.LineSeries;
    let initializerType = options?.initializerType ?? EInitializerType.ConsoleOutput;
    let enableMemoryTracing = options?.enableMemoryTracing ?? true;
    let enableRenderTracing = options?.enableRenderTracing ?? true;

    let chartInitializer: ChartInitializer = undefined;
    let controls: ReturnType<(typeof chartInitializer)["getControls"]>;

    const createChartInitializer = () => {
        chartInitializer = getChartInitializer({
            initializerType,
            shouldUseCreateSingle,
            dataSeriesCapacity,
            dataChunkSize,
            seriesNumber,
            subChartsNumber,
            drawLabels,
            seriesType,
            enableMemoryTracing,
            enableRenderTracing,
            updatesNumber: 10,
            syncDataUpdateWithFrameRate: true,
            updateInterval: undefined,
            intervalBaseline: EUpdateIntervalBaseline.PaintEnd,
            maxRunDuration: undefined
        });
        controls = chartInitializer.getControls();
    };

    // Initialize Series Type Select
    const seriesTypeSelect = document.getElementById("seriesTypeSelect") as HTMLSelectElement;
    const seriesTypeValues = Object.values(ESeriesType).filter(
        value => typeof value === "string"
    ) as string[];

    seriesTypeValues.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        seriesTypeSelect.appendChild(option);
    });

    // Set default value
    seriesTypeSelect.value = seriesType;

    // Handle change event
    seriesTypeSelect.onchange = function (ev: Event) {
        seriesType = (ev.target as HTMLSelectElement).value as ESeriesType;
        console.log("Series type changed to:", seriesType);

        createChartInitializer();
    };

    // Initialize Initializer Type Select
    const initializerTypeSelect = document.getElementById(
        "initializerTypeSelect"
    ) as HTMLSelectElement;
    const initializerTypeValues = Object.values(EInitializerType);

    initializerTypeValues.forEach(type => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        initializerTypeSelect.appendChild(option);
    });

    // Set default value
    initializerTypeSelect.value = initializerType;

    // Handle change event
    initializerTypeSelect.onchange = function (ev: Event) {
        initializerType = (ev.target as HTMLSelectElement).value as EInitializerType;

        // Show/hide SubCharts slider based on initializer type
        const subChartsContainer = document.getElementById("subChartsContainer") as HTMLElement;
        if (initializerType === EInitializerType.SubChart) {
            subChartsContainer.style.display = "block";
        } else {
            subChartsContainer.style.display = "none";
        }

        if (initializerType === EInitializerType.SubChart) {
            subChartsContainer.style.display = "block";
        } else {
            subChartsContainer.style.display = "none";
        }

        createChartInitializer();
    };

    (document.querySelector("#create1") as HTMLInputElement).onclick = () =>
        wrapCreation(() => chartInitializer.createChart());

    (document.querySelector("#append") as HTMLInputElement).onclick = () => {
        controls.appendData();
    };

    (document.querySelector("#remove") as HTMLInputElement).onclick = () => {
        controls.removeData();
    };
    (document.querySelector("#animate") as HTMLInputElement).onclick = () => {
        controls.toggleAnimate();
    };

    (document.querySelector("#logMemoryDebug") as HTMLInputElement).onclick = () => {
        logMemory();
        controls.outputMemoryUsageLogs();
    };
    (document.querySelector("#logPerformanceDebug") as HTMLInputElement).onclick = () => {
        logPerformance();
        controls.outputPerformanceData();
    };

    (document.querySelector("#deleteSurfaces") as HTMLInputElement).onclick = () =>
        controls.cleanup();
    (document.querySelector("#deleteWasm") as HTMLInputElement).onclick = () => {
        SciChartSurface.disposeSharedWasmContext();
        SciChart3DSurface.disposeSharedWasmContext();
    };
    (document.querySelector("#initSharedWasm") as HTMLInputElement).onclick = () => {
        console.log("Init Shared Wasm clicked");
        controls.initWasmContext();
    };

    const memoryDebugCheckbox = document.querySelector<HTMLInputElement>("#memoryDebug");
    memoryDebugCheckbox.checked = MemoryUsageHelper.isMemoryUsageDebugEnabled;
    memoryDebugCheckbox.onclick = function (ev: MouseEvent) {
        MemoryUsageHelper.isMemoryUsageDebugEnabled = (ev.target as HTMLInputElement).checked;
        console.log("isMemoryUsageDebugEnabled =", MemoryUsageHelper.isMemoryUsageDebugEnabled);
    };
    (document.querySelector("#autoDispose") as HTMLInputElement).onclick = function (
        ev: MouseEvent
    ) {
        SciChartSurface.autoDisposeWasmContext = (ev.target as HTMLInputElement).checked;
        SciChart3DSurface.autoDisposeWasmContext = (ev.target as HTMLInputElement).checked;
        console.log("autoDisposeWasmContext =", SciChartSurface.autoDisposeWasmContext);
    };

    const performanceDebugCheckbox = document.querySelector(
        "#performanceDebug"
    ) as HTMLInputElement;
    performanceDebugCheckbox.checked = PerformanceDebugHelper.enableDebug;
    performanceDebugCheckbox.onclick = function (ev: MouseEvent) {
        PerformanceDebugHelper.enableDebug = (ev.target as HTMLInputElement).checked;
        console.log("PerformanceDebugHelper.enableDebug =", PerformanceDebugHelper.enableDebug);
    };
    (document.querySelector("#nativeText") as HTMLInputElement).onclick = function (
        ev: MouseEvent
    ) {
        SciChartDefaults.useNativeText = (ev.target as HTMLInputElement).checked;
        console.log("useNativeText =", SciChartDefaults.useNativeText);
    };

    const createSingleToggle = document.querySelector("#individualContext") as HTMLInputElement;
    createSingleToggle.checked = shouldUseCreateSingle;
    createSingleToggle.onclick = function (ev: MouseEvent) {
        shouldUseCreateSingle = (ev.target as HTMLInputElement).checked;
        console.log("createSingle =", shouldUseCreateSingle);
    };

    const intervalSelector = document.getElementById("intervalSelector") as HTMLInputElement;
    intervalSelector.value = `${updateInterval}`;
    const intervalLabel = document.getElementById("intervalLabel");
    intervalLabel.innerHTML = `${updateInterval}`;

    intervalSelector.onchange = function (ev: Event) {
        updateInterval = Number.parseInt((ev.target as HTMLInputElement).value, 10);
        intervalLabel.innerHTML = `${updateInterval}`;
        console.log("updateInterval =", updateInterval);
    };

    const capacitySelector = document.getElementById("capacitySelector") as HTMLInputElement;
    capacitySelector.value = `${dataSeriesCapacity}`;
    const capacityLabel = document.getElementById("capacityLabel");
    capacityLabel.innerHTML = `${dataSeriesCapacity}`;

    capacitySelector.onchange = function (ev: Event) {
        dataSeriesCapacity = Number.parseInt((ev.target as HTMLInputElement).value, 10);
        capacityLabel.innerHTML = `${dataSeriesCapacity}`;
        console.log("Capacity =", dataSeriesCapacity);
    };

    const chunkSizeSelector = document.getElementById("chunkSizeSelector") as HTMLInputElement;
    chunkSizeSelector.value = `${dataChunkSize}`;
    const chunkSizeLabel = document.getElementById("chunkSizeLabel");
    chunkSizeLabel.innerHTML = `${dataChunkSize}`;

    document.querySelector<HTMLInputElement>("#chunkSizeSelector").onchange = function (ev: Event) {
        dataChunkSize = Number.parseInt((ev.target as HTMLInputElement).value, 10);
        chunkSizeLabel.innerHTML = `${dataChunkSize}`;
        console.log("dataChunkSize =", dataChunkSize);
    };

    const seriesSelector = document.getElementById("seriesSelector") as HTMLInputElement;
    seriesSelector.value = `${seriesNumber}`;
    const seriesSelectorLabel = document.getElementById("seriesLabel");
    seriesSelectorLabel.innerHTML = `${seriesNumber}`;

    seriesSelector.onchange = function (ev: Event) {
        seriesNumber = Number.parseInt((ev.target as HTMLInputElement).value, 10);
        seriesSelectorLabel.innerHTML = `${seriesNumber}`;
        console.log("seriesNumber =", seriesNumber);
    };

    const subChartsSelector = document.getElementById("subChartsSelector") as HTMLInputElement;
    subChartsSelector.value = `${subChartsNumber}`;
    const subChartsSelectorLabel = document.getElementById("subChartsSelectorLabel");
    subChartsSelectorLabel.innerHTML = `${subChartsNumber}`;
    subChartsSelector.onchange = function (ev: Event) {
        subChartsNumber = Number.parseInt((ev.target as HTMLInputElement).value, 10);
        subChartsSelectorLabel.innerHTML = `${subChartsNumber}`;
        console.log("subChartsNumber =", subChartsNumber);
    };

    (document.querySelector("#profilerDataButton") as HTMLInputElement).onclick = function (
        ev: MouseEvent
    ) {
        console.log(ev);
        getDataForProfiler();
    };

    (document.querySelector("#addMemoryCheckpoint") as HTMLInputElement).onclick = function (
        ev: MouseEvent
    ) {
        controls.addMemoryUsageCheckpoint();
    };
}
