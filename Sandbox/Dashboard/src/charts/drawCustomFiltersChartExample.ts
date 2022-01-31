import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { SciChartSurface } from "scichart/Charting/Visuals/SciChartSurface";
import { NumberRange } from "scichart/Core/NumberRange";
import { colors } from "../utils/colors";
import { axisOptionsCommon, theme } from "../utils/theme";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { XyCustomFilter } from "scichart/Charting/Model/Filters/XyCustomFilter";
import { SquarePointMarker } from "scichart/Charting/Visuals/PointMarkers/SquarePointMarker";
import { ScaleAnimation } from "scichart/Charting/Visuals/RenderableSeries/Animations/ScaleAnimation";
import { getFiltersChartData } from "../services/data.service";

export const customFiltersChart = "customFiltersChart";

export const drawCustomFiltersChartExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(customFiltersChart, { theme });

    const xAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        drawMajorGridLines: true,
        growBy: new NumberRange(0.1, 0.1)
    });

    const yAxis: NumericAxis = new NumericAxis(wasmContext, {
        ...axisOptionsCommon,
        drawMajorGridLines: true,
        growBy: new NumberRange(0.1, 0.1)
    });

    sciChartSurface.yAxes.add(yAxis);
    sciChartSurface.xAxes.add(xAxis);

    const dataSeries = new XyDataSeries(wasmContext, getFiltersChartData(0, 1000));

    const midRangeFilter = (index: number, y: number) => {
        if (y < 0.2 || y > 0.8 || index < 200 || index > 800) {
            return y;
        } else {
            return NaN;
        }
    };

    const customFilter = new XyCustomFilter(dataSeries, { filterFunction: midRangeFilter });
    const filteredSeries = new XyScatterRenderableSeries(wasmContext, {
        dataSeries: customFilter,
        pointMarker: new SquarePointMarker(wasmContext, {
            width: 10,
            height: 10,
            fill: colors.primary,
            stroke: colors.blueSchema[100],
            strokeThickness: 2
        }),
        animation: new ScaleAnimation({ zeroLine: 1, duration: 1000 })
    });
    sciChartSurface.renderableSeries.add(filteredSeries);

    sciChartSurface.chartModifiers.add(new ZoomPanModifier(), new ZoomExtentsModifier());
    return sciChartSurface;
};
