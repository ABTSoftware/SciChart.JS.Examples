import {
    AnnotationHoverModifier,
    ECursorStyle,
    EXyDirection,
    MouseWheelZoomModifier,
    ModifierMouseArgs,
    NumberRange,
    ZoomExtentsModifier,
    ZoomPanModifier,
} from "scichart";
import {
    EAnnotationVisibilityMode,
    ESnapMode,
    FreehandDrawingAnnotation,
    FreehandDrawingModifier,
} from "scichart-financial-tools";
import { createFinancialChart } from "../_shared/tradingAnnotationExampleUtils";
import { initialAnnotations } from "./initialAnnotations";

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface, xAxis } = await createFinancialChart(rootElement, {
        volatility: 0.0023,
        title: "BTC / USDT - Freehand Drawing",
        startDate: new Date("2024-01-01T00:00:00Z"),
        dataSeed: 2024,
    });

    // Jan 20 2024 00:00 UTC
    xAxis.visibleRange = new NumberRange(xAxis.visibleRange.min, 1705708800);

    const freehandDrawingModifier = new FreehandDrawingModifier({
        keepDrawingAfterComplete: true,
        pointSamplingDistancePx: 1,
    });

    const updateCursor = (isDragging = false) => {
        sciChartSurface.getMainCanvas().style.cursor = freehandDrawingModifier.isDrawing
            ? ECursorStyle.Crosshair
            : isDragging
            ? ECursorStyle.Grabbing
            : ECursorStyle.Grab;
    };

    class DrawingHoverModifier extends AnnotationHoverModifier {
        modifierMouseMove(args: ModifierMouseArgs) {
            super.modifierMouseMove(args);
            updateCursor(!!((args.nativeEvent?.buttons ?? 0) & 1));
        }

        modifierMouseDown(args: ModifierMouseArgs) {
            super.modifierMouseDown(args);
            updateCursor(args.button === 0);
        }

        modifierMouseUp(args: ModifierMouseArgs) {
            super.modifierMouseUp(args);
            updateCursor();
        }

        modifierPointerCancel(args: ModifierMouseArgs) {
            super.modifierPointerCancel(args);
            updateCursor();
        }
    }

    const zoomPanModifier = new ZoomPanModifier();
    zoomPanModifier.receiveHandledEvents = false;

    // Drawing handles stroke events before navigation modifiers receive them.
    sciChartSurface.chartModifiers.add(
        freehandDrawingModifier,
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        zoomPanModifier,
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new DrawingHoverModifier({
            enableHover: true,
            enableCursor: false,
        })
    );

    updateCursor();

    sciChartSurface.annotations.add(
        ...initialAnnotations.map(
            (options) =>
                new FreehandDrawingAnnotation({
                    ...options,
                    isEditable: true,
                    showBoxOutline: false,
                    opacity: 0.9,
                    gripVisibility: EAnnotationVisibilityMode.OnInteraction,
                })
        )
    );

    return {
        sciChartSurface,
        startDrawing: (color: string, thickness: number, opacity: number) => {
            freehandDrawingModifier.startDrawing({
                stroke: color,
                strokeThickness: thickness,
                opacity,
                isEditable: true,
                showBoxOutline: false,
                snapMode: ESnapMode.None,
                annotationsGripsRadius: 4,
                annotationsGripsStroke: color,
                gripSvgTemplate: (annotation, x, y) =>
                    `<circle cx="${x}" cy="${y}" r="${annotation.annotationsGripsRadius}" fill="${sciChartSurface.background}" stroke="${annotation.annotationsGripsStroke}" stroke-width="${thickness}" />`,
            });
            updateCursor();
        },
        stopDrawing: () => {
            freehandDrawingModifier.stopDrawing(true);
            updateCursor();
        },
        clear: () => sciChartSurface.annotations.clear(true),
        removeLast: () => {
            const annotations = sciChartSurface.annotations;
            if (annotations.size() > 0) {
                annotations.removeAt(annotations.size() - 1, true);
            }
        },
        exportAnnotations: () =>
            sciChartSurface.annotations
                .asArray()
                .filter((a): a is FreehandDrawingAnnotation => a instanceof FreehandDrawingAnnotation)
                .map((a) => ({
                    points: a.points.map((p) => ({ x: p.x, y: p.y })),
                    stroke: a.stroke,
                    strokeThickness: a.strokeThickness,
                    opacity: a.opacity,
                })),
    };
};
