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
   <scichart-angular
      [initChart]="drawExample"
      (onInit)="onInit($event)"
      (onDelete)="onDelete($event)"
      style="flex: 1; flex-basis: 50%;">
     </scichart-angular>
</div>
 `,
})

export class StackeAppComponent  {
    title = "scichart-angular-app"

  use100PercentStackedMode = false;
  areDataLabelsVisible = true;
  controls: any;

  constructor() { }
  private initResult: any;

  drawExample = drawExample;

  async onInit(initResult: any) {
    this.initResult = initResult;
  }

  togglePercentageMode(value: boolean) {
    this.use100PercentStackedMode = value;
    if (this.initResult.controls) {
      this.initResult.controls.toggleHundredPercentMode(value);
    }
  }

  toggleDataLabels() {
    this.areDataLabelsVisible = !this.areDataLabelsVisible;
    if (this.initResult.controls) {
      this.initResult.controls.toggleDataLabels(this.areDataLabelsVisible);
    }
  }

}
