import { Component } from '@angular/core';
import { ScichartAngularComponent } from 'scichart-angular';
import { appTheme } from './theme';
import {
  SciChartSurface,
  NumericAxis,
  FastLineRenderableSeries,
  XyDataSeries,
  EllipsePointMarker,
  SweepAnimation,
  SciChartJsNavyTheme,
  NumberRange,
  MouseWheelZoomModifier,
  ZoomPanModifier,
  ZoomExtentsModifier,
  EAxisType,
  ESeriesType,
  EChart2DModifierType,
  Vector3,
  CameraController,
  NumericAxis3D,
  zeroArray2D,
  UniformGridDataSeries3D,
  GradientColorPalette,
  SurfaceMeshRenderableSeries3D,
  EDrawMeshAs,
  FastBandRenderableSeries,
  XyyDataSeries,
  MouseWheelZoomModifier3D,
  OrbitModifier3D,
  ResetCamera3DModifier,
  SciChart3DSurface,
  FastBubbleRenderableSeries,
  XyzDataSeries,
  SplineLineRenderableSeries,
  TextAnnotation,
  ECoordinateMode,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
  SeriesAnimation,
  WaveAnimation,
  ScaleAnimation,
  FadeAnimation,
  GenericAnimation,
} from 'scichart';

const waveAnimation = new WaveAnimation({
  zeroLine: 0,
  pointDurationFraction: 0.5,
  duration: 1000,
  fadeEffect: true,
});
const sweepAnimation = new SweepAnimation({ duration: 1000 });
const scaleAnimation = new ScaleAnimation({ duration: 1000, zeroLine: 0 });
const fadeAnimation = new FadeAnimation({ duration: 1000 });

SciChartSurface.loadWasmFromCDN();
SciChart3DSurface.loadWasmFromCDN();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'CodeSandbox';
  private sciChartSurface?: SciChartSurface;
  private sciChart3DSurface?: SciChart3DSurface;

  constructor() {}

  ngOnInit() {
    // charts initialized on component initialization
    this.drawExampleanimation('sciChartAnimation');
    this.drawExampleAnimation3D('sciChartAnimation3D');
  }


  drawExampleanimation = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(
      rootElement,
      {
        theme: appTheme.SciChartJsTheme,
      }
    );

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
      new NumericAxis(wasmContext, { growBy: new NumberRange(0.4, 0.4) })
    );

    // Create some data for the example. We need X, Y and Y1 values
    const xValues = [];
    const yValues = [];
    const y1Values = [];
    const POINTS = 1000;
    const STEP = (3 * Math.PI) / POINTS;
    for (let i = 0; i <= 1000; i++) {
      const k = 1 - i / 2000;
      xValues.push(i);
      yValues.push(Math.sin(i * STEP) * k * 0.7);
      y1Values.push(Math.cos(i * STEP) * k);
    }

    // Create the band series and add to the chart
    // The bandseries requires a special dataseries type called XyyDataSeries with X,Y and Y1 values
    sciChartSurface.renderableSeries.add(
      new FastBandRenderableSeries(wasmContext, {
        dataSeries: new XyyDataSeries(wasmContext, {
          xValues,
          yValues,
          y1Values,
        }),
        strokeThickness: 3,
        fill: appTheme.VividOrange + '33',
        fillY1: appTheme.VividSkyBlue + '33',
        stroke: appTheme.VividOrange,
        strokeY1: appTheme.VividSkyBlue,
        animation: new SweepAnimation({ duration: 1900 }),
      })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(
      new ZoomExtentsModifier(),
      new ZoomPanModifier(),
      new MouseWheelZoomModifier()
    );

    sciChartSurface.zoomExtents();
    return { wasmContext, sciChartSurface };
  };

  drawExampleAnimation3D = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface with theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
      rootElement,
      {
        theme: appTheme.SciChartJsTheme,
      }
    );
    // Create X and Y Axis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create some data
    const xValues = [];
    const yValues = [];
    const zValues = [];
    let prevYValue = 0;
    for (let i = 0; i < 20; i++) {
      const curYValue = Math.sin(i) * 10 + 5;
      const size = Math.sin(i) * 60 + 3;

      xValues.push(i);
      yValues.push(prevYValue + curYValue);
      zValues.push(size);

      prevYValue += curYValue;
    }

    // Create a Bubble Series
    const bubbleSeries = new FastBubbleRenderableSeries(wasmContext, {
      pointMarker: new EllipsePointMarker(wasmContext, {
        width: 64,
        height: 64,
        fill: appTheme.VividSkyBlue + '77',
        strokeThickness: 0,
      }),
      dataSeries: new XyzDataSeries(wasmContext, { xValues, yValues, zValues }),
    });
    sciChartSurface.renderableSeries.add(bubbleSeries);

    // Create a Line Series
    const lineSeries = new SplineLineRenderableSeries(wasmContext, {
      stroke: appTheme.VividSkyBlue,
      strokeThickness: 2,
      opacity: 0.7,
      dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Add watermark annotation
    const watermark = new TextAnnotation({
      text: '',
      x1: 0.5,
      y1: 0.5,
      fontSize: 42,
      opacity: 0.5,
      xCoordinateMode: ECoordinateMode.Relative,
      yCoordinateMode: ECoordinateMode.Relative,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      verticalAnchorPoint: EVerticalAnchorPoint.Center,
    });
    sciChartSurface.annotations.add(watermark);

    // Add title annotation
    sciChartSurface.annotations.add(
      new TextAnnotation({
        text: 'Series Startup Animations in SciChart.js',
        fontSize: 18,
        textColor: appTheme.ForegroundColor,
        x1: 0.5,
        y1: 0,
        opacity: 0.77,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
      })
    );

    // Loop forever and update animations
    let animationState = 0;
    const updateAnimation = () => {
      let currentAnimation: SeriesAnimation = waveAnimation;
      switch (animationState) {
        case 0:
          currentAnimation = waveAnimation;
          sciChartSurface.addAnimation(
            typeWriterAnimation(watermark, 'Wave Animation')
          );
          animationState++;
          break;
        case 1:
          currentAnimation = sweepAnimation;
          sciChartSurface.addAnimation(
            typeWriterAnimation(watermark, 'Sweep Animation')
          );
          animationState++;
          break;
        case 2:
          currentAnimation = scaleAnimation;
          sciChartSurface.addAnimation(
            typeWriterAnimation(watermark, 'Scale Animation')
          );
          animationState++;
          break;
        case 3:
          currentAnimation = fadeAnimation;
          sciChartSurface.addAnimation(
            typeWriterAnimation(watermark, 'Fade Animation')
          );
          animationState = 0;
          break;
      }
      lineSeries.enqueueAnimation(currentAnimation);
      bubbleSeries.enqueueAnimation(currentAnimation);

      if (!sciChartSurface.isDeleted) setTimeout(updateAnimation, 2000);
    };


    updateAnimation();

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    return { wasmContext, sciChartSurface };
  };
  

  ngOnDestroy() {
    // Cleanup and dispose of resources when the component is destroyed
    if (this.sciChartSurface) {
      this.sciChartSurface.delete();
    }
    if (this.sciChart3DSurface) {
      this.sciChart3DSurface.delete();
    }
  }
  

  config = {
    xAxes: [{ type: EAxisType.NumericAxis }],
    yAxes: [{ type: EAxisType.NumericAxis }],
    series: [
      {
        type: ESeriesType.SplineMountainSeries,
        options: {
          fill: '#3ca832',
          stroke: '#eb911c',
          strokeThickness: 4,
          opacity: 0.4,
        },
        xyData: { xValues: [1, 2, 3, 4], yValues: [1, 4, 7, 3] },
      },
    ],
    modifiers: [
      { type: EChart2DModifierType.ZoomPan, options: { enableZoom: true } },
      { type: EChart2DModifierType.MouseWheelZoom },
      { type: EChart2DModifierType.ZoomExtents },
    ],
  };

  onInitHandler = (initResult: any) => {
    console.log('onInitHandler', initResult);
  };
}
const typeWriterAnimation = (
  textAnnotation: TextAnnotation,
  finalText: string
) =>
  new GenericAnimation<string>({
    from: '',
    to: finalText,
    onAnimate: (from: string, to: string, progress: number) => {
      const length = Math.floor(to.length * progress);
      textAnnotation.text = to.substring(0, length);
    },
    duration: 1000,
    setInitialValueImmediately: true,
  });
