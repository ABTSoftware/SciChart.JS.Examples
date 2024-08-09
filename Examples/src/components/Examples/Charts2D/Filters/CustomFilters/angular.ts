import { Component, ElementRef, OnInit,AfterViewInit,ViewChild } from '@angular/core';
import { drawExample } from "./drawExample";

@Component({
    selector: 'app-custom-filter',
    template: `
<scichart-angular
      [initChart]="drawExample"
      (onInit)="onInit($event)"
      (onDelete)="onDelete($event)"
      style="flex: 1; flex-basis: 50%;">
</scichart-angular>
    `,
})
export class CustomFilters {

    private initResult: any;

    async onInit(initResult: any) {
      this.initResult = initResult;
      this.startDemo();
    }
  
    onDelete() {
      if (this.initResult && this.initResult.controls) {
        this.initResult.controls.stopDemo();
      }
    }
  
    startDemo() {
      if (this.initResult && this.initResult.controls) {
        this.initResult.controls.startDemo();
      }
    }
  
    stopDemo() {
      if (this.initResult && this.initResult.controls) {
        this.initResult.controls.stopDemo();
      }
    }
  
  
    ngOnDestroy() {
      // Cleanup logic can go here
      if (this.initResult && this.initResult.controls) {
        this.initResult.controls.stopDemo();
      }
    }


    drawExample = drawExample;
   
}

