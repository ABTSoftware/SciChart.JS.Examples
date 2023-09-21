import {
    SciChartSurface,
    XyDataSeries,
    NumericAxis,
    ENumericFormat,
    NumberRange,
    FastMountainRenderableSeries,
    GradientParams,
    Point,
    CursorModifier,
    RolloverModifier,
    ZoomExtentsModifier,
    EXyDirection,
    ZoomPanModifier,
    MouseWheelZoomModifier,
    SciChartOverview,
} from 'scichart';
import { appTheme } from 'scichart-example-dependencies';
import { TDataEntry, getData, getRequestsNumberPerTimestamp } from './data-generation';
import { TChartConfigFunc } from './ChartAPI';

export const createChart1: TChartConfigFunc = async (divElementId: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme,
        disableAspect: true,

        title: 'Number of requests for time period',
        titleStyle: {
            placeWithinChart: true,
            fontSize: 16,
        },
    });

    const data = getData();

    const { xValues, yValues, groupedEntries } = getRequestsNumberPerTimestamp(data);
    const metadata = groupedEntries.map((entries) => ({
        isSelected: false,
        entries,
    }));
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        metadata,
    });

    

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, {
        axisTitle: 'Date Axis',
        axisTitleStyle: {
            fontSize: 20,
        },
        visibleRangeLimit: dataSeries.getXRange(),
        labelFormat: ENumericFormat.Date_DDMM,
        isInnerAxis: true,
    });
    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: 'Requests',
        axisTitleStyle: {
            fontSize: 20,
        },
        visibleRangeLimit: new NumberRange(0, 1000),
        labelPrecision: 0,
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const lineSeries = new FastMountainRenderableSeries(wasmContext, {
        dataSeries,
        stroke: appTheme.VividOrange,
        fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
            { color: appTheme.VividTeal, offset: 0.2 },
            { color: 'Transparent', offset: 1 },
        ]),
    });

    sciChartSurface.renderableSeries.add(lineSeries);

    const cursorModifier = new CursorModifier({
        id: 'TotalRequestsCursorModifier',
        showTooltip: false,
        showAxisLabels: true,
        // showXLine: false,
        showYLine: false,
    });
    const rolloverModifier = new RolloverModifier({ id: 'TotalRequestsRolloverModifier', showTooltip: true });
    sciChartSurface.chartModifiers.add(
        cursorModifier,
        rolloverModifier,
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomPanModifier({ id: 'ZoomPanModifier', xyDirection: EXyDirection.XDirection }),
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection })
    );

    sciChartSurface.zoomExtents();
    yAxis.visibleRange = new NumberRange(0, yAxis.visibleRange.max * 1.5);

    const updateData = (newData: TDataEntry[]) => {
        const { xValues, yValues } = getRequestsNumberPerTimestamp(newData);

        // const dataSeries = new XyDataSeries(wasmContext, {
        //     xValues,
        //     yValues,
        // });

        const oldDataSeries = lineSeries.dataSeries as XyDataSeries;

        // lineSeries.dataSeries = dataSeries;
        // oldDataSeries.delete();

        oldDataSeries.clear();
        oldDataSeries.appendRange(xValues, yValues);
    };

    return { sciChartSurface, updateData };
};
