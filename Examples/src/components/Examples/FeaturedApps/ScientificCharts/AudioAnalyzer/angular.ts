import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScichartAngularComponent } from "scichart-angular";
import { getChartsInitializationApi } from "./drawExample";
import { appTheme } from "../../../theme";

@Component({
    standalone: true,
    imports: [CommonModule, ScichartAngularComponent],
    selector: "app-audio-analyzer",
    template: `
        <style>
            .chart-wrapper {
                display: flex;
                flex-direction: column;
                height: 100vh;
            }
            .chart-container {
                display: flex;
                flex-direction: column;
                height: 100%;
            }

            .fft-spectrogram-container {
                display: flex;
                flex: 1;
            }
        </style>
        <div [ngStyle]="{ background: appTheme.Background }" class="chart-wrapper">
            <div class="chart-container">
                <scichart-angular
                    [initChart]="chartsInitializationAPI.initAudioChart"
                    (onInit)="onChartInit($event, 'audio')"
                    style="flex: 1;"
                >
                </scichart-angular>
                <div class="fft-spectrogram-container">
                    <scichart-angular
                        [initChart]="chartsInitializationAPI.initFftChart"
                        (onInit)="onChartInit($event, 'fft')"
                        style="flex: 1;"
                    >
                    </scichart-angular>
                    <scichart-angular
                        [initChart]="chartsInitializationAPI.initSpectogramChart"
                        (onInit)="onChartInit($event, 'spectrogram')"
                        style="flex: 1;"
                    >
                    </scichart-angular>
                </div>
            </div>
        </div>
    `,
})
export class AppComponent {
    chartsInitializationAPI = getChartsInitializationApi();
    audioChart: any;
    fftChart: any;
    spectrogramChart: any;
    controlsRef: any;
    appTheme = appTheme;

    async onChartInit(event: any, chartType: "audio" | "fft" | "spectrogram") {
        if (event?.sciChartSurface) {
            switch (chartType) {
                case "audio":
                    this.audioChart = event.sciChartSurface;
                    break;
                case "fft":
                    this.fftChart = event.sciChartSurface;
                    break;
                case "spectrogram":
                    this.spectrogramChart = event.sciChartSurface;
                    break;
            }

            if (this.audioChart && this.fftChart && this.spectrogramChart) {
                this.configureCharts();
            }
        } else {
            console.log("Chart not initialized!");
        }
    }

    private configureCharts() {
        if (this.audioChart && this.fftChart && this.spectrogramChart) {
            this.controlsRef = this.chartsInitializationAPI.onAllChartsInit();
            this.controlsRef.startUpdate();
        }
    }
}
