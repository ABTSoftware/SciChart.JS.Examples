// Generates some example data for this demo, returning a 2D array of numbers [zIndex][xIndex]
const generateData = (xSize, zSize) => {
    const heightmapArray = [];
    const wc = xSize * 0.5,
        hc = zSize * 0.5;
    const freq = Math.sin(0.5) * 0.1 + 0.1;
    for (let z = 0; z < zSize; z++) {
        heightmapArray[z] = [];
        for (let x = 0; x < xSize; x++) {
            const radius = Math.sqrt((wc - z) * (wc - z) + (hc - x) * (hc - x));
            const d = Math.PI * radius * freq;
            const value = Math.sin(d) / d;
            heightmapArray[z][x] = isNaN(value) ? 1.0 : value;
        }
    }
    return heightmapArray;
};

async function columnRenderableSeries3D(divElementId) {
    // #region ExampleA
    // Demonstrates how to create a 3D Column chart in SciChart.js
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        SciChartJsNavyTheme,
        ColumnRenderableSeries3D,
        CubePointMarker3D,
        MouseWheelZoomModifier3D,
        OrbitModifier3D,
        ResetCamera3DModifier,
        XyzDataSeries3D,
    } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-270, 230, -160),
            target: new Vector3(0, 50, 0),
        },
    });

    // Declare your axis like this
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "X Axis",
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Z Axis",
    });

    // Create a 2D array and fill this with data. returns 2D array [zIndex][xIndex]
    const heightmapArray = generateData(25, 25);

    // Unwrap into 3x 1D arrays for xValues, yValues, zValues
    const xValues = [];
    const zValues = [];
    const yValues = heightmapArray.flatMap((row, xIndex) => {
        row.forEach((_, zIndex) => {
            xValues.push(xIndex); // X corresponds to the row index
            zValues.push(zIndex); // Z corresponds to the column index
        });
        return row; // Flattened Z-values for each row
    });

    // Declare an XyzDataSeries3D passing in the x,y,zValues which specify 3d positions
    // of columns.
    // The xValues, zValues provide the position on the floor plane.
    // The yValues provide the heights of columns
    const dataSeries = new XyzDataSeries3D(wasmContext, {
        xValues,
        yValues,
        zValues,
        dataSeriesName: "Column Series 3D",
    });

    // Add the 3D column series to the chart
    sciChart3DSurface.renderableSeries.add(
        new ColumnRenderableSeries3D(wasmContext, {
            dataSeries,
            fill: "#F48420",
            dataPointWidthX: 0.5,
            dataPointWidthZ: 0.5,
            pointMarker: new CubePointMarker3D(wasmContext),
        })
    );

    // Optional: add zooming, panning for the example
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
        new OrbitModifier3D(), // provides 3d rotation on left mouse drag
        new ResetCamera3DModifier() // resets camera position on double-click
    );
    // #endregion
}

columnRenderableSeries3D("scichart-root");
