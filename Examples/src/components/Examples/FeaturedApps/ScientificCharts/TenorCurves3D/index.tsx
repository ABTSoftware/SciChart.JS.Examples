import * as React from "react";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import {
    EDrawMeshAs,
    SurfaceMeshRenderableSeries3D
} from "scichart/Charting3D/Visuals/RenderableSeries/SurfaceMesh/SurfaceMeshRenderableSeries3D";
import { zeroArray2D } from "scichart/utils/zeroArray2D";
import { UniformGridDataSeries3D } from "scichart/Charting3D/Model/DataSeries/UniformGridDataSeries3D";
import { GradientColorPalette } from "scichart/Charting3D/Visuals/RenderableSeries/SurfaceMesh/GradientColorPalette";
import { OrbitModifier3D } from "scichart/Charting3D/ChartModifiers/OrbitModifier3D";
import { NumericAxis3D } from "scichart/Charting3D/Visuals/Axis/NumericAxis3D";
import { MouseWheelZoomModifier3D } from "scichart/Charting3D/ChartModifiers/MouseWheelZoomModifier3D";
import { CameraController } from "scichart/Charting3D/CameraController";
import { Vector3 } from "scichart/Charting3D/Vector3";
import { SciChart3DSurface } from "scichart/Charting3D/Visuals/SciChart3DSurface";
import { EColor } from "scichart/types/Color";
import { getTenorCurveData } from "./TenorCurveData";
import { IDeletable } from "scichart/Core/IDeletable";
export const divElementId1 = "sciChart1";
export const divElementId2 = "sciChart2";
export const divElementId3 = "sciChart3";

export const X_2D_CHART_SIZE = 288;
export const Y_2D_CHART_SIZE = 289;
export const X_3D_CHART_SIZE = 600;
export const Y_3D_CHART_SIZE = 600;
export const CHART_MARGIN = 22;

const X_DATA_SIZE = 25;
const Z_DATA_SIZE = 25;

export const drawChart1 = async () => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(divElementId1);

    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-280, 250, -280),
        target: new Vector3(0, 50, 0)
    });
    sciChart3DSurface.camera.aspectRatio = 1.333;
    sciChart3DSurface.camera.fieldOfView = 45;

    sciChart3DSurface.worldDimensions = new Vector3(200, 100, 200);

    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    const heightmapArray = zeroArray2D([Z_DATA_SIZE, X_DATA_SIZE]);
    const tenorCurvesData = getTenorCurveData(X_DATA_SIZE, Z_DATA_SIZE);
    for (let z = 0; z < Z_DATA_SIZE; z++) {
        for (let x = 0; x < X_DATA_SIZE; x++) {
            heightmapArray[x][z] = tenorCurvesData[x][z];
        }
    }

    const dataSeries = new UniformGridDataSeries3D(wasmContext, {
        yValues: heightmapArray,
        xStep: 1,
        zStep: 1,
        dataSeriesName: "Uniform Surface Mesh"
    });

    const colorMap = new GradientColorPalette(wasmContext, {
        gradientStops: [
            { offset: 1, color: "#8B0000" },
            { offset: 0.9, color: "#FF0000" },
            { offset: 0.7, color: "#FFFF00" },
            { offset: 0.5, color: "#ADFF2F" },
            { offset: 0.3, color: "#00FFFF" },
            { offset: 0.1, color: "#0000FF" },
            { offset: 0, color: "#1D2C6B" }
        ]
    });

    const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
        dataSeries,
        minimum: 1,
        maximum: 2.69,
        opacity: 0.8,
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
        isVisible: true
    });

    sciChart3DSurface.renderableSeries.add(series);

    return sciChart3DSurface;
};

export const drawChart2 = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
        divElementId2,
        X_2D_CHART_SIZE,
        Y_2D_CHART_SIZE
    );
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.yAxes.add(yAxis);

    const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: "#E6E6FA" });
    lineSeries.strokeThickness = 3;
    lineSeries.pointMarker = new EllipsePointMarker(wasmContext, {
        width: 5,
        height: 5,
        fill: EColor.White
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    const tenorCurvesData = getTenorCurveData(X_DATA_SIZE, Z_DATA_SIZE);
    let average: number;
    for (let z = 0; z < Z_DATA_SIZE; z++) {
        average = 0;
        for (let x = 0; x < X_DATA_SIZE; x++) {
            average += tenorCurvesData[x][z];
        }
        dataSeries.append(z, average / X_DATA_SIZE);
    }
    lineSeries.dataSeries = dataSeries;

    return sciChartSurface;
};

export const drawChart3 = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(
        divElementId3,
        X_2D_CHART_SIZE,
        Y_2D_CHART_SIZE
    );
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext);
    sciChartSurface.yAxes.add(yAxis);

    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        stroke: "#FFC9A8AA",
        strokeThickness: 2
    });
    mountainSeries.strokeThickness = 3;
    sciChartSurface.renderableSeries.add(mountainSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    const tenorCurvesData = getTenorCurveData(X_DATA_SIZE, Z_DATA_SIZE);
    const zMiddleIndex = Math.floor(Z_DATA_SIZE / 2);
    for (let x = 0; x < Z_DATA_SIZE; x++) {
        dataSeries.append(x, tenorCurvesData[x][zMiddleIndex]);
    }
    mountainSeries.dataSeries = dataSeries;

    return sciChartSurface;
};

let surfaces: IDeletable[] = [];

export default function TenorCurves3DChart() {
    // const [sciChart3DSurface, setSciChart3DSurface] = React.useState<SciChart3DSurface>();
    React.useEffect(() => {
        (async () => {
            surfaces = await Promise.all([drawChart1(), drawChart2(), drawChart3()]);
        })();

        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => surfaces.forEach(s => s.delete());
    }, []);

    return (
        <React.Fragment>
            <div style={{ display: "flex" }}>
                <div id={divElementId1} style={{ width: X_3D_CHART_SIZE, height: Y_3D_CHART_SIZE }} />
                <div style={{ marginLeft: 20 }}>
                    <div
                        id={divElementId2}
                        style={{ width: X_2D_CHART_SIZE, height: Y_2D_CHART_SIZE, marginBottom: CHART_MARGIN }}
                    />
                    <div id={divElementId3} style={{ width: X_2D_CHART_SIZE, height: Y_2D_CHART_SIZE }} />
                </div>
            </div>
        </React.Fragment>
    );
}
