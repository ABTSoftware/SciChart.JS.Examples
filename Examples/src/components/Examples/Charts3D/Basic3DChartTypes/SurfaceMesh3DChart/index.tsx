import * as React from "react";
import classes from "../../../styles/Examples.module.scss";
import { appTheme } from "../../../theme";

import {
    SciChart3DSurface,
    CameraController,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    Vector3,
    NumericAxis3D,
    EDrawMeshAs,
    SurfaceMeshRenderableSeries3D,
    GradientColorPalette,
    UniformGridDataSeries3D,
    NumberRange,
    zeroArray2D,
    HeatmapLegend,
    ResetCamera3DModifier,
    TooltipModifier3D,
} from "scichart";

const divElementId = "chart";
const divHeatmapLegend = "heatmapLegend";

// SCICHART CODE
const drawExample = async () => {
    // Create a SciChart3DSurface
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create and position the camera in the 3D world
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-200, 150, 200),
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
            { offset: 1, color: appTheme.VividPink },
            { offset: 0.9, color: appTheme.VividOrange },
            { offset: 0.7, color: appTheme.MutedRed },
            { offset: 0.5, color: appTheme.VividGreen },
            { offset: 0.3, color: appTheme.VividSkyBlue },
            { offset: 0.15, color: appTheme.Indigo },
            { offset: 0, color: appTheme.DarkIndigo },
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
        stroke: appTheme.VividBlue,
        strokeThickness: 2.0,
        contourStroke: appTheme.VividBlue,
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
    sciChart3DSurface.chartModifiers.add(new TooltipModifier3D({ tooltipContainerBackground: appTheme.PaleBlue }));

    return { sciChart3DSurface, wasmContext };
};

const drawHeatmapLegend = async () => {
    const { heatmapLegend, wasmContext } = await HeatmapLegend.create(divHeatmapLegend, {
        theme: {
            ...appTheme.SciChartJsTheme,
            sciChartBackground: appTheme.DarkIndigo + "BB",
            loadingAnimationBackground: appTheme.DarkIndigo + "BB",
        },
        yAxisOptions: {
            axisBorder: {
                borderLeft: 1,
                color: appTheme.ForegroundColor + "77",
            },
            majorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 6,
                strokeThickness: 1,
            },
            minorTickLineStyle: {
                color: appTheme.ForegroundColor,
                tickSize: 3,
                strokeThickness: 1,
            },
        },
        colorMap: {
            minimum: 0,
            maximum: 0.5,
            gradientStops: [
                { offset: 1, color: appTheme.VividPink },
                { offset: 0.9, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.MutedRed },
                { offset: 0.5, color: appTheme.VividGreen },
                { offset: 0.3, color: appTheme.VividSkyBlue },
                { offset: 0.15, color: appTheme.Indigo },
                { offset: 0, color: appTheme.DarkIndigo },
            ],
        },
    });

    return heatmapLegend;
};

// REACT COMPONENT
export default function SurfaceMesh3DChart() {
    const sciChartSurfaceRef = React.useRef<SciChart3DSurface>();
    const heatmapLegendRef = React.useRef<HeatmapLegend>();

    React.useEffect(() => {
        const chartInitializationPromise = Promise.all([drawExample(), drawHeatmapLegend()]).then(
            ([{ sciChart3DSurface }, legend]) => {
                sciChartSurfaceRef.current = sciChart3DSurface;
                heatmapLegendRef.current = legend;
            }
        );

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
                sciChartSurfaceRef.current = undefined;
                heatmapLegendRef.current = undefined;
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
                heatmapLegendRef.current.delete();
                sciChartSurfaceRef.current = undefined;
                heatmapLegendRef.current = undefined;
            });
        };
    }, []);

    return (
        <div className={classes.ChartWrapper}>
            <div style={{ position: "relative", height: "100%", width: "100%" }}>
                <div id={divElementId} style={{ position: "absolute", height: "100%", width: "100%" }}></div>
                <div
                    id={divHeatmapLegend}
                    style={{ position: "absolute", height: "95%", width: "100px", right: "75px", margin: "20" }}
                ></div>
            </div>
        </div>
    );
}
