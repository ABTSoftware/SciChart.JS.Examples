import {
    AxisBase2D,
    BaseDataSeries,
    EAutoRange,
    ENumericFormat,
    EventHandler,
    generateGuid,
    I2DSurfaceOptions,
    IBaseDataSeriesOptions,
    IDataSeries,
    INumericAxisOptions,
    NumericAxis,
    receiveNextEvent,
    SciChartSurface,
    SciChartSurfaceBase
} from "scichart";
import { ResultsConsoleOutputApi } from "./ResultsConsoleOutputApi";
import { EMemoryUsageLogEntryType } from "./MemoryTrackingApi";
import { createRenderableSeries, prePopulateData } from "./helpers";
import { TChartInitializerOptions } from "./types";

export class ChartInitializer extends ResultsConsoleOutputApi {
    protected counter = 0;

    protected chartGroupContainer: HTMLDivElement;

    protected controlsProperty = {
        getSurfaces: () => this.surfaces,
        initWasmContext: () => this.initWasmContext(),
        createChartGroup: () => this.createChartGroup(),
        createChart: () => this.createChart(),
        deleteChart: (surface: SciChartSurfaceBase) => this.removeChart(surface),
        appendData: () => this.appendData(),
        removeData: () => this.removeData(),
        toggleAnimate: () => this.toggleAnimate(),
        cleanup: () => this.cleanup(),
        outputMemoryUsageLogs: () => this.outputMemoryUsageLogs(),
        outputPerformanceData: () => this.outputPerformanceData(),
        addMemoryUsageCheckpoint: () =>
            this.addMemoryUsageCheckpoint(EMemoryUsageLogEntryType.OnDemand)
    };

    constructor(options: TChartInitializerOptions) {
        super();
        this.options = { ...options };
    }

    public getControls() {
        return this.controlsProperty;
    }

    protected async createChart() {
        // Options are not shared between charts
        const index = this.counter++;

        this.checkMemoryUsage(EMemoryUsageLogEntryType.BeforeSurfaceInit);

        const rootElement = this.createRootElement(index);

        const chart = await this.initChart(rootElement);

        this.checkMemoryUsage(EMemoryUsageLogEntryType.AfterSurfaceInit);

        return chart;
    }

    protected async createChartGroup() {
        // Check if a group already exists for this initializer
        if (this.chartGroupContainer) {
            throw new Error(
                "Chart group already exists for this initializer. Please cleanup() before creating a new group."
            );
        }

        const { surfacesNumber } = this.options;

        // Create a container for the group
        const groupContainer = document.createElement("div");
        groupContainer.id = `chart-group-${Date.now()}`;
        groupContainer.className = `chart-group`;

        // Create controls container
        const controlsContainer = document.createElement("div");
        controlsContainer.className = "chart-group-controls";

        // Add Chart button
        const addChartButton = document.createElement("button");
        addChartButton.innerHTML = "+ Add Chart";
        addChartButton.title = "Add another chart to this group";
        addChartButton.onclick = () => this.createChart();

        // Append Data button
        const appendButton = document.createElement("button");
        appendButton.innerHTML = "Append Data";
        appendButton.title = "Append data to all charts in this group";
        appendButton.onclick = () => this.appendData();

        // Remove Data button
        const removeButton = document.createElement("button");
        removeButton.innerHTML = "Remove Data";
        removeButton.title = "Remove data from all charts in this group";
        removeButton.onclick = () => this.removeData();

        // Toggle Update button
        const toggleButton = document.createElement("button");
        toggleButton.innerHTML = "Toggle Update";
        toggleButton.title = "Toggle dynamic update for this group";
        toggleButton.onclick = () => this.toggleAnimate();

        // Delete Group button
        const deleteButton = document.createElement("button");
        deleteButton.className = "danger";
        deleteButton.innerHTML = "✕ Delete Group";
        deleteButton.title = "Delete this chart group";
        deleteButton.onclick = () => this.cleanup();

        controlsContainer.appendChild(addChartButton);
        controlsContainer.appendChild(appendButton);
        controlsContainer.appendChild(removeButton);
        controlsContainer.appendChild(toggleButton);
        controlsContainer.appendChild(deleteButton);

        groupContainer.appendChild(controlsContainer);

        const parentNode = document.getElementById("containerId");
        parentNode.appendChild(groupContainer);
        this.chartGroupContainer = groupContainer;

        // Create multiple surfaces using the existing createChart method
        for (let i = 0; i < surfacesNumber; i++) {
            await this.createChart();
        }

        return { groupContainer };
    }

    protected createRootElement(index: number) {
        // Create wrapper div that will contain both the delete button and the chart
        const wrapperDiv = document.createElement("div");
        wrapperDiv.classList.add("chart");

        // Create the actual chart div (this is what SciChart will use)
        const chartDiv = document.createElement("div");
        chartDiv.id = `chart-${generateGuid()}`;
        chartDiv.style.width = "100%";
        chartDiv.style.height = "100%";

        // Create delete button for individual chart
        const deleteButton = document.createElement("button");
        deleteButton.className = "chart-delete";
        deleteButton.innerHTML = "✕";
        deleteButton.title = "Delete this chart";
        deleteButton.onclick = e => {
            e.stopPropagation();
            // Find the surface associated with this chart div
            const surface = this.surfaces.find(s => s.domChartRoot === chartDiv);
            if (surface) {
                this.removeChart(surface, wrapperDiv);
            }
        };

        wrapperDiv.appendChild(deleteButton);
        wrapperDiv.appendChild(chartDiv);

        const parentNode = this.chartGroupContainer;
        parentNode.appendChild(wrapperDiv);

        // Return the inner chart div (not the wrapper) for SciChart to use
        return chartDiv;
    }

    protected async initSurface(rootElement: HTMLDivElement | string) {
        const options: I2DSurfaceOptions = {
            id: this.generateSurfaceId(rootElement),
            createSuspended: true,
            loader: false,
            disableAspect: true
        };

        if (this.options.shouldUseCreateSingle) {
            return this.initSingleSurface(rootElement, options);
        }

        return this.initMultiSurface(rootElement, options);
    }

    protected async initMultiSurface(
        rootElement: HTMLDivElement | string,
        options?: I2DSurfaceOptions
    ) {
        return SciChartSurface.create(rootElement, options);
    }

    protected async initSingleSurface(
        rootElement: HTMLDivElement | string,
        options?: I2DSurfaceOptions
    ) {
        return await SciChartSurface.createSingle(rootElement, options);
    }

    protected async configureSurface(sciChartSurface: SciChartSurface) {}

    protected async configureAxes(sciChartSurface: SciChartSurface) {
        const wasmContext = sciChartSurface.webAssemblyContext2D;

        const mainSurface = sciChartSurface;

        const { drawLabels } = this.options;

        const axisOptions: INumericAxisOptions = {
            useNativeText: true,
            isVisible: drawLabels,
            drawMajorBands: false,
            drawMinorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            drawMajorGridLines: false,
            // labelStyle: { fontSize: 8 },
            labelFormat: ENumericFormat.Decimal,
            labelPrecision: 0,
            autoRange: EAutoRange.Always
        };

        const mainXAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: "mainXAxis"
        });

        mainSurface.xAxes.add(mainXAxis);
        const mainYAxis = new NumericAxis(wasmContext, {
            ...axisOptions,
            id: "mainYAxis"
        });
        mainSurface.yAxes.add(mainYAxis);

        return { xAxis: mainXAxis, yAxis: mainYAxis };
    }

    protected async configureSeries(sciChartSurface: SciChartSurface) {
        const dataSettings = {
            seriesCount: this.options.seriesNumber,
            pointsOnChart: this.options.dataSeriesCapacity,
            initialPoints: this.options.dataChunkSize
        };

        const dataSeriesArray: IDataSeries[] = new Array(dataSettings.seriesCount);
        this.surfaceDataSeriesMap.set(sciChartSurface, { dataSeriesArray });

        const xAxis = sciChartSurface.xAxes.get(0);
        const yAxis = sciChartSurface.yAxes.get(0);

        for (let i = 0; i < dataSettings.seriesCount; i++) {
            const { dataSeries, rendSeries } = await this.createRenderableSeries(
                sciChartSurface,
                xAxis.id,
                yAxis.id,
                this.options
            );

            dataSeriesArray[i] = dataSeries;

            sciChartSurface.renderableSeries.add(rendSeries);

            // const xValues = Array.from(new Array(dataSettings.initialPoints).keys());

            // // Generate points
            // prePopulateData(dataSeries, dataSeries.type, xValues, false);

            // TODO this causes a bug
            // subChartSurface.zoomExtents(0);
        }
    }

    protected async createRenderableSeries(
        surface: SciChartSurface,
        xAxisId: string,
        yAxisId: string,
        options: TChartInitializerOptions
    ) {
        const wasmContext = surface.webAssemblyContext2D;

        const { seriesType, dataSeriesCapacity } = options;

        const dsOptions: IBaseDataSeriesOptions = {
            isSorted: true,
            dataIsSortedInX: true,
            containsNaN: false
            // fifoCapacity: dataSeriesCapacity
        };

        const { dataSeries, rendSeries } = createRenderableSeries(
            wasmContext,
            seriesType,
            xAxisId,
            yAxisId,
            dsOptions
        );
        return { dataSeries, rendSeries };
    }

    protected async configureSubCharts(params: {
        mainSurface: SciChartSurface;
        mainXAxis: AxisBase2D;
        mainYAxis: AxisBase2D;
    }) {}

    protected async initChart(rootElement: HTMLDivElement | string) {
        const wasmContextInitializedBefore = this.sharedWasmContextPromise;

        const engineInitializationStart = wasmContextInitializedBefore ? NaN : performance.now();
        // TODO would be nice to handle single chart preinitialization here as well
        if (!this.options.shouldUseCreateSingle) {
            await this.initWasmContext();
        }
        const engineInitializationEnd = wasmContextInitializedBefore ? NaN : performance.now();

        const surfaceInitializationStart = performance.now();
        const { sciChartSurface, wasmContext } = await this.initSurface(rootElement);
        const surfaceInitializationEnd = performance.now();

        this.sharedWasmContext = wasmContext;
        this.surfaces.push(sciChartSurface);

        await this.configureSurface(sciChartSurface);

        const { xAxis: mainXAxis, yAxis: mainYAxis } = await this.configureAxes(sciChartSurface);

        await this.configureSeries(sciChartSurface);

        if (this.options.subChartsNumber) {
            await this.configureSubCharts({
                mainSurface: sciChartSurface,
                mainXAxis,
                mainYAxis
            });
        }

        const dataSettings = {
            seriesCount: this.options.seriesNumber,
            pointsOnChart: this.options.dataSeriesCapacity,
            initialPoints: this.options.dataChunkSize
        };

        this.data = Array.from(this.surfaceDataSeriesMap.entries()).reduce(
            (acc, [surface]) => {
                acc[surface.id] = Array.from(Array(dataSettings.seriesCount)).map(() => ({
                    xValues: Array.from(Array(Math.max(dataSettings.initialPoints))) as number[],
                    yValues: Array.from(Array(Math.max(dataSettings.initialPoints))) as number[]
                }));

                return acc;
            },
            {} as Record<string, Record<string, number[]>[]>
        );

        const dataGenerationStart = performance.now();
        this.generateDataForSurface(sciChartSurface);
        const dataUpdateStart = performance.now();
        this.appendDataOnSurface(sciChartSurface);
        const dataUpdateEnd = performance.now();

        let renderStart: DOMHighResTimeStamp;
        let renderToWebGlEnd: DOMHighResTimeStamp;
        let renderEnd: DOMHighResTimeStamp;
        let paintEnd: DOMHighResTimeStamp;

        addOneTimeListener(sciChartSurface.preRenderAll, () => {
            renderStart = performance.now();
        });
        addOneTimeListener(sciChartSurface.renderedToWebGl, () => {
            renderToWebGlEnd = performance.now();
        });
        addOneTimeListener(sciChartSurface.rendered, () => {
            renderEnd = performance.now();
        });
        addOneTimeListener(sciChartSurface.painted, () => {
            paintEnd = performance.now();
        });

        const paintPromise = receiveNextEvent(sciChartSurface.painted);
        sciChartSurface.resumeUpdates({ invalidateOnResume: true });

        await paintPromise;
        // const  = performance.now();
        // console.log("paintPromise")

        // TODO Some properties are probably redundant
        this.addInitializationPerformanceData({
            id: sciChartSurface.id,
            engineInitializationStart,
            engineInitializationEnd,
            surfaceInitializationStart,
            surfaceInitializationEnd,
            dataGenerationStart,
            dataGenerationEnd: dataUpdateStart,
            dataUpdateStart,
            dataUpdateEnd,
            renderStart,
            renderToWebGlEnd,
            renderEnd,
            paintEnd
        });

        await this.configureDataUpdate(sciChartSurface);

        return { sciChartSurface };
    }

    protected cleanup() {
        if (!this.chartGroupContainer) {
            console.warn("No chart group to cleanup");
            return;
        }

        // Delete all surfaces
        this.surfaces.forEach(scs => {
            scs.delete(true);
        });
        this.surfaces.length = 0;
        this.surfaceDataSeriesMap.clear();
        this.toggleAnimateList = [];

        // Remove the entire group container
        const parentNode = document.getElementById("containerId");
        if (parentNode && this.chartGroupContainer.parentNode === parentNode) {
            parentNode.removeChild(this.chartGroupContainer);
        }
        this.chartGroupContainer = undefined;
        window.gc && window.gc();
    }

    protected removeChart(surface: SciChartSurfaceBase, wrapperDiv?: HTMLDivElement) {
        const chartDiv = surface.domChartRoot;

        // Remove from surfaces array
        const index = this.surfaces.indexOf(surface as SciChartSurface);
        if (index > -1) {
            this.surfaces.splice(index, 1);
            this.toggleAnimateList.splice(index, 1);
        }

        // Remove from surface data map
        this.surfaceDataSeriesMap.delete(surface as SciChartSurface);

        this.checkMemoryUsage(EMemoryUsageLogEntryType.BeforeSurfaceDelete);

        // Delete the surface
        surface.delete(true);

        this.checkMemoryUsage(EMemoryUsageLogEntryType.AfterSurfaceDelete);

        // Remove wrapper div from DOM (which contains both button and chart)
        const elementToRemove = wrapperDiv || chartDiv;
        const parentNode = this.chartGroupContainer;
        if (parentNode && elementToRemove.parentNode === parentNode) {
            parentNode.removeChild(elementToRemove);
        }

        window.gc && window.gc();
    }

    protected generateSurfaceId(rootElement: HTMLDivElement | string) {
        return typeof rootElement === "string" ? rootElement : rootElement.id;
    }
}

function addOneTimeListener<T>(source: EventHandler<T>, callback: (data: T) => void) {
    const handler = (data: T) => {
        source.unsubscribe(handler);
        callback(data);
    };
    source.subscribe(handler);
}
