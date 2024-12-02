import {
    CameraController,
    EColorMapMode,
    EDrawMeshAs,
    EMeshPaletteMode,
    ETitlePosition,
    GradientColorPalette,
    HeatmapLegend,
    linearColorMapLerp,
    MouseWheelZoomModifier3D,
    NumericAxis3D,
    OrbitModifier3D,
    PixelPointMarker3D,
    ScatterRenderableSeries3D,
    SciChart3DSurface,
    SurfaceMeshRenderableSeries3D,
    TLinearColorMap,
    UniformGridDataSeries3D,
    Vector3,
    XyzDataSeries3D,
    zeroArray2D,
} from "scichart";
import { AscData, AscReader } from "./AscReader";
import { appTheme } from "../../../theme";

type TMetadata = {
    vertexColor: number;
    pointScale: number;
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Load data from the server
    const dataFromServer = await getDataFromServer();

    // Create a SciChart3DSurface
    const { wasmContext, sciChart3DSurface } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChart3DSurface.worldDimensions = new Vector3(1000, 200, 1000);

    // Create and attach a camera to the 3D Viewport
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(800, 1000, 800),
        target: new Vector3(0, 50, 0),
    });

    // Add an X,Y,Z axis to the viewport
    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, { axisTitle: "X Distance (Meters)" });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, { axisTitle: "Height (Meters)" });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, { axisTitle: "Z Distance (Meters)" });

    // Create a ScatterRenderableSeries3D and configure as a point cloud with 1px markers
    sciChart3DSurface.renderableSeries.add(
        new ScatterRenderableSeries3D(wasmContext, {
            pointMarker: new PixelPointMarker3D(wasmContext),
            dataSeries: new XyzDataSeries3D(wasmContext, {
                xValues: dataFromServer.ascData.XValues,
                yValues: dataFromServer.ascData.YValues,
                zValues: dataFromServer.ascData.ZValues,
                metadata: dataFromServer.meta,
            }),
            opacity: 1,
        })
    );

    // Also render the point-cloud data as a heightmap / topology map with contours
    sciChart3DSurface.renderableSeries.add(
        new SurfaceMeshRenderableSeries3D(wasmContext, {
            dataSeries: new UniformGridDataSeries3D(wasmContext, {
                xStart: 0,
                xStep: dataFromServer.ascData.CellSize,
                zStart: 0,
                zStep: dataFromServer.ascData.CellSize,
                yValues: dataFromServer.heightValues2D,
            }),
            minimum: 0,
            maximum: 50,
            drawSkirt: true,
            opacity: 0.7,
            meshColorPalette: new GradientColorPalette(wasmContext, {
                gradientStops: [
                    { offset: 1, color: appTheme.VividPink },
                    { offset: 0.9, color: appTheme.VividOrange },
                    { offset: 0.7, color: appTheme.MutedRed },
                    { offset: 0.5, color: appTheme.VividGreen },
                    { offset: 0.3, color: appTheme.VividSkyBlue },
                    { offset: 0.2, color: appTheme.Indigo },
                    { offset: 0, color: appTheme.DarkIndigo },
                ],
            }),
            contourStroke: appTheme.PaleSkyBlue,
            meshPaletteMode: EMeshPaletteMode.HEIGHT_MAP_INTERPOLATED,
            contourStrokeThickness: 2,
            drawMeshAs: EDrawMeshAs.SOLID_WITH_CONTOURS,
        })
    );

    // Add interactivity modifiers for orbiting and zooming with the mousewheel
    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());

    return { sciChartSurface: sciChart3DSurface, wasmContext };
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
            maximum: 50,
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

    heatmapLegend.innerSciChartSurface.sciChartSurface.title = "Height (m)";

    heatmapLegend.innerSciChartSurface.sciChartSurface.titleStyle = {
        fontSize: 12,
        color: appTheme.ForegroundColor,
        position: ETitlePosition.Bottom,
    };

    return { sciChartSurface: heatmapLegend.innerSciChartSurface.sciChartSurface };
};

async function getDataFromServer() {
    // The LinearColorMap type in SciChart allows you to generate a colour map based on a
    // minimum and maximum value, e.g. min=0, max=50 means the gradient brush below is mapped into that range
    //
    const colorMap: TLinearColorMap = {
        Minimum: 0,
        Maximum: 50,
        Mode: EColorMapMode.Interpolated,
        GradientStops: [
            { color: appTheme.DarkIndigo, offset: 0 },
            { color: appTheme.Indigo, offset: 0.2 },
            { color: appTheme.VividSkyBlue, offset: 0.3 },
            { color: appTheme.VividGreen, offset: 0.5 },
            { color: appTheme.MutedRed, offset: 0.7 },
            { color: appTheme.VividOrange, offset: 0.9 },
            { color: appTheme.VividPink, offset: 0 },
        ],
    };

    // Read the ASC Lidar data file with optional color map data
    const reader: AscReader = new AscReader((height) => {
        // Linearly interpolate each heightValue into a colour and return to the ASCReader
        // This will be injected into the SciChart XyzDataSeries3D to colour points in the point-cloud
        return linearColorMapLerp(colorMap, height);
    });

    // See our source-code file tq3080_DSM_2M.js for format on this ASC Point cloud data
    // find the source online at github: https://github.com/ABTSoftware/SciChart.JS.Examples/blob/master/Examples/src/server/Data/t
    const hostname = window.location.hostname;
    const port = window.location.port;
    let host = hostname.includes("scichart.com") || hostname.includes("localhost") ? "" : "https://demo.scichart.com";

    if (hostname === "localhost" && port === "4200") {
        host = "https://demo.scichart.com";
    }
    const rawData = await fetch(host + "/api/lidardata");
    const ascData: AscData = reader.parse(await rawData.text());

    // Prepare metadata to contain the color values from ASCData
    const meta: TMetadata[] = ascData.ColorValues.map((c) => ({
        vertexColor: c,
        pointScale: 0,
    }));

    // Prepare heightValues2D for the uniform surface mesh (transform point cloud to 2d array of heights)
    const heightValues2D = zeroArray2D([ascData.NumberRows, ascData.NumberColumns]);
    for (let index = 0, z = 0; z < ascData.NumberRows; z++) {
        for (let x = 0; x < ascData.NumberColumns; x++) {
            heightValues2D[z][x] = ascData.YValues[index++];
        }
    }

    return {
        ascData,
        meta,
        heightValues2D,
    };
}
