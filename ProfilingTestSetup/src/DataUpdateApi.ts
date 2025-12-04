import { receiveNextEvent, SciChartSurface } from "scichart";
import { PerformanceTrackingApi } from "./PerformanceTrackingApi";
import { DataManagementApi } from "./DataManagementApi";
import { EMemoryUsageLogEntryType } from "./MemoryTrackingApi";
import { EUpdateIntervalBaseline } from "./types";

export class DataUpdateApi extends DataManagementApi {
    protected toggleAnimateList: Array<() => void> = [];

    protected performDataUpdate(params: {
        dataGenerationStart: DOMHighResTimeStamp[];
        dataUpdateStart: DOMHighResTimeStamp[];
        dataUpdateEnd: DOMHighResTimeStamp[];
    }) {
        this.checkMemoryUsage(EMemoryUsageLogEntryType.BeforeDataSeriesUpdate);

        this.addTimeStamp(params.dataGenerationStart);

        this.generateData();

        this.addTimeStamp(params.dataUpdateStart);

        this.appendData();

        this.addTimeStamp(params.dataUpdateEnd);

        this.checkMemoryUsage(EMemoryUsageLogEntryType.AfterDataSeriesUpdate);
    }

    protected async configureDataUpdate(sciChartSurface: SciChartSurface) {
        const updateInterval = this.options.updateInterval;
        let dataGenerationStart: DOMHighResTimeStamp[] = [];
        let dataUpdateStart: DOMHighResTimeStamp[] = [];
        let dataUpdateEnd: DOMHighResTimeStamp[] = [];
        let preRenderStart: DOMHighResTimeStamp[] = [];
        let renderToWebGl: DOMHighResTimeStamp[] = [];
        let renderEnd: DOMHighResTimeStamp[] = [];
        let framePainted: DOMHighResTimeStamp[] = [];

        let cancelAnimationFramesTracking: () => void;

        const resetCollectedTimeStamps = () => {
            dataGenerationStart = [];
            dataUpdateStart = [];
            dataUpdateEnd = [];
            preRenderStart = [];
            renderEnd = [];
            framePainted = [];
            cancelAnimationFramesTracking = undefined;
            // this.collectPerformanceData = [];
        };

        const toggleOn = () => {
            // console.log("start update", new Date(Date.now()));
            resetCollectedTimeStamps();
            cancelAnimationFramesTracking = this.configureAnimationFrameTracking();
        };

        const update = () => {
            this.performDataUpdate({
                dataGenerationStart,
                dataUpdateStart,
                dataUpdateEnd
            });
        };

        const toggleOff = () => {
            // console.log("stop update", new Date(Date.now()));
            cancelAnimationFramesTracking();
            // await receiveNextEvent(sciChartSurface.painted);
            this.collectPerformanceData({
                sciChartSurface,
                dataGenerationStart,
                dataUpdateStart,
                dataUpdateEnd,
                preRenderStart,
                renderToWebGl,
                renderEnd,
                framePainted
            });
        };

        // skips initial frame?
        // await sciChartSurface.nextStateRender();

        sciChartSurface.preRenderAll.subscribe(() => this.addTimeStamp(preRenderStart));
        sciChartSurface.renderedToWebGl.subscribe(() => this.addTimeStamp(renderToWebGl));
        sciChartSurface.renderedToDestination.subscribe(() => this.addTimeStamp(renderEnd));
        sciChartSurface.painted.subscribe(() => this.addTimeStamp(framePainted));

        const dataUpdateToggle = this.getDataUpdateToggle({
            sciChartSurface,
            toggleOn,
            toggleOff,
            update
        });

        this.toggleAnimateList.push(dataUpdateToggle);
    }

    protected getDataUpdateToggle(params: {
        sciChartSurface: SciChartSurface;
        toggleOn: () => void;
        toggleOff: () => void;
        update: () => void;
    }) {
        const { sciChartSurface, toggleOn, toggleOff, update } = params;
        let isRunning = false;
        let shouldStop = false;

        sciChartSurface.addDeletable({
            delete: () => {
                shouldStop = true;
                isRunning = false;
            }
        });

        const performUpdateCycle = () =>
            new Promise(async (resolve, reject) => {
                try {
                    let updateCounter = 0;
                    let paintCounter = 0;
                    const isCountBasedCycle = this.options.updatesNumber !== undefined;

                    const updatePacer = async () => {
                        const finishedIteration = updateCounter >= this.options.updatesNumber;

                        if (
                            isRunning &&
                            !shouldStop &&
                            (!isCountBasedCycle || (isCountBasedCycle && !finishedIteration))
                        ) {
                            if (
                                this.options.intervalBaseline ===
                                    EUpdateIntervalBaseline.PrevUpdateStart &&
                                this.options.syncDataUpdateWithFrameRate &&
                                paintCounter < updateCounter
                            ) {
                                await receiveNextEvent(sciChartSurface.painted);
                            }

                            ++updateCounter;

                            // Perform the data update
                            update();

                            if (this.options.syncDataUpdateWithFrameRate) {
                                // Wait for the surface to be painted before the next update
                                await receiveNextEvent(sciChartSurface.painted);
                                ++paintCounter;
                            }

                            if (
                                this.options.intervalBaseline === EUpdateIntervalBaseline.PaintEnd
                            ) {
                                if (this.options.updateInterval !== undefined) {
                                    // Start timer after paint if PaintEnd baseline
                                    setTimeout(updatePacer, this.options.updateInterval);
                                } else if (this.options.updateInterval === undefined) {
                                    // try to update immediately if no interval specified
                                    await updatePacer();
                                }
                            }
                        } else {
                            // if (sciChartSurface?.isInvalidated) {
                            //     // Wait for the final painted event
                            //     await receiveNextEvent(sciChartSurface.painted);
                            // }
                            stopAnimate();

                            toggleOff();
                            resolve({ paintCounter, updateCounter });
                        }
                    };

                    if (this.options.intervalBaseline === EUpdateIntervalBaseline.PrevUpdateStart) {
                        setInterval(updatePacer, this.options.updateInterval);
                    } else {
                        await updatePacer();
                    }
                } catch (err) {
                    reject(err);
                }
            });

        let autoToggleOffTimer: NodeJS.Timeout;
        let animationPromise: Promise<any>;

        const stopAnimate = () => {
            // Stop the update cycle
            isRunning = false;
            shouldStop = true;
            clearTimeout(autoToggleOffTimer);
        };

        const toggleAnimate = async (): Promise<any> => {
            if (isRunning) {
                stopAnimate();
            } else {
                // Start the update cycle
                shouldStop = false;
                isRunning = true;
                await toggleOn();

                if (this.options.maxRunDuration === 0) {
                    return toggleAnimate();
                }

                if (this.options.maxRunDuration !== undefined && this.options.maxRunDuration > 0) {
                    autoToggleOffTimer = setTimeout(async () => {
                        // auto stop
                        toggleAnimate();
                    }, this.options.maxRunDuration);
                }

                // Start the update loop
                return performUpdateCycle();
            }
        };

        return toggleAnimate;
    }

    protected toggleAnimate() {
        return Promise.all(this.toggleAnimateList.map(callback => callback()));
    }
}
