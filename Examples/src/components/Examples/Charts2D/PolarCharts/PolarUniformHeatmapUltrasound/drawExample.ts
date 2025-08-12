import {
    PolarMouseWheelZoomModifier,
    PolarZoomExtentsModifier,
    PolarPanModifier,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode,
    EAxisAlignment,
    HeatmapColorMap,
    UniformHeatmapDataSeries,
    PolarUniformHeatmapRenderableSeries,
    LineArrowAnnotation,
    EArrowHeadPosition,
} from "scichart";
import { appTheme } from "../../../theme";

const FETAL_DATA_PATH = "heatmap_data.csv";

async function parseCSV(): Promise<number[][]> {
    const fileData = await fetch(FETAL_DATA_PATH);
    const rows = (await fileData.text()).split("\n");

    const zValues = rows.map((row) => {
        return (
            row
                .split(",")
                // from base 16 to decimal value
                .map((value) => parseInt(value, 16))
        );
    });

    return zValues;
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
        title: "Fetal ultrasound at 31 weeks",
        titleStyle: {
            fontSize: 32,
        },
    });

    const angularAxisX = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        useNativeText: false,
        labelPrecision: 0,
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        totalAngle: Math.PI / 3,
        startAngle: (Math.PI * 3) / 2 - Math.PI / 6,
        // (start at 270deg) - (half of totalAngle) = 240deg
        // could be simplified to `Math.PI * 4 / 3`
    });
    sciChartSurface.xAxes.add(angularAxisX);

    const radialAxisY = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Left,
        useNativeText: false,
        labelPrecision: 0,
        drawMajorBands: false,
        drawMajorGridLines: false,
        drawMinorGridLines: false,
        innerRadius: 0.4,
        startAngle: (Math.PI * 3) / 2 - Math.PI / 6,
    });
    sciChartSurface.yAxes.add(radialAxisY);

    // Heatmap
    const heatmapSeries = new PolarUniformHeatmapRenderableSeries(wasmContext, {
        opacity: 0.8,
        dataSeries: new UniformHeatmapDataSeries(wasmContext, {
            xStart: 0,
            xStep: 1,
            yStart: 0,
            yStep: 1,
            zValues: await parseCSV(),
        }),
        colorMap: new HeatmapColorMap({
            minimum: 0,
            maximum: 255,
            gradientStops: [
                { offset: 0, color: "transparent" },
                { offset: 1, color: "white" },
            ],
        }),
    });
    sciChartSurface.renderableSeries.add(heatmapSeries);

    // Optional Annotations
    const headLine = new LineArrowAnnotation({
        x1: 165.9,
        y1: 74.5,
        x2: 219.2,
        y2: 136.5,
        stroke: "white",
        strokeThickness: 2,
        arrowHeadPosition: EArrowHeadPosition.StartEnd,
        arrowStyle: {
            headWidth: 18,
            headLength: 14,
        },
        isEditable: true,
        // strokeDashArray: [6, 30],
        // labelValue: "Head diameter",
        // axisLabelFill: appTheme.VividTeal,
        // labelPlacement: ELabelPlacement.Auto,
    });
    const femurLine = new LineArrowAnnotation({
        x1: 61,
        y1: 166,
        x2: 82,
        y2: 127,
        stroke: "white",
        strokeThickness: 2,
        arrowHeadPosition: EArrowHeadPosition.StartEnd,
        arrowStyle: {
            headWidth: 10,
        },
        // strokeDashArray: [6, 30],
        // labelValue: "Head diameter",
        // axisLabelFill: appTheme.VividTeal,
        // labelPlacement: ELabelPlacement.Auto,
    });
    sciChartSurface.annotations.add(headLine, femurLine);

    sciChartSurface.chartModifiers.add(
        new PolarMouseWheelZoomModifier(),
        new PolarZoomExtentsModifier(),
        new PolarPanModifier()
    );

    return { sciChartSurface, wasmContext };
};
