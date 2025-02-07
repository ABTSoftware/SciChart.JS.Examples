import {
    CameraController,
    EDrawMeshAs,
    GradientColorPalette,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    SciChartJsNavyTheme,
    SurfaceMeshRenderableSeries3D,
    TooltipModifier3D,
    UniformGridDataSeries3D,
    Vector3,
    zeroArray2D,
} from 'scichart';

export const drawExample3D = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChart3DSurface
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(
        rootElement,
        {
            theme: new SciChartJsNavyTheme(),
        }
    );

    // Create and position the camera in the 3D world
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-200, 150, 200),
        target: new Vector3(0, 50, 0),
    });
    // Set the worlddimensions, which defines the Axis cube size
    sciChart3DSurface.worldDimensions = new Vector3(200, 100, 200);

    // Add an X,Y and Z Axis
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: 'X Axis',
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: 'Y Axis',
        visibleRange: new NumberRange(0, 0.3),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: 'Z Axis',
    });

    // Create a 2D array using the helper function zeroArray2D
    // and fill this with data
    const zSize = 25;
    const xSize = 25;
    const heightmapArray = zeroArray2D([zSize, xSize]);
    for (let z = 0; z < zSize; z++) {
        for (let x = 0; x < xSize; x++) {
            const xVal = (x / xSize) * 25.0;
            const zVal = (z / zSize) * 25.0;
            const y = Math.sin(xVal * 0.2) / ((zVal + 1) * 2);
            heightmapArray[z][x] = y;
        }
    }

    // Create a UniformGridDataSeries3D
    const dataSeries = new UniformGridDataSeries3D(wasmContext, {
        yValues: heightmapArray,
        xStep: 1,
        zStep: 1,
        dataSeriesName: 'Uniform Surface Mesh',
    });

    // Create the color map
    const colorMap = new GradientColorPalette(wasmContext, {
        gradientStops: [
            { offset: 1, color: 'pink' },
            { offset: 0.9, color: '#FF5E01 ' },
            { offset: 0.7, color: 'red' },
            { offset: 0.5, color: 'green' },
            { offset: 0.3, color: '#87CEEB' },
            { offset: 0.15, color: 'indigo' },
            { offset: 0, color: '#1F0954' },
        ],
    });

    // Finally, create a SurfaceMeshRenderableSeries3D and add to the chart
    const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
        dataSeries,
        minimum: 0,
        maximum: 0.5,
        opacity: 0.9,
        cellHardnessFactor: 1.0,
        shininess: 0,
        lightingFactor: 0.0,
        highlight: 1.0,
        stroke: 'blue',
        strokeThickness: 2.0,
        contourStroke: 'blue',
        contourInterval: 2,
        contourOffset: 0,
        contourStrokeThickness: 2,
        drawSkirt: false,
        drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME,
        meshColorPalette: colorMap,
        isVisible: true,
    });

    sciChart3DSurface.renderableSeries.add(series);

    // Optional: Add some interactivity modifiers
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());
    sciChart3DSurface.chartModifiers.add(
        new TooltipModifier3D({ tooltipContainerBackground: '#B3EBF2' })
    );

    return { sciChartSurface: sciChart3DSurface, wasmContext };
};
