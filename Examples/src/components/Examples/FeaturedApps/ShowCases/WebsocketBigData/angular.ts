import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import { MatSliderModule } from "@angular/material/slider";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ScichartAngularComponent } from "scichart-angular";
import { ISettings, TMessage } from "./drawExample";
import { drawExample } from "./drawExample";
import { ESeriesType } from "scichart";

@Component({
    standalone: true,
    imports: [
        ScichartAngularComponent,
        MatSliderModule,
        MatRadioModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
    ],
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
                    <mat-label>Series Type</mat-label>
                    <mat-radio-group name="seriesType" [(ngModel)]="seriesType" (ngModelChange)="changeChart($event)">
                        <mat-radio-button value="LineSeries">Line Chart</mat-radio-button>
                        <mat-radio-button value="ColumnSeries">Column Chart with Stacked Axes</mat-radio-button>
                        <mat-radio-button value="StackedMountainSeries">Stacked Mountain Chart</mat-radio-button>
                        <mat-radio-button value="BandSeries">Band Chart</mat-radio-button>
                        <mat-radio-button value="ScatterSeries">Scatter Chart</mat-radio-button>
                        <mat-radio-button value="CandlestickSeries">Candlestick Chart</mat-radio-button>
                    </mat-radio-group>
                    <mat-slider
                        name="seriesCount"
                        min="1"
                        [max]="maxSettings.seriesCount"
                        [(ngModel)]="settings.seriesCount"
                        (change)="handleFormChange(form)"
                    >
                        <input matSliderThumb />
                    </mat-slider>
                    <div>Number of Series: {{ settings.seriesCount }}</div>
                    <mat-slider
                        name="initialPoints"
                        min="0.1"
                        [max]="maxSettings.initialPoints"
                        [(ngModel)]="settings.initialPoints"
                        (change)="handleFormChange(form)"
                        [marks]="getLogMarks(maxSettings.initialPoints)"
                    >
                        <input matSliderThumb />
                    </mat-slider>
                    <div>Initial Points: {{ settings.initialPoints }}</div>
                    <mat-slider
                        name="pointsOnChart"
                        min="0.1"
                        [max]="maxSettings.pointsOnChart"
                        [(ngModel)]="settings.pointsOnChart"
                        (change)="handleFormChange(form)"
                        [marks]="getLogMarks(maxSettings.pointsOnChart)"
                    >
                        <input matSliderThumb />
                    </mat-slider>
                    <div>Max Points On Chart: {{ settings.pointsOnChart }}</div>
                    <mat-slider
                        name="pointsPerUpdate"
                        min="0.1"
                        [max]="maxSettings.pointsPerUpdate"
                        [(ngModel)]="settings.pointsPerUpdate"
                        (change)="handleFormChange(form)"
                        [marks]="getLogMarks(maxSettings.pointsPerUpdate)"
                    >
                        <input matSliderThumb />
                    </mat-slider>
                    <div>Points Per Update: {{ settings.pointsPerUpdate }}</div>
                    <mat-slider
                        name="sendEvery"
                        min="{{ maxSettings.sendEvery }}"
                        max="500"
                        [(ngModel)]="settings.sendEvery"
                        (change)="handleFormChange(form)"
                    >
                        <input matSliderThumb />
                    </mat-slider>
                    <div>Send Data Interval (ms): {{ settings.sendEvery }}</div>
                    <button mat-raised-button color="primary" (click)="startStreaming()">Start</button>
                    <button mat-raised-button color="warn" (click)="stopStreaming()">Stop</button>
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
            this.controls.stopStreaming();
        }
        this.seriesType = newSeriesType;
        this.initChartFunction = drawExample((newMessages: TMessage[]) => {
            this.messages = [...newMessages];
        }, this.seriesType);
        this.updateChartSettings();
    }

    startStreaming() {
        if (this.controls) {
            this.isDirty = false;
            this.controls.startStreaming();
        }
    }

    stopStreaming() {
        if (this.controls) {
            this.isDirty = false;
            this.controls.stopStreaming();
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
