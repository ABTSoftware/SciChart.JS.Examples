export const code = `import * as React from "react";
import {SciChartSurface} from "scichart";
import {NumericAxis} from "scichart/Charting/Visuals/Axis/NumericAxis";
import {ZoomPanModifier} from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import {ZoomExtentsModifier} from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import {MouseWheelZoomModifier} from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import {ExampleDataProvider} from "../../../ExampleData/ExampleDataProvider";
import {NumberRange} from "scichart/Core/NumberRange";
import classes from "../../../../Examples/Examples.module.scss";
import {XyDataSeries} from "scichart/Charting/Model/XyDataSeries";
import {HorizontalLineAnnotation} from "scichart/Charting/Visuals/Annotations/HorizontalLineAnnotation";
import {ELabelPlacement} from "scichart/types/LabelPlacement";
import {
    EFillPaletteMode,
    EStrokePaletteMode,
    IFillPaletteProvider,
    IStrokePaletteProvider
} from "scichart/Charting/Model/IPaletteProvider";
import {IRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import {parseColorToUIntArgb} from "scichart/utils/parseColor";
import {TextAnnotation} from "scichart/Charting/Visuals/Annotations/TextAnnotation";
import {EVerticalAnchorPoint} from "scichart/types/AnchorPoint";
import {ECoordinateMode} from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import {FastMountainRenderableSeries} from "scichart/Charting/Visuals/RenderableSeries/FastMountainRenderableSeries";
import {GradientParams} from "scichart/Core/GradientParams";
import {Point} from "scichart/Core/Point";
import {VerticalLineAnnotation} from "scichart/Charting/Visuals/Annotations/VerticalLineAnnotation";
import {BoxAnnotation} from "scichart/Charting/Visuals/Annotations/BoxAnnotation";

const divElementId = "chart";

// tslint:disable:no-empty
// tslint:disable:max-line-length

const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Add an XAxis, YAxis
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) })
    );

    // Create a paletteprovider to colour the series depending on a threshold value
    const thresholdPalette = new ThresholdPaletteProvider(
        4, "#FF333333",
        8, "#33FF3333");

    // Add a Column series with some values to the chart
    const { xValues, yValues } = ExampleDataProvider.getDampedSinewave(0, 10, 0, 0.001, 3000, 10);

    sciChartSurface.renderableSeries.add(
        new FastMountainRenderableSeries(wasmContext, {
            stroke: "#4682b4",
            strokeThickness: 5,
            zeroLineY: 0.0,
            dataSeries: new XyDataSeries(wasmContext, {
                xValues,
                yValues
            }),
            fillLinearGradient: new GradientParams(new Point(0, 0), new Point(0, 1), [
                { color: "rgba(70,130,180,1)", offset: 0 },
                { color: "rgba(70,130,180,0.2)", offset: 1 }
            ]),
            paletteProvider: thresholdPalette,
        })
    );

    // Add a label to tell user what to do
    const textAnnotation = new TextAnnotation({
        verticalAnchorPoint: EVerticalAnchorPoint.Bottom,
        xCoordinateMode: ECoordinateMode.Relative,
        x1: 0.5,
        y1: 4.2,
        fontSize: 16,
        text: "Drag the lines!",
        textColor: "White",
    });
    // Add a horizontal threshold at Y=5
    const horizontalLine = new HorizontalLineAnnotation( {
        y1: 4.0,
        isEditable: true,
        showLabel: true,
        stroke: "#FF3333",
        axisLabelFill: "#FF3333",
        labelPlacement: ELabelPlacement.Axis,
        onDrag: (args) => {
            // When the horizontal line is dragged, update the
            // threshold palette and redraw the SciChartSurface
            thresholdPalette.yThresholdValue = horizontalLine.y1;
            textAnnotation.y1 = horizontalLine.y1 + 0.2;
            sciChartSurface.invalidateElement();
        },
    });
    sciChartSurface.annotations.add(horizontalLine);
    sciChartSurface.annotations.add(textAnnotation);

    // Add a vertical line
    const verticalLine = new VerticalLineAnnotation({
        x1: 8,
        strokeThickness: 2,
        isEditable: true,
        showLabel: true,
        stroke: "DarkGreen",
        axisLabelFill: "DarkGreen",
        axisLabelStroke: "White",
        labelPlacement: ELabelPlacement.Axis,
        onDrag: (args) => {
          thresholdPalette.xThresholdValue = verticalLine.x1;
          sciChartSurface.invalidateElement();
        },
    });
    sciChartSurface.annotations.add(verticalLine);

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

    constructor(yThresholdValue: number, yColor: string,
                xThresholdValue: number, xColor: string) {
        this.yThresholdValue = yThresholdValue;
        this.yColor = parseColorToUIntArgb(yColor);
        this.xThresholdValue = xThresholdValue;
        this.xColor = parseColorToUIntArgb(xColor);
    }

    onAttached(parentSeries: IRenderableSeries): void {
    }

    onDetached(): void {
    }

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

export default function DragHorizontalThreshold() {
    const [sciChartSurface, setSciChartSurface] = React.useState<SciChartSurface>();

    React.useEffect(() => {
        (async () => {
            const res = await drawExample();
            setSciChartSurface(res.sciChartSurface);
        })();
        // Delete sciChartSurface on unmount component to prevent memory leak
        return () => sciChartSurface?.delete();
    }, []);

    return <div id={divElementId} className={classes.ChartWrapper} />;
}
`;