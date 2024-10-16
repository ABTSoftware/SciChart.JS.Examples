import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatSliderModule } from "@angular/material/slider";
import { MatRadioModule } from "@angular/material/radio";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ScichartAngularComponent } from "scichart-angular";
import { drawExample, TTimeSpan } from "./drawExample";

@Component({
    standalone: true,
    imports: [
        ScichartAngularComponent,
        CommonModule,
        MatSliderModule,
        MatRadioModule,
        MatFormFieldModule,
        MatButtonToggleModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
    ],
    selector: "app-load500-by500-chart",
    template: `
        <div class="chart-wrapper">
            <div class="flex-outer-container">
                <scichart-angular
                    [initChart]="initChart"
                    (onInit)="onInit($event)"
                    (onDelete)="onDelete()"
                    style="flex: 1;"
                >
                </scichart-angular>
                <div class="toolbar-row">
                    <button (click)="reloadPoints()" class="reload-button">🗘 Reload Test</button>
                    <div class="notification-container">
                        <ng-container *ngIf="timeSpans.length > 0">
                            <mat-card>
                                <mat-card-header>
                                    <mat-card-title>Performance Results</mat-card-title>
                                </mat-card-header>
                                <mat-card-content>
                                    <div *ngFor="let ts of timeSpans; let i = index">
                                        {{ ts.title }}: {{ ts.durationMs.toFixed(0) }} ms
                                    </div>
                                </mat-card-content>
                            </mat-card>
                        </ng-container>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .chart-wrapper {
                width: 100%;
                height: 100%;
            }
            .flex-outer-container {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                background: #14233c;
            }
            .toolbar-row {
                display: flex;
                padding: 10px;
                width: 100%;
                min-height: 140px;
                color: #ecf0f1;
                align-items: center;
            }
            .reload-button {
                margin-right: 10px;
                background: transparent;
                border: none;
                cursor: pointer;
                font-size: 16px;
                color: #ecf0f1;
            }
            .notification-container {
                width: 80%;
                margin-left: 10px;
                background-color: #264b93;
                color: #ecf0f1;
            }
            .mat-card {
                background-color: #264b93 !important;
            }
            .mat-mdc-card {
                background-color: #264b93 !important;
            }
        `,
    ],
})
export class AppComponent {
    timeSpans: TTimeSpan[] = [];
    controls?: Awaited<ReturnType<typeof drawExample>>["controls"];

    drawExample = (rootElement: string | HTMLDivElement) => {
        return drawExample(rootElement, (newTimeSpans: TTimeSpan[]) => {
            this.updateTimeSpans(newTimeSpans);
        });
    };

    initChart = this.drawExample;

    onInit(initResult: Awaited<ReturnType<typeof drawExample>>): void {
        this.controls = initResult.controls;
        this.controls?.startUpdate();
    }

    onDelete(): void {
        this.controls?.stopUpdate();
    }

    private updateTimeSpans(newTimeSpans: TTimeSpan[]): void {
        this.timeSpans = [...newTimeSpans];
    }

    reloadPoints(): void {
        this.controls?.startUpdate();
    }
}
