import { Component, AfterViewInit } from '@angular/core';
import { chartBuilder } from 'scichart/Builder/chartBuilder';
import { ESeriesType } from 'scichart/types/SeriesType';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  title = 'angular-scichart-demo';

  ngAfterViewInit(): void {
    console.log('Init SciChart in ngAfterViewInit');
    initSciChart();
  }
}

async function initSciChart(): Promise<void> {
  // LICENSING //
  // Set your license code here
  // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
  // Purchased license keys can be viewed at https://www.scichart.com/profile
  //
  // e.g.
  //
  // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
  //
  // Also, once activated (trial or paid license) having the licensing wizard open on your machine
  // will mean any or all applications you run locally will be fully licensed.

  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(
    'scichart-root-id',
    {
      series: {
        type: ESeriesType.LineSeries,
        xyData: { xValues: [1, 2, 3, 4, 5], yValues: [1, 4, 8, 2, 6] },
      },
    }
  );

  // That's it! You just created your first SciChartSurface!
}
