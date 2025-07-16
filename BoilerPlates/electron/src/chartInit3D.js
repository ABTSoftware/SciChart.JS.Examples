import {
    CameraController,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    Vector3,
    NumericAxis3D,
    SciChart3DSurface,
    SciChartJsNavyTheme,
    ResetCamera3DModifier,
    NumberRange,
    EMeshPaletteMode,
    EDrawMeshAs,
    SurfaceMeshRenderableSeries3D,
    GradientColorPalette,
    UniformGridDataSeries3D
} from "scichart";

// Generates some example data for this demo, returning a 2D array of numbers [zIndex][xIndex]
const generateData = (xSize, zSize) => {
    const heightmapArray = [];
    const wc = xSize*0.5, hc = zSize*0.5;
    const freq = Math.sin(0.5)*0.1 + 0.1;
    for (let z = 0; z < zSize; z++) {
        heightmapArray[z] = [];
        for (let x = 0; x < xSize; x++) {
            const radius = Math.sqrt((wc - z)*(wc - z) + (hc - x)*(hc - x));
            const d = Math.PI*radius*freq;
            const value = Math.sin(d)/d;
            heightmapArray[z][x] = isNaN(value) ? 1.0 : value;
        }
    }
    return heightmapArray;
}


async function initSciChart3D() {
    // Create a SciChart3DSurface in the host <div id=".." />
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create("scichart-3d-root", {
        theme: new SciChartJsNavyTheme(),
        // worldDimensions: new Vector3(300, 200, 300),
    });
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-300, 300, -300),
        target: new Vector3(0, 50, 0),
    });

    // Declare your X,Y,Z axis
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis", visibleRange: new NumberRange(0, 1) });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    // Finally, create a SurfaceMeshRenderableSeries3D and add to the chart
    const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
        dataSeries: new UniformGridDataSeries3D(wasmContext, {
            // Create a 2D array and fill this with data. returns 2D array [zIndex][xIndex]
            yValues: generateData(40, 40),
            xStep: 1, // Defines each cell in X occupies 1 data point on the X axis
            zStep: 1, // Defines each cell in Z occupies 1 data point on the Z axis
            dataSeriesName: "Uniform Surface Mesh"
        }),

        minimum: 0,   // minimum value corresponds to colorMap offset=0
        maximum: 1.0, // maximum value corresponds to colorMap offset=1
        stroke: "#FFFFFF", // Wireframe stroke
        strokeThickness: 1.5,
        drawSkirt: false, // Draws solid wall to zero
        drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME, // Draw mesh as solid, wireframe or solid wireframe
        meshPaletteMode: EMeshPaletteMode.HEIGHT_MAP_SOLID_CELLS, // Interpolation mode for cell colors

        meshColorPalette: new GradientColorPalette(wasmContext, {
            gradientStops: [
                {offset: 1, color: "#EC0F6C"},
                {offset: 0.55, color: "#F48420"},
                {offset: 0.3, color: "#67BDAF"},
                {offset: 0.2, color: "#50C7E0"},
                {offset: 0.1, color: "#264B93"},
                {offset: 0, color: "#14233C"}
            ],
        }),
    });
    sciChart3DSurface.renderableSeries.add(series);

    // Add mouse interactivity
    sciChart3DSurface.chartModifiers.add(
        new OrbitModifier3D(), 
        new MouseWheelZoomModifier3D(), 
        new ResetCamera3DModifier()
    );

    return sciChart3DSurface;
}

// Note: When using SciChart.js in React, Angular, Vue use component lifecycle to delete the chart on unmount
// for examples see the Vue/React/Angular boilerplates at https://www.scichart.com/getting-started/scichart-javascript/
initSciChart3D();
