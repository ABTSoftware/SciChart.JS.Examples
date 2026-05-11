import {
    AnnotationHoverModifier,
    ECursorStyle,
    EObservableArrayChangedAction,
    EXyDirection,
    MouseWheelZoomModifier,
    ZoomExtentsModifier,
} from "scichart";
import {
    EAnnotationVisibilityMode,
    ESnapMode,
    FreehandDrawingAnnotation,
    FreehandDrawingModifier,
    IFreehandDrawingAnnotationOptions,
} from "scichart-financial-tools";
import { createFinancialChart, TRADING_ANNOTATION_COLORS } from "../_shared/tradingAnnotationExampleUtils";

export type TFreehandVariant = "editableOutline" | "nonEditableLine" | "thickHighlight" | "locked";

const initialAnnotationPoints = [
    [
        { x: 1705011193.3878717, y: 64468.72724223288 },
        { x: 1705091701.298787, y: 64731.83152817384 },
        { x: 1705182626.599438, y: 64991.96738381112 },
        { x: 1705283746.3193119, y: 65225.061563389245 },
        { x: 1705393873.0107985, y: 65442.87918701428 },
        { x: 1705499198.0582361, y: 65614.36033760624 },
        { x: 1705643221.452908, y: 65833.73457712222 },
        { x: 1705692414.970289, y: 65922.53408364578 },
        { x: 1705748401.3102448, y: 66054.08622661626 },
        { x: 1705772347.3061619, y: 66119.53649477549 },
        { x: 1705775095.5473561, y: 66136.04386329351 },
    ],
    [
        { x: 1704923778.5764449, y: 65514.70072021555 },
        { x: 1704939775.414341, y: 65561.79740100933 },
        { x: 1705065287.071156, y: 66001.19748669335 },
        { x: 1705197767.852811, y: 66445.77422522401 },
        { x: 1705643682.9500144, y: 67881.04647742368 },
        { x: 1705664434.763713, y: 67952.21640397293 },
        { x: 1705681152.3667524, y: 68035.36865284556 },
        { x: 1705702189.3752918, y: 68075.40626157571 },
    ],
    [
        { x: 1705179473.9001055, y: 65538.33956153634 },
        { x: 1705181771.0149152, y: 65538.33956153634 },
        { x: 1705200365.718544, y: 65621.85381410456 },
        { x: 1705305924.1072152, y: 66165.94536854768 },
        { x: 1705313665.8508062, y: 66186.07277402142 },
        { x: 1705332986.5049393, y: 65940.30846509831 },
        { x: 1705346245.4723625, y: 65852.63117003103 },
        { x: 1705365026.8489783, y: 65770.02192670174 },
        { x: 1705386349.0523586, y: 65707.72109069397 },
        { x: 1705433095.0794683, y: 65596.3325535668 },
        { x: 1705444668.8046494, y: 65580.58539280946 },
        { x: 1705447598.53347, y: 65590.79389702456 },
        { x: 1705480141.857501, y: 66128.33318457786 },
        { x: 1705498632.853915, y: 66401.93557769037 },
        { x: 1705522205.5038583, y: 66699.43021471056 },
        { x: 1705543771.4191937, y: 66934.04480981009 },
        { x: 1705558394.1364927, y: 67070.77360562724 },
        { x: 1705581054.162945, y: 67236.39029635095 },
        { x: 1705581837.1524174, y: 67203.77376338 },
        { x: 1705579695.5984302, y: 66940.05407115657 },
        { x: 1705582226.0544732, y: 66845.06430143876 },
        { x: 1705588215.146133, y: 66767.95751428214 },
        { x: 1705595065.0076761, y: 66709.49391744744 },
        { x: 1705618347.277418, y: 66560.89140041557 },
        { x: 1705627649.814593, y: 66518.06636322953 },
    ],
] as const;

const variantOptions = (variant: TFreehandVariant, background: string): IFreehandDrawingAnnotationOptions => {
    const base: IFreehandDrawingAnnotationOptions = {
        isEditable: true,
        strokeThickness: 3,
        showBoxOutline: false,
        boxOutlineStrokeDashArray: [6, 4],
        snapMode: ESnapMode.None,
        annotationsGripsRadius: 4,
        gripSvgTemplate: (annotation: any, x: number, y: number) => {
            const ann = annotation as FreehandDrawingAnnotation;
            return `<circle cx="${x}" cy="${y}" r="${ann.annotationsGripsRadius}" fill="${background}" stroke="${ann.annotationsGripsStroke}" stroke-width="${ann.strokeThickness}" />`;
        },
    };

    switch (variant) {
        case "editableOutline":
            return {
                ...base,
                stroke: TRADING_ANNOTATION_COLORS.freehand,
                annotationsGripsStroke: TRADING_ANNOTATION_COLORS.freehand,
                allowMove: true,
                showBoxOutlineOnlyWhenSelected: false,
            };
        case "locked":
            return {
                ...base,
                stroke: TRADING_ANNOTATION_COLORS.lockedFreehand,
                annotationsGripsStroke: TRADING_ANNOTATION_COLORS.lockedFreehand,
                keepAspectRatioOnResize: true,
                forcedAspectRatio: 1,
                showBoxOutlineOnlyWhenSelected: false,
            };
        case "nonEditableLine":
            return {
                ...base,
                isEditable: false,
                isSelected: false,
                stroke: TRADING_ANNOTATION_COLORS.foreground,
                strokeThickness: 2,
                showBoxOutline: false,
                gripVisibility: EAnnotationVisibilityMode.OnInteraction,
                allowMove: false,
                showBoxOutlineOnlyWhenSelected: false,
            };
        case "thickHighlight":
            return {
                ...base,
                stroke: TRADING_ANNOTATION_COLORS.warning,
                fill: `${TRADING_ANNOTATION_COLORS.warning}33`,
                annotationsGripsStroke: TRADING_ANNOTATION_COLORS.warning,
                strokeThickness: 4,
                showBoxOutlineOnlyWhenSelected: false,
            };
    }
};

export const drawExample = async (rootElement: string | HTMLDivElement) => {
    const { sciChartSurface } = await createFinancialChart(rootElement, {
        volatility: 0.0023,
        title: "BTC / USDT - Freehand Drawing",
        startDate: new Date("2024-01-01T00:00:00Z"),
        dataSeed: 2024,
    });

    const freehandDrawingModifier = new FreehandDrawingModifier({
        isDrawing: false,
        keepDrawingAfterComplete: true,
        pointSamplingDistancePx: 1.2,
        simplifyTolerancePx: 0.8,
        maxPoints: 6000,
    });

    sciChartSurface.chartModifiers.add(
        new MouseWheelZoomModifier({ xyDirection: EXyDirection.XDirection }),
        new ZoomExtentsModifier({ xyDirection: EXyDirection.XDirection }),
        new AnnotationHoverModifier({
            enableHover: true,
            enableCursor: true,
            idleCursor: ECursorStyle.Crosshair,
        }),
        freehandDrawingModifier
    );

    sciChartSurface.annotations.add(
        ...initialAnnotationPoints.map(
            (points, index) =>
                new FreehandDrawingAnnotation({
                    points: [...points],
                    isEditable: false,
                    isSelected: false,
                    allowMove: false,
                    showBoxOutline: false,
                    stroke:
                        index === 0
                            ? TRADING_ANNOTATION_COLORS.freehand
                            : index === 1
                            ? TRADING_ANNOTATION_COLORS.warning
                            : TRADING_ANNOTATION_COLORS.lockedFreehand,
                    strokeThickness: index === 1 ? 4 : 2,
                    fill: index === 1 ? `${TRADING_ANNOTATION_COLORS.warning}33` : undefined,
                    gripVisibility: EAnnotationVisibilityMode.OnInteraction,
                })
        )
    );

    return {
        sciChartSurface,
        startDrawing: (variant: TFreehandVariant, color?: string) => {
            const options = variantOptions(variant, sciChartSurface.background);
            if (color) {
                options.stroke = color;
                options.annotationsGripsStroke = color;
            }
            freehandDrawingModifier.startDrawing(options);
        },
        stopDrawing: () => freehandDrawingModifier.stopDrawing(true),
        clear: () => sciChartSurface.annotations.clear(true),
        setKeepDrawingAfterComplete: (enabled: boolean) => {
            (freehandDrawingModifier as any).keepDrawingAfterCompleteProperty = enabled;
        },
        setSampling: (pointSamplingDistancePx: number, simplifyTolerancePx: number, maxPoints: number) => {
            freehandDrawingModifier.pointSamplingDistancePx = pointSamplingDistancePx;
            (freehandDrawingModifier as any).simplifyTolerancePxProperty = simplifyTolerancePx;
            (freehandDrawingModifier as any).maxPointsProperty = maxPoints;
        },
    };
};
