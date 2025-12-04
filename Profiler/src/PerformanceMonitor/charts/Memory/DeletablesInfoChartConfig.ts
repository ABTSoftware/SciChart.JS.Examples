import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    EAutoRange,
    XyDataSeries,
    EDataLabelSkipMode,
    EHorizontalTextPosition,
    EMultiLineAlignment,
    EVerticalTextPosition,
    FastImpulseRenderableSeries,
    IDataLabelProviderOptions,
    TSciChart
} from "scichart";
import { CustomObjectRegistry } from "./CustomObjectRegistry";

const X_AXIS_ID = "DeletablesInfoXAxis";
const Y_AXIS_ID = "DeletablesInfoYAxis";

export const getMemoryData = () => {
    const xValues = Array.from(CustomObjectRegistry.stateCollection.keys());
    const deletables = Array.from(CustomObjectRegistry.stateCollection.values());
    const yValues = Array.from(deletables, itemList => itemList.length);
    const metadata = deletables.map(items => {
        const groupedDeletables = new Map<string, number>();
        items.forEach(y => {
            const x = y.split("_")[0];
            if (groupedDeletables.has(x)) {
                groupedDeletables.set(x, groupedDeletables.get(x) + 1);
            } else {
                groupedDeletables.set(x, 1);
            }
        });
        return { isSelected: false, groupedDeletables };
    });
    // console.log("deletables", Array.from(CustomObjectRegistry.stateCollection.values()))

    return { xValues, yValues, metadata };
};

const getMemoryRenderableSeries = (wasmContext: TSciChart, metricsData: ReturnType<typeof getMemoryData>) => {
    const { xValues, yValues } = metricsData;
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        dataSeriesName: "SciChartDeletableObjects"
    });

    const dataLabels: IDataLabelProviderOptions = {
        style: {
            fontFamily: "Arial",
            fontSize: 12,
            multiLineAlignment: EMultiLineAlignment.Center
        },
        color: "white",
        verticalTextPosition: EVerticalTextPosition.Above,
        horizontalTextPosition: EHorizontalTextPosition.Center,
        skipNumber: 10,
        skipMode: EDataLabelSkipMode.SkipIfSame
    };

    return new FastImpulseRenderableSeries(wasmContext, {
        // yAxisId: memoryYAxis.id,
        // xAxisId: xAxis.id,
        // dataLabels,
        // dataPointWidth: 0.01,
        fill: "Orange",
        stroke: "Orange",
        opacity: 0.5,
        dataSeries
    });
};

const configureDeletablesInfoChart = (
    sciChartSurface: SciChartSurface,
    metricsData: ReturnType<typeof getMemoryData>
) => {
    const wasmContext = sciChartSurface.webAssemblyContext2D;

    const xAxis = new NumericAxis(wasmContext, {
        labelPrecision: 0,
        visibleRangeLimit: new NumberRange(0, Infinity),
        // visibleRangeSizeLimit: new NumberRange(0, 20),
        axisTitle: "Time from page load (ms)"
    });

    const yAxis = new NumericAxis(wasmContext, {
        axisTitle: "Deletables count",
        // visibleRange: new NumberRange(3, 7),
        // visibleRangeSizeLimit: new NumberRange(10, 20),
        // visibleRangeLimit: new NumberRange(-1, 20),
        growBy: new NumberRange(0.1, 0.5),
        autoRange: EAutoRange.Once,
        isVisible: true
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    const memSeries = getMemoryRenderableSeries(wasmContext, metricsData);

    sciChartSurface.renderableSeries.add(memSeries);
    // rolloverModifier.includeSeries(memSeries, false);

    return { sciChartSurface };
};

export const getDeletablesInfoChartInitFunction = () => {
    const memoryData = getMemoryData();

    return async (rootElement: string | HTMLDivElement) => {
        const { sciChartSurface } = await SciChartSurface.create(rootElement);
        return configureDeletablesInfoChart(sciChartSurface, memoryData);
    };
};
