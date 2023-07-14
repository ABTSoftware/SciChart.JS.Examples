import * as React from "react";
import {
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
    ZoomExtentsModifier,
    ZoomPanModifier
} from "scichart";
import { appTheme, ExampleDataProvider } from "scichart-example-dependencies";
import classes from "../../../styles/Examples.module.scss";

const divElementId = "chart";

// tslint:disable:no-empty
// tslint:disable:max-line-length

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: appTheme.SciChartJsTheme
    });

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));

    // Create a paletteprovider to colour the series depending on a threshold value
    const thresholdPalette = new ThresholdPaletteProvider(4, appTheme.MutedOrange, 8, appTheme.VividTeal);

    // Add a Column series with some values to the chart
    const { xValues, yValues } = ExampleDataProvider.getDampedSinewave(0, 10, 0, 0.001, 3000, 10);

    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            stroke: appTheme.PaleSkyBlue,
            strokeThickness: 5,
            zeroLineY: 0.0,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues
            }),
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: appTheme.VividSkyBlue, offset: 0 },
                { color: appTheme.VividSkyBlue + "77", offset: 1 }
            ]),
            paletteProvider: thresholdPalette
        })
    );

    // Add a label to tell user what to do
    const textAnnotation = new TextAnnotation({
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        xCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 4.2,
        fontSize: 22,
        text: "Drag the lines!",
        textColor: "White"
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
        onDrag: args => {
            // When the horizontal line is dragged, update the
            // threshold palette and redraw the SciChartSurface
            thresholdPalette.yThresholdValue = horizontalLine.y1;
            textAnnotation.y1 = horizontalLine.y1 + 0.2;
            sciChartSurface.invalidateElement();
        }
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
        onDrag: args => {
            // When the vertical line is dragged, update the
            // threshold palette and redraw the SciChartSurface
            thresholdPalette.xThresholdValue = verticalLine.x1;
            sciChartSurface.invalidateElement();
        }
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
            text:
                "SciChart.js supports editable, draggable annotations and dynamic color/fill rules. Drag a threshold line!",
            textColor: appTheme.ForegroundColor + "77"
        })
    );

    // Optional: Add some interactivity modifiers
    sciChartSurface.chartModifiers.add(new ZoomPanModifier());
    sciChartSurface.chartModifiers.add(new ZoomExtentsModifier());
    sciChartSurface.chartModifiers.add(new MouseWheelZoomModifier());

    return { sciChartSurface, wasmContext };
};

/**
 * A paletteprovider which colours a series if X or Y-value over a threshold, else use default colour
 */
export class ThresholdPaletteProvider implements IFillPaletteProvider, IStrokePaletteProvider {
    public readonly fillPaletteMode: EFillPaletteMode = EFillPaletteMode.GRADIENT;
    public readonly strokePaletteMode: EStrokePaletteMode = EStrokePaletteMode.GRADIENT;
    public yThresholdValue: number;
    public xThresholdValue: number;
    private readonly yColor: number;
    private readonly xColor: number;

    constructor(yThresholdValue: number, yColor: string, xThresholdValue: number, xColor: string) {
        this.yThresholdValue = yThresholdValue;
        this.yColor = parseColorToUIntArgb(yColor);
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
        // When the y-value of the series is greater than the y-threshold,
        // fill with the y-color
        if (yValue > this.yThresholdValue) {
            return this.yColor;
        }
        // Undefined means use default color
        return undefined;
    }

    overrideStrokeArgb(xValue: number, yValue: number, index: number, opacity?: number): number {
        return yValue > this.yThresholdValue ? this.yColor : undefined;
    }
}
// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export default function ChartComponent() {
    const sciChartSurfaceRef = React.useRef<SciChartSurface>();

    React.useEffect(() => {
        const chartInitializationPromise = drawExample().then(({ sciChartSurface }) => {
            sciChartSurfaceRef.current = sciChartSurface;
        });

        return () => {
            // check if chart is already initialized
            if (sciChartSurfaceRef.current) {
                sciChartSurfaceRef.current.delete();
                return;
            }

            // else postpone deletion
            chartInitializationPromise.then(() => {
                sciChartSurfaceRef.current.delete();
            });
        };
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
