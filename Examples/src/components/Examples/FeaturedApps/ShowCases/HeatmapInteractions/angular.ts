import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScichartAngularComponent } from "scichart-angular";
import { appTheme } from "../../../theme";
import { getChartsInitializationApi, IChartControls } from "./drawExample";

@Component({
    standalone: true,
    imports: [CommonModule, ScichartAngularComponent],
    selector: "app-heatmap-interactions",
    template: `
        <div class="chart-wrapper">
            <div [ngStyle]="localStyles.flexOuterContainer">
                <div [ngStyle]="localStyles.toolbarRow">
                    <button
                        mat-button
                        (click)="startAnimation()"
                        [ngStyle]="{ color: appTheme.ForegroundColor }"
                        [disabled]="!controlsRef"
                    >
                        Start
                    </button>
                    <button
                        mat-button
                        (click)="stopAnimation()"
                        [ngStyle]="{ color: appTheme.ForegroundColor }"
                        [disabled]="!controlsRef"
                    >
                        Stop
                    </button>
                    <button
                        mat-button
                        (click)="loadBasicExample()"
                        [ngStyle]="{ color: appTheme.ForegroundColor }"
                        [disabled]="!controlsRef"
                    >
                        Load basic example
                    </button>
                    <button
                        mat-button
                        (click)="loadDoubleSlitExample()"
                        [ngStyle]="{ color: appTheme.ForegroundColor }"
                        [disabled]="!controlsRef"
                    >
                        Load double slit example
                    </button>
                    <button
                        mat-button
                        (click)="showHelp()"
                        [ngStyle]="{ color: appTheme.ForegroundColor }"
                        [disabled]="!controlsRef"
                    >
                        Show Help
                    </button>
                </div>
                <div style="display: flex; flex-direction: row;">
                    <scichart-angular
                        [initChart]="chartsInitializationAPI.initMainChart"
                        (onInit)="onChartInit($event, 'main')"
                        style="flex: 1; flex-basis: 50%;"
                    >
                    </scichart-angular>
                    <scichart-angular
                        [initChart]="chartsInitializationAPI.initCrossSectionChart"
                        (onInit)="onChartInit($event, 'crossSection')"
                        style="flex-basis: 500px; flex-grow: 1; flex-shrink: 1;"
                    >
                    </scichart-angular>
                </div>
                <div style="display: flex; flex-direction: row;">
                    <scichart-angular
                        [initChart]="chartsInitializationAPI.inputChart"
                        (onInit)="onChartInit($event, 'input')"
                        style="flex-basis: 500px; flex-grow: 1; flex-shrink: 1;"
                    >
                    </scichart-angular>
                    <scichart-angular
                        [initChart]="chartsInitializationAPI.initHistoryChart"
                        (onInit)="onChartInit($event, 'history')"
                        style="flex-basis: 500px; flex-grow: 1; flex-shrink: 1;"
                    >
                    </scichart-angular>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .chart-wrapper {
                height: 100%;
                width: 100%;
            }
        `,
    ],
})
export class AppComponent {
    localStyles = {
        flexOuterContainer: {
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background: appTheme.DarkIndigo,
        },
        toolbarRow: {
            display: "flex",
            flexBasis: "70px",
            padding: 10,
            width: "100%",
            color: appTheme.ForegroundColor,
        },
    };

    chartsInitializationAPI = getChartsInitializationApi();
    mainChart?: any;
    crossSectionChart?: any;
    inputChart?: any;
    historyChart?: any;
    controlsRef?: IChartControls;
    appTheme = appTheme;

    async onChartInit(event: any, chartType: "main" | "crossSection" | "input" | "history") {
        if (event?.sciChartSurface) {
            switch (chartType) {
                case "main":
                    this.mainChart = event.sciChartSurface;
                    break;
                case "crossSection":
                    this.crossSectionChart = event.sciChartSurface;
                    break;
                case "input":
                    this.inputChart = event.sciChartSurface;
                    break;
                case "history":
                    this.historyChart = event.sciChartSurface;
                    break;
            }

            if (this.mainChart && this.crossSectionChart && this.inputChart && this.historyChart) {
                this.configureCharts();
            }
        } else {
            console.log("Chart not initialized!");
        }
    }

    private configureCharts() {
        this.controlsRef = this.chartsInitializationAPI.onAllChartsInit();
    }

    startAnimation(): void {
        this.controlsRef?.startAnimation();
    }

    stopAnimation(): void {
        this.controlsRef?.stopAnimation();
    }

    loadBasicExample(): void {
        this.controlsRef?.twoPoint();
    }

    loadDoubleSlitExample(): void {
        this.controlsRef?.interference();
    }

    showHelp(): void {
        this.controlsRef?.showHelp();
    }
}
