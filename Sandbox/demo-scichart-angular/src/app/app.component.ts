import { Component } from '@angular/core';
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
  SplineMountainRenderableSeries,
  GradientParams,
  Point,
  EAnimationType,
  FastErrorBarsRenderableSeries,
  HlcDataSeries,
  EErrorMode,
  EErrorDirection,
  EDataPointWidthMode,
  PinchZoomModifier,
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
export class AppComponent{
  title = 'CodeSandbox';
  private sciChartSurface?: SciChartSurface;
  private sciChart3DSurface?: SciChart3DSurface;

  constructor() {}

  showCharts = true; 
  showAnimation3D = true; 
  showSpline = true;
  showDigitalBand = true; 
  showAnimation = true; 

  toggleCharts() {
    this.showAnimation3D = this.showCharts;
    this.showSpline = this.showCharts;
    this.showDigitalBand = this.showCharts;
    this.showAnimation = this.showCharts;
  }
  
  logVisibilityStatus() {
    console.log(`Animation Chart: ${this.showAnimation}`);
    console.log(`3D Animation Chart: ${this.showAnimation3D}`);
    console.log(`Spline Chart: ${this.showSpline}`);
    console.log(`Digital Band Chart: ${this.showDigitalBand}`);
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
  
   drawExamplespline = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Xy values for the data
    const xValues = [0, 1, 2, 2.5, 4.5, 5, 6, 7, 8];
    const yValues = [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0];

    const randomError = () => Math.random() * 0.2 + 0.2;
    // Low high error (absolute values)
    const lowValues = yValues.map((y) => y - randomError());
    const highValues = yValues.map((y) => y + randomError());

    // Left/right error (absolute values)
    const leftValues = xValues.map((x) => x - randomError());
    const rightValues = xValues.map((x) => x + randomError());

    // add optional mountain series. We use Spline type, for higher performance use FastLine or FastMountainRenderableSeries
    const lineSeries = new SplineMountainRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
        strokeThickness: 5,
        stroke: appTheme.VividSkyBlue,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { offset: 0, color: appTheme.VividSkyBlue + "77" },
            { offset: 1, color: "Transparent" },
        ]),
        animation: { type: EAnimationType.Scale, options: { zeroLine: -1, duration: 500 } },
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    // Define Horizontal Error Bars Series, Error bars require HLC data with absolute values for error whiskers
    const errorBarsHorizontalSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: new HlcDataSeries(wasmContext, {
            xValues,
            yValues,
            highValues: leftValues,
            lowValues: rightValues,
        }),
        errorMode: EErrorMode.Both,
        errorDirection: EErrorDirection.Horizontal,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.3,
        strokeThickness: 4,
        stroke: appTheme.VividSkyBlue + "77",
        animation: { type: EAnimationType.Scale, options: { zeroLine: 0,  duration: 500 } },
    });
    sciChartSurface.renderableSeries.add(errorBarsHorizontalSeries);

    // Define Vertical Error Bars Series, Error bars require HLC data with absolute values for error whiskers
    const errorBarsSeries = new FastErrorBarsRenderableSeries(wasmContext, {
        dataSeries: new HlcDataSeries(wasmContext, { xValues, yValues, highValues, lowValues }),
        errorMode: EErrorMode.Both,
        errorDirection: EErrorDirection.Vertical,
        dataPointWidthMode: EDataPointWidthMode.Relative,
        dataPointWidth: 0.3,
        strokeThickness: 4,
        stroke: appTheme.VividSkyBlue,
        animation: { type: EAnimationType.Scale, options: { zeroLine: 0, duration: 500 } },
        // Add optional pointmarker (or use separate XyScatterRenderableSeries)
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
            strokeThickness: 0,
            fill: appTheme.VividOrange,
        }),
    });
    sciChartSurface.renderableSeries.add(errorBarsSeries);

    // add some interactivity
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new PinchZoomModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    sciChartSurface.zoomExtents();

    return { sciChartSurface };
};

 drawExampleDigitalband = async (rootElement: string | HTMLDivElement) => {
  // Create a SciChartSurface
  const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
      theme: appTheme.SciChartJsTheme,
  });

  // Create an XAxis and YAxis
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "X Axis" }));
  sciChartSurface.yAxes.add(
      new NumericAxis(wasmContext, {
          growBy: new NumberRange(0.4, 0.4),
          axisTitle: "Y Axis",
      })
  );

  // Create some data for the example. We need X, Y and Y1 values
  const xValues = [];
  const yValues = [];
  const y1Values = [];
  const POINTS = 50;
  const STEP = (3 * Math.PI) / POINTS;
  for (let i = 0; i <= POINTS; i++) {
      const k = 1 - i / 100;
      xValues.push(i);
      yValues.push(Math.sin(i * STEP) * k * 0.7);
      y1Values.push(Math.cos(i * STEP) * k);
  }

  // Create the band series and add to the chart
  // The bandseries requires a special dataseries type called XyyDataSeries with X,Y and Y1 values
  sciChartSurface.renderableSeries.add(
      new FastBandRenderableSeries(wasmContext, {
          dataSeries: new XyyDataSeries(wasmContext, { xValues, yValues, y1Values }),
          strokeThickness: 3,
          fill: appTheme.VividOrange + "33",
          fillY1: appTheme.VividSkyBlue + "33",
          stroke: appTheme.VividOrange,
          strokeY1: appTheme.VividSkyBlue,
          isDigitalLine: true,
          animation: new SweepAnimation({ duration: 800 }),
      })
  );

  // Optional: Add some interactivity modifiers
  sciChartSurface.chartModifiers.add(new ZoomExtentsModifier(), new ZoomPanModifier(), new MouseWheelZoomModifier());

  return { wasmContext, sciChartSurface };
};

  ngOnDestroy() {
    if (this.sciChartSurface) {
      console.log("this.sciChartSurface",this.sciChartSurface);
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
