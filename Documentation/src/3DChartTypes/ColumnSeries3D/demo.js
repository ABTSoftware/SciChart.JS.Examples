const gaussianRandom = (mean, stdev) => {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
};

async function columnRenderableSeries3D(divElementId) {
  // #region ExampleA
  // Demonstrates how to create a 3D Lines chart in SciChart.js
  const {
    SciChart3DSurface,
    NumericAxis3D,
    Vector3,
    SciChartJsNavyTheme,
    ColumnRenderableSeries3D,
    XyzDataSeries3D,
    CylinderPointMarker3D,
    CubePointMarker3D,
    PyramidPointMarker3D,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    NumberRange,
    EAutoRange,
    parseColorToUIntArgb,
  } = SciChart;

  // or, for npm, import { SciChart3DSurface, ... } from "scichart"

  // Create a SciChart3DSurface in the host <div id=".." />
  const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(
    divElementId,
    {
      theme: new SciChartJsNavyTheme(),
      worldDimensions: new Vector3(300, 200, 300),
      cameraOptions: {
        position: new Vector3(-300, 300, -300),
        target: new Vector3(0, 50, 0),
      },
    }
  );

  // Declare your axis like this
  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "X Axis",
    autoRange: EAutoRange.Once,
  });
  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "Y Axis",
    autoRange: EAutoRange.Once,
  });
  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
    axisTitle: "Z Axis",
    autoRange: EAutoRange.Once,
    growBy: new NumberRange(0.2, 0.2),
  });

  const metadata = ["red", "orange", "yellow", "green", "blue"].map((c) => ({
    vertexColor: parseColorToUIntArgb(c),
  }));
  sciChart3DSurface.renderableSeries.add(
    new ColumnRenderableSeries3D(wasmContext, {
      dataSeries: new XyzDataSeries3D(wasmContext, {
        xValues: [0, 1, 2, 3, 4],
        yValues: [0, 1, 2, 3, 4],
        zValues: [0, 1, 2, 3, 4],
        metadata,
      }),
      dataPointWidthX: 0.5,
      dataPointWidthZ: 0.5,
      // Per column coloring using metadata
      useMetadataColors: true,
      pointMarker: new CylinderPointMarker3D(wasmContext),
    })
  );

  const xValues = [];
  const yValues = [];
  const zValues = [];

  for (let i = 0; i < 50; i++) {
    xValues.push(gaussianRandom(2, 0.5));
    yValues.push(gaussianRandom(0, 1));
    zValues.push(gaussianRandom(0, 0.5));
  }

  // Add a ColumnRenderableSeries3D
  sciChart3DSurface.renderableSeries.add(
    new ColumnRenderableSeries3D(wasmContext, {
      dataSeries: new XyzDataSeries3D(wasmContext, {
        xValues,
        yValues,
        zValues,
      }),
      dataPointWidthX: 0.2,
      dataPointWidthZ: 0.2,
      // Can set fill and pointMarker type
      fill: "#EC0F6C",
      pointMarker: new PyramidPointMarker3D(wasmContext),
    })
  );

  xValues.length = 0;
  yValues.length = 0;
  zValues.length = 0;
  for (let i = 0; i < 20; i++) {
    xValues.push(i * 0.2);
    yValues.push(gaussianRandom(0, 1));
    zValues.push(2);
  }

  const colSeries = new ColumnRenderableSeries3D(wasmContext, {
    dataSeries: new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues }),
    opacity: 0.9,
    dataPointWidthX: 0.95,
    // fill only - uses default cube pointmarker
    fill: "#F48420",
  });
  // Custom Width calculation to fit all the columns into the available width
  colSeries.getDataPointWidth = (rpd, dataPointWidthX, dataPointWidthZ) => {
    const xWidth = rpd.xCalc.viewportDimension;
    const pixelsPerColumn = xWidth / xValues.length;
    return Math.floor(pixelsPerColumn * dataPointWidthX);
  };
  sciChart3DSurface.renderableSeries.add(colSeries);

  // Optional: add zooming, panning for the example
  sciChart3DSurface.chartModifiers.add(
    new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
    new OrbitModifier3D(), // provides 3d rotation on left mouse drag
    new ResetCamera3DModifier()
  ); // resets camera position on double-click
  // #endregion
}

columnRenderableSeries3D("scichart-root");
