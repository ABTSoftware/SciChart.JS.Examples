import {
    AUTO_COLOR,
    ChartModifierBase2D,
    DataLabelProvider,
    DataPointSelectionPaletteProvider,
    deleteSafe,
    EAutoRange,
    EAxisAlignment,
    EChart2DModifierType,
    ECoordinateMode,
    EHorizontalAnchorPoint,
    EVerticalAnchorPoint,
    EXyDirection,
    FastCandlestickRenderableSeries,
    FastLineRenderableSeries,
    hitTestHelpers,
    HitTestInfo,
    LineAnnotation,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    Point,
    SciChartSurface,
    SweepAnimation,
    TextAnnotation,
    translateFromCanvasToSeriesViewRect,
    XyDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { appTheme, RandomWalkGenerator } from "scichart-example-dependencies";
const EventXStep = 6;
// A custom modifier that allows selection and editing of candles.
class CandleDragModifier extends ChartModifierBase2D {
    type = EChart2DModifierType.Custom;
    series;
    dataSeries;
    annotation;
    selectedIndex = -1;
    constructor(series, options) {
        super(options);
        this.series = series;
        this.dataSeries = series.dataSeries;
    }
    onAttach() {
        super.onAttach();
        // Create an annotation where only the selection box will be visible
        this.annotation = new LineAnnotation({
            xAxisId: this.series.xAxisId,
            yAxisId: this.series.yAxisId,
            strokeThickness: 0,
            stroke: "transparent",
            selectionBoxStroke: "#88888888",
            isEditable: true,
            resizeDirections: EXyDirection.YDirection,
        });
        // Update the selected data point when the annotation is dragged
        this.annotation.dragDelta.subscribe((data) => {
            if (this.selectedIndex >= 0) {
                const x = this.dataSeries.getNativeXValues().get(this.selectedIndex);
                const newX = x + Math.floor((this.annotation.x1 - x + EventXStep / 2) / EventXStep) * EventXStep;
                // Do not allow close to be less than open as this breaks our custom hitTest
                this.dataSeries.updateXohlc(
                    this.selectedIndex,
                    newX,
                    this.annotation.y1,
                    Math.max(this.annotation.y1 + 5, this.annotation.y2),
                    this.annotation.y1,
                    Math.max(this.annotation.y1 + 5, this.annotation.y2),
                    this.dataSeries.getMetadataAt(this.selectedIndex)
                );
            }
        });
        // Manually set the selected status of the point using metadata.  This will drive the DataPointSelectionPaletteProvider
        this.annotation.selectedChanged.subscribe((data) => {
            this.dataSeries.getMetadataAt(this.selectedIndex).isSelected = data;
        });
        this.parentSurface.modifierAnnotations.add(this.annotation);
    }
    onDetach() {
        this.parentSurface.modifierAnnotations.remove(this.annotation);
        this.annotation = deleteSafe(this.annotation);
    }
    modifierMouseUp(args) {
        const point = args.mousePoint;
        const hitTestInfo = this.series.hitTestProvider.hitTest(point.x, point.y, 0);
        if (hitTestInfo.isHit) {
            if (this.selectedIndex >= 0 && this.selectedIndex !== hitTestInfo.dataSeriesIndex) {
                this.dataSeries.getMetadataAt(this.selectedIndex).isSelected = false;
            }
            // Place the annotation over the selected box
            this.selectedIndex = hitTestInfo.dataSeriesIndex;
            this.annotation.x1 = hitTestInfo.xValue;
            this.annotation.x2 = hitTestInfo.xValue;
            this.annotation.y1 = hitTestInfo.openValue;
            this.annotation.y2 = hitTestInfo.closeValue;
            // Make the annotation selected.  Both these lines are required.
            this.annotation.isSelected = true;
            this.dataSeries.getMetadataAt(this.selectedIndex).isSelected = true;
            this.parentSurface.adornerLayer.selectedAnnotation = this.annotation;
        }
    }
}
export const drawExample = async (rootElement) => {
    // Create a SciChartSurface
    const { wasmContext, sciChartSurface } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });
    const POINTS = 1000;
    // Create an XAxis and YAxis
    const xAxis = new NumericAxis(wasmContext, { visibleRange: new NumberRange(0, POINTS) });
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        growBy: new NumberRange(0.05, 0.05),
    });
    sciChartSurface.yAxes.add(yAxis);
    // Create arrays of x, y values (just arrays of numbers)
    const { xValues, yValues } = new RandomWalkGenerator().getRandomWalkSeries(POINTS);
    // Create a line Series and add to the chart
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: new XyDataSeries(wasmContext, { xValues, yValues }),
            stroke: AUTO_COLOR,
            strokeThickness: 3,
            animation: new SweepAnimation({ duration: 500, fadeEffect: true }),
        })
    );
    // Hidden axes for event series
    const eventXAxis = new NumericAxis(wasmContext, {
        id: "EventX",
        visibleRange: new NumberRange(0, 100),
        autoRange: EAutoRange.Never,
        axisAlignment: EAxisAlignment.Left,
        isVisible: false,
        zoomExtentsToInitialRange: true,
        flippedCoordinates: true,
    });
    sciChartSurface.xAxes.add(eventXAxis);
    const eventYAxis = new NumericAxis(wasmContext, {
        id: "EventY",
        axisAlignment: EAxisAlignment.Bottom,
        isVisible: false,
        flippedCoordinates: true,
    });
    // Sync the event y axis to the main x axis
    xAxis.visibleRangeChanged.subscribe((data) => (eventYAxis.visibleRange = data.visibleRange));
    sciChartSurface.yAxes.add(eventYAxis);
    const eventDataSeries = new OhlcDataSeries(wasmContext);
    // Create event data.  Prevent overlap of events
    const rows = new Map();
    const EVENTCOUNT = 30;
    let start = 0;
    for (let i = 0; i < EVENTCOUNT; i++) {
        start = start + Math.random() * ((2 * POINTS) / EVENTCOUNT);
        const end = start + 1 + Math.random() * ((2 * POINTS) / EVENTCOUNT);
        let row = 80;
        if (i === 0) {
            rows.set(row, end);
        } else {
            let last = rows.get(row);
            while (last > start) {
                row -= EventXStep;
                last = rows.get(row) ?? 0;
            }
            rows.set(row, end);
        }
        eventDataSeries.append(row, start, end, start, end, { isSelected: false });
    }
    // FastCandlestickRenderableSeries does not have a DataLabelProvider by default
    const dataLabelProvider = new DataLabelProvider({ style: { fontFamily: "Arial", fontSize: 14 }, color: "white" });
    dataLabelProvider.getPosition = (state, textBounds) => {
        const xVal = state.renderPassData.pointSeries.openValues.get(state.index);
        const xCoord = state.renderPassData.yCoordinateCalculator.getCoordinate(xVal);
        const yCoord = state.yCoord() + textBounds.m_fHeight / 2;
        return new Point(xCoord, yCoord);
    };
    dataLabelProvider.getText = (state) => {
        const open = state.renderPassData.pointSeries.openValues.get(state.index);
        const close = state.renderPassData.pointSeries.closeValues.get(state.index);
        return (close - open).toFixed(1);
    };
    // Create the event series
    const eventSeries = new FastCandlestickRenderableSeries(wasmContext, {
        dataSeries: eventDataSeries,
        dataPointWidth: 30,
        xAxisId: "EventX",
        yAxisId: "EventY",
        dataLabelProvider,
        paletteProvider: new DataPointSelectionPaletteProvider({ fill: "ff0000cc" }),
    });
    // use fixed pixel width
    eventSeries.getDataPointWidth = (coordCalc, widthFraction) => widthFraction;
    // custom hitTest that works with multiple candles on the same x value
    eventSeries.hitTestProvider.hitTest = (x, y, hitTestRadius) => {
        const hitTestPoint = translateFromCanvasToSeriesViewRect(new Point(x, y), sciChartSurface.seriesViewRect);
        if (!hitTestPoint) {
            return HitTestInfo.empty();
        }
        let nearestIndex = -1;
        const halfWidth = eventSeries.dataPointWidth / 2; // Only works here because we are using fixed width
        const xHitCoord = hitTestPoint.y; // Because vertical chart
        const yHitCoord = hitTestPoint.x;
        const xValues = eventDataSeries.getNativeXValues();
        const openValues = eventDataSeries.getNativeOpenValues();
        const closeValues = eventDataSeries.getNativeCloseValues();
        const xCoordinateCalculator = eventXAxis.getCurrentCoordinateCalculator();
        const yCoordinateCalculator = eventYAxis.getCurrentCoordinateCalculator();
        for (let i = 0; i < eventDataSeries.count(); i++) {
            const xCoord = xCoordinateCalculator.getCoordinate(xValues.get(i));
            const dx = Math.abs(xCoord - xHitCoord);
            // Half data point width
            if (dx <= halfWidth) {
                const openCoord = yCoordinateCalculator.getCoordinate(openValues.get(i));
                const closeCoord = yCoordinateCalculator.getCoordinate(closeValues.get(i));
                if (openCoord <= yHitCoord && yHitCoord <= closeCoord) {
                    nearestIndex = i;
                }
            }
        }
        if (nearestIndex > -1) {
            const hitTestInfo = hitTestHelpers.createHitTestInfo(
                eventSeries,
                xCoordinateCalculator,
                yCoordinateCalculator,
                true,
                eventDataSeries,
                xValues,
                closeValues,
                xHitCoord,
                yHitCoord,
                nearestIndex,
                hitTestRadius
            );
            hitTestInfo.isHit = true;
            hitTestInfo.openValue = openValues.get(nearestIndex);
            hitTestInfo.highValue = eventDataSeries.getNativeHighValues().get(nearestIndex);
            hitTestInfo.lowValue = eventDataSeries.getNativeLowValues().get(nearestIndex);
            hitTestInfo.closeValue = closeValues.get(nearestIndex);
            return hitTestInfo;
        } else {
            return HitTestInfo.empty();
        }
    };
    sciChartSurface.renderableSeries.add(eventSeries);
    // Add modifiers
    sciChartSurface.chartModifiers.add(
        // Use manual zoomExtents behaviour to prevent it zooming the event axes
        new ZoomExtentsModifier({
            onZoomExtents: (sciChartSurface) => {
                xAxis.visibleRange = xAxis.getMaximumRange();
                yAxis.visibleRange = yAxis.getMaximumRange();
                // false here prevents default behaviour
                return false;
            },
        }),
        new MouseWheelZoomModifier({ excludedYAxisIds: ["EventY"], excludedXAxisIds: ["EventX"] }),
        new ZoomPanModifier({ excludedXAxisIds: ["EventX"] }),
        new CandleDragModifier(eventSeries)
    );
    // Add instructions
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 0.01,
            y1: 0.03,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            text: "The boxes are rendered with a fast candlestick series, but can be selected and dragged like an annotation.",
            textColor: appTheme.ForegroundColor + "77",
        })
    );
    xAxis.visibleRange = xAxis.getMaximumRange();
    return { wasmContext, sciChartSurface };
};
