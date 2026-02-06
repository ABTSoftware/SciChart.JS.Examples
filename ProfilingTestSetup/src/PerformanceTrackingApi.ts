import { SciChartSurface } from "scichart";
import { MemoryTrackingApi } from "./MemoryTrackingApi";
import {
    TBrowserAnimationFrameData,
    TCollectedInitializationPerformanceData,
    TCollectedPerformanceData,
    TPerformanceTimestamps
} from "./types";
import { cloneArray } from "./helpers";

export class PerformanceTrackingApi extends MemoryTrackingApi {
    public collectedPerformanceData: TCollectedPerformanceData[] = [];
    public initializationPerformanceData: TCollectedInitializationPerformanceData[] = [];

    public browserAnimationFrameData: TBrowserAnimationFrameData = {
        animationFrameStartTimestamps: [],
        animationFrameEndTimestamps: []
    };

    protected configureAnimationFrameTracking() {
        return trackAnimationFrames(this.browserAnimationFrameData);
    }

    protected addTimeStamp(collection: DOMHighResTimeStamp[]) {
        if (!this.options.enableRenderTracing) {
            return;
        }
        collection.push(performance.now());
    }

    protected addInitializationPerformanceData(data: TCollectedInitializationPerformanceData) {
        if (!this.options.enableRenderTracing) {
            return;
        }

        this.initializationPerformanceData.push(data);
    }

    protected collectPerformanceData(
        params: TPerformanceTimestamps & {
            sciChartSurface: SciChartSurface;
        }
    ) {
        const { sciChartSurface, ...serializableResultData } = params;

        this.collectedPerformanceData.push({ id: sciChartSurface.id, ...serializableResultData });
    }

    protected outputPerformanceDataForSurface(params: TCollectedPerformanceData) {}

    public outputPerformanceData(): any {
        return cloneArray(this.collectedPerformanceData);
    }
    public outputInitializationPerformanceData(): any {
        return cloneArray(this.initializationPerformanceData);
    }
    public outputBrowserAnimationFrameData(): TBrowserAnimationFrameData {
        return {
            animationFrameStartTimestamps: cloneArray(
                this.browserAnimationFrameData.animationFrameStartTimestamps
            ),
            animationFrameEndTimestamps: cloneArray(
                this.browserAnimationFrameData.animationFrameEndTimestamps
            )
        };
    }
}

function trackAnimationFrames(browserAnimationFrameData: TBrowserAnimationFrameData) {
    let cancellationToken: number;

    // animationFrameEndTimestamps is one behind compared to the start timestamps
    const { animationFrameStartTimestamps, animationFrameEndTimestamps } =
        browserAnimationFrameData;
    function animationFrameCallback(previousFrameRenderEnd: DOMHighResTimeStamp) {
        animationFrameStartTimestamps.push(performance.now());
        animationFrameEndTimestamps.push(previousFrameRenderEnd);

        cancellationToken = requestAnimationFrame(animationFrameCallback);
    }

    cancellationToken = requestAnimationFrame(animationFrameCallback);

    return () => {
        cancelAnimationFrame(cancellationToken);
    };
}
