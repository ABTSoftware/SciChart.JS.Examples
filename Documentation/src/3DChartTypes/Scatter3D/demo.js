import * as SciChart from "scichart";

const generateData = () => {
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

    for (let i = 0; i < 1000; i++) {
        xValues.push(gaussianRandom(0, 1));
        yValues.push(gaussianRandom(0, 1));
        zValues.push(gaussianRandom(0, 1));
    }
    return { xValues, yValues, zValues };
};

async function scatter3DChart(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a 3D Scatter chart in SciChart.js
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        SciChartJsNavyTheme,
        ScatterRenderableSeries3D,
        XyzDataSeries3D,
        SpherePointMarker3D,
        MouseWheelZoomModifier3D,
        OrbitModifier3D,
        ResetCamera3DModifier,
        NumberRange
    } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-300, 300, -300),
            target: new Vector3(0, 50, 0)
        }
    });

    // Declare your axis like this
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X Axis",
        visibleRange: new NumberRange(-3, 3)
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
        visibleRange: new NumberRange(-3, 3)
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis",
        visibleRange: new NumberRange(-3, 3)
    });

    // returns data in arrays of numbers e.g. xValues = [0,1,2,3,4], yValues = [0,1,2,3,4], zValues = [0,1,2,3,4]
    const { xValues, yValues, zValues } = generateData();

    // Add a ScatterRenderableSeries3D
    sciChart3DSurface.renderableSeries.add(
        new ScatterRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues,
                yValues,
                zValues
            }),
            opacity: 0.5,
            pointMarker: new SpherePointMarker3D(wasmContext, {
                fill: "#EC0F6C",
                size: 10
            })
        })
    );

    // Optional: add zooming, panning for the example
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
        new OrbitModifier3D(), // provides 3d rotation on left mouse drag
        new ResetCamera3DModifier()
    ); // resets camera position on double-click
    // #endregion
}

scatter3DChart("scichart-root");
