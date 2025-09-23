import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScichartAngularComponent } from 'scichart-angular';
import {
  EAxisType,
  EChart2DModifierType,
  EChart3DModifierType,
  EPointMarker3DType,
  ESciChartSurfaceType,
  ESeriesType,
  ESeriesType3D,
  EThemeProviderType,
  ISciChartSurfaceBase,
  NumberRange,
  SciChart3DSurface,
  SciChartSurface,
  Vector3,
} from 'scichart';

@Component({
  selector: 'app-second-chart-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ScichartAngularComponent],
  templateUrl: './second-chart-group.component.html',
  styleUrl: './second-chart-group.component.css',
})
export class SecondChartGroupComponent {
  showChart = true;

  config = {
    xAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: 'X Axis' } }],
    yAxes: [{ type: EAxisType.NumericAxis, options: { axisTitle: 'Y Axis' } }],
    series: [
      {
        type: ESeriesType.SplineMountainSeries,
        options: {
          fill: '#3ca832',
          stroke: '#eb911c',
          strokeThickness: 4,
          opacity: 0.4,
        },
        xyData: { xValues: [1, 2, 3, 4, 5, 6, 7, 8], yValues: [1, 4, 7, 3, 6, 2, 5, 8] },
      },
    ],
    modifiers: [
      { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
      { type: EChart2DModifierType.MouseWheelZoom },
      { type: EChart2DModifierType.ZoomExtents },
    ],
  };

  config3D = {
    type: ESciChartSurfaceType.Default3D,
    surface: {
      theme: { type: EThemeProviderType.Navy },
      cameraOptions: {
        position: new Vector3(230, 300, 380),
        target: new Vector3(0, 70, 0),
        fieldOfView: 50,
      },
      // isXYPlaneVisible: false,
      // isZXPlaneVisible: false,
      isZYPlaneVisible: false,
    },
    xAxis: {
      type: EAxisType.NumericAxis3D,
      options: {
        labelPrecision: 0,
        visibleRange: new NumberRange(-5, 5),
      },
    },
    yAxis: {
      type: EAxisType.NumericAxis3D,
      options: {
        labelPrecision: 0,
        visibleRange: new NumberRange(0, 8),
        axisTitle: 'Y Axis',
      },
    },
    zAxis: {
      type: EAxisType.NumericAxis3D,
      options: {
        labelPrecision: 0,
        visibleRange: new NumberRange(-5, 5),
      },
    },
    series: [
      {
        type: ESeriesType3D.ColumnRenderableSeries3D,
        options: {
          stroke: '#AA0000FF',
        },
        xyzData: {
          xValues: [0, 1, 2, 3, 4],
          zValues: [0, -1, -2, -3, -4],
          yValues: [1, 4, 2, 3, 0.5],
        },
      },
      {
        type: ESeriesType3D.PointLineRenderableSeries3D,
        options: {
          stroke: '#88aaFFFF',
          strokeThickness: 5,
          pointMarker: {
            type: EPointMarker3DType.Ellipse,
            options: {
              size: 5,
              fill: '#00FF66',
            },
          },
        },
        xyzData: {
          xValues: [0, -1, -2, -3, -4],
          zValues: [0, 1, 2, 3, 4],
          yValues: [1, 4, 2, 3, 0.5],
        },
      },
      {
        type: ESeriesType3D.ScatterRenderableSeries3D,
        options: {
          id: 'scatterSeries',
          stroke: '#88aaFFFF',
          pointMarker: {
            type: EPointMarker3DType.Pyramid,
            options: {
              size: 15,
              fill: '#6600FF',
            },
          },
        },
        xyzData: {
          xValues: [0, 1, 2, 3, 4],
          zValues: [0, 1, 2, 3, 4],
          yValues: [1, 4, 2, 3, 0.5],
        },
      },
      {
        type: ESeriesType3D.SurfaceMeshRenderableSeries3D,
        options: {
          id: 'meshSeries',
          minimum: 0,
          maximum: 5,
          strokeThickness: 0,
          drawSkirt: false,
        },
        uniformGridData: {
          xStart: -4,
          xStep: 0.5,
          zStart: -4,
          zStep: 1,
          yValues: [
            [1, 3, 2, 2, 1, 2, 1],
            [0, 2, 1, 1, 2, 1, 0],
            [1, 2, 1, 2, 1, 2, 1],
            [1, 1, 2, 1, 1, 2, 1],
          ],
        },
      },
    ],
    modifiers: [
      { type: EChart3DModifierType.MouseWheelZoom },
      { type: EChart3DModifierType.Orbit },
      { type: EChart3DModifierType.PinchZoom },
      { type: EChart3DModifierType.Tooltip },
      { type: EChart3DModifierType.ZoomExtents },
    ],
  };

  onInit2DHandler = (initResult: { sciChartSurface: ISciChartSurfaceBase }) => {
    console.log('onInit2DHandler', initResult);
  };

  onDelete2DHandler = (initResult: { sciChartSurface: ISciChartSurfaceBase }) => {
    console.log('onDelete2DHandler', initResult);
  };

  onInit3DHandler = (initResult: { sciChartSurface: ISciChartSurfaceBase }) => {
    console.log('onInit3DHandler', initResult);
  };

  onDelete3DHandler = (initResult: { sciChartSurface: ISciChartSurfaceBase }) => {
    console.log('onDelete3DHandler', initResult);
  };
}
