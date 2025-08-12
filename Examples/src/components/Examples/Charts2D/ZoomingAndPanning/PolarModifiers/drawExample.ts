import {
    EAxisAlignment,
    EChart2DModifierType,
    EPolarAxisMode,
    EPolarLabelMode,
    NumberRange,
    PolarNumericAxis,
    SciChartPolarSurface,
    XyDataSeries,
    PolarCursorModifier,
    PolarDataPointSelectionModifier,
    PolarArcZoomModifier,
    PolarMouseWheelZoomModifier,
    PolarPanModifier,
    PolarLegendModifier,
    PolarZoomExtentsModifier,
    ECoordinateMode,
    EVerticalAnchorPoint,
    EHorizontalAnchorPoint,
    NativeTextAnnotation,
    EMultiLineAlignment,
    PolarXyScatterRenderableSeries,
    EPointMarkerType,
    EActionType,
    EPolarPanModifierPanMode,
    DataPointSelectionPaletteProvider,
    EllipsePointMarker,
    TrianglePointMarker,
} from "scichart";
import { appTheme } from "../../../theme";

export const POLAR_MODIFIER_INFO: Partial<Record<EChart2DModifierType, string>> = {
    [EChart2DModifierType.PolarZoomExtents]:
        "Double-click\nto reset the zoom at the original visible ranges.\n(pairs amazing with other modifiers)",
    [EChart2DModifierType.PolarMouseWheelZoom]: "Zoom The Polar Chart\nusing the mouse wheel or touchpad",
    [EChart2DModifierType.PolarMouseWheelZoom + " [Pan]"]: "Rotate The Polar Chart\nusing the mouse wheel or touchpad",
    [EChart2DModifierType.PolarPan + " [Cartesian]"]: "Click and drag\nto pan the chart in Cartesian mode",
    [EChart2DModifierType.PolarPan + " [Polar]"]: "Click and drag\nto pan the chart in Polar mode",
    [EChart2DModifierType.PolarArcZoom]: "Click and drag\nto Cut into The Polar Chart using an Arc",
    [EChart2DModifierType.PolarCursor]: "Hover the chart\nto see the X and Y values of the data point",
    [EChart2DModifierType.PolarLegend]: "Appends a legend showing the data series names & colors",
    [EChart2DModifierType.PolarDataPointSelection]: "Select data-points\nto change their state",
};
const STROKE = "#FFFFFF";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, wasmContext } = await SciChartPolarSurface.create(rootElement, {
        theme: appTheme.SciChartJsTheme,
    });

    const radialYAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Radial,
        axisAlignment: EAxisAlignment.Right,
        visibleRange: new NumberRange(0, 6),
        zoomExtentsToInitialRange: true,

        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
        startAngle: Math.PI / 2,
        drawLabels: false, // no radial labels
    });
    sciChartSurface.yAxes.add(radialYAxis);

    const polarXAxis = new PolarNumericAxis(wasmContext, {
        polarAxisMode: EPolarAxisMode.Angular,
        axisAlignment: EAxisAlignment.Top,
        polarLabelMode: EPolarLabelMode.Parallel,
        visibleRange: new NumberRange(0, 9),
        startAngle: Math.PI / 2, // start at 12 o'clock
        flippedCoordinates: true, // go clockwise
        zoomExtentsToInitialRange: true,

        drawMinorTickLines: false,
        drawMajorTickLines: false,
        drawMinorGridLines: false,

        useNativeText: true,
        labelPrecision: 0,
        labelStyle: {
            color: "white",
        },
        majorGridLineStyle: {
            color: appTheme.DarkIndigo,
            strokeThickness: 1,
        },
    });
    sciChartSurface.xAxes.add(polarXAxis);

    const polarColumn = new PolarXyScatterRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [0, 1, 2, 3, 4, 5, 6, 7, 8],
            yValues: [2.6, 5.3, 3.5, 2.7, 4.8, 3.8, 5, 4.5, 3.5],
        }),
        pointMarker: new TrianglePointMarker(wasmContext, {
            width: 14,
            height: 12,
            fill: "#000000",
            stroke: "#FFAA00",
            strokeThickness: 2,
        }),
        paletteProvider: new DataPointSelectionPaletteProvider({
            fill: "#FFFFFF",
            stroke: "#00AA00",
        }),
    });
    sciChartSurface.renderableSeries.add(polarColumn);

    const detailTextAnnotation = new NativeTextAnnotation({
        text: POLAR_MODIFIER_INFO[EChart2DModifierType.PolarMouseWheelZoom],
        fontSize: 24,
        xCoordinateMode: ECoordinateMode.Relative,
        yCoordinateMode: ECoordinateMode.Relative,
        x1: 0,
        y1: 0,
        verticalAnchorPoint: EVerticalAnchorPoint.Center,
        horizontalAnchorPoint: EHorizontalAnchorPoint.Center,
        multiLineAlignment: EMultiLineAlignment.Center,
        lineSpacing: 5,
    });
    sciChartSurface.annotations.add(detailTextAnnotation);

    // define all modifiers
    const PolarArcZoom = new PolarArcZoomModifier({
        stroke: STROKE,
        fill: STROKE + "20", // 15% opacity
        strokeThickness: 3,
    });
    const PolarCursor = new PolarCursorModifier({
        axisLabelStroke: STROKE,
        axisLabelFill: appTheme.DarkIndigo,
        tooltipTextStroke: STROKE,
        lineColor: STROKE,
    });
    const PolarDataPointSelection = new PolarDataPointSelectionModifier({
        allowDragSelect: true,
        allowClickSelect: true,
        selectionStroke: "#3388FF",
        selectionFill: "#3388FF44",
        onSelectionChanged: (args) => {
            console.log("seriesSelectionModifier onSelectionChanged", args);
        },
    });
    const PolarLegend = new PolarLegendModifier({
        backgroundColor: appTheme.DarkIndigo,
        textColor: STROKE,
    });
    const PolarMouseWheelZoom = new PolarMouseWheelZoomModifier({
        defaultActionType: EActionType.Zoom,
    });
    const PolarMouseWheelZoomPAN = new PolarMouseWheelZoomModifier({
        defaultActionType: EActionType.Pan,
    });
    const PolarPanCartesian = new PolarPanModifier({
        primaryPanMode: EPolarPanModifierPanMode.Cartesian,
    });
    const PolarPanPolar = new PolarPanModifier({
        primaryPanMode: EPolarPanModifierPanMode.PolarStartAngle,
    });
    const PolarZoomExtents = new PolarZoomExtentsModifier();

    // add by default these 3 modifiers
    sciChartSurface.chartModifiers.add(PolarZoomExtents, PolarPanCartesian, PolarMouseWheelZoom);

    return {
        sciChartSurface,
        controls: {
            toggleModifier: (modifier: EChart2DModifierType) => {
                const modifierToAddOrRemove = () => {
                    switch (modifier) {
                        case EChart2DModifierType.PolarArcZoom:
                            return PolarArcZoom;
                        case EChart2DModifierType.PolarCursor:
                            return PolarCursor;
                        case EChart2DModifierType.PolarDataPointSelection:
                            return PolarDataPointSelection;
                        case EChart2DModifierType.PolarLegend:
                            return PolarLegend;

                        case EChart2DModifierType.PolarMouseWheelZoom:
                            return PolarMouseWheelZoom;
                        case EChart2DModifierType.PolarMouseWheelZoom + " [Pan]":
                            return PolarMouseWheelZoomPAN;

                        case EChart2DModifierType.PolarPan + " [Cartesian]":
                            return PolarPanCartesian;
                        case EChart2DModifierType.PolarPan + " [Polar]":
                            return PolarPanPolar;

                        case EChart2DModifierType.PolarZoomExtents:
                            return PolarZoomExtents;
                        default:
                            return undefined;
                    }
                };

                const newModifier = modifierToAddOrRemove();

                if (sciChartSurface.chartModifiers.contains(newModifier)) {
                    sciChartSurface.chartModifiers.remove(newModifier, true);
                    detailTextAnnotation.text = "Select a modifier to see its info";
                } else {
                    sciChartSurface.chartModifiers.add(newModifier);
                    detailTextAnnotation.text = POLAR_MODIFIER_INFO[modifier]; // update the text
                }
            },
        },
    };
};
