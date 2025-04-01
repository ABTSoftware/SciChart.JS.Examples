import * as SciChart from "scichart";

const generateData = index => {
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
    // #region ExampleA
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
        EAutoRange
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
        autoRange: EAutoRange.Once
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
        autoRange: EAutoRange.Once
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis",
        autoRange: EAutoRange.Once,
        growBy: new NumberRange(0.2, 0.2)
    });

    // returns data in arrays of numbers e.g. xValues = [0,1,2,3,4], yValues = [0,1,2,3,4], zValues = [0,1,2,3,4]
    const { xValues, yValues, zValues } = generateData(1);

    // Add a PointLineRenderableSeries3D
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, { xValues, yValues, zValues }),
            opacity: 0.9,
            stroke: "#EC0F6C",
            strokeThickness: 3
        })
    );

    // Repeat 2x
    const dataset1 = generateData(2);
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues: dataset1.xValues,
                yValues: dataset1.yValues,
                zValues: dataset1.zValues
            }),
            opacity: 0.9,
            stroke: "#50C7E0",
            strokeThickness: 3,
            // Pointmarkers are optional. Many different pointmarker types are supported
            pointMarker: new EllipsePointMarker3D(wasmContext, { size: 3 })
        })
    );

    const dataset2 = generateData(3);
    sciChart3DSurface.renderableSeries.add(
        new PointLineRenderableSeries3D(wasmContext, {
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues: dataset2.xValues,
                yValues: dataset2.yValues,
                zValues: dataset2.zValues
            }),
            opacity: 0.9,
            stroke: "#F48420",
            strokeThickness: 3
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

pointLineRenderableSeries3D("scichart-root");
