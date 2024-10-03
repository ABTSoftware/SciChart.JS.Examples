import { Component } from "@angular/core";
import { SciChartSurface, SciChart3DSurface } from "scichart";

// @ts-ignore
import { getChartsInitializationAPI } from "./drawExample";
import { TSciChart } from "scichart/types/TSciChart";

@Component({
    selector: "app-line-chart",
    template: `<style>
            .flexOuterContainer {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                background: #14233c;
            }

            .flexContainerRow {
                display: flex;
                flex: auto;
                flex-basis: 33%;
                justify-content: space-between;
                align-content: stretch;
                margin: 10px;
                width: calc(100% - 10px);
            }
            .item {
                flex: auto;
                height: 100%;
            }
        </style>
        <div style="aspect-ratio: 3/2">
            <div class="flexOuterContainer">
                <div class="flexContainerRow">
                    <div class="item"><scichart-angular [initChart]="initJustLineCharts"></scichart-angular></div>
                    <div class="item"><scichart-angular [initChart]="initDigitalLineCharts"></scichart-angular></div>
                    <div class="item"><scichart-angular [initChart]="initTooltipsOnLineCharts"></scichart-angular></div>
                </div>
                <div class="flexContainerRow">
                    <div class="item"><scichart-angular [initChart]="initDashedLineCharts"></scichart-angular></div>
                    <div class="item"><scichart-angular [initChart]="initPalettedLineCharts"></scichart-angular></div>
                    <div class="item"><scichart-angular [initChart]="initHoveredLineCharts"></scichart-angular></div>
                </div>
                <div class="flexContainerRow">
                    <div class="item"><scichart-angular [initChart]="initGapsInLineCharts"></scichart-angular></div>
                    <div class="item"><scichart-angular [initChart]="initVerticalLineCharts"></scichart-angular></div>
                    <div class="item">
                        <scichart-angular [initChart]="initThresholdedLineCharts"></scichart-angular>
                    </div>
                </div>
            </div>
        </div>`,
})
export class AppComponent {
    title = "scichart-angular-app";

    public initJustLineCharts!: TChartInitFunction;
    public initDigitalLineCharts!: TChartInitFunction;
    public initTooltipsOnLineCharts!: TChartInitFunction;
    public initDashedLineCharts!: TChartInitFunction;
    public initPalettedLineCharts!: TChartInitFunction;
    public initHoveredLineCharts!: TChartInitFunction;
    public initGapsInLineCharts!: TChartInitFunction;
    public initVerticalLineCharts!: TChartInitFunction;
    public initThresholdedLineCharts!: TChartInitFunction;

    ngOnInit(): void {
        const charts = getChartsInitializationAPI();
        this.initJustLineCharts = charts.initJustLineCharts;
        this.initDigitalLineCharts = charts.initDigitalLineCharts;
        this.initTooltipsOnLineCharts = charts.initTooltipsOnLineCharts;
        this.initDashedLineCharts = charts.initDashedLineCharts;
        this.initPalettedLineCharts = charts.initPalettedLineCharts;
        this.initHoveredLineCharts = charts.initHoveredLineCharts;
        this.initGapsInLineCharts = charts.initGapsInLineCharts;
        this.initVerticalLineCharts = charts.initVerticalLineCharts;
        this.initThresholdedLineCharts = charts.initThresholdedLineCharts;
    }
}

type TChartInitFunction = (
    rootElement: string | HTMLDivElement
) => Promise<{ sciChartSurface: SciChartSurface; wasmContext: TSciChart }>;
