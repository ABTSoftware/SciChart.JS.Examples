import {
    CategoryAxis,
    DateTimeNumericAxis,
    EFillPaletteMode,
    EStrokePaletteMode,
    EAutoRange,
    EAxisAlignment,
    ELabelAlignment,
    ENumericFormat,
    FastColumnRenderableSeries,
    FastLineRenderableSeries,
    IFillPaletteProvider,
    IStrokePaletteProvider,
    IPointMetadata,
    IRenderableSeries,
    LogarithmicAxis,
    MouseWheelZoomModifier,
    NumericAxis,
    NumberRange,
    parseColorToUIntArgb,
    SciChartSurface,
    TextLabelProvider,
    Thickness,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";

import { appTheme } from "../../../theme";
import { TBinanceCandleData } from "../../../../../commonTypes/TBinanceCandleData";

const colorStrings = [
    appTheme.VividSkyBlue,
    appTheme.VividPink,
    appTheme.MutedTeal,
    appTheme.VividOrange,
    appTheme.VividBlue,
];
const colors = colorStrings.map((c) => parseColorToUIntArgb(c + "AA"));

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface with Theme
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const labelProvider = new TextLabelProvider({
        labels: ["Bitcoin", "Ethereum", "XRP", "Cardano", "Dogecoin"],
    });
    // Category Axis - measures using index not value.
    const xAxis = new CategoryAxis(wasmContext, { id: "XCategory", labelProvider });

    xAxis.labelStyle.fontSize = 18;
    xAxis.labelStyle.alignment = ELabelAlignment.Center;
    xAxis.labelStyle.padding = new Thickness(2, 1, 2, 1);
    // Allow rotated labels to overlap
    xAxis.axisRenderer.hideOverlappingLabels = false;
    // Keep first and last labels aligned to their ticks
    xAxis.axisRenderer.keepLabelsWithinAxis = false;
    xAxis.axisTitle = ["Top 5 Coins - Category Axis", "Custom labels using TextLabelProvider"];
    xAxis.axisTitleStyle.fontSize = 18;

    sciChartSurface.xAxes.add(xAxis);

    // Numeric Y-Axis. measures using value
    const yAxis = new NumericAxis(wasmContext, {
        id: "YNumeric",
        autoRange: EAutoRange.Always,
        labelPrefix: "$",
        labelPostfix: "B",
        labelPrecision: 0,
        axisAlignment: EAxisAlignment.Left,
        labelStyle: { fontSize: 18 },
    });
    // Pass array to axisTitle to make it multiline
    yAxis.axisTitle = ["Market Cap - Numeric Axis", "formatting using prefix and postfix"];
    yAxis.axisTitleStyle.fontSize = 18;

    sciChartSurface.yAxes.add(yAxis);

    const columnSeries = new FastColumnRenderableSeries(wasmContext, {
        strokeThickness: 0,
        dataPointWidth: 0.5,
        paletteProvider: new AxisTypesPaletteProvider(),
        xAxisId: xAxis.id,
        yAxisId: yAxis.id,
    });
    sciChartSurface.renderableSeries.add(columnSeries);

    const dataSeries = new XyDataSeries(wasmContext);
    dataSeries.appendRange([0, 1, 2, 3, 4], [380.9, 162.1, 23.87, 14.56, 8.372]);
    columnSeries.dataSeries = dataSeries;
    const endDate = new Date(2022, 10, 5);
    const startTime = endDate.getTime() / 1000 - 500 * 7 * 24 * 60 * 60;
    const dateXAxis = new DateTimeNumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Top,
        id: "XDate",
        labelStyle: { fontSize: 18 },
        axisTitle: ["Date Axis", "Auto formats based on the date range"],
        axisTitleStyle: { fontSize: 18 },
        visibleRangeLimit: new NumberRange(startTime, endDate.getTime() / 1000),
    });
    sciChartSurface.xAxes.add(dateXAxis);

    // Logarithmic Y Axis - measures on log scale using value
    const logYAxis = new LogarithmicAxis(wasmContext, {
        id: "YLog",
        logBase: 2,
        labelFormat: ENumericFormat.SignificantFigures,
        labelPrefix: "$",
        axisAlignment: EAxisAlignment.Right,
        labelStyle: { fontSize: 18 },
        axisTitle: ["Price - Logarithmic Axis", "base 2, labelFormat: SignificantFigures"],
        axisTitleStyle: { fontSize: 18 },
    });
    sciChartSurface.yAxes.add(logYAxis);

    const symbols = ["BTCUSDT", "ETHUSDT", "XRPUSDT", "ADAUSDT", "DOGEUSDT"];
    for (let index = 0; index < symbols.length; index++) {
        const symbol = symbols[index];
        const priceDataSeries = new XyDataSeries(wasmContext, { dataSeriesName: symbol });
        const series = new FastLineRenderableSeries(wasmContext, {
            id: symbol,
            strokeThickness: 3,
            xAxisId: dateXAxis.id,
            yAxisId: logYAxis.id,
            stroke: colorStrings[index],
            dataSeries: priceDataSeries,
        });
        sciChartSurface.renderableSeries.add(series);

        (async () => {
            const response = await fetch(
                `/api/get-binance-candles?interval=1w&symbol=${symbol}&limit=500&endTime=${endDate}`
            );
            const data: TBinanceCandleData = await response.json();
            priceDataSeries.appendRange(data.xValues, data.closeValues);
            sciChartSurface.zoomExtents();
        })();
    }

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ includedXAxisIds: [dateXAxis.id], includedYAxisIds: [logYAxis.id] }),
        new MouseWheelZoomModifier({ includedXAxisIds: [dateXAxis.id], includedYAxisIds: [logYAxis.id] }),
        new ZoomExtentsModifier()
    );

    return { sciChartSurface, wasmContext };
};

class AxisTypesPaletteProvider implements IStrokePaletteProvider, IFillPaletteProvider {
    public readonly strokePaletteMode = EStrokePaletteMode.SOLID;
    public readonly fillPaletteMode = EFillPaletteMode.SOLID;

    // tslint:disable-next-line:no-empty
    public onAttached(parentSeries: IRenderableSeries): void {}

    // tslint:disable-next-line:no-empty
    public onDetached(): void {}

    public overrideFillArgb(xValue: number, yValue: number, index: number): number {
        return colors[xValue];
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number {
        return undefined;
    }
}
