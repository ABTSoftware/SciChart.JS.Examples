import { Component, OnInit } from '@angular/core';
import { SciChartSurface, XyDataSeries, NumericAxis, NumberRange, EllipsePointMarker, SquarePointMarker, CrossPointMarker, SpritePointMarker, TrianglePointMarker, createImageAsync, ZoomPanModifier, ZoomExtentsModifier, MouseWheelZoomModifier, SplineLineRenderableSeries, LegendModifier, ELegendOrientation, ELegendPlacement } from 'scichart';

import { appTheme } from '../../../theme'; // Adjust path as necessary

@Component({
  selector: 'app-use-pointer',
  template: `<div id="usepointmarkers" style="width: 100%; height: 600px;"></div>`
  })
export class UsePointMarkers implements OnInit {

  constructor() { }

  async ngOnInit() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('usepointmarkers', {
      theme: appTheme.SciChartJsTheme,
    });

    const dataSeriesArr = this.createData(wasmContext);

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Add your renderable series here

    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 3,
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 13,
                height: 13,
                strokeThickness: 2,
                fill: appTheme.VividSkyBlue,
                stroke: appTheme.ForegroundColor,
            }),
            dataSeries: dataSeriesArr[0],
        })
    );

    // Add a scatter series with SquarePointMarker
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividPink,
            strokeThickness: 3,
            pointMarker: new SquarePointMarker(wasmContext, {
                width: 11,
                height: 11,
                strokeThickness: 2,
                fill: appTheme.MutedPink,
                stroke: appTheme.VividPink,
            }),
            dataSeries: dataSeriesArr[1],
        })
    );

    // Add a scatter series with TrianglePointMarker
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividOrange,
            strokeThickness: 3,
            pointMarker: new TrianglePointMarker(wasmContext, {
                width: 13,
                height: 13,
                strokeThickness: 2,
                fill: appTheme.VividOrange,
                stroke: appTheme.VividOrange,
            }),
            dataSeries: dataSeriesArr[2],
        })
    );

    // Add a scatter series with CrossPointMarker
    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.VividPurple,
            strokeThickness: 3,
            pointMarker: new CrossPointMarker(wasmContext, {
                width: 13,
                height: 13,
                strokeThickness: 3,
                stroke: appTheme.VividPurple,
            }),
            dataSeries: dataSeriesArr[3],
        })
    );

    // Add a scatter series with Custom Image using SpritePointMarker
    const imageBitmap = await createImageAsync('/assets/images/CustomMarkerImage.png');

    sciChartSurface.renderableSeries.add(
        new SplineLineRenderableSeries(wasmContext, {
            stroke: appTheme.MutedOrange,
            strokeThickness: 2,
            pointMarker: new SpritePointMarker(wasmContext, {
                image: imageBitmap,
            }),
            dataSeries: dataSeriesArr[4],
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());

    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    sciChartSurface.chartModifiers.add(
        new LegendModifier({
            orientation: ELegendOrientation.Horizontal,
            placement: ELegendPlacement.TopLeft,
        })
    );

    sciChartSurface.zoomExtents();

    return { sciChartSurface, wasmContext };
  }

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
