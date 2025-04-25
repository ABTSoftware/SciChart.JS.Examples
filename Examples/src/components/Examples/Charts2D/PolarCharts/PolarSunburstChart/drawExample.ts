import {
    PolarColumnRenderableSeries,
    PolarNumericAxis,
    SciChartPolarSurface,
    EPolarAxisMode, 
    NumberRange, 
    EAxisAlignment, 
    EPolarLabelMode,
    PolarCursorModifier,
    TCursorTooltipDataTemplate,
    SeriesInfo,
    Thickness,
    EPolarGridlineMode,
    PolarDataPointSelectionModifier,
    SciChartJSLightTheme,
    TSciChart,
    EColumnMode,
    XyxDataSeries,
    EMultiLineAlignment,
    EColumnDataLabelPosition,
    EDataPointWidthMode,
    GenericAnimation,
    easing,
    DoubleAnimator,
    translateToNotScaled,
    adjustTooltipPosition,
    calcTooltipSize,
    CursorTooltipSvgAnnotation,
    TCursorTooltipSvgTemplate,
    parseColorToTArgb
} from "scichart";
import { appTheme } from "../../../theme";
import { SunburstMetadata } from "./SunburstMetadata";
import { SunburstPaletteProvider } from "./SunburstPaletteProvider"
import { getDataById, getElementById, TLevelDataForChart } from "./sunburstData";

const drawSeriesFn = (
    wasmContext: TSciChart,
    xAxis: PolarNumericAxis,
    yAxis: PolarNumericAxis,
    sciChartSurface: SciChartPolarSurface,
    polarLabelMode: EPolarLabelMode,
    dataPointSelectionModifier: PolarDataPointSelectionModifier,
    nodeId: number[],
    selectedElStartX: number,
    prevNodeId: number[]
) => {
    const startAngleDefault = - Math.PI / 2;

    const clearSeriesFn = () => {
        dataPointSelectionModifier.selectionChanged.unsubscribeAll();
        sciChartSurface.renderableSeries.asArray().forEach(rs => rs.delete());
        sciChartSurface.renderableSeries.clear();
    };

    const level = nodeId.length - 1;
    const prevLevel = prevNodeId.length - 1;
    const prevXVisRangeDiff = xAxis.visibleRange.diff;

    const polarColumnMode = EColumnMode.StartEnd;
    const dataPointWidth = 0.5;
    const paletteProvider = new SunburstPaletteProvider();

    const createDataFn = (input$: TLevelDataForChart) => {
        const [xValues$, yValues$, x1Values$] = input$.data;
        return new XyxDataSeries(wasmContext, {
            xValues: xValues$,
            yValues: yValues$,
            x1Values: x1Values$,
            metadata: input$.metadata
        });
    };

    const levelData = getDataById(nodeId);
    const rootNode = getElementById(nodeId);

    const redrawSeriesFn = () => {
        clearSeriesFn();
        for (let i = 0; i < levelData.length; i++) {
            const rs$ = new PolarColumnRenderableSeries(wasmContext, {
                stroke: "black",
                columnXMode: polarColumnMode,
                dataLabels: {
                    style: {
                        fontSize: 16,
                        multiLineAlignment: EMultiLineAlignment.Center,
                        lineSpacing: 8
                    },
                    color: "black",
                    precision: 2,
                    pointGapThreshold: 0,
                    skipNumber: 0,
                    polarLabelMode,
                    labelYPositionMode: EColumnDataLabelPosition.Position,
                    labelYPositionMultiplier: 0.5,
                    metaDataSelector: metadata => {
                        const md = metadata as SunburstMetadata;
                        return `${md.title} \n ${md.value}`;
                    }
                },
                dataSeries: createDataFn(levelData[i]),
                strokeThickness: 2,
                dataPointWidth,
                dataPointWidthMode: EDataPointWidthMode.Range,
                defaultY1: i,
                paletteProvider: paletteProvider
            });
            dataPointSelectionModifier.includeSeries(rs$, true);
            sciChartSurface.renderableSeries.add(rs$);
        }
    };

    const drillDownAnimationFn = (isReverse$: boolean, onCompleteFn$: () => void = () => undefined) => {
        const xMin$ = 0; // always zero
        const xMax0$ = prevXVisRangeDiff;
        const xMax1$ = rootNode.value;

        const startAngle0$ = isReverse$
            ? startAngleDefault
            : startAngleDefault + (2 * Math.PI * selectedElStartX) / xAxis.visibleRange.diff;
        let startAngle1$: number;
        if (isReverse$) {
            const levelDiff$ = prevLevel - level;
            const element$ = levelData[levelDiff$].metadata.find(a => a.id.toString() === prevNodeId.toString());
            startAngle1$ = startAngleDefault + (2 * Math.PI * element$.start) / rootNode.value;
        } else {
            startAngle1$ = startAngleDefault;
        }

        const yMin0$ = isReverse$ ? 0 : prevLevel - level;
        const yMin1$ = isReverse$ ? level - prevLevel : 0;

        const from$ = { x1: xMax0$, x2: startAngle0$, y1: yMin0$, y2: 0 };
        const to$ = { x1: xMax1$, x2: startAngle1$, y1: yMin1$, y2: 0 };

        const sweepAnimation = new GenericAnimation({
            from: from$,
            to: to$,
            duration: 2000,
            ease: easing.inOutSine,
            onAnimate: (from, to, progress) => {
                const xMaxCur = DoubleAnimator.interpolate(from.x1, to.x1, progress);
                const startAngleCur = DoubleAnimator.interpolate(from.x2, to.x2, progress);
                const yMinCur = DoubleAnimator.interpolate(from.y1, to.y1, progress);
                const yMaxCur = yMinCur + 4;
                xAxis.visibleRange = new NumberRange(xMin$, xMaxCur);
                xAxis.startAngle = startAngleCur;
                yAxis.visibleRange = new NumberRange(yMinCur, yMaxCur);
            },
            onCompleted: () => {
                onCompleteFn$();
            }
        });
        sciChartSurface.addAnimation(sweepAnimation);
    };

    const subscribeFn = () => {
        dataPointSelectionModifier.selectionChanged.subscribe(args => {
            const selectedDataPoint = args.selectedDataPoints[0];
            if (selectedDataPoint) {
                const { yValue } = selectedDataPoint;
                const md = selectedDataPoint?.metadata as SunburstMetadata;
                const { id } = md;
                const newId = [...id];
                if (yValue === 1 && id.length > 1) {
                    newId.pop();
                }
                drawSeriesFn(
                    wasmContext,
                    xAxis,
                    yAxis,
                    sciChartSurface,
                    polarLabelMode,
                    dataPointSelectionModifier,
                    newId,
                    md.start,
                    nodeId
                );
            }
        });
    };

    if (level < prevLevel) {
        drillDownAnimationFn(true, () => {
            redrawSeriesFn();
            xAxis.startAngle = startAngleDefault;
            yAxis.visibleRange = new NumberRange(0, 4);
            subscribeFn();
        });
    } else if (level > prevLevel) {
        redrawSeriesFn();
        drillDownAnimationFn(false);
        subscribeFn();
    } else {
        xAxis.startAngle = startAngleDefault;
        xAxis.visibleRange = new NumberRange(0, rootNode.value);
        yAxis.visibleRange = new NumberRange(0, 4);
        redrawSeriesFn();
        subscribeFn();
    }
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme
    });

    const startAngle = -Math.PI / 2;
    const totalAngle = 2 * Math.PI;

    const xAxis = new PolarNumericAxis(wasmContext, {
        isVisible: false,
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        visibleRange: new NumberRange(0, 65),
        startAngle,
        totalAngle
    });
    xAxis.polarLabelMode = EPolarLabelMode.Parallel;
    sciChartSurface.xAxes.add(xAxis);

    const yAxis = new PolarNumericAxis(wasmContext, {
        isVisible: false,
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 6),
        flippedCoordinates: false,
        startAngle,
        totalAngle,
    });
    sciChartSurface.yAxes.add(yAxis);


    const dataPointSelectionModifier = new PolarDataPointSelectionModifier({
        allowClickSelect: true,
        allowDragSelect: true,
        selectionStroke: "red",
        selectionFill: "#ff879f33"
    });

    drawSeriesFn(
        wasmContext, 
        xAxis, 
        yAxis, 
        sciChartSurface, 
        EPolarLabelMode.Parallel, 
        dataPointSelectionModifier, 
        [0], 
        0, 
        [0]
    );

    const tooltipDataTemplate: TCursorTooltipDataTemplate = (seriesInfos: SeriesInfo[], tooltipTitle: string) => {
        const res: string[] = [];
        seriesInfos.forEach(si => {
            if (si.isHit) {
                const md = si.pointMetadata as SunburstMetadata;
                res.push(`Name: ${md.title}`);
                res.push(`Value: ${md.value}`);
            }
        });
        return res;
    };

    sciChartSurface.chartModifiers.add(
        dataPointSelectionModifier,
        new PolarCursorModifier({
            showTooltip: true,
            showCircularLine: false,
            showRadialLine: false,
            tooltipDataTemplate,
        })
    );

    return { sciChartSurface, wasmContext };
};