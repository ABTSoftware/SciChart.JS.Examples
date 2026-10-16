import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ScichartAngularComponent } from "scichart-angular";
import { ISettings, TMessage } from "./drawExample";
import { drawExample } from "./drawExample";
import { ESeriesType } from "scichart";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent, FormsModule],
    selector: "app-realtime-big-data-showcase",
    template: `
        <div class="sc-chart-wrapper flex">
            <scichart-angular
                [initChart]="initChartFunction"
                (onInit)="onChartInit($event)"
                style="flex: 1; height: 100%;"
            ></scichart-angular>
            <div style="width: 300px; padding: 10px;">
                <form class="flex flex-col gap-2" #form="ngForm">
                    <label class="sc-control flex-col w-full">
                        Chart type
                        <select
                            class="sc-select w-full"
                            name="seriesType"
                            [(ngModel)]="seriesType"
                            (ngModelChange)="changeChart($event)"
                        >
                            <option value="LineSeries">Line</option>
                            <option value="ColumnSeries">Column with stacked axes</option>
                            <option value="StackedMountainSeries">Stacked mountain</option>
                            <option value="BandSeries">Band</option>
                            <option value="ScatterSeries">Scatter</option>
                            <option value="CandlestickSeries">Candlestick</option>
                        </select>
                    </label>
                    <input
                        class="sc-range"
                        type="range"
                        name="seriesCount"
                        aria-label="Number of series"
                        min="1"
                        [max]="maxSettings.seriesCount"
                        [(ngModel)]="settings.seriesCount"
                        (change)="handleFormChange()"
                    />
                    <div>Number of Series: {{ settings.seriesCount }}</div>
                    <input
                        class="sc-range"
                        type="range"
                        name="initialPoints"
                        aria-label="Initial points"
                        min="0.1"
                        [max]="maxSettings.initialPoints"
                        [(ngModel)]="settings.initialPoints"
                        (change)="handleFormChange()"
                        step="0.1"
                    />
                    <div>Initial Points: {{ settings.initialPoints }}</div>
                    <input
                        class="sc-range"
                        type="range"
                        name="pointsOnChart"
                        aria-label="Max points on chart"
                        min="0.1"
                        [max]="maxSettings.pointsOnChart"
                        [(ngModel)]="settings.pointsOnChart"
                        (change)="handleFormChange()"
                        step="0.1"
                    />
                    <div>Max Points On Chart: {{ settings.pointsOnChart }}</div>
                    <input
                        class="sc-range"
                        type="range"
                        name="pointsPerUpdate"
                        aria-label="Points per update"
                        min="0.1"
                        [max]="maxSettings.pointsPerUpdate"
                        [(ngModel)]="settings.pointsPerUpdate"
                        (change)="handleFormChange()"
                        step="0.1"
                    />
                    <div>Points Per Update: {{ settings.pointsPerUpdate }}</div>
                    <input
                        class="sc-range"
                        type="range"
                        name="sendEvery"
                        aria-label="Send interval (ms)"
                        min="{{ maxSettings.sendEvery }}"
                        max="500"
                        [(ngModel)]="settings.sendEvery"
                        (change)="handleFormChange()"
                    />
                    <div>Send Data Interval (ms): {{ settings.sendEvery }}</div>
                    <button type="button" (click)="toggleStreaming()" [disabled]="!controls" class="sc-button">
                        {{ isRunning ? "Stop" : "Start" }}
                    </button>
                </form>
            </div>
        </div>
    `,
})
export class RealtimeBigDataShowcaseComponent {
    protected controls: any;
    isRunning = false;
    seriesType = ESeriesType.LineSeries;
    isDirty = false;
    settings: ISettings = {
        seriesCount: 10,
        pointsOnChart: 4,
        pointsPerUpdate: 1,
        sendEvery: 100,
        initialPoints: 4,
    };

    maxSettings: ISettings = {
        seriesCount: 100,
        pointsOnChart: 6,
        pointsPerUpdate: 4,
        sendEvery: 5,
        initialPoints: 6,
    };

    seriesTypes = [
        { value: ESeriesType.LineSeries, label: "Line Chart" },
        { value: ESeriesType.ColumnSeries, label: "Column Chart with Stacked Axes" },
        { value: ESeriesType.StackedMountainSeries, label: "Stacked Mountain Chart" },
        { value: ESeriesType.BandSeries, label: "Band Chart" },
        { value: ESeriesType.ScatterSeries, label: "Scatter Chart" },
        { value: ESeriesType.CandlestickSeries, label: "Candlestick Chart" },
    ];

    messages: TMessage[] = [];

    constructor(private cdr: ChangeDetectorRef) {}

    initChartFunction = drawExample((newMessages: TMessage[]) => {
        this.messages = [...newMessages];
    }, this.seriesType);

    onChartInit(event: any) {
        this.controls = event.controls;
        this.updateChartSettings();
    }

    handleFormChange() {
        this.isDirty = true;
        this.updateChartSettings();
    }

    private updateChartSettings() {
        if (this.controls) {
            this.controls.updateSettings({
                ...this.settings,
                initialPoints: this.logScale(this.settings.initialPoints),
                pointsOnChart: this.logScale(this.settings.pointsOnChart),
                pointsPerUpdate: this.logScale(this.settings.pointsPerUpdate),
            });
        }
    }

    changeChart(newSeriesType: ESeriesType) {
        if (this.controls) {
            this.controls.stopUpdate();
        }
        this.isRunning = false;
        this.controls = undefined;
        this.seriesType = newSeriesType;
        this.initChartFunction = drawExample((newMessages: TMessage[]) => {
            this.messages = [...newMessages];
        }, this.seriesType);
        this.updateChartSettings();
    }

    toggleStreaming() {
        if (this.isRunning) this.stopUpdate();
        else this.startUpdate();
    }

    startUpdate() {
        if (this.controls) {
            this.isDirty = false;
            this.controls.startUpdate();
            this.isRunning = true;
        }
    }

    stopUpdate() {
        if (this.controls) {
            this.isDirty = false;
            this.controls.stopUpdate();
            this.isRunning = false;
        }
    }

    getLogMarks(maxPower: number) {
        const marks: number[] = [1, 2, 5, 10];
        for (let i = 1; i <= maxPower; i++) {
            const base = Math.pow(10, i);
            marks.push(...[2, 5, 10].map((m) => m * base));
        }
        return marks.map((m) => ({ value: Math.log10(m) }));
    }

    logScale(value: number) {
        return Math.round(10 ** value);
    }
}
