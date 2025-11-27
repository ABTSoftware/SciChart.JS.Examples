import {
    CameraController,
    CubePointMarker3D,
    CylinderPointMarker3D,
    EllipsePointMarker3D,
    MouseWheelZoomModifier3D,
    NumberRange,
    NumericAxis3D,
    OrbitModifier3D,
    PixelPointMarker3D,
    PyramidPointMarker3D,
    QuadPointMarker,
    ResetCamera3DModifier,
    ScatterRenderableSeries3D,
    SciChart3DSurface,
    SeriesInfo3D,
    SpherePointMarker3D,
    TooltipModifier3D,
    TooltipSvgAnnotation3D,
    TrianglePointMarker3D,
    Vector3,
    XyzDataSeries3D,
    XyzSeriesInfo3D,
} from "scichart";

import { appTheme } from "../../../theme";

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


type TMarkerMetadata = {
    markerType: string;
    color: string;
    vertexColor: number;
    pointScale: number;
};


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
        axisTitle: "Value 1",
        visibleRange: new NumberRange(25, 110),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Value 2",
        visibleRange: new NumberRange(0, 50000),
        labelPrecision: 0,
        drawMinorGridLines: false,
        drawMajorGridLines: false,
        tickLabelsOffset: 20,
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Value 3",
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

    // Create different point markers for each data point
    const pointMarkers = [
        new EllipsePointMarker3D(wasmContext, { size: 10 }),
        new TrianglePointMarker3D(wasmContext, { size: 10 }),
        new PixelPointMarker3D(wasmContext, { size: 10 }),
        new QuadPointMarker(wasmContext, { size: 10 }),
        new SpherePointMarker3D(wasmContext, { size: 10 }),
        new CubePointMarker3D(wasmContext, { size: 10 }),
        new CylinderPointMarker3D(wasmContext, { size: 10 }),
        new PyramidPointMarker3D(wasmContext, { size: 10 }),
    ];

    const renderableSeriesList: ScatterRenderableSeries3D[] = [];

    const lifeExpectancy = [30, 40, 50, 60, 70, 80, 90, 100];

    const gdpPerCapita = [5000, 10_000, 15_000, 20_000, 25_000, 30_000, 35_000, 40_000];

    const year = [1972, 1977, 1982, 1987, 1992, 1997, 2002, 2007];

    const metadata = [
        { markerType: "EllipsePointMarker3D", pointScale: 1, vertexColor: 4284988847, color: "#67BDAF" },
        { markerType: "TrianglePointMarker3D", pointScale: 1, vertexColor: 4292639081, color: "#DC7969" },
        { markerType: "PixelPointMarker3D", pointScale: 1, vertexColor: 4278255615, color: "#FF6B35" },
        { markerType: "QuadPointMarker", pointScale: 1, vertexColor: 4294934352, color: "#F7931E" },
        { markerType: "SpherePointMarker3D", pointScale: 2, vertexColor: 4294967040, color: "#FFD23F" },
        { markerType: "CubePointMarker3D", pointScale: 2, vertexColor: 4278255360, color: "#6BCF7F" },
        { markerType: "CylinderPointMarker3D", pointScale: 2, vertexColor: 4278190335, color: "#4D96FF" },
        { markerType: "PyramidPointMarker3D", pointScale: 2, vertexColor: 4286578816, color: "#9B59B6" },
    ];

    // Create individual series for each data point with different markers
    for (let i = 0; i < lifeExpectancy.length; i++) {
        const renderableSeries = new ScatterRenderableSeries3D(wasmContext, {
            opacity: 0.9,
            dataSeries: new XyzDataSeries3D(wasmContext),
            pointMarker: pointMarkers[i % pointMarkers.length],
        });

        // Add single data point to each series
        (renderableSeries.dataSeries as XyzDataSeries3D).append(
            lifeExpectancy[i],
            gdpPerCapita[i],
            year[i],
            metadata[i]
        );

        renderableSeriesList.push(renderableSeries);
        sciChart3DSurface.renderableSeries.add(renderableSeries);
    }

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
            const md = (seriesInfo as XyzSeriesInfo3D).pointMetadata as TMarkerMetadata;
            valuesWithLabels.push(md.markerType);
            valuesWithLabels.push(`Value 1: ${seriesInfo.xValue}`);
            valuesWithLabels.push(`Value 2: ${seriesInfo.yValue}`);
            valuesWithLabels.push(`Value 3: ${seriesInfo.zValue}`);
        }
        return valuesWithLabels;
    };
    const defaultTemplate = tooltipModifier.tooltipSvgTemplate;

    tooltipModifier.tooltipSvgTemplate = (seriesInfo: SeriesInfo3D, svgAnnotation: TooltipSvgAnnotation3D) => {
        if (seriesInfo) {
            const md = (seriesInfo as XyzSeriesInfo3D).pointMetadata as TMarkerMetadata;
            svgAnnotation.containerBackground = md.color;
            svgAnnotation.textStroke = "black";
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
    };

    return { sciChartSurface: sciChart3DSurface, wasmContext, controls };
};
