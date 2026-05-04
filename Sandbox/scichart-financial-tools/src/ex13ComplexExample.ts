import { ChannelAnnotation, DisjointChannelAnnotation, FlatBottomChannelAnnotation } from "scichart-financial-tools";
import { addDefaultTradingAnnotationModifiers, createStressAnnotationOptions, createTradingCandlestickDemo } from "./utils";

const CHANNEL_SEGMENT_PAIRS = [
    [0, 1],
    [2, 3],
    [0, 2],
    [1, 3],
] as const;

export async function ex13ComplexExample() {
    const { sciChartSurface, xAt, yAt } = await createTradingCandlestickDemo("scichart-root");

    const channel = new ChannelAnnotation({
        ...createStressAnnotationOptions(0, 4, "CHN", undefined, { segmentPairs: CHANNEL_SEGMENT_PAIRS }),
        isEditable: true,
        stroke: "#A78BFA",
        fill: "#A78BFA33",
        strokeThickness: 2,
        showMidLine: true,
        showMidPointGrips: true,
        points: [
            { x: xAt(20), y: yAt(20, 0.09) },
            { x: xAt(56), y: yAt(56, 0.03) },
            { x: xAt(20), y: yAt(20, -0.09) },
        ],
    });

    const flatBottomChannel = new FlatBottomChannelAnnotation({
        ...createStressAnnotationOptions(0, 4, "FLT", undefined, { segmentPairs: CHANNEL_SEGMENT_PAIRS }),
        isEditable: true,
        stroke: "#22D3EE",
        fill: "#22D3EE22",
        strokeThickness: 2,
        showMidLine: true,
        points: [
            { x: xAt(86), y: yAt(86, 0.07) },
            { x: xAt(124), y: yAt(124, 0.02) },
            { x: xAt(86), y: yAt(86, -0.12) },
        ],
    });

    const disjointChannel = new DisjointChannelAnnotation({
        ...createStressAnnotationOptions(0, 4, "DSJ", undefined, { segmentPairs: CHANNEL_SEGMENT_PAIRS }),
        isEditable: true,
        stroke: "#FB7185",
        fill: "#FB718522",
        strokeThickness: 2,
        showMidLine: true,
        showMidPointGrips: false,
        points: [
            { x: xAt(146), y: yAt(146, 0.1) },
            { x: xAt(176), y: yAt(176, 0.06) },
            { x: xAt(176), y: yAt(176, -0.02) },
        ],
    });

    sciChartSurface.annotations.add(channel, flatBottomChannel, disjointChannel);

    addDefaultTradingAnnotationModifiers(sciChartSurface);
    sciChartSurface.zoomExtents();

    return { sciChartSurface };
};
