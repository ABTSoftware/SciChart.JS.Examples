import {
    NumericAxis,
    ZoomPanModifier,
    ZoomExtentsModifier,
    MouseWheelZoomModifier,
    SciChartSurface,
    ENumericFormat,
    FastRectangleRenderableSeries,
    XyxyDataSeries,
    EColumnYMode,
    EColumnMode,
    EDataPointWidthMode,
    NumberRange,
    EHorizontalTextPosition,
    EVerticalTextPosition,
    TextLabelProvider,
    RectangleSeriesDataLabelProvider,
    formatNumber,
    IRectangleSeriesDataLabelProviderOptions,
    EDataLabelSkipMode,
    EMultiLineAlignment,
    IPointMetadata,
    IFillPaletteProvider,
    EFillPaletteMode,
    parseColorToUIntArgb,
    ELabelAlignment,
    Thickness,
} from "scichart";
import { appTheme } from "../../../theme";

const data = [
    { date: "Jan.", profit: 387264 },
    { date: "Feb.", profit: 772096 },
    { date: "Mar.", profit: 638075 },
    { date: "Apr.", profit: -211386 },
    { date: "May", profit: -138135 },
    { date: "Jun.", profit: -267238 },
    { date: "Jul.", profit: 431406 },
    { date: "Aug.", profit: 363018 },
    { date: "Sep.", profit: -224638 },
    { date: "Oct.", profit: -299867 },
    { date: "Nov.", profit: 607365 },
    { date: "Dec.", profit: 1106986 },
];

const waterfall = function (numbers: { date: string; profit: number }[]) {
    let last = 0,
        accu = 0;
    const waterfall = numbers.map((d, i) => {
        last = accu;
        accu += d.profit;
        return {
            date: d.date,
            nextDay: i < numbers.length - 1 ? numbers[i + 1].date : "Total",
            prior: last,
            accu: accu,
            profit: d.profit,
        };
    });

    waterfall.push({
        date: "Total",
        nextDay: null,
        prior: 0,
        accu: accu,
        profit: 0,
    });

    return waterfall;
};

const generatedData = waterfall(data);

const labelProvider = new TextLabelProvider({
    labels: [...generatedData.map((d) => d.date)],
    maxLength: 15,
});

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    // Create a SciChartSurface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const growBy = new NumberRange(0.05, 0.05);

    // Create an XAxis with a TextLabelProvider
    const xAxis = new NumericAxis(wasmContext, {
        // labelprovider maps Xaxis values (in this case index) to labels (in this case manufacturer name)
        labelProvider,
        labelStyle: {
            alignment: ELabelAlignment.Center,
            padding: new Thickness(2, 1, 2, 1),
            fontSize: 11,
        },
        maxAutoTicks: 15,
        growBy: new NumberRange(0.05, 0.05), // add some horizontal padding
    });

    sciChartSurface.xAxes.add(xAxis);

    // Create a YAxis
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy, labelFormat: ENumericFormat.Engineering }));

    class CustomFillProvider implements IFillPaletteProvider {
        public readonly fillPaletteMode = EFillPaletteMode.SOLID;

        public onAttached(): void {}
        public onDetached(): void {}

        public overrideFillArgb(
            _xValue: number,
            _yValue: number,
            _index: number,
            _opacity?: number,
            metadata?: IPointMetadata
        ): number {
            const profit = (metadata as unknown as { profit: number })?.profit;

            if (profit > 0) {
                return parseColorToUIntArgb("green", 128);
            }

            if (profit < 0) {
                return parseColorToUIntArgb("red", 128);
            }

            return parseColorToUIntArgb("blue", 128);
        }
    }

    class TreemapDataLabelProvider extends RectangleSeriesDataLabelProvider {
        constructor(options?: IRectangleSeriesDataLabelProviderOptions) {
            super(options);
        }

        // Override "getText" method to provide dynamic text based on rectangle size
        getText(state: any): string {
            const metadata = state.getMetaData() as any;

            return (
                `${formatNumber(metadata.accu, ENumericFormat.Engineering, 2)}$` +
                (metadata.profit === 0
                    ? ""
                    : `\n${metadata.profit > 0 ? "+" : ""}${formatNumber(
                          metadata.profit,
                          ENumericFormat.Engineering,
                          this.precision
                      )}$`)
            );
        }
    }

    // Prepare data and create rectangle series

    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: new XyxyDataSeries(wasmContext, {
            xValues: generatedData.map((d, i) => i),
            yValues: generatedData.map((d) => d.prior),
            x1Values: generatedData.map((d, i) => i),
            y1Values: generatedData.map((d) => d.accu),
            metadata: generatedData as any[],
        }),
        columnXMode: EColumnMode.Mid,
        columnYMode: EColumnYMode.TopBottom,
        dataPointWidthMode: EDataPointWidthMode.Range,
        stroke: "black",
        strokeThickness: 1,
        opacity: 0.5,
        fill: appTheme.DarkIndigo,
        dataLabelProvider: new TreemapDataLabelProvider({
            skipMode: EDataLabelSkipMode.ShowAll,
            color: "white",
            style: {
                fontSize: 11,
                multiLineAlignment: EMultiLineAlignment.Center,
                lineSpacing: 5,
            },
            horizontalTextPosition: EHorizontalTextPosition.Center,
            verticalTextPosition: EVerticalTextPosition.Center,
            metaDataSelector: (md: unknown) => {
                return (md as { profit: string }).profit;
            },
        }),
        paletteProvider: new CustomFillProvider(),
    });
    sciChartSurface.renderableSeries.add(rectangleSeries);

    // Add interactivity modifiers
    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier({ enableZoom: true }),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier()
    );

    return { sciChartSurface, wasmContext };
};
