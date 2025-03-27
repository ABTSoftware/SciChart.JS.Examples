async function gridlineLabelSpacing(divElementId) {
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        SciChartJsNavyTheme,
        NumberRange,
        MouseWheelZoomModifier3D,
        OrbitModifier3D,
        ResetCamera3DModifier,
    } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: { ...new SciChartJsNavyTheme(), majorGridLineBrush: "#F48420", minorGridLineBrush: "#882B91" },
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-300, 300, -300),
            target: new Vector3(0, 50, 0),
        },
    });

    // #region ExampleA
    // Define the X Axis with automatic spacing, and optional hint to set the max
    // number of gridlines, labels and minor gridlines
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X [Automatic Spacing]",
        visibleRange: new NumberRange(0, 10),
        autoTicks: true, // default value is true. Major/Minor Deltas are calculated automatically
        maxAutoTicks: 5, // Hint: 5 major gridlines and labels
        minorsPerMajor: 4, // Exact: 4 minor gridlines per major gridline
    });
    // #endregion

    // #region ExampleB
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y [Manual Spacing]",
        visibleRange: new NumberRange(0, 10),
        autoTicks: false, // Major/Minor Deltas are specified manually
        majorDelta: 5,
        minorDelta: 1,
    });
    // #endregion
    // #region ExampleC
    const {
        NumericTickProvider, // or import { NumericTickProvider } from "scichart";
    } = SciChart;

    // Custom TickProvider implementation
    //
    class CustomTickProvider extends NumericTickProvider {
        constructor(wasmContext) {
            super(wasmContext);
        }

        // returns an array of minor gridline positions in data space
        // Called once per draw. Can be dynamic
        getMinorTicks(minorDelta, majorDelta, visibleRange) {
            // Todo here: calculate your tick spacing based on axis minorDelta, majorDelta and visibleRange
            // Note we do not return major ticks here, so minor ticks exclude the majors
            return [
                0.2, 0.4, 0.6, 0.8, 1.2, 1.4, 1.6, 1.8, 2.2, 2.4, 2.6, 2.8, 3.0, 3.2, 3.4, 3.6, 3.8, 4.2, 4.4, 4.6, 4.8,
                5.0, 5.2, 5.4, 5.6, 5.8, 6.0, 6.2, 6.4, 6.6, 6.8, 7.0, 7.2, 7.4, 7.6, 7.8, 8.2, 8.4, 8.6, 8.8, 9.0, 9.2,
                9.4, 9.6, 9.8,
            ];
        }

        // returns an array of major gridline positions in data space
        // Called once per draw. Can be dynamic
        getMajorTicks(minorDelta, majorDelta, visibleRange) {
            // Todo here: calculate your tick spacing based on axis minorDelta, majorDelta and visibleRange
            // Note we return the major tick intervals and label intervals here
            return [0, 1, 2, 4, 8];
        }
    }

    // Create the X-Axis
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z [Custom Spacing]",
        visibleRange: new NumberRange(0, 10),
    });

    // Apply the tick provider
    sciChart3DSurface.zAxis.tickProvider = new CustomTickProvider(wasmContext);
    // #endregion

    // Optional: add zooming, panning for the example
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
        new OrbitModifier3D(), // provides 3d rotation on left mouse drag
        new ResetCamera3DModifier()
    ); // resets camera position on double-click
}

gridlineLabelSpacing("scichart-root");
