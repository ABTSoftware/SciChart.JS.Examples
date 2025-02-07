import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ScichartAngularComponent } from "scichart-angular";
import { appTheme } from "../../../theme";
import { TDataUpdateInfo, drawExample } from "./drawExample";

@Component({
    standalone: true,
    imports: [ScichartAngularComponent, CommonModule],
    selector: "app-vital-signs-monitor",
    template: `
        <style>
            .chart-wrapper {
                height: 100%;
                display: flex;
            }
            .chart-container {
                display: flex;
                flex: 1;
            }
            .info-box-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                border: 1px solid;
            }
            .info-box {
                padding: 58px;
                flex: 1;
                border: 1px solid;
            }
            .ib-row1,
            .ib-row2 {
                display: flex;
                justify-content: space-between;
            }
            .ib-row1-col1,
            .ib-row2-col1,
            .ib-row2-col2 {
                flex: 1;
            }

            .info-box {
                padding: 58px;
                flex: 1;
                border: 1px solid;
                display: flex;
                flex-direction: column;
                height: 100%;
                justify-content: space-between;
            }
            .ib-bottom-row {
                display: flex;
                justify-content: space-between;
                margin-top: auto;
            }

            .ib-title {
                font-size: 24px;
                font-weight: bold;
            }
            .ib-row1-col1 {
                font-size: 24px;
                font-weight: bold;
            }
        </style>

        <div class="chart-wrapper">
            <div class="chart-container">
                <scichart-angular [initChart]="drawExample" (onInit)="onChartInit($event)" style="flex: 1;">
                </scichart-angular>
                <div class="info-box-container">
                    <div class="info-box" [ngStyle]="{ color: appTheme.VividOrange, background: appTheme.Background }">
                        <div class="ib-header">
                            <div class="ib-title">ECG</div>
                        </div>
                        <div class="ib-bottom-row">
                            <div class="ib-bottom-left">
                                <div>
                                    V1 - 1.4MM<br />
                                    ST | +0.6 || +0.9
                                </div>
                            </div>
                            <div class="ib-bottom-right">
                                <div>{{ infoEcg }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="info-box" [ngStyle]="{ color: appTheme.VividSkyBlue, background: appTheme.Background }">
                        <div class="ib-row1">
                            <div class="ib-row1-col1">NIBP</div>
                            <div class="ib-row1-col2">
                                AUTO<br />
                                145/95
                            </div>
                        </div>
                        <div class="ib-row2">
                            <div class="ib-row2-col2">
                                <div>{{ infoBloodPressure1 }}/{{ infoBloodPressure2 }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="info-box" [ngStyle]="{ color: appTheme.VividPink, background: appTheme.Background }">
                        <div class="ib-row1">
                            <div class="ib-row1-col1">SV</div>
                            <div class="ib-row1-col2">
                                ML 100<br />
                                %**** 55
                            </div>
                        </div>
                        <div class="ib-row2">
                            <div class="ib-row2-col2">
                                <div>{{ infoBloodVolume.toFixed(1) }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="info-box" [ngStyle]="{ color: appTheme.VividTeal, background: appTheme.Background }">
                        <div class="ib-row1">
                            <div class="ib-row1-col1">SPO<span style="font-size: 12px">2</span></div>
                            <div class="ib-row1-col2">18:06</div>
                        </div>
                        <div class="ib-row2">
                            <div class="ib-row2-col1">
                                <div>
                                    71-<br />
                                    RESP
                                </div>
                            </div>
                            <div class="ib-row2-col2">
                                <div>{{ infoBloodOxygenation }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
})
export class AppComponent {
    appTheme = appTheme;
    public infoEcg: number = 0;
    public infoBloodPressure1: number = 0;
    public infoBloodPressure2: number = 0;
    public infoBloodVolume: number = 0;
    public infoBloodOxygenation: number = 0;
    drawExample = drawExample;
    private dataUpdateCallback: ((info: TDataUpdateInfo) => void) | null = null;

    onChartInit(event: any) {
        let initResult = event;
        if (initResult.subscribeToDataUpdates) {
            this.dataUpdateCallback = (info: TDataUpdateInfo) => {
                this.infoEcg = info.ecg;
                this.infoBloodPressure1 = info.bloodPressure1;
                this.infoBloodPressure2 = info.bloodPressure2;
                this.infoBloodVolume = info.bloodVolume;
                this.infoBloodOxygenation = info.bloodOxygenation;
            };
            initResult.subscribeToDataUpdates(this.dataUpdateCallback);
        }

        if (initResult.controls.startUpdate) {
            initResult.controls.startUpdate();
        }
    }
}
