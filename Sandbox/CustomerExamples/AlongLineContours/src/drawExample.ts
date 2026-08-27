import {
    ContoursDataLabelProvider,
    CursorModifier,
    ENumericFormat,
    HeatmapColorMap,
    MouseWheelZoomModifier,
    NumericAxis,
    SciChartSurface,
    UniformContoursRenderableSeries,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { AlongLineContoursDataLabelProvider } from "./contours/AlongLineContoursDataLabelProvider";

export type CustomOptions = {
    labelSpacing: number;
    maxLabelsPerLine: number;
    rotateToLine: boolean;
    avoidOverlaps: boolean;
    overlapPadding: number;
};
const WIDTH = 220;
const HEIGHT = 180;
const LEVELS = [-15, -7, -3, -1, 0, 1, 3, 7, 15];
const gradientStops = [
    { offset: 0, color: "#172554" },
    { offset: 0.25, color: "#075985" },
    { offset: 0.5, color: "#0f766e" },
    { offset: 0.72, color: "#f59e0b" },
    { offset: 1, color: "#fef3c7" },
];

const makeTerrain = (): number[][] =>
    Array.from({ length: HEIGHT }, (_, row) =>
        Array.from({ length: WIDTH }, (_, column) => {
            const x = -4 + (column / (WIDTH - 1)) * 8;
            const y = -3.2 + (row / (HEIGHT - 1)) * 6.4;

			return x*x*x + Math.abs(1.0 / y) - 2*x;
        }),
    );

export const drawExample = async (element: HTMLDivElement): Promise<{
    setIsCustom: (isCustom: boolean) => void;
    setCustomOptions: (options: CustomOptions) => void;
    delete: () => void;
}> => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(element, { widthAspect: 1.6 });
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { axisTitle: "longitude" }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { axisTitle: "latitude" }));

    const dataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: -4,
        xStep: 8 / (WIDTH - 1),
        yStart: -3.2,
        yStep: 6.4 / (HEIGHT - 1),
        zValues: makeTerrain(),
    });
    const colorMap = new HeatmapColorMap({ minimum: -15, maximum: 15, gradientStops });

    sciChartSurface.renderableSeries.add(
        new UniformHeatmapRenderableSeries(wasmContext, { dataSeries, colorMap, opacity: 0.72 }),
    );

    const contourSeries = new UniformContoursRenderableSeries(wasmContext, {
        dataSeries,
        zLevels: LEVELS,
        stroke: "#dbeafe",
        strokeThickness: 2,
        majorLineStyle: { strokeThickness: 2, color: "#f8fafc" },
        minorLineStyle: { strokeThickness: 1, color: "#93c5fd" },
        dataLabels: {
            color: "#f8fafc",
            style: { fontSize: 13 },
            precision: 3,
            numericFormat: ENumericFormat.Decimal,
            labelRowCount: 10,
        },
    });
    const defaultProvider = contourSeries.dataLabelProvider as ContoursDataLabelProvider;
    const customProvider = new AlongLineContoursDataLabelProvider({
        color: "#fff",
        style: { fontSize: 13 },
        precision: 1,
        numericFormat: ENumericFormat.Decimal,
        labelSpacing: 50,
        maxLabelsPerLine: 16,
        rotateToLine: true,
        avoidOverlaps: true,
        overlapPadding: 4,
    });
    sciChartSurface.renderableSeries.add(contourSeries);
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new MouseWheelZoomModifier(),
        new ZoomExtentsModifier(),
        new CursorModifier({ showTooltip: true, includedSeriesIds: [contourSeries.id] }),
    );
    sciChartSurface.zoomExtents();

    // handlers for App.tsx to call
    return {
        setIsCustom: (isCustom) => {
            contourSeries.dataLabelProvider = isCustom ? customProvider : defaultProvider;
            sciChartSurface.invalidateElement();
        },
        setCustomOptions: ({ labelSpacing, maxLabelsPerLine, rotateToLine, avoidOverlaps, overlapPadding }) => {
            customProvider.labelSpacing = labelSpacing;
            customProvider.maxLabelsPerLine = maxLabelsPerLine;
            customProvider.rotateToLine = rotateToLine;
            customProvider.avoidOverlaps = avoidOverlaps;
            customProvider.overlapPadding = overlapPadding;
        },
        delete: () => sciChartSurface.delete(),
    };
};
