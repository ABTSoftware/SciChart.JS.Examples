import * as React from "react";
import { CameraController } from "scichart3d/Charting3D/CameraController";
import { MouseWheelZoomModifier3D } from "scichart3d/Charting3D/ChartModifiers/MouseWheelZoomModifier3D";
import { OrbitModifier3D } from "scichart3d/Charting3D/ChartModifiers/OrbitModifier3D";
import { Vector3 } from "scichart3d/Charting3D/Vector3";
import { NumericAxis3D } from "scichart3d/Charting3D/Visuals/Axis/NumericAxis3D";
import { SciChart3DSurface } from "scichart3d/Charting3D/Visuals/SciChart3DSurface";
import {
    EDrawMeshAs,
    SurfaceMeshRenderableSeries3D,
} from "scichart3d/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D";
import { GradientColorPalette } from "scichart3d/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette";
import { UniformGridDataSeries3D } from "scichart3d/Charting3D/Model/DataSeries/UniformGridDataSeries3D";
import { NumberRange } from "scichart3d/Core/NumberRange";
import { zeroArray2D } from "scichart3d/utils/zeroArray2D";

const divElementId = "chart";

// SCICHART CODE
const drawExample = async () => {
    // Create a SciChart3DSurface
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(divElementId);

    // Create and position the camera in the 3D world
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-200, 200, -200),
        target: new Vector3(0, 50, 0),
    });
    // Set the worlddimensions, which defines the Axis cube size
    sciChart3DSurface.worldDimensions = new Vector3(200, 100, 200);

    // Add an X,Y and Z Axis
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Y Axis",
        visibleRange: new NumberRange(0, 0.3),
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

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
        dataSeriesName: "Uniform Surface Mesh",
    });

    // Create the color map
    const colorMap = new GradientColorPalette(wasmContext, {
        gradientStops: [
            { offset: 1, color: "#8B0000" },
            { offset: 0.9, color: "#FF0000" },
            { offset: 0.7, color: "#FF0000" },
            { offset: 0.5, color: "#ADFF2F" },
            { offset: 0.3, color: "#00FFFF" },
            { offset: 0.1, color: "#0000FF" },
            { offset: 0, color: "#1D2C6B" },
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
        lightingFactor: 0.8,
        highlight: 1.0,
        stroke: "rgba(24,139,34,0.5)",
        strokeThickness: 2.0,
        contourStroke: "rgba(24,139,34,0.5)",
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

    return { sciChart3DSurface, wasmContext };
};

// REACT COMPONENT
export default function SurfaceMesh3DChart() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChart3DSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChart3DSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} style={{ maxWidth: 900 }} />;
}
