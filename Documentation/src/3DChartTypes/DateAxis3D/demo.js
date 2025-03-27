async function numericAxisFormattedAsDates3D(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a 3D chart with X,Y,Z axis in SciChart.js
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        NumberRange,
        SciChartJsNavyTheme,
        ENumericFormat,
        MouseWheelZoomModifier3D,
        OrbitModifier3D,
        ResetCamera3DModifier,
    } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(300, 300, 300),
            target: new Vector3(0, 50, 0),
        },
    });

    // If you want to show an XAxis with dates between 1st March 2023 and 10th March 2023
    const minDate = new Date("2023-03-01");
    const maxDate = new Date("2023-03-10");

    // Create an xAxis and assign to SciChart3DSurface
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "XAxis DD-MM-YYYY",
        // We need to specify some visibleRange to see these two dates
        // SciChart.js expects linux timestamp / 1000
        visibleRange: new NumberRange(minDate.getTime() / 1000, maxDate.getTime() / 1000),
        // Enable formatting as dates. Expects values on this axis to be in seconds since 1970-01-01
        labelFormat: ENumericFormat.Date_DDMMYYYY,
        titleOffset: 100,
    });

    // Create the Y and Z-Axis and assign to SciChart3DSurface
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis",
    });

    // Optional: add zooming, panning for the example
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
        new OrbitModifier3D(), // provides 3d rotation on left mouse drag
        new ResetCamera3DModifier()
    ); // resets camera position on double-click
    // #endregion
}

numericAxisFormattedAsDates3D("scichart-root");
