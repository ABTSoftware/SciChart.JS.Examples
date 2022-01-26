import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { FastMountainRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { GradientParams } from "scichart/Core/GradientParams";
import { NumberRange } from "scichart/Core/NumberRange";
import { Point } from "scichart/Core/Point";
import { EAutoRange } from "scichart/types/AutoRange";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { getMountainChartData } from "../services/data.service";
import { colors } from "../utils/colors";
import { axisOptionsCommon, theme } from "../utils/theme";

export const mountainChart = "mountainChart";

export const drawMountainChartExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(mountainChart, { theme });

    const xAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        autoRange: EAutoRange.Always
    });

    const yAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        autoRange: EAutoRange.Always,
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.05, 0.05)
    });

    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.xAxes.add(xAxis);

    const sinSeries: FastMountainRenderableSeries = new FastMountainRenderableSeries(wasmContext, {
        stroke: colors.transparent,
        strokeThickness: 0,
        zeroLineY: 0.0,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: colors.primary, offset: 0 },
            { color: colors.transparent, offset: 1 }
        ])
    });

    const cosSeries: FastMountainRenderableSeries = new FastMountainRenderableSeries(wasmContext, {
        stroke: colors.transparent,
        strokeThickness: 0,
        zeroLineY: 0.0,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: colors.secondary, offset: 0 },
            { color: colors.transparent, offset: 1 }
        ])
    });

    sciChartSurface.renderableSeries.add(sinSeries, cosSeries);

    const sinData = new XyDataSeries(wasmContext, { dataSeriesName: "Cos(x)" });
    const cosData = new XyDataSeries(wasmContext, { dataSeriesName: "Sin(x)" });

    sinSeries.dataSeries = sinData;
    cosSeries.dataSeries = cosData;

    const { dataX, dataY, dataY1 } = getMountainChartData(false);
    sinData.appendRange(dataX, dataY);
    cosData.appendRange(dataX, dataY1);

    const updateDataFunc = () => {
        const { dataX, dataY, dataY1 } = getMountainChartData(true);
        sinData.appendRange(dataX, dataY);
        cosData.appendRange(dataX, dataY1);
        setTimeout(updateDataFunc, 100);
    };

    updateDataFunc();

    return sciChartSurface;
};
