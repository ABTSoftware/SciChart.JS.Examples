import * as SciChart from "scichart";

async function simple3DChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a 3D chart with X,Y,Z axis in SciChart.js
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier3D,
        OrbitModifier3D,
        ResetCamera3DModifier
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
            target: new Vector3(0, 50, 0)
        }
    });

    // SciChart.js 3D supports only a single x,y,z axis. Declare your axis like this
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    // Optional: add zooming, panning for the example
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
        new OrbitModifier3D(), // provides 3d rotation on left mouse drag
        new ResetCamera3DModifier()
    ); // resets camera position on double-click
    // #endregion
}

simple3DChart("scichart-root");
