import {
    AUTO_COLOR,
    BaseOhlcRenderableSeries,
    BoxAnnotation,
    CustomChartModifier2D,
    DataLabelProvider,
    DataPointSelectionPaletteProvider,
    deleteSafe,
    EAutoRange,
    EAxisAlignment,
    EColumnMode,
    EColumnYMode,
    ECoordinateMode,
    EDataPointWidthMode,
    EHorizontalAnchorPoint,
    ENumericFormat,
    EResamplingMode,
    EVerticalAnchorPoint,
    EXyDirection,
    FastCandlestickRenderableSeries,
    FastLineRenderableSeries,
    FastRectangleRenderableSeries,
    formatNumber,
    hitTestHelpers,
    HitTestInfo,
    IChartModifierBaseOptions,
    IOhlcPointSeries,
    LineAnnotation,
    ModifierMouseArgs,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    OhlcDataSeries,
    Point,
    RectangleDataLabelState,
    RectangleSeriesDataLabelProvider,
    SciChartSurface,
    SweepAnimation,
    TextAnnotation,
    translateFromCanvasToSeriesViewRect,
    XyDataSeries,
    XyxDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { appTheme } from "../../../theme";

const defaultHeight = 6;
class RectangleDragModifier extends CustomChartModifier2D {
    private series: FastRectangleRenderableSeries;
    private dataSeries: XyxDataSeries;
    private annotation: BoxAnnotation;
    private selectedIndex: number = -1;

    public constructor(series: FastRectangleRenderableSeries, options?: IChartModifierBaseOptions) {
        super(options);
        this.series = series;
        this.dataSeries = series.dataSeries as XyxDataSeries;
    }

    public override onAttach(): void {
        super.onAttach();
        // Create an annotation where only the selection box will be visible

        console.log(this.series);
        this.annotation = new BoxAnnotation({
            xAxisId: this.series.xAxisId,
            yAxisId: this.series.yAxisId,
            strokeThickness: 0,
            stroke: "transparent",
            selectionBoxStroke: "#88888888",
            isEditable: true,
            resizeDirections: EXyDirection.XDirection,
        });

        // Update the selected data point when the annotation is dragged
        this.annotation.dragDelta.subscribe((data) => {
            if (this.selectedIndex >= 0) {
                // const y = this.dataSeries.getNativeXValues().get(this.selectedIndex);
                // const newY =
                //     y + Math.floor((this.annotation.y1 - y + defaultHeight / 2) / defaultHeight) * defaultHeight;
                const newX = this.annotation.x1;
                const tempY = this.annotation.y1;
                // Do not allow close to be less than open as this breaks our custom hitTest
                this.dataSeries.update(
                    this.selectedIndex,
                    tempY, //y
                    newX, //x1

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

    public override onDetach(): void {
        this.parentSurface.modifierAnnotations.remove(this.annotation);
        this.annotation = deleteSafe(this.annotation);
    }

    public override modifierMouseUp(args: ModifierMouseArgs): void {
        const point = args.mousePoint;
        const hitTestInfo = this.series.hitTestProvider.hitTest(point.x, point.y, 0);
        if (hitTestInfo.isHit) {
            console.log("hit", hitTestInfo);

            if (this.selectedIndex >= 0 && this.selectedIndex !== hitTestInfo.dataSeriesIndex) {
                this.dataSeries.getMetadataAt(this.selectedIndex).isSelected = false;
            }
            // Place the annotation over the selected box
            this.selectedIndex = hitTestInfo.dataSeriesIndex;
            this.annotation.x1 = hitTestInfo.xValue;
            this.annotation.x2 = hitTestInfo.xValue;
            this.annotation.y1 = hitTestInfo.yValue;
            this.annotation.y2 = hitTestInfo.yValue;
            // Make the annotation selected.  Both these lines are required.
            this.annotation.isSelected = true;
            this.dataSeries.getMetadataAt(this.selectedIndex).isSelected = true;
            this.parentSurface.adornerLayer.selectedAnnotation = this.annotation;
        }
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
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

    const eventDataSeries = new XyxDataSeries(wasmContext);

    // Create event data.  Prevent overlap of events
    const rows = new Map<number, number>();
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
                row -= defaultHeight;
                last = rows.get(row) ?? 0;
            }
            rows.set(row, end);
        }
        // eventDataSeries.append(  start,row, end,{ isSelected: false });

        eventDataSeries.append(start, row, end, { isSelected: false });

        // console.log(start, row, end, { isSelected: false });
    }

    class MyRectangleSeriesDataLabelProvider extends RectangleSeriesDataLabelProvider {
        public getText(state: RectangleDataLabelState): string {
            const usefinal = !this.updateTextInAnimation && state.parentSeries.isRunningAnimation;
            const yval = usefinal ? state.yValAfterAnimation() : state.yVal();
            if (isNaN(yval)) {
                return undefined;
            } else {
                const diff = Math.abs(state.x1Val() - state.xVal());
                if (this.engineeringPrefix) {
                    return formatNumber(diff, this.numericFormat, this.precision, this.engineeringPrefixProperty);
                } else {
                    return formatNumber(diff, this.numericFormat ?? ENumericFormat.Decimal, this.precision);
                }
            }
        }
    }

    const eventSeries = new FastRectangleRenderableSeries(wasmContext, {
        dataSeries: eventDataSeries,
        columnXMode: EColumnMode.StartEnd,
        columnYMode: EColumnYMode.CenterHeight,
        defaultY1: defaultHeight,
        // dataPointWidthMode: EDataPointWidthMode.Absolute,
        // dataPointWidth: 30,
        stroke: "ff0000cc",
        strokeThickness: 1,
        fill: "ff0000cc",
        opacity: 0.8,
        // xAxisId: "EventX",
        // yAxisId: "EventY",
        // defaultY1,
        // resamplingMode: EResamplingMode.Auto,
        // topCornerRadius: 20,
        // bottomCornerRadius: 10,
        // customTextureOptions: new BrickCustomTextureOptions({ stroke: "black" }),

        // dataPointWidth()
        dataLabelProvider: new MyRectangleSeriesDataLabelProvider({
            style: {
                fontSize: 12,
            },
            color: "white",
        }),
        // dataLabelProvider,
    });

    // custom hitTest that works with multiple candles on the same x value
    // eventSeries.hitTestProvider.hitTest = (x, y, hitTestRadius) => {
    //     const hitTestPoint = translateFromCanvasToSeriesViewRect(new Point(x, y), sciChartSurface.seriesViewRect);
    //     if (!hitTestPoint) {
    //         return HitTestInfo.empty();
    //     }
    //     let nearestIndex = -1;
    //     const halfHeight = eventSeries.defaultY1 / 2; // Only works here because we are using fixed width

    //     const xHitCoord = hitTestPoint.x;
    //     const yHitCoord = hitTestPoint.y;

    //     const xValues = eventDataSeries.getNativeXValues();
    //     const yValues = eventDataSeries.getNativeYValues();
    //     const x1Values = eventDataSeries.getNativeXValues(); // how to get x1Values here ??

    //     console.log({xValues})

    //     // const openValues = eventDataSeries.getNativeXValues();
    //     // const closeValues = eventDataSeries.getNativeXValues();

    //     const xCoordinateCalculator = xAxis.getCurrentCoordinateCalculator();
    //     const yCoordinateCalculator = yAxis.getCurrentCoordinateCalculator();

    //     for (let i = 0; i < eventDataSeries.count(); i++) {
    //         const yCoord = yCoordinateCalculator.getCoordinate(yValues.get(i));
    //         const dx = Math.abs(yCoord - yHitCoord);
    //         // Half data point width
    //         if (dx <= halfHeight) {
    //             const openCoord = yCoordinateCalculator.getCoordinate(xValues.get(i));
    //             const closeCoord = yCoordinateCalculator.getCoordinate(x1Values.get(i));
    //             if (openCoord <= yHitCoord && yHitCoord <= closeCoord) {
    //                 nearestIndex = i;
    //             }
    //         }
    //     }
    //     if (nearestIndex > -1) {
    //         const hitTestInfo = hitTestHelpers.createHitTestInfo(
    //             eventSeries,
    //             xCoordinateCalculator,
    //             yCoordinateCalculator,
    //             true,
    //             eventDataSeries,
    //             xValues,
    //             x1Values,
    //             xHitCoord,
    //             yHitCoord,
    //             nearestIndex,
    //             hitTestRadius
    //         );
    //         hitTestInfo.isHit = true;

    //         hitTestInfo.xValue = xValues.get(nearestIndex);
    //         hitTestInfo.yValue = yValues.get(nearestIndex);


    //         // hitTestInfo.highValue = eventDataSeries.getNativeXValues().get(nearestIndex);
    //         // hitTestInfo.lowValue = eventDataSeries.getNativeXValues().get(nearestIndex);
    //         return hitTestInfo;
    //     } else {
    //         return HitTestInfo.empty();
    //     }
    // };

    sciChartSurface.renderableSeries.add(eventSeries);

    // Add modifiers
    sciChartSurface.chartModifiers.add(
        // Use manual zoomExtents behaviour to prevent it zooming the event axes
        new ZoomExtentsModifier({
            onZoomExtents: (sciChartSurface: SciChartSurface) => {
                xAxis.visibleRange = xAxis.getMaximumRange();
                yAxis.visibleRange = yAxis.getMaximumRange();
                // false here prevents default behaviour
                return false;
            },
        }),
        new MouseWheelZoomModifier({ excludedYAxisIds: ["EventY"], excludedXAxisIds: ["EventX"] }),
        new ZoomPanModifier({ excludedXAxisIds: ["EventX"] }),
        new RectangleDragModifier(eventSeries)
    );

    // Add instructions
    // sciChartSurface.annotations.add(
    //     new TextAnnotation({
    //         x1: 0.01,
    //         y1: 0.03,
    //         xCoordinateMode: ECoordinateMode.Relative,
    //         yCoordinateMode: ECoordinateMode.Relative,
    //         horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
    //         verticalAnchorPoint: EVerticalAnchorPoint.Top,
    //         text: "The boxes are rendered with a fast candlestick series, but can be selected and dragged like an annotation.",
    //         textColor: appTheme.ForegroundColor + "77",
    //     })
    // );

    xAxis.visibleRange = xAxis.getMaximumRange();

    return { wasmContext, sciChartSurface };
};
