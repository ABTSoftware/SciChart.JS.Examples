
import { SciChartSurface } from "scichart";
import { MouseWheelZoomModifier } from "scichart/Charting/ChartModifiers/MouseWheelZoomModifier";
import { RolloverModifier } from "scichart/Charting/ChartModifiers/RolloverModifier";
import { RubberBandXyZoomModifier } from "scichart/Charting/ChartModifiers/RubberBandXyZoomModifier";
import { YAxisDragModifier } from "scichart/Charting/ChartModifiers/YAxisDragModifier";
import { ZoomExtentsModifier } from "scichart/Charting/ChartModifiers/ZoomExtentsModifier";
import { ZoomPanModifier } from "scichart/Charting/ChartModifiers/ZoomPanModifier";
import { BasePaletteProvider } from "scichart/Charting/Model/BasePaletteProvider";
import { EDataChangeType } from "scichart/Charting/Model/IDataSeries";
import { IStrokePaletteProvider, EStrokePaletteMode } from "scichart/Charting/Model/IPaletteProvider";
import { PaletteFactory } from "scichart/Charting/Model/PaletteFactory";
import { UniformHeatmapDataSeries } from "scichart/Charting/Model/UniformHeatmapDataSeries";
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";
import { SciChartJSLightTheme } from "scichart/Charting/Themes/SciChartJSLightTheme";
import { EDraggingGripPoint } from "scichart/Charting/Visuals/Annotations/AnnotationBase";
import { AnnotationClickEventArgs } from "scichart/Charting/Visuals/Annotations/AnnotationClickEventArgs";
import { AxisMarkerAnnotation } from "scichart/Charting/Visuals/Annotations/AxisMarkerAnnotation";
import { BoxAnnotation } from "scichart/Charting/Visuals/Annotations/BoxAnnotation";
import { CustomAnnotation } from "scichart/Charting/Visuals/Annotations/CustomAnnotation";
import { HorizontalLineAnnotation } from "scichart/Charting/Visuals/Annotations/HorizontalLineAnnotation";
import { VerticalLineAnnotation } from "scichart/Charting/Visuals/Annotations/VerticalLineAnnotation";
import { NumericAxis } from "scichart/Charting/Visuals/Axis/NumericAxis";
import { EllipsePointMarker } from "scichart/Charting/Visuals/PointMarkers/EllipsePointMarker";
import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { HeatmapColorMap } from "scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap";
import { IRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/IRenderableSeries";
import { SplineLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/SplineLineRenderableSeries";
import { UniformHeatmapRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries";
import { XyScatterRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries";
import { NumberRange } from "scichart/Core/NumberRange";
import { EHorizontalAnchorPoint, EVerticalAnchorPoint } from "scichart/types/AnchorPoint";
import { EAxisAlignment } from "scichart/types/AxisAlignment";
import { EExecuteOn } from "scichart/types/ExecuteOn";
import { ESeriesType } from "scichart/types/SeriesType";
import { TGradientStop } from "scichart/types/TGradientStop";
import { TSciChart } from "scichart/types/TSciChart";
import { formatNumber } from "scichart/utils/number";
import { appTheme } from "../../../theme";
import { AddIOModifier } from "./AddIOModifier";
import { DiscreteAxisMarker } from "./DiscreteAxisMarker";
import { PointDragModifier } from "./PointDragModifier";

export const divElementId = "chart";
export const divCrossSection = "crossSection";
export const divInput = "input";
export const divHistory = "history";

const gradientStops = [
    { offset: 0, color: "#17243d" },
    { offset: 0.3, color: "#274b92" },
    { offset: 0.45, color: "#47bde6" },
    { offset: 0.5, color: appTheme.DarkIndigo },
    { offset: 0.55, color: "#68bcae" },
    { offset: 0.7, color: "#e97064" },
    { offset: 1.0, color: "#ae418d" }
];

const csGradientStops = [
    { offset: 0, color: "#17243d" },
    { offset: 0.3, color: "#274b92" },
    { offset: 0.45, color: "#47bde6" },
    { offset: 0.5, color: "#45AEC3" },
    { offset: 0.55, color: "#68bcae" },
    { offset: 0.7, color: "#e97064" },
    { offset: 1.0, color: "#ae418d" }
];

let width = 700;
let height = 500;

export const drawExample = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, { theme: appTheme.SciChartJsTheme });
    const xAxis = new NumericAxis(wasmContext, { isVisible: false });
    sciChartSurface.xAxes.add(xAxis);
    const yAxis = new NumericAxis(wasmContext, { axisAlignment: EAxisAlignment.Left, isVisible: true, drawLabels: false, drawMajorGridLines: false, drawMajorBands: false, drawMajorTickLines: false, drawMinorTickLines: false, drawMinorGridLines: false });
    sciChartSurface.yAxes.add(yAxis);

    width = Math.floor(sciChartSurface.domCanvas2D.width);
    height = Math.floor(sciChartSurface.domCanvas2D.height);
    let initialZValues = Array.from(Array(height), _ => Array(width).fill(0));
    const velocities = Array.from(Array(height), _ => Array(width).fill(0));

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
        colorMap: new HeatmapColorMap({ minimum: -80, maximum: 80, gradientStops })
    });

    const lineSurface = await createLineChart();
    const lineDataSeries = lineSurface.renderableSeries.getById("h").dataSeries as XyDataSeries;
    const vlineDataSeries = lineSurface.renderableSeries.getById("v").dataSeries as XyDataSeries;
    const lineXValues = Array.from(Array(width)).map((_, i) => i);
    const vlineXValues = Array.from(Array(height)).map((_, i) => i);

    const hline = new HorizontalLineAnnotation({
        stroke: "#E97064",
        strokeThickness: 3,
        y1: height / 3,
        isEditable: true,
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

    const { sciChartSurface: inputSurface, addInputSeries } = await inputChart();
    const inputColors = ["#68bcae", "#e97064", "#47bde6", "#ae418d", "#274b92", "#634e96"];
    const outputColors = ["#0bf4cd", "#f4840b", "#0bdef4", "#f6086c", "#112cce", "#9002a1"];

    const addIO = new AddIOModifier();

    const addInput = (x: number, y: number) => {
        if (inputColors.length === 0) return;
        const color = inputColors.shift();
        const size = Math.round(width / 80);
        const boxInput = new BoxAnnotation({
            id: color,
            x1: x - size,
            x2: x + size,
            y1: y - size,
            y2: y + size,
            isEditable: true,
            strokeThickness: 3,
            stroke: color,
            fill: "transparent",
            dragPoints: [EDraggingGripPoint.Body, EDraggingGripPoint.x2y1],
            onClick: (args: AnnotationClickEventArgs) => {
                if (args.mouseArgs.button !== EExecuteOn.MouseRightButton) return;
                const input = args.sender as BoxAnnotation;
                sciChartSurface.annotations.remove(input);
                const inputSeries = inputSurface.renderableSeries.getById(input.id);
                inputSurface.renderableSeries.remove(inputSeries);
                inputColors.push(input.id);
                inputs.splice(inputs.indexOf(input));
                input.delete();
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
        addInputSeries(color);
    };

    addInput(width / 4, height / 2);
    addInput((3 * width) / 4, height / 2);

    const { sciChartSurface: outputSurface, addOutputSeries } = await createHistoryChart();

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
                const outputToRemove = args.sender as CustomAnnotation;
                sciChartSurface.annotations.remove(outputToRemove);
                outputSurface.renderableSeries.remove(outputSurface.renderableSeries.getById(outputToRemove.id));
                // remove leading dot
                outputSurface.renderableSeries.remove(
                    outputSurface.renderableSeries.getById(outputToRemove.id + "dot")
                );
                outputColors.push(outputToRemove.id);
                outputs.splice(outputs.indexOf(outputToRemove));
                outputToRemove.delete();
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
        output.updateAdornerInner = () => {};
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

    addOutput((3 * width) / 4, (3 * height) / 4);
    addOutput(width / 4, height / 4);

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
    dampingMarker.updateAdornerInner = () => {}
    sciChartSurface.annotations.add(dampingMarker);

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

    startAnimation();
    return [sciChartSurface, lineSurface, inputSurface];
};

class YPalette extends BasePaletteProvider implements IStrokePaletteProvider {
    public strokePaletteMode: EStrokePaletteMode.GRADIENT;
    private dataSeries: XyDataSeries;
    private wasmContext: TSciChart;
    private colorData: number[];

    constructor(wasmContext: TSciChart, gradientStops: TGradientStop[]) {
        super();
        this.wasmContext = wasmContext;
        this.colorData = PaletteFactory.createColorMap(wasmContext, gradientStops);
    }

    public onAttached(parentSeries: IRenderableSeries): void {
        this.dataSeries = parentSeries.dataSeries as XyDataSeries;
    }
    public onDetached(): void {}
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

export const createLineChart = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divCrossSection, { theme: appTheme.SciChartJsTheme });
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
            //isInnerAxis: true,
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
        dataSeries: new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true }),
        paletteProvider: new YPalette(wasmContext, csGradientStops),
        xAxisId: "xh",
        yAxisId: "yh"
    });
    sciChartSurface.renderableSeries.add(lineSeriesh);
    const lineSeriesv = new FastLineRenderableSeries(wasmContext, {
        id: "v",
        strokeThickness: 3,
        stroke: "steelblue",
        dataSeries: new XyDataSeries(wasmContext, { containsNaN: false, isSorted: true }),
        paletteProvider: new YPalette(wasmContext, csGradientStops),
        xAxisId: "xv",
        yAxisId: "yv"
    });
    sciChartSurface.renderableSeries.add(lineSeriesv);

    sciChartSurface.chartModifiers.add(
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton }),
        new YAxisDragModifier({})
    );

    return sciChartSurface;
};

export const inputChart = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divInput, { theme: appTheme.SciChartJsTheme });
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

    const addInputSeries = (color: string) => {
        const freq = Math.floor(Math.random() * 30000 / 500) * 500;
        const frequencyMarker = new DiscreteAxisMarker({
            id: color,
            x1: freq,
            backgroundColor: color,
            isEditable: true,
            formattedValue: "Frequency"
        });
        // hack to disable selection box while dragging
        // @ts-ignore
        frequencyMarker.updateAdornerInner = () => {}
        const dataSeries = new XyDataSeries(wasmContext, {
            containsNaN: false,
            isSorted: true,
            xValues,
            yValues: makeYValues(freq),
            metadata: { isSelected: false }
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

    sciChartSurface.chartModifiers.add(
        new PointDragModifier(),
        new ZoomPanModifier({ executeOn: EExecuteOn.MouseRightButton }),
        new MouseWheelZoomModifier()
    );
    return { sciChartSurface, addInputSeries };
};

export const createHistoryChart = async () => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divHistory, { theme: appTheme.SciChartJsTheme });
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
        const lineData = new XyDataSeries(wasmContext, { containsNaN: true, isSorted: true });
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

        const dotSeries = new XyDataSeries(wasmContext, { containsNaN: true, isSorted: true });
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

    sciChartSurface.chartModifiers.add(
        new ZoomPanModifier(),
        new ZoomExtentsModifier(),
        new MouseWheelZoomModifier(),
        new RubberBandXyZoomModifier({ executeOn: EExecuteOn.MouseRightButton })
    );

    return { sciChartSurface, addOutputSeries };
};
