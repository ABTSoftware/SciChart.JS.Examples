import {
    BaseDataSeries,
    ECoordinateMode,
    EFillPaletteMode,
    EHorizontalAnchorPoint,
    ELabelPlacement,
    EStrokePaletteMode,
    EVerticalAnchorPoint,
    FastMountainRenderableSeries,
    GradientParams,
    HorizontalLineAnnotation,
    IFillPaletteProvider,
    IRenderableSeries,
    IStrokePaletteProvider,
    MouseWheelZoomModifier,
    NumberRange,
    NumericAxis,
    parseColorToUIntArgb,
    Point,
    SciChartSurface,
    TextAnnotation,
    VerticalLineAnnotation,
    XyDataSeries,
    XyFilterBase,
    XyyFilterBase,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import { ExampleDataProvider } from "../../../ExampleData/ExampleDataProvider";
import { appTheme } from "../../../theme";

// tslint:disable:no-empty
// tslint:disable:max-line-length

class ThresholdFilter extends XyFilterBase {
    private thresholdProperty = 1;

    constructor(originalSeries: BaseDataSeries, threshold: number, dataSeriesName: string) {
        super(originalSeries, { dataSeriesName });
        this.thresholdProperty = threshold;
        this.filterAll();
    }

    public get threshold() {
        return this.thresholdProperty;
    }

    public set threshold(value: number) {
        this.thresholdProperty = value;
        this.filterAll();
    }

    protected filterAll() {
        this.clear();
        this.filter(0, this.getOriginalCount());
    }

    protected filterOnAppend(count: number): void {
        // Overriding this so we do not have to reprocess the entire series on append
        this.filter(this.getOriginalCount() - count, count);
    }

    protected filter(start: number, count: number): void {
        const xValues: number[] = [];
        const yValues: number[] = [];
        for (let i = start; i < start + count; i++) {
            xValues.push(this.getOriginalXValues().get(i));
            const y = this.getOriginalYValues().get(i);
            if (this.threshold > 0 && y < this.threshold) {
                yValues.push(NaN);
            } else if (y < 0) {
                yValues.push(Math.max(y, this.threshold));
            } else {
                yValues.push(y);
            }
        }
        this.appendRange(xValues, yValues);
    }

    protected onClear() {
        this.clear();
    }
}

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create a paletteprovider to colour the series depending on a threshold value
    const thresholdPalette = new XThresholdPaletteProvider(8, appTheme.VividTeal);

    // Add a Column series with some values to the chart
    const { xValues, yValues } = ExampleDataProvider.getDampedSinewave(0, 10, 0, 0.001, 3000, 10);
    const dataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
    });
    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            stroke: appTheme.PaleSkyBlue,
            strokeThickness: 5,
            zeroLineY: 0.0,
            dataSeries,
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.VividSkyBlue, offset: 0 },
                { color: appTheme.VividSkyBlue + "77", offset: 1 },
            ]),
            paletteProvider: thresholdPalette,
        })
    );

    const thresholdFilter = new ThresholdFilter(dataSeries, 4.0, "TopFill");
    const topFill = new FastMountainRenderableSeries(wasmContext, {
        stroke: appTheme.PaleSkyBlue,
        strokeThickness: 5,
        zeroLineY: 4.0,
        dataSeries: thresholdFilter,
        fill: appTheme.MutedOrange,
        paletteProvider: thresholdPalette,
    });
    sciChartSurface.renderableSeries.add(topFill);

    // Add a label to tell user what to do
    const textAnnotation = new TextAnnotation({
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        xCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 4.2,
        fontSize: 22,
        text: "Drag the lines!",
        textColor: "White",
    });
    // Add a horizontal threshold at Y=5
    const horizontalLine = new HorizontalLineAnnotation({
        y1: 4.0,
        isEditable: true,
        showLabel: true,
        stroke: appTheme.VividOrange,
        strokeThickness: 3,
        axisLabelFill: appTheme.VividOrange,
        axisLabelStroke: appTheme.ForegroundColor,
        labelPlacement: ELabelPlacement.Axis,
        onDrag: (args) => {
            // When the horizontal line is dragged, update the
            // threshold palette and redraw the SciChartSurface
            topFill.zeroLineY = Math.max(0, horizontalLine.y1);
            thresholdFilter.threshold = horizontalLine.y1;
            textAnnotation.y1 = horizontalLine.y1 + 0.2;
            sciChartSurface.invalidateElement();
        },
    });
    sciChartSurface.annotations.add(horizontalLine);
    sciChartSurface.annotations.add(textAnnotation);

    // Add a vertical line
    const verticalLine = new VerticalLineAnnotation({
        x1: 8,
        strokeThickness: 3,
        isEditable: true,
        showLabel: true,
        stroke: appTheme.VividTeal,
        axisLabelFill: appTheme.VividTeal,
        axisLabelStroke: appTheme.ForegroundColor,
        labelPlacement: ELabelPlacement.Axis,
        onDrag: (args) => {
            // When the vertical line is dragged, update the
            // threshold palette and redraw the SciChartSurface
            thresholdPalette.xThresholdValue = verticalLine.x1;
            sciChartSurface.invalidateElement();
        },
    });
    sciChartSurface.annotations.add(verticalLine);

    // Add instructions
    sciChartSurface.annotations.add(
        new TextAnnotation({
            x1: 0,
            y1: 0,
            xAxisId: "history",
            xCoordinateMode: ECoordinateMode.Relative,
            yCoordinateMode: ECoordinateMode.Relative,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Left,
            verticalAnchorPoint: EVerticalAnchorPoint.Top,
            text: "SciChart.js supports editable, draggable annotations and dynamic color/fill rules. Drag a threshold line!",
            textColor: appTheme.ForegroundColor + "77",
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};

/**
 * A paletteprovider which colours a series if X value over a threshold, else use default colour
 */
export class XThresholdPaletteProvider implements IFillPaletteProvider {
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.GRADIENT;
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.GRADIENT;
    public xThresholdValue: number;
    private readonly xColor: number;

    constructor(xThresholdValue: number, xColor: string) {
        this.xThresholdValue = xThresholdValue;
        this.xColor = parseColorToUIntArgb(xColor);
    }

    onAttached(parentSeries: IRenderableSeries): void {}

    onDetached(): void {}

    overrideFillArgb(xValue: number, yValue: number, index: number, opacity?: number): number {
        // When the x-value of the series is greater than the x threshold
        // fill with the xColor
        if (xValue > this.xThresholdValue) {
            return this.xColor;
        }
        // Undefined means use default color
        return undefined;
    }
}
