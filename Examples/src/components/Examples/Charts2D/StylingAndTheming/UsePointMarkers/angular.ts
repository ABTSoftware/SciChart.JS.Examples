import { Component, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { SciChartSurface, XyDataSeries, NumericAxis, NumberRange, EllipsePointMarker, SquarePointMarker, CrossPointMarker, SpritePointMarker, TrianglePointMarker, createImageAsync, ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier, SplineLineRenderableSeries, LegendModifier, ELegendOrientation, ELegendPlacement } from 'scichart';
const customPointImage =  "/assets/images/CustomMarkerImage.png";
import { drawExample } from "./drawExample";

@Component({
  selector: 'app-use-pointer',
   template: `<scichart-angular
      [initChart]="drawExample"
      style="flex: 1; flex-basis: 50%;">
      </scichart-angular>`,
  })
export class UsePointMarkers  {

  drawExample = drawExample(customPointImage)

  createData(wasmContext:any) {
       // Create some dataseries
       const dataSeries1 = new XyDataSeries(wasmContext, { dataSeriesName: "Ellipse Marker" });
       const dataSeries2 = new XyDataSeries(wasmContext, { dataSeriesName: "Square Marker" });
       const dataSeries3 = new XyDataSeries(wasmContext, { dataSeriesName: "Triangle Marker" });
       const dataSeries4 = new XyDataSeries(wasmContext, { dataSeriesName: "Cross Marker" });
       const dataSeries5 = new XyDataSeries(wasmContext, { dataSeriesName: "Custom Marker" });
   
       // Append values
       const dataSize = 30;
       for (let i = 0; i < dataSize; i++) {
           dataSeries1.append(i, Math.random());
           dataSeries2.append(i, Math.random() + 1);
           dataSeries3.append(i, Math.random() + 1.8);
           dataSeries4.append(i, Math.random() + 2.5);
           dataSeries5.append(i, Math.random() + 3.6);
       }
   
       // Insert a break into th eline = we do this to test double.NaN for the point marker types
       dataSeries1.update(15, NaN);
       dataSeries2.update(15, NaN);
       dataSeries3.update(15, NaN);
       dataSeries4.update(15, NaN);
       dataSeries5.update(15, NaN);
   
       return [dataSeries1, dataSeries2, dataSeries3, dataSeries4, dataSeries5];
  }
}
