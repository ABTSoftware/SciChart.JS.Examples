import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
  standalone: true,
  imports: [RouterOutlet, ScichartAngularComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'scichart-angular-app';

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

  drawExample3D = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(
      rootElement
    );

    // Create and position the camera in the 3D world
    sciChart3DSurface.camera = new CameraController(wasmContext, {
      position: new Vector3(-200, 150, 200),
      target: new Vector3(0, 50, 0),
    });
    // Set the worlddimensions, which defines the Axis cube size
    sciChart3DSurface.worldDimensions = new Vector3(200, 100, 200);

    // Add an X,Y and Z Axis
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
      axisTitle: 'X Axis',
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
      axisTitle: 'Y Axis',
      visibleRange: new NumberRange(0, 0.3),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
      axisTitle: 'Z Axis',
    });

    // Create a 2D array using the helper function zeroArray2D
    // and fill this with data
    const zSize = 25;
    const xSize = 25;
    const heightmapArray = zeroArray2D([zSize, xSize]);
    for (let z = 0; z < zSize; z++) {
      for (let x = 0; x < xSize; x++) {
        const xVal = (x / xSize) * 25.0;
        const zVal = (z / zSize) * 25.0;
        const y = Math.sin(xVal * 0.2) / ((zVal + 1) * 2);
        heightmapArray[z][x] = y;
      }
    }

    // Create a UniformGridDataSeries3D
    const dataSeries = new UniformGridDataSeries3D(wasmContext, {
      yValues: heightmapArray,
      xStep: 1,
      zStep: 1,
      dataSeriesName: 'Uniform Surface Mesh',
    });

    // Create the color map
    const colorMap = new GradientColorPalette(wasmContext, {
      gradientStops: [
        { offset: 1, color: 'pink' },
        { offset: 0.9, color: 'orange' },
        { offset: 0.7, color: 'red' },
        { offset: 0.5, color: 'green' },
        { offset: 0.3, color: 'blue' },
        { offset: 0, color: 'violet' },
      ],
    });

    // Finally, create a SurfaceMeshRenderableSeries3D and add to the chart
    const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
      dataSeries,
      minimum: 0,
      maximum: 0.5,
      opacity: 0.9,
      cellHardnessFactor: 1.0,
      shininess: 0,
      lightingFactor: 0.0,
      highlight: 1.0,
      stroke: 'blue',
      strokeThickness: 2.0,
      contourStroke: 'blue',
      contourInterval: 2,
      contourOffset: 0,
      contourStrokeThickness: 2,
      drawSkirt: false,
      drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME,
      meshColorPalette: colorMap,
      isVisible: true,
    });

    sciChart3DSurface.renderableSeries.add(series);

    // Optional: Add some interactivity modifiers
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

    // the returned result should contain at least a reference to the created surface as `sciChartSurface`
    return { sciChartSurface: sciChart3DSurface };
  };

  drawExample = async (rootElement: string | HTMLDivElement) => {
    // LICENSING
    // Commercial licenses set your license code here
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    // How-to steps at https://www.scichart.com/licensing-scichart-js/
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");

    // Initialize SciChartSurface. Don't forget to await!
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
      rootElement,
      {
        theme: new SciChartJsNavyTheme(),
        title: 'SciChart.js First Chart',
        titleStyle: { fontSize: 22 },
      }
    );

    // Create an XAxis and YAxis with growBy padding
    const growBy = new NumberRange(0.1, 0.1);
    sciChartSurface.xAxes.add(
      new NumericAxis(wasmContext, { axisTitle: 'X Axis', growBy })
    );
    sciChartSurface.yAxes.add(
      new NumericAxis(wasmContext, { axisTitle: 'Y Axis', growBy })
    );

    // Create a line series with some initial data
    sciChartSurface.renderableSeries.add(
      new FastLineRenderableSeries(wasmContext, {
        stroke: 'steelblue',
        strokeThickness: 3,
        dataSeries: new XyDataSeries(wasmContext, {
          xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          yValues: [
            0, 0.0998, 0.1986, 0.2955, 0.3894, 0.4794, 0.5646, 0.6442, 0.7173,
            0.7833,
          ],
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
          width: 11,
          height: 11,
          fill: '#fff',
        }),
        animation: new SweepAnimation({ duration: 300, fadeEffect: true }),
      })
    );

    // Add some interaction modifiers to show zooming and panning
    sciChartSurface.chartModifiers.add(
      new MouseWheelZoomModifier(),
      new ZoomPanModifier(),
      new ZoomExtentsModifier()
    );

    return { sciChartSurface, wasmContext };
  };

  drawExampleAnimation = async (rootElement: string | HTMLDivElement) => {
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
      // Loop forever while SciChartSurface is not deleted (see React Component unmount)
      if (!sciChartSurface.isDeleted) setTimeout(updateAnimation, 2000);
    };

    updateAnimation();

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    return { wasmContext, sciChartSurface };
  };

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
// function typeWriterAnimation(watermark: TextAnnotation, arg1: string): import("scichart").IGenericAnimation {
//   throw new Error('Function not implemented.');
// }
