import {
    IRenderableSeries,
    XyDataSeries,
    FastLineRenderableSeries,
    ELineDrawMode,
    SquarePointMarker,
    XyScatterRenderableSeries,
    SciChartSurface,
    FastLineSegmentRenderableSeries,
    ECoordinateMode,
    ELabelPlacement,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint
} from "scichart";

import { AxisBase2D } from "scichart";
import { TSciChart } from "scichart";
import { NativeTextAnnotation } from "scichart";
import { AxisMarkerAnnotation } from "scichart";
import { HorizontalLineAnnotation } from "scichart";
import {
    axisRenderingMarkTypes,
    annotationRenderingMarkTypes,
    seriesRenderingMarkTypes,
    miscMarkTypes,
    bulkMarkTypes,
    summaryMarkTypes
} from "../data/markTypeCategories";
import { TMarkType, TSurfaceId } from "../data/typeAliases";
import { getSeriesColor } from "../PerformanceMarkColors";
import { TDataEntry, StatsRangeDataEntry, StatsEventDataEntry } from "../data/PerformanceStatsUtils";
import { XyxyDataSeries } from "scichart";
import { CollapsibleAxisMarkerAnnotation } from "../annotations/CollapsibleAxisMarkerAnnotation";
import { getIsEventMarkType, getIsOperationEndMarkType } from "../data/MarksParsing";

type SeriesGroup = { markType: TMarkType; series: IRenderableSeries };

export class ProfilerSeriesConfigurator {
    // This is defined by the indexes returned by getMarkTypePositionIndex
    public performanceMarksCategoriesNumber = 5;
    public yValueForOtherOperationStats = -2;
    public yValueForOtherEventStats = -2;

    /** Profiler Surface */
    protected sciChartSurface: SciChartSurface;
    protected wasmContext: TSciChart;
    protected statsInfo: TDataEntry;
    protected xAxis: AxisBase2D;
    protected yAxis: AxisBase2D;

    public constructor(sciChartSurface: SciChartSurface, statsInfo: TDataEntry, xAxis: AxisBase2D, yAxis: AxisBase2D) {
        this.sciChartSurface = sciChartSurface;
        this.wasmContext = sciChartSurface.webAssemblyContext2D;
        this.statsInfo = statsInfo;
        this.xAxis = xAxis;
        this.yAxis = yAxis;
    }

    public addSeries() {
        const { mainSurfaceIds, subChartsPerSurface } = this.statsInfo.statsContextInfo;

        // series for performance stats related to a specific surface in the app
        const renderableSeriesForSurfaceStats: SeriesGroup[] = mainSurfaceIds.flatMap((surfaceId, surfaceIndex) => {
            // Main Surface series
            const seriesForSurface = this.getSeriesForSurface({ surfaceId, surfaceIndex });

            // SubChart series
            const relatedSubChartIds = subChartsPerSurface.get(surfaceId);
            const seriesForSubSurfaceStats = relatedSubChartIds.flatMap((subSurfaceId, subSurfaceIndex) =>
                this.getSeriesForSurface({
                    surfaceId: subSurfaceId,
                    surfaceIndex: surfaceIndex + subSurfaceIndex
                })
            );

            return seriesForSurface.concat(seriesForSubSurfaceStats);
        });

        // series for performance stats NOT related to a specific surface in the app
        const renderableSeriesForOtherOperationStats: SeriesGroup[] = Array.from(
            this.statsInfo.otherStatsByMarkType.keys()
        )
            .filter(getIsOperationEndMarkType)
            .filter(t => this.getMarkTypePositionIndex(t) !== null)
            .map((markType, index) => this.createOtherOperationSeries({ markType, index }));

        const renderableSeriesForOtherEventStats: SeriesGroup[] = Array.from(this.statsInfo.otherStatsByMarkType.keys())
            .filter(getIsEventMarkType)
            .filter(t => this.getMarkTypePositionIndex(t) !== null)
            .map((markType, index) => this.createOtherEventSeries({ markType, index }));
        ////

        const allSeries: IRenderableSeries[] = renderableSeriesForSurfaceStats
            .concat(renderableSeriesForOtherOperationStats)
            .concat(renderableSeriesForOtherEventStats)
            .map(({ series }) => series);

        this.sciChartSurface.renderableSeries.add(...allSeries);
    }

    protected getSeriesForSurface(props: { surfaceId: string; surfaceIndex: number }): SeriesGroup[] {
        const { surfaceId, surfaceIndex } = props;

        const operationMarksToSeriesMapper = (markType: TMarkType) =>
            this.createSurfaceOperationSeries({ markType, surfaceIndex, surfaceId });

        const eventMarksToSeriesMapper = (markType: TMarkType) =>
            this.createSurfaceEventSeries({ markType, surfaceIndex, surfaceId });

        const operationSeries: SeriesGroup[] = Array.from(
            this.statsInfo.statsBySurfaceAndMarkType.get(surfaceId).keys()
        )
            .filter(getIsOperationEndMarkType)
            .filter(t => this.getMarkTypePositionIndex(t) !== null)
            .map(operationMarksToSeriesMapper);

        const eventSeries: SeriesGroup[] = Array.from(this.statsInfo.statsBySurfaceAndMarkType.get(surfaceId).keys())
            .filter(getIsEventMarkType)
            .filter(t => this.getMarkTypePositionIndex(t) !== null)
            .map(eventMarksToSeriesMapper);

        return operationSeries.concat(eventSeries);
    }

    protected createSurfaceOperationSeries(props: { markType: TMarkType; surfaceIndex: number; surfaceId: string }) {
        const wasmContext = this.wasmContext;
        const { markType, surfaceIndex, surfaceId } = props;
        const statsByMarkType = this.statsInfo.statsBySurfaceAndMarkType.get(surfaceId);
        const dataValues = (statsByMarkType.get(markType) as StatsRangeDataEntry[]) ?? [];
        const xValues = dataValues.flatMap(entry => (entry.end ? [entry.start, entry.end] : entry.start));

        const seriesIndex = this.getMarkTypePositionIndex(markType);
        const yValues = dataValues.flatMap(entry => {
            const yOffset = surfaceIndex * (this.performanceMarksCategoriesNumber + 1) + seriesIndex;
            return entry.end ? [yOffset, yOffset] : yOffset;
        });

        const metadata = dataValues.flatMap(entry => {
            const isSelected = false;
            const metadataEntry = { isSelected, detail: entry.detail };
            return entry.end ? [metadataEntry, metadataEntry] : metadataEntry;
        });

        const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: `${markType}-Chart-${surfaceIndex}`,
            containsNaN: true,
            xValues,
            yValues,
            // y1Values,
            metadata
        });

        // const xValues = dataValues.map(entry => entry.start);
        // const x1Values = dataValues.map(entry => entry.end);

        // const seriesIndex = this.getMarkTypePositionIndex(markType);
        // const yValues = dataValues.map((entry, i) => {
        //     const yOffset = surfaceIndex * (this.performanceMarksCategoriesNumber + 1) + seriesIndex;
        //     return yOffset - 0.5;
        // });
        // const y1Values = yValues.map((entry, i) => {
        //     const yOffset = surfaceIndex * (this.performanceMarksCategoriesNumber + 1) + 3;
        //     return yOffset - 0.5;
        // });

        // const dataSeries = new XyxyDataSeries(wasmContext, {
        //     dataSeriesName: `${markType}-Chart-${surfaceIndex}`,
        //     // containsNaN: false,
        //     xValues,
        //     yValues,
        //     x1Values,
        //     y1Values
        //     // metadata
        // });

        const series = new FastLineSegmentRenderableSeries(wasmContext, {
            id: `${markType}-Chart-${surfaceIndex}`,
            dataSeries,
            yAxisId: this.yAxis.id,
            xAxisId: this.xAxis.id,
            drawNaNAs: ELineDrawMode.DiscontinuousLine,
            // dataLabels,
            pointMarker: new SquarePointMarker(wasmContext, {
                height: 20,
                width: 2,
                stroke: getSeriesColor(markType),
                fill: getSeriesColor(markType)
            }),
            opacity: 0.25 * (seriesIndex + 1),
            stroke: getSeriesColor(markType),
            // strokeY1: getSeriesColor(markType),
            // fill: getSeriesColor(markType),
            // fillY1: getSeriesColor(markType),
            strokeThickness: 20,
            renderOrder: seriesIndex,
            // columnXMode: EColumnMode.StartEnd, // x, x1
            // columnYMode: EColumnYMode.TopBottom, // y, y1
            // fill: getSeriesColor(markType),
            onSelectedChanged
            // paletteProvider: new CustomPaletteProvider()
        });

        return { markType, series, surfaceId };
    }

    protected createSurfaceEventSeries(props: { markType: TMarkType; surfaceIndex: number; surfaceId: string }) {
        const wasmContext = this.wasmContext;
        const { markType, surfaceIndex, surfaceId } = props;
        const statsByMarkType = this.statsInfo.statsBySurfaceAndMarkType.get(surfaceId);
        const dataValues = statsByMarkType.get(markType) as StatsEventDataEntry[];
        const xValues = dataValues.flatMap(entry => [entry.start]);
        const yValues = xValues.map(
            () => surfaceIndex * (this.performanceMarksCategoriesNumber + 1) + this.getMarkTypePositionIndex(markType)
        );

        const metadata = dataValues.flatMap(entry => {
            const isSelected = false;
            const metadataEntry = { isSelected, detail: entry.detail };
            return metadataEntry;
        });
        // const metadata = dataValues.flatMap(entry => {
        //     const res = { isSelected: false, name: key, duration: entry.end - entry.start };
        //     return entry.end ? [{ isSelected: false, name: key }, res] : [res];
        // });

        const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: `${markType}-Chart-${surfaceIndex}`,
            isSorted: true,
            containsNaN: false,
            xValues,
            yValues,
            metadata
        });

        const series = new XyScatterRenderableSeries(wasmContext, {
            id: `${markType}-Chart-${surfaceIndex}`,
            dataSeries,
            yAxisId: this.yAxis.id,
            xAxisId: this.xAxis.id,
            // drawNaNAs: ELineDrawMode.DiscontinuousLine,
            // dataLabels,
            pointMarker: new SquarePointMarker(wasmContext, {
                height: 20,
                width: 4,
                stroke: getSeriesColor(markType),
                fill: getSeriesColor(markType)
            }),
            opacity: 0.6,
            stroke: getSeriesColor(markType),
            onSelectedChanged
            // paletteProvider: new CustomPaletteProvider()
        });

        return { markType, series, surfaceId };
    }

    protected createOtherOperationSeries = (props: { markType: TMarkType; index: number }) => {
        const { markType, index } = props;
        const wasmContext = this.wasmContext;

        const dataValues = (this.statsInfo.otherStatsByMarkType.get(markType) as StatsRangeDataEntry[]) ?? [];
        const xValues = dataValues.flatMap((entry, i) => {
            // const nextEntry = dataValues[i + 1]
            return entry.end ? [entry.start, entry.end] : [entry.start];
        });

        const yOffset = this.yValueForOtherOperationStats;
        const yValues = dataValues.flatMap(entry => (entry.end ? [yOffset, yOffset] : yOffset));

        // const y1Values = yValues.map(y => y + 1);
        const metadata = dataValues.flatMap(entry => {
            const isSelected = false;
            const metadataEntry = { isSelected, detail: entry.detail };
            return entry.end ? [metadataEntry, metadataEntry] : metadataEntry;
        });

        const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: `${markType}`,
            containsNaN: true,
            xValues,
            yValues,
            // y1Values,
            metadata
        });

        const series = new FastLineSegmentRenderableSeries(wasmContext, {
            id: `${markType}`,
            dataSeries,
            yAxisId: this.yAxis.id,
            xAxisId: this.xAxis.id,
            drawNaNAs: ELineDrawMode.DiscontinuousLine,
            // dataLabels,
            pointMarker: new SquarePointMarker(wasmContext, {
                height: 20,
                width: 2,
                stroke: getSeriesColor(markType),
                fill: getSeriesColor(markType)
            }),
            opacity: 0.6,
            stroke: getSeriesColor(markType),
            // strokeY1: getSeriesColor(markType),
            // fill: getSeriesColor(markType),
            // fillY1: getSeriesColor(markType),
            strokeThickness: 10
            // onSelectedChanged,
            // paletteProvider: new CustomPaletteProvider()
        });

        return { markType, series };
    };

    protected createOtherEventSeries = (props: { markType: TMarkType; index: number }) => {
        const { markType, index } = props;
        const wasmContext = this.wasmContext;

        const dataValues = (this.statsInfo.otherStatsByMarkType.get(markType) as StatsEventDataEntry[]) ?? [];
        const xValues = dataValues.flatMap(entry => [entry.start]);
        const yValues = xValues.map(() => this.yValueForOtherEventStats);

        const metadata = dataValues.flatMap(entry => {
            const isSelected = false;
            const metadataEntry = { isSelected, detail: entry.detail };
            return metadataEntry;
        });

        const dataSeries = new XyDataSeries(wasmContext, {
            dataSeriesName: `${markType}`,
            isSorted: true,
            containsNaN: false,
            xValues,
            yValues,
            metadata
        });

        const series = new XyScatterRenderableSeries(wasmContext, {
            id: `${markType}`,
            dataSeries,
            yAxisId: this.yAxis.id,
            xAxisId: this.xAxis.id,
            // drawNaNAs: ELineDrawMode.DiscontinuousLine,
            // dataLabels,
            pointMarker: new SquarePointMarker(wasmContext, {
                height: 20,
                width: 2,
                stroke: getSeriesColor(markType),
                fill: getSeriesColor(markType)
            }),
            opacity: 0.6,
            stroke: getSeriesColor(markType),
            strokeThickness: 20,
            onSelectedChanged
            // paletteProvider: new CustomPaletteProvider()
        });

        return { markType, series };
    };

    public getMarkTypePositionIndex(markType: TMarkType) {
        if (axisRenderingMarkTypes.includes(markType)) {
            return 2;
        }
        if (annotationRenderingMarkTypes.includes(markType)) {
            return 2;
        }
        if (seriesRenderingMarkTypes.includes(markType)) {
            return 2;
        }
        if (miscMarkTypes.includes(markType)) {
            return 2;
        }
        if (bulkMarkTypes.includes(markType)) {
            return 1;
        }
        if (summaryMarkTypes.includes(markType)) {
            return 0;
        }
        if (this.statsInfo.eventMarkTypes.includes(markType)) {
            return 3;
        }

        // throw new Error(`TODO handle ${markType}`);
        return 4;
    }

    public addLaneMarkers() {
        const { mainSurfaceIds, subChartsPerSurface } = this.statsInfo.statsContextInfo;

        const detachedEntriesMark = new CollapsibleAxisMarkerAnnotation({
            xCoordinateMode: ECoordinateMode.DataValue,
            yCoordinateMode: ECoordinateMode.DataValue,
            y1: this.yValueForOtherOperationStats,
            formattedValue: `Detached`
        });

        mainSurfaceIds.forEach((surfaceId, surfaceIndex) => {
            // add annotation for each PositionIndex

            const getAnnotationOffset = (surfaceId: TSurfaceId, surfaceIndex: number) => {
                const seriesIndex = 0;
                const yOffset = surfaceIndex * (this.performanceMarksCategoriesNumber + 1) + seriesIndex;
                return yOffset;
            };

            const createLaneMarkAnnotation = (surfaceId: TSurfaceId, surfaceIndex: number) => {
                const yOffset = getAnnotationOffset(surfaceId, surfaceIndex);
                const separatorMark = new HorizontalLineAnnotation({
                    xCoordinateMode: ECoordinateMode.DataValue,
                    yCoordinateMode: ECoordinateMode.DataValue,
                    y1: yOffset - 1,
                    labelPlacement: ELabelPlacement.Bottom,
                    showLabel: false,
                    labelValue: `Surface-${surfaceId}`,
                    stroke: "grey",
                    strokeThickness: 20
                });

                const laneTitleAnnotation = new NativeTextAnnotation({
                    xCoordinateMode: ECoordinateMode.Relative,
                    yCoordinateMode: ECoordinateMode.DataValue,
                    horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
                    verticalAnchorPoint: EVerticalAnchorPoint.Center,
                    x1: 0.5,
                    y1: yOffset - 1,
                    text: `Surface-${surfaceId}`
                });

                const topLevelMark = new CollapsibleAxisMarkerAnnotation({
                    xCoordinateMode: ECoordinateMode.DataValue,
                    yCoordinateMode: ECoordinateMode.DataValue,
                    y1: yOffset,
                    formattedValue: `General`
                });

                const bulkOperationsMark = new CollapsibleAxisMarkerAnnotation({
                    xCoordinateMode: ECoordinateMode.DataValue,
                    yCoordinateMode: ECoordinateMode.DataValue,
                    y1: yOffset + 1,
                    formattedValue: `Bulk Operations`
                });

                const detailedOperationsMark = new CollapsibleAxisMarkerAnnotation({
                    xCoordinateMode: ECoordinateMode.DataValue,
                    yCoordinateMode: ECoordinateMode.DataValue,
                    y1: yOffset + 2,
                    formattedValue: `Detailed Operations`
                });

                const eventsMark = new CollapsibleAxisMarkerAnnotation({
                    xCoordinateMode: ECoordinateMode.DataValue,
                    yCoordinateMode: ECoordinateMode.DataValue,
                    y1: yOffset + 3,
                    formattedValue: `Events`
                });

                this.sciChartSurface.annotations.add(
                    separatorMark,
                    laneTitleAnnotation,
                    topLevelMark,
                    bulkOperationsMark,
                    detailedOperationsMark,
                    eventsMark
                );
            };

            createLaneMarkAnnotation(surfaceId, surfaceIndex);

            // SubChart series
            const relatedSubChartIds = subChartsPerSurface.get(surfaceId);
            relatedSubChartIds.forEach((subSurfaceId, subSurfaceIndex) =>
                createLaneMarkAnnotation(subSurfaceId, surfaceIndex + subSurfaceIndex)
            );
        });

        this.sciChartSurface.annotations.add(detachedEntriesMark);
    }
}

// Custom function called when a series is selected or deselected
const onSelectedChanged = (sourceSeries: IRenderableSeries, isSelected: boolean) => {
    console.log(`Series ${sourceSeries.dataSeries.dataSeriesName} isSelected=${isSelected}`);

    // // When selected, set the stroke = white, or reset previous value
    // const targetSeriesStroke = isSelected ? appTheme.ForegroundColor : sourceSeries.pointMarker.fill;
    // sourceSeries.stroke = targetSeriesStroke;
    // sourceSeries.pointMarker.stroke = targetSeriesStroke;
};
