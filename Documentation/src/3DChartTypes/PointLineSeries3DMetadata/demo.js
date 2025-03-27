const generateData = (index) => {
    const gaussianRandom = (mean, stdev) => {
        const u = 1 - Math.random(); // Converting [0,1) to (0,1]
        const v = Math.random();
        const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        // Transform to the desired mean and standard deviation:
        return z * stdev + mean;
    };

    const xValues = [];
    const yValues = [];
    const zValues = [];

    for (let i = 0; i < 50; i++) {
        xValues.push(i * 0.1);
        yValues.push(gaussianRandom(0, 1));
        zValues.push(index);
    }
    return { xValues, yValues, zValues };
};

async function pointLineRenderableSeries3D(divElementId) {
    // Demonstrates how to create a 3D Lines chart in SciChart.js
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        SciChartJsNavyTheme,
        PointLineRenderableSeries3D,
        XyzDataSeries3D,
        EllipsePointMarker3D,
        MouseWheelZoomModifier3D,
        OrbitModifier3D,
        ResetCamera3DModifier,
        NumberRange,
        parseColorToUIntArgb,
        uintArgbColorLerp,
    } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-300, 300, -300),
            target: new Vector3(0, 50, 0),
        },
    });

    // Declare your axis like this
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    // #region ExampleA
    // returns data in arrays of numbers e.g. xValues = [0,1,2,3,4], yValues = [0,1,2,3,4], zValues = [0,1,2,3,4]
    const { xValues, yValues, zValues } = generateData(1);

    const colorHigh = parseColorToUIntArgb("#EC0F6C");
    const colorLow = parseColorToUIntArgb("#30BC9A");
    const yMin = Math.min(...yValues);
    const yMax = Math.max(...yValues);
    const metadata = yValues.map((y, i) => {
        // interpolate y between colorLow and colorHigh using the helper function uintArgbColorLerp
        const t = (y - yMin) / (yMax - yMin);
        const color = uintArgbColorLerp(colorLow, colorHigh, t);
        return { vertexColor: color };
    });

    // Add a PointLineRenderableSeries3D
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues, metadata }),
            opacity: 0.9,
            // When metadata colors are provided, stroke is ignored
            stroke: "#EC0F6C",
            strokeThickness: 3,
            // pointMarkers are optional
            pointMarker: new EllipsePointMarker3D(wasmContext, { size: 3 }),
        })
    );
    // #endregion

    // Optional: add zooming, panning for the example
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
        new OrbitModifier3D(), // provides 3d rotation on left mouse drag
        new ResetCamera3DModifier()
    ); // resets camera position on double-click
}

pointLineRenderableSeries3D("scichart-root");
