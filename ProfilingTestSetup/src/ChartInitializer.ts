import {
    AxisBase2D,
    BaseDataSeries,
    EAutoRange,
    ENumericFormat,
    EventHandler,
    I2DSurfaceOptions,
    IBaseDataSeriesOptions,
    INumericAxisOptions,
    NumericAxis,
    receiveNextEvent,
    SciChartSurface,
    SciChartSurfaceBase
} from "scichart";
import { DataUpdateApi } from "./DataUpdateApi";
import { EMemoryUsageLogEntryType } from "./MemoryTrackingApi";
import { createRenderableSeries, prePopulateData } from "./helpers";
import { TChartInitializerOptions } from "./types";

export class ChartInitializer extends DataUpdateApi {
    protected counter = 0;

    protected controlsProperty = {
        initWasmContext: () => this.initWasmContext(),
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

    public async createChart() {
        // Options are not shared between charts
        const index = this.counter++;

        this.checkMemoryUsage(EMemoryUsageLogEntryType.BeforeSurfaceInit);

        const rootElement = this.createRootElement(index);

        await this.initChart(rootElement);

        this.checkMemoryUsage(EMemoryUsageLogEntryType.AfterSurfaceInit);
    }

    protected createRootElement(index: number) {
        const divElement = document.createElement("div");
        divElement.id = `chart-${index}`;
        const parentNode = document.getElementById("containerId");
        parentNode.appendChild(divElement);

        return divElement;
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

        const dataSeriesArray: BaseDataSeries[] = new Array(dataSettings.seriesCount);
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

            const xValues = Array.from(new Array(dataSettings.initialPoints).keys());

            // Generate points
            prePopulateData(dataSeries, dataSeries.type, xValues, false);

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

        this.data = Array.from(this.surfaceDataSeriesMap.entries()).map(() =>
            Array.from(Array(dataSettings.seriesCount)).map(() => ({
                xValues: [] as number[],
                yValues: [] as number[]
            }))
        );

        const dataGenerationStart = performance.now();
        this.generateData();
        const dataUpdateStart = performance.now();
        this.appendData();
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
        console.log("Clear all");

        this.surfaces.forEach(scs => this.removeChart(scs));
        this.surfaces.length = 0;
        this.surfaceDataSeriesMap.clear();
        this.toggleAnimateList = [];

        const parentNode = document.getElementById("containerId");
        parentNode.innerHTML = "";
        window.gc && window.gc();
    }

    protected removeChart(surface: SciChartSurfaceBase) {
        console.log("Delete", surface.id);
        const rootElement = surface.domChartRoot;
        surface.delete(true);
        const parentNode = document.getElementById("containerId");
        parentNode.removeChild(rootElement);
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
