import {
    BasePointMarker3D,
    CameraController,
    CubePointMarker3D,
    CylinderPointMarker3D,
    EllipsePointMarker3D,
    IBasePointMarker3DOptions,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D,
    OrbitModifier3D,
    parseColorToUIntArgb,
    PixelPointMarker3D,
    PyramidPointMarker3D,
    QuadPointMarker,
    ResetCamera3DModifier,
    ScatterRenderableSeries3D,
    SciChart3DSurface,
    SeriesInfo3D,
    SpherePointMarker3D,
    TGradientStop,
    TooltipModifier3D,
    TooltipSvgAnnotation3D,
    TrianglePointMarker3D,
    Vector3,
    XyzDataSeries3D,
    XyzSeriesInfo3D,
} from "scichart";

import { appTheme } from "../../../theme";

type TMetadata = {
    vertexColor: number;
    pointScale: number;
};

import {
    fetchPopulationDataData,
    TMappedPopulationData,
    TPopulationMetadata,
} from "../../../ExampleData/ExampleDataProvider";
import {
    TSRTexture,
    SCRTFloatVector,
    TSRVector4,
    eTSRTextureFormat,
    IntVector,
    SCRTSceneWorld,
    eSCRTMesh,
    TSRIndexedMesh,
    eSCRTTexture,
    SCRTSelectionInfo,
    SCRTWaterMarkProperties,
    SCRTSampleChartInterface,
    SCRTCopyToDestinationInterface,
    SCRTFileLoadCallbackInterface,
    UIntVector,
    FloatVector,
    SCRTDoubleVector,
    DoubleVector,
    StringVector,
    LinearCoordinateCalculatorDouble,
    FlippedLinearCoordinateCalculatorDouble,
    LinearCoordinateCalculatorSingle,
    FlippedLinearCoordinateCalculatorSingle,
    CategoryCoordinateCalculatorDouble,
    FlippedCategoryCoordinateCalculatorDouble,
    LogarithmicCoordinateCalculator,
    FlippedLogarithmicCoordinateCalculator,
    SCRTDoubleRange,
    SCRTLicenseType,
    WStringVector,
    TSRVector3,
    PitchYaw,
    SCRTTickStyle,
    eSCRTTextAlignement,
    SCRTTextStyle,
    SCRTAxisDescriptor,
    SCRTSceneEntityWrapper,
    SCRTSceneEntity,
    TSRCamera,
    TSRVector2,
    SCRTXyzGizmoEntityWrapper,
    SCRTXyzGizmoEntity,
    eSCRT_POINT_MARKER_TYPE,
    SCRTPoint3DSceneEntityParams,
    SCRTPoint3DSceneEntity,
    SCRTPoint3DSceneEntityWrapper,
    SCRTColumnsSceneEntityParams,
    SCRTColumnsSceneEntity,
    SCRTColumnsSceneEntityWrapper,
    SCRTPointLines3DSceneEntityParams,
    SCRTPointLine3DSceneEntity,
    SCRTPointLine3DSceneEntityWrapper,
    SCRTAxisRange,
    eSCRTGridDrawingFeatures,
    eSCRTGridMeshResolution,
    SCRTGridDrawingProperties,
    SCRTGridMeshEntity,
    SCRTGridMeshEntityWrapper,
    eAxisPlaneDrawLabelsMode,
    eAxisPlaneVisibilityMode,
    SCRTAxisCubeDescriptor,
    SCRTAxisCubeEntity,
    SCRTAxisCubeEntityWrapper,
    SCRTMesh,
    SCRTLinesMesh,
    SCRTFrameRenderer3D,
    eTSRPlatform,
    eTSRMetaDataType,
    eVariableUsage,
    eTSRRendererType,
    eTSRCameraProjectionMode,
    TSRShadowPartitionMode,
    TSRShadowCascadeSelectionModes,
    TSRShadowMode,
    TSRShadowMapSize,
    TSRShadowDepthBufferFormat,
    TSRShadowFixedFilterSize,
    TSRShadowMSAA,
    TSRShadowSMFormat,
    TSRShadowAnisotropy,
    eTSRTextAlignMode,
    TSRTextLineBounds,
    TSRTextBounds,
    SCRTFontKey,
    SCRTSampleChartInterfaceWrapper,
    SCRTCopyToDestinationInterfaceWrapper,
    SCRTFileLoadCallbackInterfaceWrapper,
    SCRTSurfaceDestinationWrapper,
    SCRTSurfaceDestination,
} from "scichart/types/TSciChart3D";

export const fonts = [
    { name: "arial", url: "" },
    {
        name: "braahone",
        url: "https://raw.githubusercontent.com/google/fonts/main/ofl/braahone/BraahOne-Regular.ttf",
    },
    {
        name: "iceland",
        url: "https://raw.githubusercontent.com/google/fonts/main/ofl/iceland/Iceland-Regular.ttf",
    },
    { name: "antic", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/antic/Antic-Regular.ttf" },
    { name: "coda", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/coda/Coda-Regular.ttf" },
    { name: "forum", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/forum/Forum-Regular.ttf" },
    { name: "freeman", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/freeman/Freeman-Regular.ttf" },
    { name: "geo", url: "https://raw.githubusercontent.com/google/fonts/main/ofl/geo/Geo-Regular.ttf" },
];

// SCICHART CODE
export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Register one font
    // await sciChart3DSurface.registerFont(
    //     "braahone",
    //     "https://raw.githubusercontent.com/google/fonts/main/ofl/braahone/BraahOne-Regular.ttf"
    // );

    // Register all fonts from "fonts" array in parallel
    await Promise.all(fonts.map((font) => sciChart3DSurface.registerFont(font.name, font.url)));

    sciChart3DSurface.worldDimensions = new Vector3(300, 100, 300);

    sciChart3DSurface.camera = new CameraController(wasmContext, {
        target: new Vector3(0, 50, 0),
    });

    const setCamera = (positionX: number) => {
        sciChart3DSurface.camera = new CameraController(wasmContext, {
            position: new Vector3(positionX, 310.29, 393.32),
        });
    };

    setCamera(-141.6);

    sciChart3DSurface.chartModifiers.add(new MouseWheelZoomModifier3D());
    sciChart3DSurface.chartModifiers.add(new OrbitModifier3D());
    sciChart3DSurface.chartModifiers.add(new ResetCamera3DModifier());

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Life Expectancy",
        visibleRange: new NumberRange(25, 110),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Gdp Per Capita",
        visibleRange: new NumberRange(0, 50000),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Year",
        visibleRange: new NumberRange(1965, 2010),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });

    sciChart3DSurface.xAxis.backgroundColor = "red";
    // sciChart3DSurface.xAxis.planeBorderColor = "red";
    // sciChart3DSurface.xAxis.planeBorderThickness = 20;

    // title offset

    const setTitleOffset = (offset: number) => {
        sciChart3DSurface.xAxis.titleOffset = offset;
        sciChart3DSurface.yAxis.titleOffset = offset;
        sciChart3DSurface.zAxis.titleOffset = offset;
    };

    const setAxisLabelFontSize = (value: number) => {
        sciChart3DSurface.xAxis.labelStyle.fontSize = value;
        sciChart3DSurface.yAxis.labelStyle.fontSize = value;
        sciChart3DSurface.zAxis.labelStyle.fontSize = value;
    };


    const renderableSeries = new ScatterRenderableSeries3D(wasmContext, {
        // pointMarker: new CylinderPointMarker3D(wasmContext, { size: 10 }),
        opacity: 0.9,
        dataSeries: new XyzDataSeries3D(wasmContext),
        pointMarker: new SpherePointMarker3D(wasmContext, { size: 10 })
    });

    const setPointMarker = (pointMarker: string) => {
        if (pointMarker === "CylinderPointMarker3D") {
            renderableSeries.pointMarker = new CylinderPointMarker3D(wasmContext, { size: 10 });
        } else if (pointMarker === "CubePointMarker3D") {
            renderableSeries.pointMarker = new CubePointMarker3D(wasmContext, { size: 10 });
        } else if (pointMarker === "PyramidPointMarker3D") {
            renderableSeries.pointMarker = new PyramidPointMarker3D(wasmContext, { size: 10 });
        } else if (pointMarker === "SpherePointMarker3D") {
            renderableSeries.pointMarker = new SpherePointMarker3D(wasmContext, { size: 10 });
        }
    };

    // // Set the custom dodecahedron point marker as default
    // setPointMarker("SpherePointMarker3D");

    sciChart3DSurface.renderableSeries.add(renderableSeries);

    const data = await fetchPopulationDataData();

    // const { lifeExpectancy, gdpPerCapita, year, metadata } = data;

    const lifeExpectancy = [30, 40, 50, 60, 70, 80, 90, 100];

    const gdpPerCapita = [5000, 10_000, 15_000, 20_000, 25_000, 30_000, 35_000, 40_000];

    const year = [1972, 1977, 1982, 1987, 1992, 1997, 2002, 2007];

    const markers = [
        new SpherePointMarker3D(wasmContext, { size: 10 }),
        new CubePointMarker3D(wasmContext, { size: 10 }),
        new CylinderPointMarker3D(wasmContext, { size: 10 }),
        new PyramidPointMarker3D(wasmContext, { size: 10 }),
    ];

    const metadata = [
        { country: "Zimbabwe", pointScale: 1, vertexColor: 4284988847, color: "#67BDAF" },
        { country: "Zimbabwe", pointScale: 1, vertexColor: 4292639081, color: "#DC7969" },
        { country: "Zimbabwe", pointScale: 1, vertexColor: 4292639081, color: "#DC7969" },
        { country: "Zimbabwe", pointScale: 1, vertexColor: 4292639081, color: "#DC7969" },
        { country: "Zimbabwe", pointScale: 1, vertexColor: 4292639081, color: "#DC7969" },
        { country: "Zimbabwe", pointScale: 1, vertexColor: 4292639081, color: "#DC7969" },
        { country: "Zimbabwe", pointScale: 1, vertexColor: 4292639081, color: "#DC7969" },
        { country: "Zimbabwe", pointScale: 1, vertexColor: 4284988847, color: "#67BDAF" },
    ]
    // .map((item, index) => ({
    //     ...item,
    //     markerType: markers[index % 4], // Cycle through 4 different marker types
    //     pointScale: 1,
    //     vertexColor: item.vertexColor,
    // }));


    console.log(JSON.stringify(metadata.slice(-10)));

    (renderableSeries.dataSeries as XyzDataSeries3D).appendRange(lifeExpectancy, gdpPerCapita, year, metadata);

    const updateFont = (font: string) => {
        sciChart3DSurface.xAxis.labelStyle.fontFamily = font;
        sciChart3DSurface.yAxis.labelStyle.fontFamily = font;
        sciChart3DSurface.zAxis.labelStyle.fontFamily = font;
        // sciChart3DSurface.xAxis.axisTitleStyle.fontFamily = font;
        sciChart3DSurface.xAxis.titleStyle.fontFamily = font;
        sciChart3DSurface.yAxis.titleStyle.fontFamily = font;
        sciChart3DSurface.zAxis.titleStyle.fontFamily = font;

        // sciChart3DSurface.yAxis.axisTitleStyle // future update
    };

    sciChart3DSurface.xAxis.drawMajorBands = true;
    sciChart3DSurface.xAxis.axisBandsFill = "blue";

    sciChart3DSurface.yAxis.drawMajorBands = true;
    sciChart3DSurface.yAxis.axisBandsFill = "blue";

    const enableGridBands = (enable: boolean) => {
        sciChart3DSurface.xAxis.drawMajorBands = enable;
        sciChart3DSurface.yAxis.drawMajorBands = enable;
        sciChart3DSurface.zAxis.drawMajorBands = enable;
    };

    sciChart3DSurface.xAxis.majorGridLineStyle.color = "red";
    sciChart3DSurface.yAxis.majorGridLineStyle.color = "red";
    sciChart3DSurface.zAxis.majorGridLineStyle.color = "red";

    const enableMajorGridLines = (enable: boolean) => {
        sciChart3DSurface.xAxis.drawMajorGridLines = enable;
        sciChart3DSurface.yAxis.drawMajorGridLines = enable;
        sciChart3DSurface.zAxis.drawMajorGridLines = enable;
    };

    const tooltipModifier = new TooltipModifier3D({ tooltipLegendOffsetX: 10, tooltipLegendOffsetY: 10 });
    tooltipModifier.tooltipDataTemplate = (seriesInfo: SeriesInfo3D, svgAnnotation: TooltipSvgAnnotation3D) => {
        const valuesWithLabels: string[] = [];
        if (seriesInfo && seriesInfo.isHit) {
            const md = (seriesInfo as XyzSeriesInfo3D).pointMetadata as TPopulationMetadata;
            valuesWithLabels.push(md.country);
            valuesWithLabels.push(`Life Expectancy: ${seriesInfo.xValue}`);
            valuesWithLabels.push(`GDP Per Capita: ${seriesInfo.yValue}`);
            valuesWithLabels.push(`Year: ${seriesInfo.zValue}`);
        }
        return valuesWithLabels;
    };
    const defaultTemplate = tooltipModifier.tooltipSvgTemplate;
    tooltipModifier.tooltipSvgTemplate = (seriesInfo: SeriesInfo3D, svgAnnotation: TooltipSvgAnnotation3D) => {
        if (seriesInfo) {
            const md = (seriesInfo as XyzSeriesInfo3D).pointMetadata as TPopulationMetadata;
            svgAnnotation.containerBackground = md.color;
            svgAnnotation.textStroke = "white";
        }
        return defaultTemplate(seriesInfo, svgAnnotation);
    };
    sciChart3DSurface.chartModifiers.add(tooltipModifier);

    const controls = {
        setTitleOffset,
        setCamera,
        updateFont,
        enableGridBands,
        setAxisLabelFontSize,
        enableMajorGridLines,
        setPointMarker,
    };

    return { sciChartSurface: sciChart3DSurface, wasmContext, controls };
};
