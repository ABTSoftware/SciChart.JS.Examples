import {
    SciChartSurface,
    NumericAxis,
    FastRectangleRenderableSeries,
    EColumnMode,
    EColumnYMode,
    XyxyDataSeries,
    Thickness,
    EAxisAlignment,
    ETextAlignment,
    ETitlePosition,
    IPointMetadata,
    GenericAnimation,
    easing,
    EDataLabelSkipMode,
    EVerticalTextPosition,
    EHorizontalTextPosition,
    NumberRange,
    SciChartDefaults,
    ELabelAlignment,
    TextLabelProvider,
    XyxDataSeries,
    SeriesAnimation,
    ColumnAnimation,
    XyDataSeries,
} from "scichart";

import { appTheme } from "../../../theme";
import { data } from "./atp-rankings";

SciChartDefaults.useNativeText = false;

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    type ATPMetadata = IPointMetadata & {
        rank: number;
        name: string;
        country: string;
    };

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
            // labelProvider: new TextLabelProvider({
            //     labels: ["10.", "9.", "8.", "7.", "6.", "5.", "4.", "3.", "2.", "1."],
            //     maxLength: 10,
            // }),
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
            labelStyle: {
                fontSize: 22,
                fontWeight: "bold",
                color: appTheme.MutedOrange,
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
        stroke: appTheme.DarkIndigo,
        strokeThickness: 4,
        fill: appTheme.VividOrange,
        opacity: 0.3,
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
        const cur = data[i - 1].top10;
        const next = data[i].top10;
        for (let p = 0; p < curDataSeries.count(); p++) {
            const e = curDataSeries.getMetadataAt(p) as ATPMetadata;
            const eNext = next.find((n) => n.name === e.name);
            if (eNext) {
                // updating
                nextDataSeries.append(0, eNext.rank, 16 - eNext.rank, { isSelected: false, ...eNext });
            } else {
                //console.log(`${e.name} going in ${data[i].year.toString()}`);
                if (curDataSeries.getNativeYValues().get(p) > 0) {
                    // remove
                    nextDataSeries.append(0, 12, 0, e);
                }
            }
        }
        for (const element of next) {
            const isNew = cur.find((e) => e.name === element.name) === undefined;
            if (isNew) {
                // add at 0
                curDataSeries.append(0, 12, 0, { isSelected: false, ...element });
                nextDataSeries.append(0, element.rank, 16 - element.rank, { isSelected: false, ...element });
            }
        }
        const animation = new ColumnAnimation({
            duration: 1000,
            ease: easing.inOutSine,
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
        color: appTheme.MutedOrange,
        fontSize: 30,
        fontWeight: "bold",
        alignment: ETextAlignment.Center,
        position: ETitlePosition.Top,
        placeWithinChart: false,
        padding: Thickness.fromString("40 0 0 0"),
    };
    updateData(1, dataSeriesA, dataSeriesB);

    return { sciChartSurface, wasmContext };
};
