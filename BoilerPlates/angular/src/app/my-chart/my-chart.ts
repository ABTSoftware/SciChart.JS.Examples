import { Component, OnInit, OnDestroy } from '@angular/core';
import { SciChartSurface } from 'scichart';
import { initSciChart } from './initSciChart';

@Component({
  selector: 'app-my-chart',
  imports: [],
  templateUrl: './my-chart.html',
  styleUrl: './my-chart.css',
})
export class MyChart implements OnInit, OnDestroy {
  chartInitializationPromise: Promise<SciChartSurface> | undefined;

  ngOnInit(): void {
    this.cleanupSciChart();
    this.chartInitializationPromise = initSciChart();
  }

  ngOnDestroy() {
    this.cleanupSciChart();
  }

  cleanupSciChart() {
    if (this.chartInitializationPromise) {
      // Delete the chart from the DOM, and dispose of SciChart
      this.chartInitializationPromise.then((sciChartSurface) => {
        sciChartSurface.delete();
      });
      this.chartInitializationPromise = undefined;
    }
  }
}
