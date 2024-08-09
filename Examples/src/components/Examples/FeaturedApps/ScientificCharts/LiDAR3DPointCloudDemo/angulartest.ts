import { Component, OnDestroy,  ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { drawExample, drawHeatmapLegend } from './drawExample'; // Update path based on your project structure
import { ScichartAngularComponent } from 'scichart-angular';
import { SciChart3DSurface } from "scichart";

@Component({
  selector: 'app-lidar-3d-point-cloud-demo',
  template: `<div class="chart-wrapper">
  <div style="position: relative;">
    <div #mainChartContainer style="width: 100%; height: 100%;"></div>
    <div #heatmapLegendContainer style="position: absolute; height: 90%; width: 100px; top: 0; right: 75px; margin: 20px;"></div>
  </div>
</div>
`,
 })
export class LiDAR3DPointCloudDemoComponent implements OnDestroy, AfterViewInit {
    @ViewChild('mainChartContainer') mainChartContainer: ElementRef<HTMLDivElement>;
    @ViewChild('heatmapLegendContainer') heatmapLegendContainer: ElementRef<HTMLDivElement>;
  
    private mainChartSurface: any; // Use appropriate type if available
    private heatmapLegendSurface: any; 
    ngAfterViewInit(): void {
        this.initializeCharts();
      }
    
      async initializeCharts(): Promise<void> {
        try {
          if (this.mainChartContainer) {
            const result = await drawExample(this.mainChartContainer.nativeElement);
            this.mainChartSurface = result.sciChartSurface;
          }
    
          if (this.heatmapLegendContainer) {
            await drawHeatmapLegend(this.heatmapLegendContainer.nativeElement);
          }
        } catch (error) {
          console.error('Error initializing charts:', error);
        }
      }
    
      ngOnDestroy(): void {
        // Perform cleanup if needed
      }
}
