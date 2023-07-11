async function conversionOfCoordinatesIn3D(divElementId) {
  const {
    SciChart3DSurface,
    NumericAxis3D,
    Vector3,
    SciChartJsNavyTheme,
  } = SciChart;

  // or, for npm, import { SciChart3DSurface, ... } from "scichart"

  // Create a SciChart3DSurface in the host <div id=".." />
  const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
    // Optional theme
    theme: new SciChartJsNavyTheme(),
    // Optional dimensions of the axis cube (X,Y,Z) in World coordinates
    worldDimensions: new Vector3(300, 200, 300),
    // Optional initial camera position and target
    cameraOptions: {
      position: new Vector3(300, 300, 300),
      target: new Vector3(0, 50, 0),
    }
  });

  sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
  sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" })
  sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

  // #region ExampleA
  // Get the coordinate calculator
  const coordCalc = sciChart3DSurface.xAxis.getCurrentCoordinateCalculator();

  // Get a world coordinate from data values
  const worldX0 = coordCalc.getCoordinate(0);
  const worldX10 = coordCalc.getCoordinate(10);

  // Convert back to dataValue
  const dataValue0 = coordCalc.getDataValue(worldX0);
  const dataValue10 = coordCalc.getDataValue(worldX10);

  console.log(`Data value at X=${dataValue0} corresponds to world coordinate X=${worldX0}`);
  console.log(`Data value at X=${dataValue10} corresponds to world coordinate X=${worldX10}`);
  // #endregion
};

conversionOfCoordinatesIn3D("scichart-root");
