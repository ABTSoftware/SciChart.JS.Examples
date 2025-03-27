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

async function surfaceMesh3DChart(divElementId) {
    // Demonstrates how to create a 3D surface mesh chart with X,Y,Z axis in SciChart.js
    const {
        SciChart3DSurface,
        NumericAxis3D,
        Vector3,
        SciChartJsNavyTheme,
        MouseWheelZoomModifier3D,
        OrbitModifier3D,
        ResetCamera3DModifier,
        EDrawMeshAs,
        UniformGridDataSeries3D,
        SurfaceMeshRenderableSeries3D,
        GradientColorPalette,
        EMeshPaletteMode,
        NumberRange,
    } = SciChart;

    // or, for npm, import { SciChart3DSurface, ... } from "scichart"

    // #region ExampleA
    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        worldDimensions: new Vector3(300, 200, 300),
        cameraOptions: {
            position: new Vector3(-300, 300, -300),
            target: new Vector3(0, 50, 0),
        },
    });

    // Declare your X,Y,Z axis
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
        visibleRange: new NumberRange(0, 1),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    // Create a 2D array and fill this with data. returns 2D array [zIndex][xIndex]
    const heightmapArray = generateData(40, 40);

    const dataSeries = new UniformGridDataSeries3D(wasmContext, {
        yValues: heightmapArray,
        xStep: 1, // Defines each cell in X occupies 1 data point on the X axis
        zStep: 1, // Defines each cell in Z occupies 1 data point on the Z axis
        dataSeriesName: "Uniform Surface Mesh",
    });

    // Create the color map. GradientColorPalette maps heightMap values to a color range
    const colorMap = new GradientColorPalette(wasmContext, {
        gradientStops: [
            { offset: 1, color: "#EC0F6C" },
            { offset: 0.55, color: "#F48420" },
            { offset: 0.3, color: "#67BDAF" },
            { offset: 0.2, color: "#50C7E0" },
            { offset: 0.1, color: "#264B93" },
            { offset: 0, color: "#14233C" },
        ],
    });

    // Finally, create a SurfaceMeshRenderableSeries3D and add to the chart
    const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
        // Apply the Data to the series. Data can be updated dynamically
        dataSeries,
        minimum: 0, // minimum value corresponds to colorMap offset=0
        maximum: 1.0, // maximum value corresponds to colorMap offset=1
        stroke: "White", // Wireframe stroke
        strokeThickness: 1.5,
        drawSkirt: false, // Draws solid wall to zero
        drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME, // Draw mesh as solid, wireframe or solid wireframe
        meshPaletteMode: EMeshPaletteMode.HEIGHT_MAP_SOLID_CELLS, // Interpolation mode for cell colors
        meshColorPalette: colorMap,
    });

    sciChart3DSurface.renderableSeries.add(series);
    // #endregion

    // Optional: add zooming, panning for the example
    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(), // provides camera zoom on mouse wheel
        new OrbitModifier3D(), // provides 3d rotation on left mouse drag
        new ResetCamera3DModifier()
    ); // resets camera position on double-click
}

surfaceMesh3DChart("scichart-root");
