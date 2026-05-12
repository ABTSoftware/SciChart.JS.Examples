import {
    AnnotationHoverModifier,
    ECursorStyle,
    EObservableArrayChangedAction,
    EXyDirection,
    MouseWheelZoomModifier,
    NumberRange,
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

const generateHandDrawnTrendline = () => {
    const startX = 1705104000; // 2024-01-13 00:00 UTC
    const endX = 1705276800; // 2024-01-15 00:00 UTC
    const startY = 65000;
    const endY = 67500;
    const count = 110;
    let seed = 1337;
    const rand = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < count; i++) {
        const t = i / (count - 1);
        const drift = Math.sin(t * Math.PI * 1.6 + 0.4) * 18;
        const yJitter = (rand() - 0.5) * 16;
        const xJitter = (rand() - 0.5) * ((endX - startX) / count) * 0.35;
        points.push({
            x: startX + (endX - startX) * t + xJitter,
            y: startY + (endY - startY) * t + drift + yJitter,
        });
    }
    return points;
};

const handDrawnTrendlinePoints = generateHandDrawnTrendline();

type TInitialFreehandAnnotation = {
    points: { x: number; y: number }[];
    stroke: string;
    strokeThickness: number;
};

const initialFreehandAnnotations: TInitialFreehandAnnotation[] = [
    {
        points: [
            { x: 1705074424.9760892, y: 65731.6718827903 },
            { x: 1705075600.6684432, y: 65642.12282942746 },
            { x: 1705087445.885085, y: 65307.71857034999 },
            { x: 1705085666.0820355, y: 65356.5315837517 },
            { x: 1705081130.604812, y: 65410.78777490682 },
            { x: 1705070214.7892404, y: 65438.14998565657 },
            { x: 1705086971.8905394, y: 65356.648641337786 },
            { x: 1705090526.8496335, y: 65388.83947751397 },
            { x: 1705094908.9756804, y: 65460.77136416947 },
            { x: 1705091521.3087788, y: 65449.416778318235 },
        ],
        stroke: "#F97066",
        strokeThickness: 4,
    },
    {
        points: [
            { x: 1705025064.4852417, y: 66127.82401853298 },
            { x: 1705025394.4226215, y: 65871.17526101925 },
            { x: 1705024855.3700008, y: 65954.7251130947 },
            { x: 1705029753.3136415, y: 65982.08732384446 },
            { x: 1705035097.3697963, y: 65992.00795426602 },
            { x: 1705040343.8388386, y: 65986.09654616822 },
            { x: 1705044791.0229604, y: 65964.20677756841 },
            { x: 1705045278.9585223, y: 65933.80106958018 },
            { x: 1705043201.74713, y: 65906.67297400262 },
            { x: 1705035543.48231, y: 65873.80905670639 },
            { x: 1705027936.3345492, y: 65859.3231804271 },
            { x: 1705022132.2248645, y: 65859.11832965145 },
        ],
        stroke: "#F97066",
        strokeThickness: 4,
    },
    {
        points: [
            { x: 1705060251.609766, y: 65972.86903893946 },
            { x: 1705060688.4282691, y: 65910.50660994725 },
            { x: 1705065716.4880598, y: 65861.5180101664 },
            { x: 1705069043.7438917, y: 65854.55308379373 },
            { x: 1705070656.2547488, y: 65860.55228508111 },
            { x: 1705072877.523307, y: 65910.76998951596 },
            { x: 1705073388.6938958, y: 65974.47858074827 },
            { x: 1705080935.4305873, y: 65866.11252042063 },
        ],
        stroke: "#F97066",
        strokeThickness: 4,
    },
    {
        points: [
            { x: 1705091646.7779233, y: 65990.3691480607 },
            { x: 1705091860.5401695, y: 65928.09451225805 },
            { x: 1705094035.338674, y: 65896.19632004711 },
            { x: 1705100819.966488, y: 65890.43123393191 },
            { x: 1705104123.987293, y: 65914.89626942581 },
            { x: 1705104742.0390048, y: 65990.60326323289 },
            { x: 1705105169.5634973, y: 65837.34561863774 },
            { x: 1705103979.9301271, y: 65712.03547272283 },
            { x: 1705100095.033653, y: 65693.04287937887 },
            { x: 1705092195.1245549, y: 65700.32971411331 },
            { x: 1705088156.876904, y: 65734.97875959748 },
            { x: 1705088291.6400592, y: 65779.40211352061 },
            { x: 1705102172.2450452, y: 65854.20191103544 },
            { x: 1705112846.4163384, y: 65896.78160797758 },
        ],
        stroke: "#F97066",
        strokeThickness: 4,
    },
    {
        points: [
            { x: 1705271913.4095333, y: 68272.31899579709 },
            { x: 1705254473.1984477, y: 68281.71286708124 },
            { x: 1705243325.0326085, y: 68256.80886563948 },
            { x: 1705241071.2350128, y: 68237.43583514073 },
            { x: 1705240253.362071, y: 68204.68897543059 },
            { x: 1705263358.2726805, y: 68162.25560047108 },
            { x: 1705266676.2345016, y: 68137.556449805 },
            { x: 1705266866.7617211, y: 68104.31209535395 },
            { x: 1705263558.0939107, y: 68079.99338184268 },
            { x: 1705255137.720213, y: 68056.46480703754 },
            { x: 1705245188.4817545, y: 68058.92301634554 },
            { x: 1705237929.859395, y: 68076.89135581115 },
        ],
        stroke: "#4EC385",
        strokeThickness: 4,
    },
    {
        points: [
            { x: 1705282146.115318, y: 68129.39168317485 },
            { x: 1705292318.4100335, y: 68129.39168317485 },
            { x: 1705293675.335596, y: 68157.39771064813 },
            { x: 1705293670.6885908, y: 68187.07180872327 },
            { x: 1705292443.8791778, y: 68194.03673509593 },
            { x: 1705280305.9011989, y: 68194.82687380207 },
            { x: 1705275919.1281466, y: 68183.64787432998 },
            { x: 1705274227.6181984, y: 68106.59471828281 },
            { x: 1705277666.402159, y: 68075.6037223641 },
            { x: 1705283721.4501324, y: 68055.26496678006 },
            { x: 1705292304.4690173, y: 68053.74321816083 },
            { x: 1705297546.2910542, y: 68064.07355013373 },
        ],
        stroke: "#4EC385",
        strokeThickness: 4,
    },
    {
        points: [
            { x: 1705314953.9731023, y: 68304.74394714547 },
            { x: 1705314517.1545992, y: 68072.50169633258 },
        ],
        stroke: "#4EC385",
        strokeThickness: 4,
    },
    {
        points: [
            { x: 1705332956.4718356, y: 68300.50060964952 },
            { x: 1705332956.4718356, y: 68178.23396097307 },
            { x: 1705330897.8484647, y: 68051.95808997288 },
        ],
        stroke: "#4EC385",
        strokeThickness: 4,
    },
    {
        points: [
            { x: 1705294609.3836718, y: 67929.01836017639 },
            { x: 1705294474.6205165, y: 67825.6272472578 },
            { x: 1705285682.4863908, y: 67528.6814157308 },
            { x: 1705283005.8113081, y: 67676.43735377946 },
            { x: 1705285306.0789573, y: 67543.25508519965 },
            { x: 1705300334.4942653, y: 67679.27600024227 },
        ],
        stroke: "#4EC385",
        strokeThickness: 4,
    },
];

const variantOptions = (variant: TFreehandVariant, background: string): IFreehandDrawingAnnotationOptions => {
    const base: IFreehandDrawingAnnotationOptions = {
        isEditable: true,
        strokeThickness: 4,
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
    const { sciChartSurface, xAxis } = await createFinancialChart(rootElement, {
        volatility: 0.0023,
        title: "BTC / USDT - Freehand Drawing",
        startDate: new Date("2024-01-01T00:00:00Z"),
        dataSeed: 2024,
    });

    // Jan 20 2024 00:00 UTC
    xAxis.visibleRange = new NumberRange(xAxis.visibleRange.min, 1705708800);

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
        ...initialFreehandAnnotations.map(
            (data) =>
                new FreehandDrawingAnnotation({
                    points: data.points,
                    stroke: data.stroke,
                    strokeThickness: data.strokeThickness,
                    isEditable: true,
                    isSelected: false,
                    allowMove: true,
                    showBoxOutline: false,
                    opacity: 0.9,
                    gripVisibility: EAnnotationVisibilityMode.OnInteraction,
                })
        ),
        new FreehandDrawingAnnotation({
            points: handDrawnTrendlinePoints,
            isEditable: true,
            isSelected: false,
            allowMove: true,
            showBoxOutline: false,
            stroke: "#686c70",
            annotationsGripsStroke: "#9AA0A6",
            strokeThickness: 7,
            opacity: 0.9,
            gripVisibility: EAnnotationVisibilityMode.OnInteraction,
        })
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
                })),
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
