import * as SciChart from "scichart";

async function mouseWheelZoom3D(divElementId) {
    const { SciChart3DSurface, NumericAxis3D, Vector3, SciChartJsNavyTheme } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        // Optional theme
        theme: new SciChartJsNavyTheme(),
        // Optional dimensions of the axis cube (X,Y,Z) in World coordinates
        worldDimensions: new Vector3(300, 200, 300),
        // Optional initial camera position and target
        cameraOptions: {
            position: new Vector3(-300, 300, -300),
            target: new Vector3(0, 50, 0)
        }
    });

    // SciChart.js 3D supports only a single x,y,z axis. Declare your axis like this
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    const camera = sciChart3DSurface.camera;

    // propertyChanged is raised each time any property changes on the camera
    camera.propertyChanged.subscribe(args => {
        // Log current properties to console. debugOutput returns array of strings
        const cameraDebug = camera.debugOutput();

        // Output the same information to a div on the page
        document.getElementById("debug-camera").innerHTML = cameraDebug.map(line => `<p>${line}</p>`).join("");
    });
    camera.target = new Vector3(0, 60, 0);

    // #region ExampleA
    const { MouseWheelZoomModifier3D } = SciChart;

    // or for npm: import { MouseWheelZoomModifier3D } from "scichart"

    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    // #endregion
}

mouseWheelZoom3D("scichart-root");
