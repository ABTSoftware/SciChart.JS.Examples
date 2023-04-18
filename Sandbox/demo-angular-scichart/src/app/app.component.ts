import { Component, AfterViewInit } from "@angular/core";
import { chartBuilder } from "scichart/Builder/chartBuilder";
import { ESeriesType } from "scichart/types/SeriesType";

async function initSciChart(): Promise<void> {
  const { sciChartSurface, wasmContext } = await chartBuilder.build2DChart(
    "scichart-root-id",
    {
      series: {
        type: ESeriesType.LineSeries,
        xyData: { xValues: [1, 2, 3, 4, 5], yValues: [1, 4, 8, 2, 6] },
      },
    }
  );
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements AfterViewInit {
  title = "angular-scichart-demo";

  ngAfterViewInit(): void {
    console.log("Init SciChart in ngAfterViewInit");
    initSciChart();
  }
}
