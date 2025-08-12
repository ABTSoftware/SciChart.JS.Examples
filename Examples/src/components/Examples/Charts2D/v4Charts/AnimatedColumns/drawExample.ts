import {
    SciChartSurface,
    NumericAxis,
    FastRectangleRenderableSeries,
    EColumnMode,
    EColumnYMode,
    Thickness,
    EAxisAlignment,
    ETextAlignment,
    ETitlePosition,
    IPointMetadata,
    easing,
    EDataLabelSkipMode,
    EVerticalTextPosition,
    EHorizontalTextPosition,
    NumberRange,
    XyxDataSeries,
    ColumnAnimation,
    XyDataSeries,
    DefaultPaletteProvider,
    TSciChart,
    parseColorToUIntArgb,
} from "scichart";

import { appTheme } from "../../../theme";
import { data } from "./atp-rankings";

type ATPMetadata = IPointMetadata & {
    rank: number;
    name: string;
    country: string;
};
class CountryPaletteProvider extends DefaultPaletteProvider {
    private colorMap: Map<string, { stroke: number; fill: number }> = new Map<
        string,
        { stroke: number; fill: number }
    >();

    constructor(wasmContext: TSciChart) {
        super();
        const countries = [
            "SE",
            "CS",
            "US",
            "EC",
            "AT",
            "HR",
            "NL",
            "UA",
            "RU",
            "ZA",
            "AU",
            "GB",
            "CL",
            "SK",
            "BR",
            "CH",
            "CZ",
            "AR",
            "RS",
            "JP",
            "ES",
            "YU",
            "FR",
            "CA",
            "BG",
            "BE",
            "GR",
            "IT",
            "NO",
            "DE",
            "PL",
            "DK",
        ];
        const max = countries.length - 1;
        for (let i = 0; i < countries.length; i++) {
            const country = countries[i];
            const stroke = parseColorToUIntArgb(appTheme.SciChartJsTheme.getStrokeColor(i, max, wasmContext));
            const fill = parseColorToUIntArgb(appTheme.SciChartJsTheme.getFillColor(i, max, wasmContext));
            this.colorMap.set(country, { stroke, fill });
        }
    }

    public overrideStrokeArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        const country = (metadata as ATPMetadata).country;
        return this.colorMap.get(country).stroke;
    }

    public overrideFillArgb(
        xValue: number,
        yValue: number,
        index: number,
        opacity?: number,
        metadata?: IPointMetadata
    ): number | undefined {
        const country = (metadata as ATPMetadata).country;
        return this.colorMap.get(country).fill;
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Setup axes
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(0, 15),
            isVisible: false,
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(0.5, 10.5),
            axisTitle: "Rank",
            axisTitleStyle: {
                fontSize: 18,
            },
            axisAlignment: EAxisAlignment.Left,
            drawMajorBands: false,
            drawLabels: true,
            drawMinorGridLines: false,
            drawMajorGridLines: false,
            drawMinorTickLines: false,
            drawMajorTickLines: false,
            keepLabelsWithinAxis: false,
            autoTicks: false,
            flippedCoordinates: true,
            majorDelta: 1,
            labelPrecision: 0,
            labelStyle: {
                fontSize: 22,
                fontFamily: "Arial",
            },
        })
    );

    sciChartSurface.yAxes.get(0).axisRenderer.hideOverlappingLabels = false;

    sciChartSurface.title = [`ATP Year-end Top 10 in ${data[0].year.toString()}`];

    const topMargin = 30;
    const rightMargin = 30;
    const bottomMargin = 30;
    const leftMargin = 30;

    sciChartSurface.padding = new Thickness(topMargin, rightMargin, bottomMargin, leftMargin);

    const xValues: number[] = [];
    const x1Values: number[] = [];
    const yValues: number[] = [];
    const metadata: ATPMetadata[] = [];

    for (const element of data[0].top10) {
        xValues.push(0);
        yValues.push(element.rank);
        x1Values.push(16 - element.rank);
        metadata.push({ isSelected: false, ...element });
    }

    // setup data
    const dataSeriesA = new XyxDataSeries(wasmContext, { xValues, yValues, x1Values, metadata });
    const dataSeriesB = new XyxDataSeries(wasmContext);

    const rectangleSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: dataSeriesA,
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.CenterHeight,
        defaultY1: 1,
        strokeThickness: 4,
        opacity: 0.3,
        paletteProvider: new CountryPaletteProvider(wasmContext),
        dataLabels: {
            skipMode: EDataLabelSkipMode.ShowAll,
            verticalTextPosition: EVerticalTextPosition.Center,
            horizontalTextPosition: EHorizontalTextPosition.Center,
            style: {
                fontFamily: "Arial",
                fontSize: 16,
            },
            color: appTheme.ForegroundColor,
            metaDataSelector: (md) => {
                const metadata = md as ATPMetadata;
                return `${metadata.name.toString()} (${metadata.country.toString()})`;
            },
            //updateTextInAnimation: true
        },
    });
    sciChartSurface.renderableSeries.add(rectangleSeries);
    // Setup animations

    const updateData = (i: number, curDataSeries: XyxDataSeries, nextDataSeries: XyxDataSeries) => {
        sciChartSurface.title = [`ATP Year-end Top 10 in ${data[i].year.toString()}`];
        nextDataSeries.clear();
        const cur: ATPMetadata[] = [];
        const next = data[i].top10;
        // Series animations work by animating values at the same index, so it is important to preserve the order of entries, which may be totally unrelated to the display order
        for (let p = 0; p < curDataSeries.count(); p++) {
            // Look at all existing entries
            const e = curDataSeries.getMetadataAt(p) as ATPMetadata;
            // see if they should still be on the chart in the next period
            const eNext = next.find((n) => n.name === e.name);
            if (eNext) {
                // Add to next data with new value
                nextDataSeries.append(0, eNext.rank, 16 - eNext.rank, { isSelected: false, ...eNext });
            } else {
                if (curDataSeries.getNativeYValues().get(p) > 0) {
                    // If they are currently in view, set them to be out of view in next period
                    nextDataSeries.append(0, 12, 0, e);
                }
            }
            // track all the current entries
            cur.push(e);
        }
        for (const element of next) {
            // Find entries that are completely new
            const isNew = cur.find((e) => e.name === element.name) === undefined;
            if (isNew) {
                // add out of view in current data, and with new value in next data
                curDataSeries.append(0, 12, 0, { isSelected: false, ...element });
                nextDataSeries.append(0, element.rank, 16 - element.rank, { isSelected: false, ...element });
            }
        }
        //Create an animation which will call the update for the following period when it completes
        const animation = new ColumnAnimation({
            duration: 1000,
            ease: easing.inOutQuart,
            dataSeries: nextDataSeries as any as XyDataSeries,
            onCompleted: () => {
                if (i < data.length - 2) {
                    updateData(i + 1, curDataSeries, nextDataSeries);
                }
            },
        });
        rectangleSeries.runAnimation(animation);
    };

    sciChartSurface.titleStyle = {
        color: appTheme.ForegroundColor,
        fontSize: 30,
        alignment: ETextAlignment.Center,
        position: ETitlePosition.Top,
        placeWithinChart: false,
        padding: Thickness.fromString("40 0 0 0"),
    };
    updateData(1, dataSeriesA, dataSeriesB);

    return { sciChartSurface, wasmContext };
};
