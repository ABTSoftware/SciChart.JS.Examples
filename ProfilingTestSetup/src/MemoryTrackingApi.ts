import { getSharedWasmContext, TSciChart } from "scichart";
import { bytesToMB, cloneArray } from "./helpers";
import { ChartInitializerBase } from "./ChartInitializerBase";
import { MemoryUsageLogEntry } from "./types";

export class MemoryTrackingApi extends ChartInitializerBase {
    protected sharedWasmContext: TSciChart;
    protected sharedWasmContextPromise: Promise<TSciChart>;

    protected memoryUsageLogs: Array<MemoryUsageLogEntry> = [];

    public addMemoryUsageEntry(name: EMemoryUsageLogEntryType) {
        return this.checkMemoryUsage(name);
    }

    public async outputMemoryUsageLogs(): Promise<MemoryUsageLogEntry[]> {
        return cloneArray(this.memoryUsageLogs);
    }

    public addMemoryUsageCheckpoint(name: EMemoryUsageLogEntryType) {
        const logEntry = this.getCurrentMemoryUsage(name);

        this.memoryUsageLogs.push(logEntry);
    }

    protected checkMemoryUsage(name: EMemoryUsageLogEntryType) {
        if (!this.options.enableMemoryTracing) {
            return;
        }

        this.addMemoryUsageCheckpoint(name);
    }

    protected getCurrentMemoryUsage(name: EMemoryUsageLogEntryType) {
        const timestamp = performance.now();
        const logEntry = { name, timestamp };
        // @ts-ignore Chromium only feature
        if (performance.memory) {
            const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } =
                // @ts-ignore Chromium only feature
                performance.memory;
            Object.assign(logEntry, {
                usedJSHeapSize,
                totalJSHeapSize,
                jsHeapSizeLimit
            });
        }

        if (this.sharedWasmContext) {
            const wasmContext = this.sharedWasmContext;

            const mallInfoRes = wasmContext.GetMallinfoStats();

            const wasmHeapStats = {
                arena: mallInfoRes.arena,
                ordblks: mallInfoRes.ordblks,
                smblks: mallInfoRes.smblks,
                hblks: mallInfoRes.hblks,
                hblkhd: mallInfoRes.hblkhd,
                usmblks: mallInfoRes.usmblks,
                fsmblks: mallInfoRes.fsmblks,
                uordblks: mallInfoRes.uordblks,
                fordblks: mallInfoRes.fordblks,
                keepcost: mallInfoRes.keepcost
            };
            mallInfoRes.delete();

            // @ts-ignore "HEAPF64" is not exposed in TSciChart types but still is accessible
            Object.assign(logEntry, { HEAPF64: wasmContext["HEAPF64"].byteLength, wasmHeapStats });
        }

        return logEntry as MemoryUsageLogEntry;
    }

    protected async initWasmContext() {
        if (!this.sharedWasmContext && !this.sharedWasmContextPromise) {
            this.sharedWasmContextPromise = getSharedWasmContext();
            this.sharedWasmContext = await this.sharedWasmContextPromise;
            this.checkMemoryUsage(EMemoryUsageLogEntryType.AfterWasmInit);
        }
    }
}

export enum EMemoryUsageLogEntryType {
    BeforeDataSeriesUpdate = "Before DataSeries Update",
    AfterDataSeriesUpdate = "After Data Series Update",
    BeforeSurfaceInit = "Before Surface Init",
    AfterSurfaceInit = "After Surface Init",
    BeforeWasmInit = "Before Wasm Init",
    AfterWasmInit = "After Wasm Init",
    BeforeSurfaceDelete = "Before Surface Delete",
    AfterSurfaceDelete = "After Surface Delete",
    OnDemand = "OnDemand"
}
