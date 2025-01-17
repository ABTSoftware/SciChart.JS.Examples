import { appTheme } from "../../../theme";

import {
    SciChart3DSurface,
    CameraController,
    Vector3,
    MouseWheelZoomModifier3D,
    OrbitModifier3D,
    ResetCamera3DModifier,
    NumericAxis3D,
    NumberRange,
    ScatterRenderableSeries3D,
    XyzDataSeries3D,
    SpherePointMarker3D,
    TGradientStop,
    parseColorToUIntArgb,
    TooltipModifier3D,
    SeriesInfo3D,
    TooltipSvgAnnotation3D,
    XyzSeriesInfo3D,
    IPointMetadata3D,
} from "scichart";

type TMetadata = IPointMetadata3D & {
    country: string;
    color: string;
    vertexColor: number;
    pointScale: number;
};

type TMappedPopulationData = {
    population: number[];
    lifeExpectancy: number[];
    gdpPerCapita: number[];
    year: number[];
    metadata: TMetadata[];
};

const initializeChart = async (rootElement: string | HTMLDivElement) => {
    const { sciChart3DSurface, wasmContext } = await SciChart3DSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChart3DSurface.camera = new CameraController(wasmContext, {
        position: new Vector3(-141.6, 310.29, 393.32),
        target: new Vector3(0, 50, 0),
    });

    sciChart3DSurface.chartModifiers.add(
        new MouseWheelZoomModifier3D(),
        new OrbitModifier3D(),
        new ResetCamera3DModifier()
    );

    const tooltipModifier = new TooltipModifier3D({ tooltipLegendOffsetX: 10, tooltipLegendOffsetY: 10 });
    tooltipModifier.tooltipDataTemplate = (seriesInfo: SeriesInfo3D, svgAnnotation: TooltipSvgAnnotation3D) => {
        const valuesWithLabels: string[] = [];
        if (seriesInfo && seriesInfo.isHit) {
            const md = (seriesInfo as XyzSeriesInfo3D).pointMetadata as TMetadata;
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
            const md = (seriesInfo as XyzSeriesInfo3D).pointMetadata as TMetadata;
            svgAnnotation.containerBackground = md.color;
            svgAnnotation.textStroke = "white";
        }
        return defaultTemplate(seriesInfo, svgAnnotation);
    };
    sciChart3DSurface.chartModifiers.add(tooltipModifier);

    sciChart3DSurface.xAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Life Expectancy",
        visibleRange: new NumberRange(30, 85),
        labelPrecision: 0,
    });
    sciChart3DSurface.yAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Gdp Per Capita",
        visibleRange: new NumberRange(0, 50000),
        labelPrecision: 0,
    });
    sciChart3DSurface.zAxis = new NumericAxis3D(wasmContext, {
        axisTitle: "Year",
        visibleRange: new NumberRange(1950, 2010),
        labelPrecision: 0,
    });

    const renderableSeries = new ScatterRenderableSeries3D(wasmContext, {
        pointMarker: new SpherePointMarker3D(wasmContext, { size: 10 }),
        opacity: 0.9,
    });

    sciChart3DSurface.renderableSeries.add(renderableSeries);

    const setData = (data: TMappedPopulationData) => {
        const { lifeExpectancy, gdpPerCapita, year, metadata } = data;

        const dataSeries = new XyzDataSeries3D(wasmContext, {
            xValues: lifeExpectancy,
            yValues: gdpPerCapita,
            zValues: year,
            metadata,
        });

        renderableSeries.dataSeries = dataSeries;
    };

    return { sciChartSurface: sciChart3DSurface, setData };
};

// TODO link to data source file
const getData = async (): Promise<TMappedPopulationData> => {
    const response = await fetch("/api/populationData");

    if (!response.ok) {
        throw new Error("Population data request unsuccessful!");
    }

    return response.json();
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const [chart, data] = await Promise.all([initializeChart(rootElement), getData()]);
    chart.setData(data);

    return chart;
};
