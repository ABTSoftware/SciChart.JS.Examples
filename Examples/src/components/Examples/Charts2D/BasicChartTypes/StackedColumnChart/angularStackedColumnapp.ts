import { Component } from "@angular/core";
import { SciChartSurface, SciChart3DSurface } from "scichart";

// @ts-ignore
import { drawExample } from "./drawExample";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
    selector: "app-stack-chart",
    template: `<div class="chart-wrapper">
  <div class="toolbar-row">
    <mat-button-toggle-group
      (change)="togglePercentageMode($event.value)"
      [value]="use100PercentStackedMode">
      <mat-button-toggle [value]="false">Stacked mode</mat-button-toggle>
      <mat-button-toggle [value]="true">100% Stacked mode</mat-button-toggle>
    </mat-button-toggle-group>

    <mat-button-toggle-group
      (change)="toggleDataLabels()">
      <mat-button-toggle [value]="areDataLabelsVisible">
        {{ areDataLabelsVisible ? 'Hide' : 'Show' }} Data Labels
      </mat-button-toggle>
    </mat-button-toggle-group>
  </div>
  <div id="chart-root" style="width: 100%; height: 100%;"></div>
</div>
 `,
})



export class StackeAppComponent  {
    title = "scichart-angular-app"

  use100PercentStackedMode = false;
  areDataLabelsVisible = true;
  controls: any;

  constructor() { }

  ngOnInit(): void {
    this.initChart();
  }

  async initChart() {
    const container = document.getElementById('chart-root') as HTMLDivElement; 
    const { controls } = await drawExample(container);
    this.controls = controls;
  }

  togglePercentageMode(value: boolean) {
    this.use100PercentStackedMode = value;
    if (this.controls) {
      this.controls.toggleHundredPercentMode(value);
    }
  }

  toggleDataLabels() {
    this.areDataLabelsVisible = !this.areDataLabelsVisible;
    if (this.controls) {
      this.controls.toggleDataLabels(this.areDataLabelsVisible);
    }
  }

}
