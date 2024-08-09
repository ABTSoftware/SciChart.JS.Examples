import { Component, AfterViewInit, ViewChild, ElementRef,ChangeDetectorRef } from '@angular/core';
import { SciChart3DSurface } from 'scichart';
import { drawExample, drawHeatmapLegend } from './drawExample'; 

@Component({
  selector: 'app-li-dar3d-point-cloud',
  template: `<div class="chart-container">
  <div class="chart-wrapper">
    <scichart-angular
      #sciChartSurface
      [initChart]="initSciChartSurface"
      style="flex: 1; flex-basis: 50%;">
    </scichart-angular>
    <scichart-angular
      #heatmapLegend
      [initChart]="initHeatmapLegend"
      style="position: absolute; height: 90%; width: 100px; top: 0; right: 75px; margin: 20px;">
    </scichart-angular>
  </div>
</div>
`,
 
})
export class LiDAR3DPointCloudDemoComponent implements AfterViewInit {
    @ViewChild('sciChartSurface', { static: false }) sciChartSurfaceRef!: ElementRef;
    @ViewChild('heatmapLegend', { static: false }) heatmapLegendRef!: ElementRef;

  private sciChartSurface: SciChart3DSurface | undefined;
  constructor(private cd: ChangeDetectorRef) {}

  async ngAfterViewInit() {

    this.cd.detectChanges();

    setTimeout(async () => {
        await this.initializeCharts();
      }, 5000);
  }

async initializeCharts() {
  try {
    // Check if the elements are available
    const sciChartElement = this.sciChartSurfaceRef.nativeElement;
    const heatmapLegendElement = this.heatmapLegendRef.nativeElement;
    
    console.log('SciChartSurface Element:', sciChartElement);
    console.log('HeatmapLegend Element:', heatmapLegendElement);

    if (!sciChartElement || !heatmapLegendElement) {
      throw new Error('One or more chart elements are not available.');
    }

    // Initialize the charts
    const sciChartResult = await drawExample(sciChartElement);
    console.log('SciChart Surface:', sciChartResult.sciChartSurface);

    const heatmapLegendResult = await drawHeatmapLegend(heatmapLegendElement);
    console.log('Heatmap Legend:', heatmapLegendResult.sciChartSurface);

  } catch (error) {
    console.error('Error initializing charts:', error);
  }
}

  initSciChartSurface = drawExample;
  initHeatmapLegend = drawHeatmapLegend;
  
}
