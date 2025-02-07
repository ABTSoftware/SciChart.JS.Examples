import { appTheme } from "../../../theme";
import { getTenorCurveData } from "./TenorCurveData";
import {
    EllipsePointMarker,
    FastMountainRenderableSeries,
    IDeletable,
    NumericAxis,
    NumberRange,
    Point,
    SciChartSurface,
    XyDataSeries,
    CameraController,
    EDrawMeshAs,
    EMeshPaletteMode,
    GradientColorPalette,
    HeatmapLegend,
    MouseWheelZoomModifier3D,
    NumericAxis3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    SciChart3DSurface,
    SurfaceMeshRenderableSeries3D,
    UniformGridDataSeries3D,
    Vector3,
} from "scichart";

const X_DATA_SIZE = 25;
const Z_DATA_SIZE = 25;

export const draw3DChart = async (rootElement: string | HTMLDivElement) => {
    // Create the 3d chart
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Create camerea, position, field of view
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-225, 300, -225),
        target: new Vector3(0, 50, 0),
    });
    sciChart3DSurface.camera.aspectRatio = 1.333;
    sciChart3DSurface.camera.fieldOfView = 45;

    // World dimensions specifies size of the axis cube box
    sciChart3DSurface.worldDimensions = new Vector3(200, 200, 200);

    // Add X.Y,Z axis
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Axis" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Y Axis" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Axis" });

    // Add optional interaction modifiers (mousewheel and orbit via mouse drag)
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

    // returns data for the example. UniformGridDataSeries3D expects number[][] 2D Array
    // filled with values. The values are heights (y-values) on the 3d chart and
    // are mapped to colors via a colorMap
    const tenorCurvesData = getTenorCurveData(X_DATA_SIZE, Z_DATA_SIZE);

    // Create the DataSeries for the 3d chart
    const dataSeries = new UniformGridDataSeries3D(wasmContext, {
        yValues: tenorCurvesData,
        xStep: 1,
        zStep: 1,
        dataSeriesName: "Uniform Surface Mesh",
    });

    // Create a color map. Color at offset=0 is mapped to y-value at SurfaceMeshRenderableSeries3D.minimum
    // color at offset = 1 is mapped to y-value at SurfaceMeshRenderableSeries3D.maximum
    const colorMap = new GradientColorPalette(wasmContext, {
        gradientStops: [
            { offset: 1, color: appTheme.VividPink },
            { offset: 0.9, color: appTheme.VividOrange },
            { offset: 0.7, color: appTheme.MutedRed },
            { offset: 0.5, color: appTheme.VividGreen },
            { offset: 0.3, color: appTheme.VividSkyBlue },
            { offset: 0.2, color: appTheme.Indigo },
            { offset: 0, color: appTheme.DarkIndigo },
        ],
    });

    const series = new SurfaceMeshRenderableSeries3D(wasmContext, {
        dataSeries,
        minimum: 1,
        maximum: 100,
        opacity: 1.0,
        cellHardnessFactor: 1,
        shininess: 0,
        lightingFactor: 0.8,
        highlight: 0.05,
        stroke: appTheme.VividSkyBlue + "33",
        strokeThickness: 1.5,
        drawSkirt: false,
        drawMeshAs: EDrawMeshAs.SOLID_WIREFRAME,
        meshPaletteMode: EMeshPaletteMode.HEIGHT_MAP_INTERPOLATED,
        meshColorPalette: colorMap,
    });
    sciChart3DSurface.renderableSeries.add(series);

    return { sciChartSurface: sciChart3DSurface };
};

export const drawLineChart1 = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
    sciChartSurface.yAxes.add(yAxis);

    // xAxis.isVisible = false;
    // yAxis.isVisible = false;

    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        stroke: appTheme.VividSkyBlue,
        strokeThickness: 3,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
            stroke: appTheme.VividSkyBlue,
            strokeThickness: 2,
            fill: appTheme.ForegroundColor,
        }),
        fillLinearGradient: {
            startPoint: new Point(0, 0),
            endPoint: new Point(0, 1),
            gradientStops: [
                { offset: 0, color: appTheme.VividSkyBlue },
                { offset: 1, color: "Transparent" },
            ],
        },
    });
    sciChartSurface.renderableSeries.add(mountainSeries);

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
    mountainSeries.dataSeries = dataSeries;

    return { sciChartSurface };
};

export const drawLineChart2 = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.05, 0.05) });
    sciChartSurface.yAxes.add(yAxis);
    // xAxis.isVisible = false;
    // yAxis.isVisible = false;

    const mountainSeries = new FastMountainRenderableSeries(wasmContext, {
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 5,
        fillLinearGradient: {
            startPoint: new Point(0, 0),
            endPoint: new Point(0, 1),
            gradientStops: [
                { offset: 0, color: appTheme.VividTeal },
                { offset: 1, color: "Transparent" },
            ],
        },
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 9,
            height: 9,
            stroke: appTheme.PaleSkyBlue,
            strokeThickness: 2,
            fill: appTheme.ForegroundColor,
        }),
    });
    sciChartSurface.renderableSeries.add(mountainSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    const tenorCurvesData = getTenorCurveData(X_DATA_SIZE, Z_DATA_SIZE);
    const zMiddleIndex = Math.floor(Z_DATA_SIZE / 2);
    for (let x = 0; x < Z_DATA_SIZE; x++) {
        dataSeries.append(x, tenorCurvesData[x][zMiddleIndex]);
    }
    mountainSeries.dataSeries = dataSeries;

    return { sciChartSurface };
};

export const drawHeatmapLegend = async (rootElement: string | HTMLDivElement) => {
    const { heatmapLegend, wasmContext } = await HeatmapLegend.create(rootElement, {
        theme: {
            ...appTheme.SciChartJsTheme,
            sciChartBackground: appTheme.DarkIndigo + "BB",
            loadingAnimationBackground: appTheme.DarkIndigo + "BB",
        },
        yAxisOptions: {
            isInnerAxis: true,
            labelStyle: {
                fontSize: 12,
                color: appTheme.ForegroundColor,
            },
            axisBorder: {
                borderRight: 1,
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
            maximum: 200,
            gradientStops: [
                { offset: 1, color: appTheme.VividPink },
                { offset: 0.9, color: appTheme.VividOrange },
                { offset: 0.7, color: appTheme.MutedRed },
                { offset: 0.5, color: appTheme.VividGreen },
                { offset: 0.3, color: appTheme.VividSkyBlue },
                { offset: 0.2, color: appTheme.Indigo },
                { offset: 0, color: appTheme.DarkIndigo },
            ],
        },
    });

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};
