async function drawExample(divElementId) {
    // Demonstrates how to configure chart titles SciChart.js
    const {
        SciChart3DSurface,
        CameraController,
        Vector3,
        NumericAxis3D,
        PinchZoomModifier3D,
    } = SciChart;

    // or, for npm, import { SciChartSurface, ... } from "scichart"

    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(divElementId);

    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(300, 300, 300),
        target: new Vector3(0, 50, 0)
    });

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext);
    sciChart3DSurface.xAxis.axisTitle = "X Axis";

    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext);
    sciChart3DSurface.yAxis.axisTitle = "Y Axis";

    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext);
    sciChart3DSurface.zAxis.axisTitle = "Z Axis";

    sciChart3DSurface.chartModifiers.add(new PinchZoomModifier3D({growFactor: 0.3}));
}

drawExample("scichart-root");
