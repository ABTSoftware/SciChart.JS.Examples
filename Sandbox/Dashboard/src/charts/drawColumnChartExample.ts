import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { ENumericFormat } from "scichart/types/NumericFormat";
import { colors } from "../utils/colors";
import { WaveAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/WaveAnimation";
import { FastColumnRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastColumnRenderableSeries";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EStrokePaletteMode, IPaletteProvider } from "scichart/Charting/Model/IPaletteProvider";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { parseColorToUIntArgb } from "scichart/utils/parseColor";
import { axisOptionsCommon, theme } from "../utils/theme";
import { getColumnChartData } from "../services/data.service";

export const columnChart = "columnChart";

export const drawColumnChartExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(columnChart, { theme });

    const { xValues, yValues } = getColumnChartData();

    const xAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon
    });
    const yAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        drawMajorGridLines: true,
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0, 1),
        labelFormat: ENumericFormat.Decimal,
        labelPrecision: 0,
        labelPrefix: "$",
        labelPostfix: " M"
    });
    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.renderableSeries.add(
        new FastColumnRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            fill: colors.primary,
            stroke: colors.text,
            strokeThickness: 2,
            dataPointWidth: 0.7,
            animation: new WaveAnimation({ duration: 1000 }),
            paletteProvider: new ColumnPaletteProvider()
        })
    );

    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());
    return sciChartSurface;
};

class ColumnPaletteProvider implements IPaletteProvider {
    readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.SOLID;
    onAttached(parentSeries: IRenderableSeries): void {}
    onDetached(): void {}

    overrideFillArgb(xValue: number, yValue: number, index: number): number {
        return yValue > 100.0 ? parseColorToUIntArgb(colors.secondary) : undefined;
    }
}
