import {
    AUTO_COLOR,
    BoxAnnotation,
    CustomChartModifier2D,
    deleteSafe,
    EAxisAlignment,
    EColumnMode,
    EColumnYMode,
    ECoordinateMode,
    EDraggingGripPoint,
    EHorizontalAnchorPoint,
    ENumericFormat,
    EValueName,
    EVerticalAnchorPoint,
    EXyDirection,
    FastLineRenderableSeries,
    FastRectangleRenderableSeries,
    formatNumber,
    IChartModifierBaseOptions,
    ModifierMouseArgs,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    RectangleDataLabelState,
    RectangleSeriesDataLabelProvider,
    SciChartSurface,
    SweepAnimation,
    TextAnnotation,
    XyDataSeries,
    XyxDataSeries,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { RandomWalkGenerator } from "../../../ExampleData/RandomWalkGenerator";
import { appTheme } from "../../../theme";

const defaultHeight = 1;
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
        this.annotation = new BoxAnnotation({
            xAxisId: this.series.xAxisId,
            yAxisId: this.series.yAxisId,
            strokeThickness: 0,
            stroke: "transparent",
            selectionBoxStroke: "#88888844",
            opacity: 0,
            isEditable: true,
            resizeDirections: EXyDirection.XDirection,
            dragPoints: [
                EDraggingGripPoint.Body,
                EDraggingGripPoint.x1y1,
                EDraggingGripPoint.x2y1,
                // EDraggingGripPoint.x1y2,
                // EDraggingGripPoint.x2y2,
            ],
        });

        // Update the selected data point when the annotation is dragged
        this.annotation.dragDelta.subscribe((data) => {
            if (this.selectedIndex >= 0) {
                const newX = this.annotation.x1;
                const newY = Math.floor(this.annotation.y1 + defaultHeight);
                const newx1 = this.annotation.x2;

                // Do not allow close to be less than open as this breaks our custom hitTest
                this.dataSeries.updateXyz(
                    this.selectedIndex,
                    newX,
                    newY,
                    newx1,
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
        const hitTestInfo = this.series.hitTestProvider.hitTest(point.x, point.y, 5);

        if (hitTestInfo.isHit) {
            if (this.selectedIndex >= 0 && this.selectedIndex !== hitTestInfo.dataSeriesIndex) {
                this.dataSeries.getMetadataAt(this.selectedIndex).isSelected = false;
            }

            const x1Values = this.dataSeries.getYValuesByName(EValueName.X1);

            const x1Value = x1Values.get(hitTestInfo.dataSeriesIndex);

            // Place the annotation over the selected box
            this.selectedIndex = hitTestInfo.dataSeriesIndex;
            this.annotation.x1 = hitTestInfo.xValue;
            this.annotation.x2 = x1Value;
            this.annotation.y1 = Math.round(hitTestInfo.yValue) - defaultHeight / 2;
            this.annotation.y2 = Math.round(hitTestInfo.yValue) + defaultHeight / 2;
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
        growBy: new NumberRange(0.05, 0.1),
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
        let row = 16;
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

        eventDataSeries.append(start, row, end, { isSelected: false });
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
        stroke: "ff0000cc",
        strokeThickness: 1,
        fill: "ff00004D",
        // opacity: 0.8,
        dataLabelProvider: new MyRectangleSeriesDataLabelProvider({
            style: {
                fontSize: 12,
            },
            color: "white",
        }),
    });

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
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 0.01,
            y1: 0.03,
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            text: "The boxes are rendered with a fast rectangle series and can be selected and dragged like an annotation.",
            textColor: appTheme.ForegroundColor + "77",
        })
    );

    xAxis.visibleRange = xAxis.getMaximumRange();

    return { wasmContext, sciChartSurface };
};
