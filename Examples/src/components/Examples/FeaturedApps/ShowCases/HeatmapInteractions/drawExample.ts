import {appTheme} from "../../../theme";
import {AddIOModifier} from "./AddIOModifier";
import {DiscreteAxisMarker} from "./DiscreteAxisMarker";
import {PointDragModifier} from "./PointDragModifier";

import {
    AnnotationClickEventArgs,
    AxisMarkerAnnotation,
    BasePaletteProvider,
    BoxAnnotation,
    CustomAnnotation,
    ECoordinateMode,
    EDataChangeType,
    EHorizontalAnchorPoint,
    EStrokePaletteMode,
    ESeriesType,
    EAxisAlignment,
    ELabelPlacement,
    EExecuteOn,
    EDraggingGripPoint,
    EWrapTo,
    FastLineRenderableSeries,
    HeatmapColorMap,
    HorizontalLineAnnotation,
    IStrokePaletteProvider,
    IRenderableSeries,
    MouseWheelZoomModifier,
    NativeTextAnnotation,
    NumericAxis,
    NumberRange,
    PaletteFactory,
    RolloverModifier,
    RubberBandXyZoomModifier,
    SciChartSurface,
    SplineLineRenderableSeries,
    TGradientStop,
    TSciChart,
    UniformHeatmapDataSeries,
    UniformHeatmapRenderableSeries,
    VerticalLineAnnotation,
    XyDataSeries,
    XyScatterRenderableSeries,
    YAxisDragModifier,
    ZoomExtentsModifier,
    ZoomPanModifier,
    EVerticalAnchorPoint,
    GenericAnimation,
    formatNumber,
    EllipsePointMarker
} from "scichart";

export const divElementId = "chart";
export const divCrossSection = "crossSection";
export const divInput = "input";
export const divHistory = "history";

const gradientStops = [
    {offset: 0, color: "#942B96"},
    {offset: 0.3, color: "#3C2D91"},
    {offset: 0.45, color: "#47bde6"},
    {offset: 0.5, color: appTheme.DarkIndigo},
    {offset: 0.55, color: "#68bcae"},
    {offset: 0.7, color: "#e97064"},
    {offset: 1.0, color: "#ae418d"}
];

const csGradientStops = [
    {offset: 0, color: "#942B96"},
    {offset: 0.3, color: "#3C2D91"},
    {offset: 0.45, color: "#47bde6"},
    {offset: 0.5, color: "#45AEC3"},
    {offset: 0.55, color: "#68bcae"},
    {offset: 0.7, color: "#e97064"},
    {offset: 1.0, color: "#ae418d"}
];

let width = 700;
let height = 500;

export const drawExample = async () => {
    const {
        sciChartSurface,
        wasmContext
    } = await SciChartSurface.create(divElementId, {theme: appTheme.SciChartJsTheme});
    const xAxis = new NumericAxis(wasmContext, {isVisible: false});
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        isVisible: true,
        drawLabels: false,
        drawMajorGridLines: false,
        drawMajorBands: false,
        drawMajorTickLines: false,
        drawMinorTickLines: false,
        drawMinorGridLines: false
    });
    sciChartSurface.yAxes.add(yAxis);

    width = Math.floor(sciChartSurface.domCanvas2D.width);
    height = Math.floor(sciChartSurface.domCanvas2D.height);
    let initialZValues = Array.from(Array(height), _ => Array(width).fill(0));
    let velocities = Array.from(Array(height), _ => Array(width).fill(0));

    const heatmapDataSeries = new UniformHeatmapDataSeries(wasmContext, {
        xStart: 1,
        xStep: 1,
        yStart: 1,
        yStep: 1,
        zValues: initialZValues
    });

    const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
        opacity: 0.8,
        dataSeries: heatmapDataSeries,
        useLinearTextureFiltering: true,
        colorMap: new HeatmapColorMap({minimum: -80, maximum: 80, gradientStops})
    });

    const crossSectionSurface = await createCrossSectionChart();
    const lineDataSeries = crossSectionSurface.renderableSeries.getById("h").dataSeries as XyDataSeries;
    const vlineDataSeries = crossSectionSurface.renderableSeries.getById("v").dataSeries as XyDataSeries;
    const lineXValues = Array.from(Array(width)).map((_, i) => i);
    const vlineXValues = Array.from(Array(height)).map((_, i) => i);

    const hline = new HorizontalLineAnnotation({
        stroke: "#E97064",
        strokeThickness: 3,
        y1: height / 3,
        isEditable: true,
        labelPlacement: ELabelPlacement.TopLeft,
        axisLabelStroke: "#E97064",
        showLabel: true,
        dragOnLabel: false,
        onDrag: () => {
            lineDataSeries.clear();
            const yVals = initialZValues[Math.floor(hline.y1)];
            if (yVals) {
                lineDataSeries.appendRange(lineXValues, yVals);
            }
        }
    });

    const vline = new VerticalLineAnnotation({
        stroke: "#E97064",
        strokeThickness: 3,
        labelPlacement: ELabelPlacement.BottomLeft,
        axisLabelStroke: "#E97064",
        showLabel: true,
        x1: width / 2,
        isEditable: true,
        onDrag: () => {
            vlineDataSeries.clear();
            const yVals = initialZValues.map(r => r[Math.floor(vline.x1)]);
            if (yVals) {
                vlineDataSeries.appendRange(vlineXValues, yVals);
            }
        }
    });

    const inputs: BoxAnnotation[] = [];
    const outputs: CustomAnnotation[] = [];

    const {sciChartSurface: inputSurface, addInputSeries} = await inputChart();
    const inputColors = ["#68bcae", "#e97064", "#47bde6", "#ae418d", "#274b92", "#634e96"];
    const outputColors = ["#0bf4cd", "#f4840b", "#0bdef4", "#f6086c", "#112cce", "#9002a1"];

    const addIO = new AddIOModifier();

    const removeInput = (input: BoxAnnotation) => {
        sciChartSurface.annotations.remove(input);
        const inputSeries = inputSurface.renderableSeries.getById(input.id);
        inputSurface.renderableSeries.remove(inputSeries);
        inputSeries.delete();
        const freqAnn = inputSurface.annotations.getById(input.id);
        inputSurface.annotations.remove(freqAnn);
        freqAnn?.delete();
        inputColors.push(input.id);
        inputs.splice(inputs.indexOf(input), 1);
        input.delete();
    }
    const addInput = (x: number, y: number, w?: number, h?: number, freq?: number) => {
        if (inputColors.length === 0) return;
        const color = inputColors.shift();
        w = w ?? Math.round(width / 80);
        h = h ?? w;
        const boxInput = new BoxAnnotation({
            id: color,
            x1: x - w,
            x2: x + w,
            y1: y - h,
            y2: y + h,
            isEditable: true,
            strokeThickness: 3,
            stroke: color,
            fill: "transparent",
            dragPoints: [EDraggingGripPoint.Body, EDraggingGripPoint.x2y1],
            onClick: (args: AnnotationClickEventArgs) => {
                if (args.mouseArgs.button !== EExecuteOn.MouseRightButton) return;
                removeInput(boxInput);
            }
        });

        boxInput.selectedChanged.subscribe((isSelected: boolean) => {
            inputSurface.renderableSeries.getById(color).isSelected = isSelected;
        });
        boxInput.dragDelta.subscribe(data => {
            if (boxInput.x1 < 1) boxInput.x1 = 1;
            if (boxInput.x2 >= width) boxInput.x1 = width - 1;
            if (boxInput.y1 < 1) boxInput.y1 = 1;
            if (boxInput.y2 >= height) boxInput.y1 = height - 1;
        });

        inputs.push(boxInput);
        sciChartSurface.annotations.add(boxInput);
        addInputSeries(color, freq);
    };

    const {sciChartSurface: outputSurface, addOutputSeries} = await createHistoryChart();

    const removeOutput = (output: CustomAnnotation) => {
        sciChartSurface.annotations.remove(output);
        const os = outputSurface.renderableSeries.getById(output.id);
        outputSurface.renderableSeries.remove(os);
        os?.delete();
        // remove leading dot
        const od = outputSurface.renderableSeries.getById(output.id + "dot");
        outputSurface.renderableSeries.remove(od);
        od.delete();
        outputColors.push(output.id);
        outputs.splice(outputs.indexOf(output), 1);
        output.delete();
    }
    const addOutput = (x: number, y: number) => {
        if (outputColors.length === 0) return;
        const color = outputColors.shift();
        const output = new CustomAnnotation({
            id: color,
            x1: x,
            y1: y,
            horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
            verticalAnchorPoint: EVerticalAnchorPoint.Center,
            svgString: `<svg width="16" height="16"  xmlns="http://www.w3.org/2000/svg"><ellipse style="fill: ${color}; stroke: rgb(0, 0, 0);" cx="8" cy="8" rx="7" ry="7"></ellipse></svg>`,
            isEditable: true,
            dragPoints: [EDraggingGripPoint.Body],
            onClick: (args: AnnotationClickEventArgs) => {
                if (args.mouseArgs.button !== EExecuteOn.MouseRightButton) return;
                removeOutput(output);
            }
        });
        output.selectedChanged.subscribe((isSelected: boolean) => {
            if (isSelected) {
                outputSurface.renderableSeries
                    .asArray()
                    .filter(rs => rs.type === ESeriesType.LineSeries)
                    .forEach(rs => {
                        rs.opacity = rs.id === color ? 1 : 0.3;
                    });
            } else {
                outputSurface.renderableSeries
                    .asArray()
                    .filter(rs => rs.type === ESeriesType.LineSeries)
                    .forEach(rs => (rs.opacity = 0.8));
            }
            outputSurface.renderableSeries.getById(color).isSelected = isSelected;
        });
        // @ts-ignore
        output.updateAdornerInner = () => {
        };
        output.dragDelta.subscribe(data => {
            if (output.x1 < 1) output.x1 = 1;
            if (output.x1 >= width) output.x1 = width - 1;
            if (output.y1 < 1) output.y1 = 1;
            if (output.y1 >= height) output.y1 = height - 1;
        });
        outputs.push(output);
        sciChartSurface.annotations.add(output);
        addOutputSeries(color);
    };

    sciChartSurface.annotations.add(hline, vline);

    // Add heatmap to the chart
    sciChartSurface.renderableSeries.add(heatmapSeries);

    addIO.onAddInput = addInput;
    addIO.onAddOutput = addOutput;
    sciChartSurface.chartModifiers.add(addIO);

    const dampingMarker = new AxisMarkerAnnotation({
        id: "damping",
        y1: 100,
        backgroundColor: "#E97064",
        isEditable: true,
        formattedValue: "Damping"
    });
    // hack to disable selection box while dragging
    // @ts-ignore
    dampingMarker.updateAdornerInner = () => {
    }
    sciChartSurface.annotations.add(dampingMarker);

    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 0.5,
        y1: 0.02,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        text: "2D Wave simulation",
        fontSize: 18,
        textColor: appTheme.ForegroundColor,
        opacity: 0.5,
        wrapTo: EWrapTo.ViewRect
    }));

    let timerId: NodeJS.Timeout;
    const getValue = (r: number, c: number) => {
        if (r < 0 || r === height || c < 0 || c === width) {
            return 0;
        } else {
            return initialZValues[r][c];
        }
    };
    let time = 0;
    const timerLine1 = inputSurface.annotations.getById("timerLine");

    const dt = 0.3;
    let damping = 0.99;
    const timestep = 20;
    const updateChart = () => {
        damping = 1 - Math.abs(dampingMarker.y1 / 10000);
        const newZValues: number[][] = Array.from(Array(height), _ => Array(width));
        for (let r = 0; r < height; r++) {
            for (let c = 0; c < width; c++) {
                const a =
                    1 *
                    (-8 * getValue(r, c) +
                        getValue(r - 1, c) +
                        getValue(r + 1, c) +
                        getValue(r, c - 1) +
                        getValue(r, c + 1) +
                        getValue(r - 1, c - 1) +
                        getValue(r + 1, c - 1) +
                        getValue(r - 1, c + 1) +
                        getValue(r + 1, c + 1));
                velocities[r][c] = (velocities[r][c] + a * dt) * damping;
                newZValues[r][c] = initialZValues[r][c] + velocities[r][c] * dt * 2;
            }
        }
        timerLine1.x1 = time;
        const inputIndex = Math.floor(time / 500);
        // Update inputs
        for (const boxInput of inputs) {
            const inputSeries = inputSurface.renderableSeries.getById(boxInput.id).dataSeries as XyDataSeries;
            const inputY = inputSeries.getNativeYValues().get(inputIndex);
            const inputY1 = inputSeries.getNativeYValues().get((inputIndex + 1) % 60);
            const inputInterpolated = inputY + ((inputY1 - inputY) / 500) * (time - inputIndex * 500);
            const irStart = Math.max(2, Math.min(Math.floor(boxInput.y1), Math.floor(boxInput.y2)) - 1);
            const irEnd = Math.min(height, Math.max(Math.floor(boxInput.y1), Math.floor(boxInput.y2)) - 1);
            const icStart = Math.max(2, Math.min(Math.floor(boxInput.x1), Math.floor(boxInput.x2)) - 1);
            const icEnd = Math.min(width, Math.max(Math.floor(boxInput.x1), Math.floor(boxInput.x2)) - 1);
            for (let r = irStart; r < irEnd; r++) {
                for (let c = icStart; c < icEnd; c++) {
                    newZValues[r][c] = inputInterpolated;
                }
            }
        }

        initialZValues = newZValues;
        heatmapDataSeries.setZValues(newZValues);
        if (!hline.isHidden) {
            lineDataSeries.clear();
            const yVals = initialZValues[Math.floor(hline.y1)];
            if (yVals) {
                lineDataSeries.appendRange(lineXValues, yVals);
            }
        }
        if (!vline.isHidden) {
            vlineDataSeries.clear();
            const yVals = initialZValues.map(r => r[Math.floor(vline.x1)]);
            if (yVals) {
                vlineDataSeries.appendRange(vlineXValues, yVals);
            }
        }

        // update outputs
        for (const output of outputs) {
            const outputDS = outputSurface.renderableSeries.getById(output.id).dataSeries as XyDataSeries;
            outputDS.update(time / timestep, initialZValues[Math.floor(output.y1)][Math.floor(output.x1)]);
        }

        time = (time + timestep) % 30000;
        timerId = setTimeout(updateChart, 20);
    };

    // Buttons for chart
    const startAnimation = () => {
        console.log("start animation");
        updateChart();
    };

    document.querySelector("#startAnimation").addEventListener("click", startAnimation);
    const stopAnimation = () => {
        console.log("stop animation");
        clearTimeout(timerId);
        timerId = undefined;
    };
    document.querySelector("#stopAnimation").addEventListener("click", stopAnimation);

    const showHelp = () => {
        const anim = getHelpAnnotation("This heatmap is running a 2D wave simulation.  Colours correspond to wave height. Drag the Damping marker to adjust how long the waves last.",
            sciChartSurface);
        sciChartSurface.addAnimation(anim.startAnim);
        const anim2 = getHelpAnnotation("This shows the cross section of the waveforms at the horizontal and vertical orange lines on the heatmap.\nTry Dragging the orange lines.",
            crossSectionSurface);
        anim.next.onNext = () => sciChartSurface.addAnimation(anim2.startAnim);
        const anim3 = getHelpAnnotation("The boxes are input locations. Drag to move them around, or click, then drag in the white circle to resize.",
            sciChartSurface);
        anim2.next.onNext = () => sciChartSurface.addAnimation(anim3.startAnim);
        const anim4 = getHelpAnnotation("These series drive the corresponding colored inputs.  Drag the frequency markers to set a regular driving input, or click and drag to edit the series directly.",
            inputSurface);
        anim3.next.onNext = () => sciChartSurface.addAnimation(anim4.startAnim);
        const anim5 = getHelpAnnotation("This chart records the values over time at the coloured output circles on the heatmap.  You can drag those around too.  Click on one to highlight its associated series.",
            outputSurface);
        anim4.next.onNext = () => sciChartSurface.addAnimation(anim5.startAnim);
        const anim6 = getHelpAnnotation("You can add additional inputs and outputs by left clicking on the heatmap and selecting one of the options.  This is all done with annotations and a custom modifier.  Right click on an input or output to remove it.",
            sciChartSurface);
        anim5.next.onNext = () => sciChartSurface.addAnimation(anim6.startAnim);
    }
    showHelp();

    document.querySelector("#showHelp").addEventListener("click", showHelp);

    const clearHeatmap = () => {
        initialZValues = Array.from(Array(height), _ => Array(width).fill(0));
        velocities = Array.from(Array(height), _ => Array(width).fill(0));
        while (inputs.length > 0) {
            const i = inputs[0];
            removeInput(i);
        }
        while (outputs.length > 0) {
            const o = outputs[0];
            removeOutput(o);
        }
    }

    const twoPoint = () => {
        stopAnimation();
        clearHeatmap();
        addInput(width / 4, height / 2);
        addInput((3 * width) / 4, height / 2);
        addOutput((3 * width) / 4, (3 * height) / 4);
        addOutput(width / 4, height / 4);
        startAnimation();
    }
    document.querySelector("#twoSource").addEventListener("click", twoPoint);

    const interference = () => {
        stopAnimation();
        clearHeatmap();
        const sep = 20;
        const gap = 10
        const outer = (((height - sep) / 2) - gap) / 2;
        addInput(width / 2, height / 2, 2, sep / 2, 0);
        addInput(width / 2, outer, 2, outer, 0);
        addInput(width / 2, height - outer, 2, outer, 0);
        addInput(width / 3, height / 2, 4, height / 3, 25000);
        addOutput((3 * width) / 4, height / 2);
        addOutput((3 * width) / 4, height / 3);
        addOutput((3 * width) / 4, height / 4);
        vline.x1 = (3 * width) / 4;
        startAnimation();
    }
    document.querySelector("#interference").addEventListener("click", interference);

    twoPoint();
    return [sciChartSurface, crossSectionSurface, inputSurface, outputSurface];
};

const getHelpAnnotation = (text: string, surface: SciChartSurface) => {
    const ann = new NativeTextAnnotation({
        x1: 0.5,
        y1: 0.5,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        text,
        opacity: 0,
        fontSize: 18,
        textColor: appTheme.ForegroundColor,
        wrapTo: EWrapTo.ViewRect
    });
    const next = {
        onNext: () => {
        }
    };
    const startAnim = new GenericAnimation<number>({
        from: 0,
        to: 1,
        duration: 500,
        onAnimate(from, to, progress) {
            if (!surface.annotations.contains(ann)) {
                surface.annotations.add(ann);
            } else {
                ann.opacity = progress;
            }
        },
        onCompleted() {
            surface.addAnimation(new GenericAnimation<number>({
                delay: 4000,
                duration: 500,
                from: 1,
                to: 0,
                onAnimate(from, to, progress) {
                    ann.opacity = 1 - progress;
                },
                onCompleted() {
                    surface.annotations.remove(ann);
                    if (next.onNext)
                        next.onNext();
                }
            }));
        },
    });
    return {startAnim, next};
}

class YPalette extends BasePaletteProvider implements IStrokePaletteProvider {
    public strokePaletteMode: EStrokePaletteMode.GRADIENT;
    private dataSeries: XyDataSeries;
    private wasmContext: TSciChart;
    private colorData: number[];

    constructor(wasmContext: TSciChart, stops: TGradientStop[]) {
        super();
        this.wasmContext = wasmContext;
        this.colorData = PaletteFactory.createColorMap(wasmContext, stops);
    }

    public onAttached(parentSeries: IRenderableSeries): void {
        this.dataSeries = parentSeries.dataSeries as XyDataSeries;
    }

    public onDetached(): void {
    }

    public overrideStrokeArgb(xValue: number, yValue: number, index: number): number {
        const y = this.dataSeries.getNativeYValues().get(index);
        const lerpFactor = (y + 75) / 150;
        const mapIndex = this.wasmContext.NumberUtil.Constrain(
            Math.round(lerpFactor * (this.colorData.length - 1)),
            0,
            this.colorData.length - 1
        );
        const result = this.colorData[mapIndex];
        return result;
    }
}

const createCrossSectionChart = async () => {
    const {
        sciChartSurface,
        wasmContext
    } = await SciChartSurface.create(divCrossSection, {theme: appTheme.SciChartJsTheme});
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            id: "xh",
            isInnerAxis: true,
            visibleRange: new NumberRange(0, width),
            visibleRangeLimit: new NumberRange(0, width),
            drawMinorGridLines: false,
            zoomExtentsToInitialRange: true,
            drawLabels: false
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: "yh",
            visibleRange: new NumberRange(-50, 50),
            visibleRangeLimit: new NumberRange(-100, 100),
            axisAlignment: EAxisAlignment.Right,
            drawMinorGridLines: false,
            labelPrecision: 0,
            zoomExtentsToInitialRange: true
        })
    );

    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, {
            id: "xv",
            isInnerAxis: true,
            visibleRange: new NumberRange(0, height),
            visibleRangeLimit: new NumberRange(0, height),
            flippedCoordinates: true,
            axisAlignment: EAxisAlignment.Left,
            zoomExtentsToInitialRange: true,
            drawLabels: false
        })
    );

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            id: "yv",
            // isInnerAxis: true,
            visibleRange: new NumberRange(-50, 50),
            visibleRangeLimit: new NumberRange(-100, 100),
            axisAlignment: EAxisAlignment.Top,
            flippedCoordinates: true,
            labelPrecision: 0,
            zoomExtentsToInitialRange: true
        })
    );

    const lineSeriesh = new FastLineRenderableSeries(wasmContext, {
        id: "h",
        strokeThickness: 3,
        stroke: "steelblue",
        dataSeries: new XyDataSeries(wasmContext, {containsNaN: false, isSorted: true}),
        paletteProvider: new YPalette(wasmContext, csGradientStops),
        xAxisId: "xh",
        yAxisId: "yh"
    });
    sciChartSurface.renderableSeries.add(lineSeriesh);
    const lineSeriesv = new FastLineRenderableSeries(wasmContext, {
        id: "v",
        strokeThickness: 3,
        stroke: "steelblue",
        dataSeries: new XyDataSeries(wasmContext, {containsNaN: false, isSorted: true}),
        paletteProvider: new YPalette(wasmContext, csGradientStops),
        xAxisId: "xv",
        yAxisId: "yv"
    });
    sciChartSurface.renderableSeries.add(lineSeriesv);

    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 0.5,
        y1: 0.02,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        text: "Cross sections",
        fontSize: 18,
        textColor: appTheme.ForegroundColor,
        opacity: 0.5,
        wrapTo: EWrapTo.ViewRect
    }));

    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new RubberBandXyZoomModifier({executeOn: EExecuteOn.MouseRightButton}),
        new YAxisDragModifier({})
    );

    return sciChartSurface;
};

const inputChart = async () => {
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divInput, {theme: appTheme.SciChartJsTheme});
    const xAxis = new NumericAxis(wasmContext, {
        drawMinorGridLines: false,
        visibleRange: new NumberRange(0, 30000),
        visibleRangeLimit: new NumberRange(0, 30000),
        axisAlignment: EAxisAlignment.Top
    });
    xAxis.labelProvider.formatLabel = dataValue =>
        xAxis.labelProvider.applyFormat(formatNumber(dataValue / 1000, xAxis.labelProvider.numericFormat, 0));

    sciChartSurface.xAxes.add(xAxis);
    const xValues = Array.from(Array(60)).map((_, i) => i * 500);
    const yAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(-100, 100),
        visibleRangeLimit: new NumberRange(-100, 100),
        axisAlignment: EAxisAlignment.Left,
        labelPrecision: 0,
        drawMinorGridLines: false
    });

    sciChartSurface.yAxes.add(yAxis);
    const makeYValues = (frequency: number) => {
        return Array.from(Array(60)).map((_, i) => (Math.sin((frequency * 2 - 30000) * i * 2 * Math.PI / 60000) * 80))
    }

    const addInputSeries = (color: string, freq?: number) => {
        freq = freq ?? Math.floor(Math.random() * 30000 / 500) * 500;
        const frequencyMarker = new DiscreteAxisMarker({
            id: color,
            x1: freq,
            backgroundColor: color,
            isEditable: true,
            formattedValue: "Frequency"
        });
        frequencyMarker.stepSize = 250;
        // hack to disable selection box while dragging
        // @ts-ignore
        frequencyMarker.updateAdornerInner = () => {
        }
        const dataSeries = new XyDataSeries(wasmContext, {
            containsNaN: false,
            isSorted: true,
            xValues,
            yValues: makeYValues(freq),
            metadata: {isSelected: false}
        });
        const lineSeries = new SplineLineRenderableSeries(wasmContext, {
            id: color,
            stroke: color,
            pointMarker: new EllipsePointMarker(wasmContext, {
                stroke: color,
                fill: color,
                width: 5,
                height: 5
            }),
            dataSeries,
            onSelectedChanged: (sourceSeries: IRenderableSeries, isSelected: boolean) => {
                lineSeries.strokeThickness = isSelected ? 4 : 2;
                lineSeries.pointMarker.fill = isSelected ? "red" : color;
            }
        });
        frequencyMarker.dragDelta.subscribe((args) => {
            dataSeries.clear();
            dataSeries.appendRange(xValues, makeYValues(frequencyMarker.x1));
        });
        sciChartSurface.renderableSeries.add(lineSeries);
        sciChartSurface.annotations.add(frequencyMarker);
    };

    const timerLine = new VerticalLineAnnotation({
        id: "timerLine",
        stroke: "green",
        x1: 0
    });
    sciChartSurface.annotations.add(timerLine);

    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 0.5,
        y1: 0.02,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        text: "Input drivers",
        fontSize: 18,
        textColor: appTheme.ForegroundColor,
        opacity: 0.5,
        wrapTo: EWrapTo.ViewRect
    }));

    sciChartSurface.chartModifiers.add(
        new PointDragModifier(),
        new ZoomPanModifier({executeOn: EExecuteOn.MouseRightButton}),
        new MouseWheelZoomModifier()
    );
    return {sciChartSurface, addInputSeries};
};

const createHistoryChart = async () => {
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(divHistory, {theme: appTheme.SciChartJsTheme});
    const xAxis = new NumericAxis(wasmContext, {
        visibleRange: new NumberRange(0, 30000),
        visibleRangeLimit: new NumberRange(0, 30000),
        drawMinorGridLines: false,
        zoomExtentsToInitialRange: true,
        axisAlignment: EAxisAlignment.Top
    });
    xAxis.labelProvider.formatLabel = dataValue =>
        xAxis.labelProvider.applyFormat(formatNumber(dataValue / 1000, xAxis.labelProvider.numericFormat, 0));
    sciChartSurface.xAxes.add(xAxis);

    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, {
            visibleRange: new NumberRange(-30, 30),
            visibleRangeLimit: new NumberRange(-100, 100),
            axisAlignment: EAxisAlignment.Right,
            drawMinorGridLines: false,
            labelPrecision: 0,
            cursorLabelPrecision: 1
        })
    );

    const rollover = new RolloverModifier();
    sciChartSurface.chartModifiers.add(rollover);

    const addOutputSeries = (color: string) => {
        const lineData = new XyDataSeries(wasmContext, {containsNaN: true, isSorted: true});
        const xarr = Array.from(Array(1500)).map((_, i) => i * 20);
        const nanArr = xarr.map(x => NaN);
        lineData.appendRange(xarr, nanArr);
        const lineSeries = new FastLineRenderableSeries(wasmContext, {
            id: color,
            strokeThickness: 3,
            stroke: color,
            dataSeries: lineData,
            opacity: 0.8
        });

        const dotSeries = new XyDataSeries(wasmContext, {containsNaN: true, isSorted: true});
        const leadingDot = new XyScatterRenderableSeries(wasmContext, {
            id: color + "dot",
            pointMarker: new EllipsePointMarker(wasmContext, {
                width: 8,
                height: 8,
                strokeThickness: 2,
                fill: color,
                stroke: color
            }),
            dataSeries: dotSeries
        });
        rollover.includeSeries(leadingDot, false);
        lineData.dataChanged.subscribe(data => {
            const changeIndex = data.changeType === EDataChangeType.Append ? lineData.count() - 1 : data.index;
            dotSeries.clear();
            dotSeries.append(
                lineData.getNativeXValues().get(changeIndex),
                lineData.getNativeYValues().get(changeIndex)
            );
        });
        sciChartSurface.renderableSeries.add(lineSeries, leadingDot);
    };

    sciChartSurface.annotations.add(new NativeTextAnnotation({
        x1: 0.5,
        y1: 0.02,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        verticalAnchorPoint: EVerticalAnchorPoint.Top,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        text: "Point outputs",
        fontSize: 18,
        textColor: appTheme.ForegroundColor,
        opacity: 0.5,
        wrapTo: EWrapTo.ViewRect
    }));

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new RubberBandXyZoomModifier({executeOn: EExecuteOn.MouseRightButton})
    );

    return {sciChartSurface, addOutputSeries};
};
