import {
    CameraController, EDrawMeshAs, GradientColorPalette, MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D, OrbitModifier3D, ResetCamera3DModifier,
    SciChart3DSurface, SurfaceMeshRenderableSeries3D,
    UniformGridDataSeries3D,
    Vector3,
    zeroArray2D
} from "scichart";
import {appTheme} from "scichart-example-dependencies";

const divElementId = "chart";
const divHeatmapLegend = "heatmapLegend";

// SCICHART CODE
export const drawExample = async () => {
    // Create a SciChart3DSurface
    const {
        sciChart3DSurface,
        wasmContext
    } = await SciChart3DSurface.create(divElementId, {theme: appTheme.SciChartJsTheme});

    // Create and position the camera in the 3D world
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-150, 200, 150),
        target: new Vector3(0, 50, 0),
    });
    // Set the worlddimensions, which defines the Axis cube size
    sciChart3DSurface.worldDimensions = new Vector3(200, 100, 200);

    // Add an X,Y and Z Axis
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {axisTitle: "X Axis"});
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
        visibleRange: new NumberRange(-0.3, 0.3)
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {axisTitle: "Z Axis"});

    // Create a 2D array using the helper function zeroArray2D
    // and fill this with data
    const zSize = 50;
    const xSize = 50;
    const heightmapArray = zeroArray2D([zSize, xSize]);

    // Create a UniformGridDataSeries3D
    const dataSeries = new UniformGridDataSeries3D(wasmContext, {
        yValues: heightmapArray,
        xStep: 1,
        zStep: 1,
        dataSeriesName: "Uniform Surface Mesh"
    });

    const setData = (i: number) => {
        const f = i / 10;
        for (let z = 0; z < zSize; z++) {
            let zVal = z - (zSize / 2);
            for (let x = 0; x < xSize; x++) {
                let xVal = x - (xSize / 2);
                const y = (Math.cos(xVal * 0.2 + f) + Math.cos(zVal * 0.2 + f)) / 5;
                heightmapArray[z][x] = y;
            }
        }
        dataSeries.setYValues(heightmapArray);
    }

    // Create the color map
    const colorMap = new GradientColorPalette(wasmContext, {
        gradientStops: [
            {offset: 1, color: appTheme.VividPink},
            {offset: 0.9, color: appTheme.VividOrange},
            {offset: 0.7, color: appTheme.MutedRed},
            {offset: 0.5, color: appTheme.VividGreen},
            {offset: 0.3, color: appTheme.VividSkyBlue},
            {offset: 0.15, color: appTheme.Indigo},
            {offset: 0, color: appTheme.DarkIndigo}
        ],
    });

    // Finally, create a SurfaceMeshRenderableSeries3D and add to the chart
    const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
        dataSeries,
        minimum: -0.3,
        maximum: 0.5,
        opacity: 0.9,
        cellHardnessFactor: 1.0,
        shininess: 0,
        lightingFactor: 0.0,
        highlight: 1.0,
        stroke: appTheme.VividBlue,
        strokeThickness: 2.0,
        contourStroke: appTheme.VividBlue,
        contourInterval: 2,
        contourOffset: 0,
        contourStrokeThickness: 2,
        drawSkirt: false,
        drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
        meshColorPalette: colorMap,
        isVisible: true
    });

    sciChart3DSurface.renderableSeries.add(series);

    // Optional: Add some interactivity modifiers
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

    let frame = 0;
    let timer: NodeJS.Timeout;
    const updateFunc = () => {
        setData(frame);
        frame++;
    }
    updateFunc();
    const startAnimation = () => {
        frame = 0;
        timer = setInterval(updateFunc, 20);
    }
    const stopAnimation = () => {
        clearInterval(timer);
    }

    return {sciChart3DSurface, wasmContext, controls: { startAnimation, stopAnimation }};
};
