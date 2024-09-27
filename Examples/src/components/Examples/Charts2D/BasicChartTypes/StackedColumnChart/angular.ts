import { Component } from "@angular/core";
import { SciChartSurface, SciChart3DSurface } from "scichart";
import { drawExample } from "./drawExample";

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
    selector: "app-stack-chart",
    template: `
    <style>
      button.custom-button.mdc-button.mat-mdc-button.mat-unthemed.mat-mdc-button-base {
        padding: 2rem !important;
        height: 100%;
        border: 1px solid;
      }
     .toolbar-row {
        display: flex;
        justify-content: space-between;
        align-items: center; 
      }
      .toggle-group {
        display: flex;
      }
    </style>
    <div class="chart-wrapper">
  <div class="toolbar-row">
    <mat-button-toggle-group
      (change)="togglePercentageMode($event.value)"
      [value]="use100PercentStackedMode">
      <mat-button-toggle class="custom-button" [value]="false">Stacked mode</mat-button-toggle>
      <mat-button-toggle class="custom-button" [value]="true">100% Stacked mode</mat-button-toggle>
    </mat-button-toggle-group>
    <button mat-button class="custom-button" (click)="toggleDataLabels()">
    {{ areDataLabelsVisible ? 'Show Data Labels':'Hide Data Labels'}}
    </button>
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
  areDataLabelsVisible = false;
  controls: any;

  constructor() { 
  
  }
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
  this.areDataLabelsVisible = !this.areDataLabelsVisible
  if (this.initResult.controls) {
    this.initResult.controls.toggleDataLabels(this.areDataLabelsVisible);
  }
}
}
