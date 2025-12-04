import {
    EPerformanceDebugLevel,
    ISciChartSurfaceBase,
    ObservableArray,
    ObservableArrayBase,
    receiveNextEvent,
    SciChartSurfaceBase
} from "scichart";
import {
    EPerformanceMarkType,
    PerformanceDebugHelper,
    TPerformanceDetail,
    TProcessedDetail,
    TSciChartPerformanceMark
} from "scichart";

type SCPerformanceMark = TSciChartPerformanceMark<TPerformanceDetail>;

export type TRecordingOptions = {
    sciChartSurface: SciChartSurfaceBase;
    invalidate?: boolean;
    keepCollectedData?: boolean;
    trackedMarkTypes?: (EPerformanceMarkType | string)[];
    verbose?: boolean;
};

export class SCPerformanceMeasure implements PerformanceMeasure {
    readonly duration: DOMHighResTimeStamp;
    readonly entryType: string = "measure";

    readonly name: string;

    readonly startTime: DOMHighResTimeStamp;

    constructor(name: string, startMark: SCPerformanceMark, endMark: SCPerformanceMark) {
        this.name = name;
        this.startTime = startMark.startTime;
        this.duration = endMark.startTime - startMark.startTime;
        this.detail = endMark.detail;
    }

    toJSON() {
        return {
            duration: this.duration,
            entryType: this.entryType,
            name: this.name,
            startTime: this.startTime,
            detail: this.detail
        };
    }
    readonly detail: TPerformanceDetail;
}

export class CustomPerformanceDebugHelper extends PerformanceDebugHelper {
    public marks = new ObservableArrayBase<SCPerformanceMark>();
    public measures = new ObservableArrayBase<SCPerformanceMeasure>();

    public override createMark<TDetail extends TPerformanceDetail>(
        type: EPerformanceMarkType | string,
        groupId: string,
        detail: TProcessedDetail<TDetail>
    ): TSciChartPerformanceMark<TDetail> {
        const mark = new PerformanceMark(`${type}${this.separator}${groupId}`, { detail });
        this.marks.add(mark);
        return mark;
    }

    public override getMarks(): TSciChartPerformanceMark<TPerformanceDetail>[] {
        return this.marks.asArray();
    }

    public override getMeasures(): PerformanceEntryList {
        return this.measures.asArray();
    }

    public override clearMarks(): void {
        this.marks.clear(false);
    }

    public clearMeasures() {
        this.measures.clear();
    }

    public override createMeasureFromEndMark<TDetail extends TPerformanceDetail>(
        mark: TSciChartPerformanceMark<TDetail>,
        name?: string
    ): SCPerformanceMeasure {
        const measure = this.constructMeasure<TDetail>(mark, name);
        this.measures.add(measure);
        return measure;
    }

    protected constructMeasure<TDetail extends TPerformanceDetail>(
        mark: TSciChartPerformanceMark<TDetail>,
        name?: string
    ): SCPerformanceMeasure {
        const startTypeName = mark.name.replace("End", "Start");
        const measureName = name ?? startTypeName.replace("Start", "Time");

        const startMark = this.marks.asArray().find(m => m.name === startTypeName);

        if (!startMark) {
            throw new Error(`Start mark for "${measureName}" not found!`);
        }

        const measure = new SCPerformanceMeasure(measureName, startMark, mark);

        return measure;
    }

    protected startRecording(options: TRecordingOptions) {
        const surface = options.sciChartSurface;

        const currentMeasuredMarks = PerformanceDebugHelper.measuredMarks;
        PerformanceDebugHelper.measuredMarks = options?.trackedMarkTypes
            ? currentMeasuredMarks
            : PerformanceDebugHelper.measuredMarks;

        if (options.verbose) {
            PerformanceDebugHelper.debugLevel = EPerformanceDebugLevel.Verbose;
        } else {
            PerformanceDebugHelper.debugLevel = EPerformanceDebugLevel.Info;
        }

        PerformanceDebugHelper.enableDebug = true;

        if (options.invalidate) {
            surface.invalidateElement({ force: true });
        }

        return currentMeasuredMarks;
    }

    protected endRecording(options: TRecordingOptions, previousTrackedMarkTypes: (EPerformanceMarkType | string)[]) {
        const surface = options.sciChartSurface;

        PerformanceDebugHelper.enableDebug = false;

        // reset to previous
        PerformanceDebugHelper.measuredMarks = previousTrackedMarkTypes;

        const surfaceRelatedMarks = this.getMarks().filter(
            mark =>
                mark.detail.contextId === surface.id ||
                mark.detail.parentContextId === surface.id ||
                mark.detail.parentContextId === surface.domCanvas2D.id
        );

        const surfaceRelatedEndMarks = surfaceRelatedMarks.filter(mark => mark.name.includes("End"));

        // these are not added to any collection automatically
        const measures = surfaceRelatedEndMarks.map(endMark => this.constructMeasure(endMark));

        if (options.verbose) {
            console.log(`Performance recording completed for surface ${surface.id}`);
            console.log(`Total marks collected: ${surfaceRelatedMarks.length}`);
            console.log(`Total measures created: ${measures.length}`);
        }

        if (options?.keepCollectedData) {
            this.measures.add(...measures);
        } else {
            this.clearMarks();
        }

        return measures;
    }

    public async startRecordingPerformance(options: TRecordingOptions) {
        const prevMarkTypes = this.startRecording(options);

        const endRecording = () => this.endRecording(options, prevMarkTypes);

        return endRecording;
    }

    public async recordSingleRedrawRequest(options: TRecordingOptions & { includeInternalRedrawRequests?: boolean }) {
        const prevMarkTypes = this.startRecording(options);

        if (options.includeInternalRedrawRequests) {
            let frameCounter = 0;
            while (await receiveNextEvent(options.sciChartSurface.painted)) {
                ++frameCounter;
            }
        } else {
            const isInvalidated = await receiveNextEvent(options.sciChartSurface.painted);
            if (isInvalidated) {
                // TODO create a documentation page explaining potential causes or problems
                console.warn(
                    `The surface ${options.sciChartSurface.id} was invalidated again during the rendering!\nYou can use "includeInternalRedrawRequests: true" to record multiple frames.`
                );
            }
        }

        return this.endRecording(options, prevMarkTypes);
    }
}
