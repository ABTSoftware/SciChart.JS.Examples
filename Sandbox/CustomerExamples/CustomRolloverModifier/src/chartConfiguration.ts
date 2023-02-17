import {
    SciChartSurface,
    NumericAxis,
    AUTO_COLOR,
    CategoryAxis,
    EExecuteOn,
    EllipsePointMarker,
    FastLineRenderableSeries,
    IRolloverModifierOptions,
    IXyDataSeriesOptions,
    ModifierMouseArgs,
    MouseWheelZoomModifier,
    NumberRange,
    RolloverModifier,
    TextLabelProvider,
    TSciChart,
    TWebAssemblyChart,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from 'scichart';
import { CustomRolloverModifier, EShowTooltipOptions, EExecuteWhen } from './CustomRolloverModifier';

export type TChangeEventHandler = (value: any) => void;
export type TChartInfo = TWebAssemblyChart & {
    chartControls: {
        handleShowTooltipOptionsChange: TChangeEventHandler;
        handleExecuteWhenChange: TChangeEventHandler;
    };
};

export const createDataSeries = (wasmContext: TSciChart, index: number, options?: IXyDataSeriesOptions) => {
    const sigma = Math.pow(0.6, index);
    const dataSeries = new XyDataSeries(wasmContext, options);
    for (let i = 0; i < 100; i++) {
        const grow = 1 + i / 99;
        dataSeries.append(i, Math.sin((Math.PI * i) / 15) * grow * sigma);
    }
    return dataSeries;
};

export const drawChart = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);
    const xAxis = new CategoryAxis(wasmContext, { growBy: new NumberRange(0.5, 0.05) });
    xAxis.labelProvider = new TextLabelProvider({
        labels: Array.from(Array(100)).map((_, i) => 'x' + i),
    });

    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });
    yAxis.labelProvider.cursorPrecision = 2;
    sciChartSurface.yAxes.add(yAxis);

    const dataSeries = createDataSeries(wasmContext, 0, { dataSeriesName: 'Sinewave A' });

    // Series 1
    const renderableSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: AUTO_COLOR,
        strokeThickness: 3,
        dataSeries,
        pointMarker: new EllipsePointMarker(wasmContext, {
            width: 5,
            height: 5,
            strokeThickness: 2,
            fill: 'white',
            stroke: AUTO_COLOR,
        }),
    });
    sciChartSurface.renderableSeries.add(renderableSeries1);


    const rolloverModifier = new CustomRolloverModifier();

    sciChartSurface.chartModifiers.add(
        rolloverModifier,
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );

    sciChartSurface.zoomExtents();

    const handleShowTooltipOptionsChange = (value: EShowTooltipOptions) => {
        rolloverModifier.showTooltipOn = value;
    };

    const handleExecuteWhenChange = (value: EExecuteWhen) => {
        rolloverModifier.executeWhen = value;
    };

    return { sciChartSurface, wasmContext, chartControls: { handleShowTooltipOptionsChange, handleExecuteWhenChange } };
};