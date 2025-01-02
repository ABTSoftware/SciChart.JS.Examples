import {
  SciChartSurface,
  NumericAxis,
  LineAnnotation,
  BoxAnnotation,
  TextAnnotation,
  CustomAnnotation,
  EHorizontalAnchorPoint,
  EVerticalAnchorPoint,
  ECoordinateMode,
} from "scichart";

async function initSciChart() {
  // Create the SciChartSurface in the div 'scichart-root'
  // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
  // instance must be passed to other types that exist on the same surface.
  const { sciChartSurface, wasmContext } = await SciChartSurface.create(
    "scichart-root"
  );

  // Create an X,Y Axis and add to the chart
  sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
  sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

  // #region ExampleA
  // Add line annotation
  sciChartSurface.annotations.add(
    new LineAnnotation({
      stroke: "#FF6600",
      strokeThickness: 3,
      x1: 1.0,
      x2: 4.0,
      y1: 6.0,
      y2: 9.0,
    })
  );

  // Add box annotation
  sciChartSurface.annotations.add(
    new BoxAnnotation({
      stroke: "#33FF33",
      strokeThickness: 1,
      fill: "rgba(50, 255, 50, 0.3)",
      x1: 6.0,
      x2: 9.0,
      y1: 6.0,
      y2: 9.0,
    })
  );
  // #endregion

  // #region ExampleB
  // Add text annotation
  sciChartSurface.annotations.add(
    new TextAnnotation({
      x1: 0.25,
      y1: 0.75,
      xCoordinateMode: ECoordinateMode.Relative,
      yCoordinateMode: ECoordinateMode.Relative,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      verticalAnchorPoint: EVerticalAnchorPoint.Center,
      textColor: "yellow",
      fontSize: 26,
      fontFamily: "Comic Sans MS",
      text: "TEXT ANNOTATION",
    })
  );
  // #endregion

  // #region ExampleC
  // Add custom SVG annotation
  const svgString = `
  <svg baseProfile="full" width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="100" fill="rgba(50,50,255,0.3)" />
      <text x="100" y="125" font-size="60" text-anchor="middle" fill="white">SVG</text>
  </svg>`;
  sciChartSurface.annotations.add(
    new CustomAnnotation({
      x1: 7.5,
      y1: 2.5,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      verticalAnchorPoint: EVerticalAnchorPoint.Center,
      svgString,
    })
  );
  // #endregion

  // #region ExampleD
  // Add a watermark centered on the chart
  sciChartSurface.annotations.add(
    new TextAnnotation({
      x1: 0.5,
      y1: 0.5,
      xCoordinateMode: ECoordinateMode.Relative,
      yCoordinateMode: ECoordinateMode.Relative,
      horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
      verticalAnchorPoint: EVerticalAnchorPoint.Center,
      text: "THIS IS A WATERMARK",
      opacity: 0.33,
      fontSize: 27,
    })
  );

  // Add a box vertically stretched between data-points X=4, X=5
  sciChartSurface.annotations.add(
    new BoxAnnotation({
      x1: 4,
      x2: 5,
      // y:0-1 Relative means stretch vertically
      y1: 0,
      y2: 1,
      yCoordinateMode: ECoordinateMode.Relative,
      strokeThickness: 0,
      fill: "#ff660033",
    })
  );
  // #endregion
}

initSciChart();
