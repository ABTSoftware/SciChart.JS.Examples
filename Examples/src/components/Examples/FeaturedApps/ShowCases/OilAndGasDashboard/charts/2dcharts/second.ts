import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { TSciChart } from "scichart/types/TSciChart";
import { Point } from "scichart/Core/Point";
import { DpiHelper } from "scichart/Charting/Visuals/TextureManager/DpiHelper";
import { HitTestInfo } from "scichart/Charting/Visuals/RenderableSeries/HitTest/HitTestInfo";
import { getColor } from "../chartUtils";
import { appTheme } from "../../theme";

export default async function init2dSecondChart(rootELement: string | HTMLDivElement) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootELement, {
        theme: appTheme.SciChartJsTheme,
    });
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { visibleRange: new NumberRange(-0.5, 5.5), isVisible: false })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { visibleRange: new NumberRange(-0.5, 5.5), isVisible: false })
    );

    // Create a scatter series with some initial data
    const scatterSeriesR = generateData(wasmContext, getColor("red"), data.xValuesR, data.yValuesR);
    const scatterSeriesB = generateData(wasmContext, getColor("blue"), data.xValuesB, data.yValuesB);
    const scatterSeriesG = generateData(wasmContext, getColor("green"), data.xValuesG, data.yValuesG);

    sciChartSurface.renderableSeries.add(scatterSeriesG);
    sciChartSurface.renderableSeries.add(scatterSeriesB);
    sciChartSurface.renderableSeries.add(scatterSeriesR);
    const xTestValues: number[] = [];
    const yTestValues: number[] = [];
    sciChartSurface.domCanvas2D.addEventListener("mousedown", (mouseEvent: MouseEvent) => {
        const newHitTestsList: HitTestInfo[] = [];
        const dpiScaledPoint = new Point(
            mouseEvent.offsetX * DpiHelper.PIXEL_RATIO,
            mouseEvent.offsetY * DpiHelper.PIXEL_RATIO
        );
        const dpiScaledRadius = 10 * DpiHelper.PIXEL_RATIO;
        sciChartSurface.renderableSeries.asArray().forEach((rs, index) => {
            // Interpolation is used for LineSeries to test hit on the line
            // for CandlestickSeries to test hit on the candle
            // for ColumnSeries to test hit on the column
            if (rs.hitTestProvider && index === 0) {
                const hitTestInfo = rs.hitTestProvider.hitTest(dpiScaledPoint.x, dpiScaledPoint.y, dpiScaledRadius);
                xTestValues.push(+hitTestInfo.hitTestPointValues.x.toFixed(2));
                yTestValues.push(+hitTestInfo.hitTestPointValues.y.toFixed(2));
                console.log(xTestValues);
                console.log(yTestValues);
                if (!hitTestInfo.isEmpty) {
                    newHitTestsList.push(hitTestInfo);
                }
            }
        });
    });

    return { sciChartSurface };
}

function generateData(wasmContext: TSciChart, color: string, xValues: number[], yValues: []) {
    return new XyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues,
        }),
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 3,
            height: 3,
            fill: color,
            strokeThickness: 0,
        }),
    });
}

const data: any = {
    xValuesR: [
        2.25, 2.15, 1.95, 1.69, 1.4, 0.91, 0.58, 0.38, 0.19, 0.19, 1.1, 1.92, 1.95, 1.95, 1.76, 1.95, 1.92, 1.69, 1.79,
        1.63, 1.49, 1.66, 1.46, 1.3, 1.33, 1.1, 0.94, 1.07, 1.17, 0.94, 0.84, 0.61, 0.28, 0.38, 0.19, 0.19, 0.58, 0.74,
        0.97, 1.43, 1.69, 2.02, 2.02, 1.76, 1.2, 0.91, 0.42, 0.68, 1.66, 1.76, 1.99, 2.12, 1.95, 2.15, 2.41, 2.77, 3.16,
        3.06, 2.97, 2.84, 3.03, 3.16, 3.23, 2.87, 2.84, 1.66, 1.36, 1.07, 0.74, 0.48, 0.06, 0.02, 0.06, 0.12, -0.07,
        -0.01, 1, 1.07, 0.61, 0.28, 0.02, -0.17, 0.55, 1.07, 0.68, 0.97, 1.3, 1.66, 1.33, 0.71, 1.3, 1.69, 1.89, 1.46,
        1.23, 1.4, 2.05, 2.08, 2.18, 2.48, 2.74, 2.87, 2.64, 3.16, 3.16, 3.36, 3.42, 3.49, 3.39, 3.23, 3.46, 3.39, 3.36,
        3.42, 3.33, 5.46, 5.38, 5.38, 5.38, 5.53, 5.53, 5.53, 5.46, 5.38, 5.46, 5.53, 5.46, 5.3, 3.93, 3.62, 3.47, 3.39,
        3.55, 3.62, 3.85, 3.78, 3.09, 3.17, 3.55, 4.31, 4.31, 4.23, 4.39, 4.54, 4.54, 4.39, 4.31, 4.39, 4.31, 3.93,
        4.01, 4.08, 4.08, 4.08, 4.08, 4.08, 4.16, 4.39, 4.39, 4.23, 4.23, 0.95, 1.33, 1.56, 1.18, 1.18, 0.65, 0.26,
        0.95, 1.18, 0.34, -0.04, 0.42, 0.49, 0.72, 0.95, 1.33, 1.56, 1.94, 1.41, 1.1, 1.41, 1.1, 0.87, 0.87, 1.56, 1.79,
        2.1, 1.87, 2.02, 2.33, 2.4, 2.55, 2.4, 2.63, 3.01, 3.09, 3.09, 2.94, 2.78, 3.09, 3.32, 3.39, 3.24, 3.17, 3.01,
        2.63, 2.33, 1.94, 1.79, 1.79, 2.02, 1.18, 0.95, 1.33, 1.64, 2.1, 2.25, 1.64, -0.11, -0.18, -0.29, -0.38, -0.39,
        -0.14, -0.04, 0.08, 0.21, 0.42, 0.69, 0.87, 0.88, 1.01, 1.2, 1.52, 1.68, 1.8, 2, 2.43, 2.75, 3.02, 3.23, 3.33,
        3.19, 2.92, 2.68, 2.33, 2.15, 2, 1.7, 1.43, 1.25, 0.85, 0.61, 0.4, -0.03, -0.33, 0, 0.25, 0.67, 0.87, 0.32,
        0.08, 1.01, 1.21, 1.68, 2.94, 3.24, 3.32, 3.62, 3.24, 3.09, 2.33, 2.55, 2.17, 2.02, 1.33, 1.18, 1.26, 1.56,
        1.79, 1.18, 1.1, 0.57, 0.42, 0.26, 0.49, 0.72, 0.34, 0.19, 0.19, -0.19, 0.11, 0.42, 0.57, 1.03, 1.1, 1.33, 1.41,
        1.56, 1.56, 1.33, 0.87, 0.34, 0.26, 0.26, 0.26, -0.04, 0.42, 0.8, 0.42,
    ],
    yValuesR: [
        2.33, 2.33, 2.41, 2.41, 2.41, 2.41, 2.18, 2.1, 1.88, 1.73, 1.73, 1.58, 1.65, 1.95, 1.88, 1.8, 2.18, 2.03, 1.95,
        2.18, 2.03, 2.1, 2.25, 1.95, 2.18, 2.18, 2.1, 1.88, 2.18, 2.1, 1.8, 2.03, 1.88, 1.5, 1.58, 1.27, 1.42, 1.65,
        1.88, 1.5, 1.8, 1.8, 1.95, 2.33, 2.41, 2.1, 2.1, 2.03, 1.95, 2.48, 2.48, 2.33, 2.33, 2.41, 2.33, 2.1, 1.8, 1.65,
        1.58, 1.65, 1.58, 1.5, 1.58, 1.42, 1.5, 1.2, 1.2, 1.2, 1.2, 1.42, 1.5, 1.5, 1.65, 1.8, 1.8, 1.65, 1.58, 1.65,
        1.8, 2.03, 2.1, 2.03, 2.1, 1.95, 1.65, 1.5, 1.58, 1.42, 1.42, 1.73, 1.73, 1.58, 1.58, 1.73, 1.65, 1.73, 1.65,
        1.65, 1.8, 1.8, 1.8, 1.65, 1.73, 1.65, 1.58, 1.42, 1.5, 1.65, 1.8, 1.95, 1.65, 1.58, 1.5, 1.58, 1.65, -0.39,
        0.07, 0.37, 0.37, 0.22, -0.01, 0.22, 0.37, 0.37, -0.01, -0.54, 0.22, 0.52, -0.54, -0.54, -0.54, -0.39, -0.31,
        -0.46, -0.46, -0.46, -0.54, -0.39, -0.39, 3.31, 3.08, 2.86, 2.71, 2.78, 3.01, 3.24, 3.24, 2.86, 2.78, 3.61,
        3.39, 3.24, 3.08, 3.24, 3.54, 3.92, 3.69, 3.46, 3.24, 3.24, 3.24, 2.78, 2.63, 3.08, 3.08, 2.41, 2.1, 1.8, 1.95,
        1.65, 1.95, 2.48, 1.8, 2.03, 1.95, 1.88, 1.95, 2.03, 2.33, 2.03, 1.88, 1.35, 1.27, 1.2, 1.12, 1.12, 1.5, 1.42,
        1.58, 1.65, 1.5, 1.58, 1.65, 1.73, 1.73, 1.65, 1.95, 2.03, 1.8, 1.65, 1.65, 1.42, 1.42, 1.27, 1.27, 1.27, 1.27,
        1.35, 1.35, 1.27, 2.71, 3.31, 3.76, 4.37, 4.59, 4.97, 5.2, 4.29, 4.07, 1.34, 1.45, 1.66, 1.8, 2.01, 2.33, 2.36,
        2.36, 2.33, 2.33, 2.33, 2.26, 2.24, 2.17, 2.31, 2.42, 2.45, 2.26, 2.15, 2.05, 2.05, 2.03, 2.01, 1.92, 1.8, 1.75,
        1.75, 1.75, 1.75, 1.75, 1.71, 1.71, 1.8, 1.57, 1.2, 1.15, 1.25, 1.29, 1.8, 1.71, 1.68, 1.96, 1.96, 1.75, 1.73,
        1.99, 1.96, 1.2, 1.2, 1.27, 1.73, 1.73, 1.65, 2.48, 1.88, 1.8, 1.88, 1.8, 1.5, 1.35, 1.27, 1.27, 1.12, 1.12,
        1.27, 1.35, 1.35, 1.2, 1.58, 1.95, 1.95, 1.95, 1.88, 1.95, 1.88, 1.58, 1.2, 1.73, 1.88, 1.95, 1.8, 1.65, 1.42,
        1.5, 1.27, 1.12, 1.27, 1.5, 2.03, 1.88, 1.8, 1.58,
    ],
    xValuesG: [
        1.66, 1.85, 1.95, 2.57, 2.61, 2.77, 3.13, 3.03, 2.54, 3.16, 2.84, 2.41, 3.03, 3.2, 2.77, 2.64, 3.29, 3.16, 2.84,
        3, 3.03, 3.16, 3.16, 2.67, 2.67, 3.56, 3.95, 3.75, 3.62, 3.82, 3.91, 3.98, 3.98, 3.62, 3.36, 3.33, 3.42, 3.56,
        3.62, 3.72, 3.72, 3.46, 3.49, 3.69, 3.85, 3.78, 3.52, 3.29, 3.46, 3.72, 3.82, 3.75, 3.75, 3.82, 3.88, 3.72,
        3.49, 3.69, 3.01, 3.01, 2.94, 2.78, 2.86, 3.17, 3.09, 3.09, 3.24, 3.39, 3.47, 3.39, 3.39, 3.24, 3.17, 2.94,
        3.24, 3.85, 3.78, 3.78, 3.47, 3.24, 3.09, 3.39, 3.32, 3.17, 3.17, 5.46, 5.38, 5.38, 5.38, 5.53, 5.53, 5.53,
        5.46, 5.38, 5.46, 5.53, 5.46, 5.3, 3.85, 3.7, 3.62, 3.55, 3.39, 3.39, 3.24, 3.62, 3.78, 3.85, 3.78, 3.85, 3.85,
        3.85, 3.93, 3.93, 3.93, 3.93, 3.93, 3.85, 3.85, 3.85, 3.7, 3.62, 3.55, 3.32, 3.17, 3.01, 3.01, 3.09, 3.17, 3.47,
        3.55, 3.7, 3.78, 3.85, 4.01, 4.08, 4.08, 4.08, 3.93, 3.09, 2.48, 2.4, 2.71, 3.78, 4.08, 3.24, 3.09, 3.01, 3.09,
        2.94, 2.94, 3.17, 3.24, 3.39, 3.32, 3.32, 3.62, 3.47, 4.54, 4.08, 3.62, 3.09, 3.55, 4.46, 3.85, 3.39, 3.24,
        3.62, 3.62, 3.17, 3.78, 3.39, 3.62, 3.47, 3.47, 3.62, 3.62, 3.78, 3.32, 3.62, 3.93, 3.24, 3.62, 3.78, 3.47,
        3.39, 3.85, 4.01, 5, 5.3, 5.3, 5.38, 5.38, 5.46, 5.15, 5.07, 5, 5, 4.46, 4.39, 4.77, 4.84, 4.84, 5, 5.15, 4.84,
        4.92, 4.77, 4.62, 4.84, 5, 5.3, 5.07, 4.92, 5, 4.92, 4.92, 4.92, 4.69, 4.92, 3.24, 3.24, 3.24, 3.39, 3.47, 3.55,
        3.55, 3.62, 3.85, 3.93, 3.93, 4.01, 4.01, 4.16, 4.16, 4.46, 4.31, 4.46, 4.77, 4.69, 4.77, 4.39, 4.01, 4.01,
        4.01, 3.93, 3.62, 3.55, 3.47, 3.47, 3.62, 3.85, 4.08, 3.55, 3.47, 3.55, 3.7, 3.85, 3.85, 4.01, 3.85, 3.78, 3.78,
        3.72, 2.08, 2.07, 2.4, 2.54, 2.72, 2.76, 2.43, 2.3, 2.1, 2.16, 2.64, 2.8, 2.64, 2.38, 2.1, 2.59, 2.91, 2.55,
        2.24, 2.16, 2.46, 2.24, 2.2, 2.27, 1.91, 1.8, 1.99, 2.35, 2.91, 3.1, 2.6, 2.31, 2.11, 1.95, 2.27, 2.82, 2.54,
        2.36, 2.27, 2.28, 2.36, 2.26, 2.32, 2.38, 2.04, 2, 1.84, 1.75, 1.79, 2.2, 2.3, 2.02, 1.83, 1.84, 2.15, 2.22,
        2.04, 2.06, 2.15, 2.14, 2.34, 2.47, 2.59, 2.71, 2.78, 2.88, 2.82, 2.91, 2.98, 2.79, 2.44, 2.12, 2.04, 1.95,
        1.92, 2.15, 2.06, 2.07, 2.35, 2.63, 2.8, 2.82, 2.71, 2.7, 2.75, 3.06, 2.62, 2.64, 2.5, 1.88, 1.59, 2.19, 2.55,
        2.99, 2.98, 2.9, 2.84, 2.79, 2.79, 2.17, 2.17, 2.48, 2.55, 2.63, 2.55, 2.48, 2.33, 2.1, 1.94, 1.87, 1.71, 1.79,
        2.33, 2.33, 2.48, 2.63, 2.78, 2.78, 2.86, 2.86, 3.09, 3.09, 2.94, 2.86, 2.63, 2.4, 2.17, 2.1, 2.02, 1.56, 1.64,
        2.02, 1.87, 1.71, 1.87, 2.1, 2.1, 2.48, 2.33, 2.33, 2.4, 2.33, 2.48, 2.48, 2.55, 2.71, 2.63, 2.48, 2.4, 2.17,
        2.17, 2.33, 2.1, 1.87, 2.25, 2.33, 2.17, 2.25, 2.33, 2.4, 2.55, 2.71, 2.55, 2.1, 2.63, 2.78, 2.17, 2.4, 2.55,
        2.33, 2.4, 2.33, 2.55, 2.55, 2.78, 3.01, 2.86, 2.71, 2.55, 2.4, 2.63, 3.09, 2.86, 2.78, 2.4, 2.25, 2.48, 2.86,
        2.78, 2.55, 2.48, 2.48, 2.94, 3.09, 2.86, 2.71, 2.63, 2.86, 2.86, 1.18, 1.33, 1.49, 1.64, 1.94, 2.02, 2.94,
        2.94, 2.1, 2.55, 2.63, 2.63, 2.17, 2.1, 1.64, 1.87, 2.02, 2.55, 2.55,
    ],
    yValuesG: [
        -0.16, 0.14, 0.37, 0.22, 0.14, 0.29, 0.52, 0.14, 0.37, -0.16, -0.08, 0.14, -0.16, -0.08, 0.14, -0.08, -0.08,
        0.22, 0.29, 0.14, 0.22, 0.22, 0.22, 0.37, 0.29, 2.93, 3.39, 3.08, 3.46, 3.54, 3.08, 2.71, 2.48, 2.48, 2.56,
        2.48, 2.33, 2.25, 2.1, 2.03, 2.25, 2.1, 2.03, 1.95, 2.03, 2.25, 2.33, 2.41, 2.03, 2.03, 2.03, 2.71, 3.01, 3.16,
        2.71, 2.41, 2.25, 2.1, 2.71, 2.63, 2.48, 2.48, 2.41, 2.41, 2.63, 2.86, 2.86, 3.01, 3.01, 3.01, 3.01, 2.86, 2.71,
        2.63, 2.48, 2.48, 2.48, 2.71, 2.48, 2.48, 2.93, 3.16, 3.01, 2.86, 2.86, -0.39, 0.07, 0.37, 0.37, 0.22, -0.01,
        0.22, 0.37, 0.37, -0.01, -0.54, 0.22, 0.52, 3.99, 3.84, 3.69, 3.46, 3.08, 2.86, 2.78, 3.01, 3.31, 3.54, 3.69,
        3.39, 3.31, 2.93, 2.78, 2.63, 2.63, 2.71, 2.93, 3.16, 3.24, 3.54, 3.69, 3.39, 3.08, 2.93, 2.78, 2.56, 2.56,
        2.93, 2.93, 3.16, 3.54, 3.76, 3.54, 3.39, 3.16, 3.01, 2.78, 2.56, 2.41, 2.78, 2.78, 2.93, 3.01, 3.24, 3.46,
        3.08, 3.01, 3.01, 2.86, 2.78, 2.78, 3.01, 3.01, 2.78, 0.44, 0.44, 0.67, 0.52, 0.14, -0.01, -0.08, -0.31, -0.08,
        0.52, 0.22, 0.67, 0.67, 0.67, 0.44, 0.22, -0.16, 0.37, 0.67, 0.59, 0.29, 0.44, 0.67, -0.01, -0.16, -0.16, 0.22,
        0.59, 0.37, 0.59, 0.67, -0.16, -0.01, 0.37, 0.52, 0.44, 0.22, 0.14, -0.16, -0.24, -0.31, -0.31, -0.16, -0.01,
        0.37, 0.37, 0.52, 0.59, 0.22, 0.07, -0.08, -0.01, 0.59, 0.52, 0.07, -0.01, -0.16, -0.31, -0.01, 0.29, 1.05,
        0.67, 0.37, 0.07, -0.01, 0.29, 2.71, 2.71, 2.78, 3.01, 3.31, 3.69, 3.61, 3.24, 3.01, 2.78, 2.71, 2.56, 2.41,
        2.33, 2.25, 2.1, 1.73, 1.58, 1.5, 1.42, 1.2, 1.8, 1.65, 1.73, 1.95, 2.25, 2.33, 2.25, 2.41, 2.93, 2.71, 2.56,
        2.41, 2.48, 2.71, 2.78, 2.48, 2.33, 2.03, 2.1, 2.25, 2.56, 2.48, 1.09, 1.43, 1.46, 1.59, 1.51, 1.48, 1.53, 1.64,
        1.54, 1.43, 1.33, 1.29, 1.29, 1.54, 1.56, 1.44, 1.31, 1.34, 1.51, 1.43, 1.34, 0.71, 0.59, 0.69, 0.96, -0.39,
        -0.31, -0.22, -0.39, -0.34, -0.22, -0.06, -0.21, -0.14, -0.01, -0.37, -0.26, 0.13, 0.18, 0.29, 0.81, 0.99, 0.98,
        0.58, 0.26, -0.06, -0.44, -0.44, -0.39, -0.21, -0.36, -0.39, -0.09, 0.14, 0.23, 0.63, 0.83, 0.99, 1.13, 1.33,
        1.43, 1.48, 1.44, 1.44, 1.44, 1.51, 1.38, 1.29, 1.36, 1.48, 1.54, 1.59, 1.59, 1.54, 1.43, 1.24, 1.06, 1.19,
        1.39, 1.49, 1.46, 1.51, 1.41, 1.23, 0.93, 0.76, -0.41, -0.37, -0.32, -0.22, -0.42, -0.26, -0.17, -0.26, -0.32,
        0.11, 0.43, 0.76, 0.99, 1.19, 1.27, 1.27, 1.35, 1.27, 1.2, 1.05, 1.2, 1.2, 1.2, 0.97, 0.67, 0.44, -0.01, 0.29,
        0.67, 0.97, 1.2, 0.9, 0.59, 0.22, -0.01, -0.16, 0.29, 0.9, 1.12, 1.2, 1.27, 1.12, 0.82, 0.37, -0.08, -0.01, 0.9,
        0.82, 0.44, 0.44, 0.9, 1.05, 1.2, 0.9, 0.9, 1.2, 1.05, 0.59, 0.29, 0.07, 0.14, 0.59, 0.9, 1.2, 0.29, 0.67, 0.44,
        0.14, -0.08, -0.16, 0.44, 0.52, 0.22, -0.01, -0.46, -0.54, -0.54, -0.46, -0.54, -0.46, -0.08, -0.01, 0.52, 0.82,
        0.44, 0.22, 0.07, 2.25, 2.03, 2.03, 2.56, 2.93, 2.86, 2.71, 2.33, 2.1, 2.18, 2.71, 2.78, 2.41, 2.25, 2.03, 2.18,
        2.63, 2.78, 2.63, 2.25, 2.1, 2.48, 2.86, 2.41, 2.25, 2.03, 2.03, -0.46, -0.39, -0.39, -0.39, -0.46, -0.46,
        -0.46, -0.46, 1.12, 1.12, 0.75, 0.52, 0.37, 0.07, -0.01, 0.29, 0.67, 0.29, 0.07,
    ],
    xValuesB: [
        3.52, 3.65, 3.65, 3.69, 3.65, 3.39, 3.46, 3.65, 3.78, 3.85, 3.85, 3.78, 3.69, 3.52, 3.46, 3.59, 3.65, 3.42, 3.2,
        3, 3.13, 3.39, 3.72, 3.78, 3.98, 4.93, 5.12, 5.39, 4.73, 4.63, 4.86, 5.29, 4.93, 3.78, 3.46, 3.69, 3.82, 4.01,
        4.21, 4.34, 4.18, 3.78, 3.47, 3.09, 3.09, 3.32, 3.47, 3.85, 4.08, 3.55, 3.24, 3.01, 3.01, 2.86, 2.71, 3.09,
        2.78, 2.94, 2.33, 1.87, 2.71, 2.86, 2.94, 3.17, 3.09, 3.09, 3.24, 3.17, 3.24, 3.39, 3.62, 3.78, 3.85, 4.01,
        4.01, 4.01, 4.08, 4.08, 3.85, 3.78, 3.78, 3.78, 3.78, 3.78, 3.7, 3.62, 3.55, 3.39, 3.32, 3.17, 3.01, 3.01, 3.17,
        3.24, 3.39, 3.47, 3.55, 3.62, 3.7, 3.78, 3.85, 3.93, 4.08, 4.16, 4.16, 3.85, 3.85, 3.78, 3.78, 3.62, 3.17, 2.86,
        2.55, 2.4, 3.7, 3.55, 3.24, 4.08, 4.01, 4.31, 4.23, 4.23, 3.85, 3.7, 3.55, 3.47, 3.47, 3.47, 3.47, 3.62, 3.47,
        3.7, 4.16, 4.39, 4.01, 3.47, 3.47, 3.39, 3.17, 3.62, 3.93, 4.01, 4.08, 3.93, 3.47, 3.85, 3.78, 4.01, 4.01, 4.16,
        3.78, 3.78, 3.78, 2.1, 2.02, 2.86, 2.94, 3.24, 3.7, 3.93, 3.93, 4.23, 4.54, 4.62, 4.84, 4.62, 4.54, 3.85, 3.01,
        2.63, 3.47, 3.39, 3.62, 3.32, 3.09, 2.78, 2.71, 2.94, 2.71, 2.4, 2.1, 2.1, 5.46, 5.46, 5.15, 4.92, 4.84, 4.69,
        4.23, 4.01, 4.69, 4.69, 3.47, 3.47, 3.62, 4.23, 4.01, 4.39, 4.39, 5.3, 5, 5.3, 5.3, 3.01, 1.94, 2.4, 3.85, 3.01,
        3.09, 2.94, 2.78, 3.32, 3.7, 3.32, 3.55, 3.85, 4.16, 4.23, 4.62, 4.92, 4.62, 4.23, 3.85, 3.85, 4.01, 4.54, 4.08,
        3.85, 4.54, 4.62, 4.69, 4.46, 5.3, 4.92, 5.15, 5.3, 5.3, 5.3, 4.92, 5.46, 5.15, 5.38, 5.23, 5, 4.84, 5.07, 5.3,
    ],
    yValuesB: [
        4.82, 5.2, 5.27, 5.5, 5.42, 4.75, 4.67, 5.5, 5.27, 4.97, 4.75, 4.97, 5.42, 4.97, 4.44, 4.97, 5.5, 4.75, 3.99,
        3.69, 3.76, 4.37, 4.67, 4.29, 4.22, 1.95, 1.88, 1.73, 2.18, 2.41, 2.18, 2.1, 2.1, 0.75, 0.82, 0.9, 0.9, 0.37,
        0.14, 0.07, 0.52, 4.82, 4.59, 4.22, 3.99, 4.07, 4.37, 4.82, 5.35, 4.67, 4.22, 3.84, 3.39, 3.08, 2.93, 5.35,
        4.97, 5.12, 3.84, 3.46, 3.01, 3.16, 3.54, 3.54, 3.24, 3.16, 3.39, 3.61, 3.92, 4.22, 4.52, 4.82, 5.05, 4.75,
        4.59, 4.29, 4.07, 3.92, 3.92, 3.99, 4.22, 4.52, 4.67, 4.82, 4.52, 4.29, 4.14, 3.92, 3.76, 3.54, 3.31, 3.08,
        3.08, 3.24, 3.69, 3.99, 4.29, 4.52, 4.82, 4.97, 4.82, 4.52, 4.22, 4.07, 4.07, 4.44, 4.82, 4.67, 4.29, 3.99, 4.9,
        4.44, 3.99, 3.46, 1.12, 0.9, 0.82, 0.82, 0.67, 0.37, 0.44, 0.67, 1.12, 0.67, 0.52, 0.29, -0.01, -0.16, -0.08,
        -0.08, -0.54, -0.54, -0.46, -0.24, -0.16, 0.22, 0.52, 0.75, 0.75, 0.75, 0.52, 0.29, 0.59, 0.82, 0.67, 0.9, 1.12,
        1.12, 1.42, 1.65, 1.2, 0.97, 0.97, 0.97, 1.95, 3.24, 3.54, 3.76, 3.99, 4.07, 3.08, 2.48, 2.1, 1.42, 0.29, -0.16,
        0.14, 0.52, 0.52, 0.52, 0.44, 3.24, 3.76, 3.61, 2.93, 2.25, 2.48, 3.16, 2.03, 0.9, 0.37, 0.07, 2.03, 2.1, 2.03,
        1.73, 1.8, 2.48, 2.71, 2.93, 2.71, 2.71, 4.22, 4.37, 4.59, 3.46, 3.39, 3.16, 3.08, 1.27, 1.05, 1.12, 1.5, 3.99,
        4.75, 5.2, 5.35, 2.33, 2.41, 2.71, 3.01, 3.31, 3.69, 4.07, 4.07, 3.46, 2.86, 2.48, 2.1, 2.41, 2.63, 3.16, 3.46,
        3.01, 2.41, 2.33, 2.86, 3.24, 2.56, 2.18, 2.1, 2.56, 1.5, 0.9, 1.27, 1.42, 1.58, 1.88, 2.03, 1.5, 1.35, 1.5,
        1.65, 1.5, 1.27, 1.27, 1.5,
    ],
};
