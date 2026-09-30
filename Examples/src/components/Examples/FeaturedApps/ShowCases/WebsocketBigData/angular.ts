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
        <div style="display: flex; height: 100vh;">
            <scichart-angular
                [initChart]="initChartFunction"
                (onInit)="onChartInit($event)"
                style="flex: 1; height: 100%;"
            ></scichart-angular>
            <div style="width: 300px; padding: 10px;">
                <form #form="ngForm">
                    <fieldset class="sc-control-row">
                        <legend>Series Type</legend>
                        <label class="sc-control"
                            ><input
                                class="sc-radio"
                                type="radio"
                                name="seriesType"
                                value="LineSeries"
                                [(ngModel)]="seriesType"
                                (ngModelChange)="changeChart($event)"
                            />Line Chart</label
                        >
                        <label class="sc-control"
                            ><input
                                class="sc-radio"
                                type="radio"
                                name="seriesType"
                                value="ColumnSeries"
                                [(ngModel)]="seriesType"
                                (ngModelChange)="changeChart($event)"
                            />Column Chart with Stacked Axes</label
                        >
                        <label class="sc-control"
                            ><input
                                class="sc-radio"
                                type="radio"
                                name="seriesType"
                                value="StackedMountainSeries"
                                [(ngModel)]="seriesType"
                                (ngModelChange)="changeChart($event)"
                            />Stacked Mountain Chart</label
                        >
                        <label class="sc-control"
                            ><input
                                class="sc-radio"
                                type="radio"
                                name="seriesType"
                                value="BandSeries"
                                [(ngModel)]="seriesType"
                                (ngModelChange)="changeChart($event)"
                            />Band Chart</label
                        >
                        <label class="sc-control"
                            ><input
                                class="sc-radio"
                                type="radio"
                                name="seriesType"
                                value="ScatterSeries"
                                [(ngModel)]="seriesType"
                                (ngModelChange)="changeChart($event)"
                            />Scatter Chart</label
                        >
                        <label class="sc-control"
                            ><input
                                class="sc-radio"
                                type="radio"
                                name="seriesType"
                                value="CandlestickSeries"
                                [(ngModel)]="seriesType"
                                (ngModelChange)="changeChart($event)"
                            />Candlestick Chart</label
                        >
                    </fieldset>
                    <input
                        class="sc-range"
                        type="range"
                        name="seriesCount"
                        min="1"
                        [max]="maxSettings.seriesCount"
                        [(ngModel)]="settings.seriesCount"
                        (change)="handleFormChange(form)"
                    />
                    <div>Number of Series: {{ settings.seriesCount }}</div>
                    <input
                        class="sc-range"
                        type="range"
                        name="initialPoints"
                        min="0.1"
                        [max]="maxSettings.initialPoints"
                        [(ngModel)]="settings.initialPoints"
                        (change)="handleFormChange(form)"
                        step="0.1"
                    />
                    <div>Initial Points: {{ settings.initialPoints }}</div>
                    <input
                        class="sc-range"
                        type="range"
                        name="pointsOnChart"
                        min="0.1"
                        [max]="maxSettings.pointsOnChart"
                        [(ngModel)]="settings.pointsOnChart"
                        (change)="handleFormChange(form)"
                        step="0.1"
                    />
                    <div>Max Points On Chart: {{ settings.pointsOnChart }}</div>
                    <input
                        class="sc-range"
                        type="range"
                        name="pointsPerUpdate"
                        min="0.1"
                        [max]="maxSettings.pointsPerUpdate"
                        [(ngModel)]="settings.pointsPerUpdate"
                        (change)="handleFormChange(form)"
                        step="0.1"
                    />
                    <div>Points Per Update: {{ settings.pointsPerUpdate }}</div>
                    <input
                        class="sc-range"
                        type="range"
                        name="sendEvery"
                        min="{{ maxSettings.sendEvery }}"
                        max="500"
                        [(ngModel)]="settings.sendEvery"
                        (change)="handleFormChange(form)"
                    />
                    <div>Send Data Interval (ms): {{ settings.sendEvery }}</div>
                    <button type="button" (click)="startUpdate()" class="sc-button sc-button-primary">Start</button>
                    <button type="button" (click)="stopUpdate()" class="sc-button sc-button-danger">Stop</button>
                </form>
            </div>
        </div>
    `,
})
export class RealtimeBigDataShowcaseComponent {
    private controls: any;
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
        this.seriesType = newSeriesType;
        this.initChartFunction = drawExample((newMessages: TMessage[]) => {
            this.messages = [...newMessages];
        }, this.seriesType);
        this.updateChartSettings();
    }

    startUpdate() {
        if (this.controls) {
            this.isDirty = false;
            this.controls.startUpdate();
        }
    }

    stopUpdate() {
        if (this.controls) {
            this.isDirty = false;
            this.controls.stopUpdate();
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
