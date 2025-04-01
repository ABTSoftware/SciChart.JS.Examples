import * as SciChart from "scichart";

async function resetCameraModifier3D(divElementId) {
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
            position: new Vector3(-650, 700, 200),
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
    const { ResetCamera3DModifier } = SciChart;

    // or for npm: import { ResetCameraModifier3D } from "scichart"

    sciChart3DSurface.chartModifiers.add(
        new ResetCamera3DModifier({
            // Optional properties. If these are not set,
            // the ResetCameraModifier3D grabs initial state from the SciChart3DSurface.camera
            isAnimated: true,
            animationDuration: 2000,
            // Camera will animate to this position on double click (or initial position if not set)
            destination: {
                radius: 450,
                pitch: 30,
                yaw: 45
            }
        })
    );
    // #endregion
}

resetCameraModifier3D("scichart-root");
