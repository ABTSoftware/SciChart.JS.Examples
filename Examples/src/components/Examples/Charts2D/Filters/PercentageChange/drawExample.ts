import { appTheme } from "../../../theme";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import {
    SciChartSurface,
    NumericAxis,
    NumberRange,
    EAutoRange,
    XyDataSeries,
    XyScaleOffsetFilter,
    FastLineRenderableSeries,
    HitTestInfo,
    XySeriesInfo,
    SeriesInfo,
    ZoomPanModifier,
    ZoomExtentsModifier,
    RolloverModifier,
    TextAnnotation,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    ECoordinateMode,
    EAnnotationLayer,
    ENumericFormat,
} from "scichart";

// Custom formatNumber function to avoid conflicts
const customFormatNumber = (value: number, format: ENumericFormat, precision: number) => {
    return value.toFixed(precision);
};

const getScaleValue = (dataSeries: XyDataSeries, zeroXValue: number) => {
    const dataLength = dataSeries.count();
    let zeroIndex = -1;
    for (let i = 0; i < dataLength; i++) {
        const xValue = dataSeries.getNativeXValues().get(i);
        if (xValue >= zeroXValue) {
            zeroIndex = i;
            break;
        }
    }
    if (zeroIndex === -1) {
        return 1;
    }
    return 100 / dataSeries.getNativeYValues().get(zeroIndex);
};

class TransformedSeries extends FastLineRenderableSeries {
    public originalSeries: XyDataSeries;

    public override getSeriesInfo(hitTestInfo: HitTestInfo): SeriesInfo {
        const info = new XySeriesInfo(this, hitTestInfo);
        if (this.originalSeries && info.dataSeriesIndex !== undefined) {
            info.yValue = this.originalSeries.getNativeYValues().get(info.dataSeriesIndex);
        }
        return info;
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement, usePercentage: boolean) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const xAxis = new NumericAxis(wasmContext);
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, {
        autoRange: EAutoRange.Always,
        labelPostfix: usePercentage ? "%" : "",
        labelPrecision: usePercentage ? 0 : 1,
        growBy: new NumberRange(0.1, 0.1),
    });

    yAxis.labelProvider.formatCursorLabel = (value: number) => customFormatNumber(value, ENumericFormat.Decimal, 1);
    sciChartSurface.yAxes.add(yAxis);

    const lineSeries = new TransformedSeries(wasmContext, {
        strokeThickness: 3,
        stroke: appTheme.VividSkyBlue,
    });
    sciChartSurface.renderableSeries.add(lineSeries);

    const data0 = new RandomWalkGenerator().Seed(1337).getRandomWalkSeries(100);
    const dataSeries1 = new XyDataSeries(wasmContext, { xValues: data0.xValues, yValues: data0.yValues });

    const transform1 = new XyScaleOffsetFilter(dataSeries1, { offset: -100 });

    xAxis.visibleRangeChanged.subscribe(
        (args) => (transform1.scale = getScaleValue(dataSeries1, args.visibleRange.min))
    );

    if (usePercentage) {
        lineSeries.dataSeries = transform1;
        lineSeries.originalSeries = dataSeries1;
    } else {
        lineSeries.dataSeries = dataSeries1;
    }

    const lineSeries2 = new TransformedSeries(wasmContext, {
        strokeThickness: 3,
        stroke: appTheme.VividOrange,
    });
    sciChartSurface.renderableSeries.add(lineSeries2);

    const data1 = new RandomWalkGenerator().Seed(0).getRandomWalkSeries(100);
    const dataSeries2 = new XyDataSeries(wasmContext, { xValues: data1.xValues, yValues: data1.yValues });

    const transform2 = new XyScaleOffsetFilter(dataSeries2, { offset: -100 });
    xAxis.visibleRangeChanged.subscribe(
        (args) => (transform2.scale = getScaleValue(dataSeries2, args.visibleRange.min))
    );

    if (usePercentage) {
        lineSeries2.dataSeries = transform2;
        lineSeries2.originalSeries = dataSeries2;
    } else {
        lineSeries2.dataSeries = dataSeries2;
    }

    sciChartSurface.chartModifiers.add(new ZoomPanModifier({ enableZoom: true }));
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new RolloverModifier({ rolloverLineStroke: appTheme.VividTeal }));

    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: "Toggle between original data & Percentage Changed on chart",
            fontSize: 16,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0,
            opacity: 0.77,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
        })
    );

    const watermarkText = usePercentage ? "Percentage Changed" : "Original Data";
    sciChartSurface.annotations.add(
        new TextAnnotation({
            text: watermarkText,
            fontSize: 32,
            textColor: appTheme.ForegroundColor,
            x1: 0.5,
            y1: 0.5,
            opacity: 0.23,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            annotationLayer: EAnnotationLayer.BelowChart,
        })
    );

    return { sciChartSurface, wasmContext };
};
