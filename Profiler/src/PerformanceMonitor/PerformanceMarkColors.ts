import { EPerformanceMarkType } from "scichart";
import { TMarkType } from "./data/typeAliases";
import {
    standardEventMarkTypes,
    standardOperationEndMarkTypes,
    standardOperationTypes
} from "./data/markTypeCategories";
import { getOperationTypeFromEndMarkType, getIsOperationEndMarkType } from "./data/MarksParsing";

// TODO add some values for custom marks
const colorPalette: string[] = [];

export const performanceMarkColorMap: Partial<Record<EPerformanceMarkType, string>> = {
    [EPerformanceMarkType.EngineInitEnd]: "purple",
    [EPerformanceMarkType.InitializationEnd]: "orange",
    [EPerformanceMarkType.CanvasInitializationEnd]: "orange",
    [EPerformanceMarkType.SetupEnd]: "green",
    [EPerformanceMarkType.DataUpdateEnd]: "red",
    [EPerformanceMarkType.LeadingInvalidate]: "yellow",
    [EPerformanceMarkType.Invalidate]: "violet",
    [EPerformanceMarkType.RenderEnd]: "pink",
    [EPerformanceMarkType.Rendered]: "teal",
    [EPerformanceMarkType.FullStateRendered]: "lime",
    [EPerformanceMarkType.Resize]: "brown",
    [EPerformanceMarkType.DpiChange]: "skyblue",
    [EPerformanceMarkType.RenderSurfaceDrawEnd]: "lightcoral",
    [EPerformanceMarkType.DrawingLoopEnd]: "darkorange",
    [EPerformanceMarkType.GenericAnimationEnd]: "royalblue",
    [EPerformanceMarkType.AutoRangeEnd]: "mediumvioletred",
    [EPerformanceMarkType.LayoutEnd]: "darkkhaki",
    [EPerformanceMarkType.GetTicksEnd]: "darkcyan",
    [EPerformanceMarkType.DrawAxisBorderEnd]: "coral",
    [EPerformanceMarkType.DrawAxisBandsEnd]: "mediumseagreen",
    [EPerformanceMarkType.DrawMinorGridLinesEnd]: "indigo",
    [EPerformanceMarkType.DrawMajorGridLinesEnd]: "darkmagenta",
    [EPerformanceMarkType.DrawAxisBackgroundEnd]: "slateblue",
    [EPerformanceMarkType.DrawAxisLabelsEnd]: "olivedrab",
    [EPerformanceMarkType.DrawMinorTicksEnd]: "firebrick",
    [EPerformanceMarkType.DrawMajorTicksEnd]: "tomato",
    [EPerformanceMarkType.DrawNativeTextEnd]: "deepskyblue",
    [EPerformanceMarkType.DrawAnnotationEnd]: "plum",
    [EPerformanceMarkType.ResampleSingleSeriesEnd]: "saddlebrown",
    [EPerformanceMarkType.DrawSingleSeriesEnd]: "palevioletred",
    [EPerformanceMarkType.DrawCollectionSeriesEnd]: "lightgreen",
    [EPerformanceMarkType.PerformTextLayoutEnd]: "peachpuff",
    [EPerformanceMarkType.DrawDataLabelsEnd]: "khaki",
    [EPerformanceMarkType.PostDrawActionsEnd]: "powderblue",
    [EPerformanceMarkType.GenerateDataLabelsEnd]: "#FF6F61",
    [EPerformanceMarkType.PaletteProviderEnd]: "lightpink",
    [EPerformanceMarkType.DataFilterEnd]: "#3A7BD5",
    [EPerformanceMarkType.AccumulatedVectorEnd]: "#FF914D",
    [EPerformanceMarkType.RenderDataTransformEnd]: "#A259FF"
};

/** Creates entries where Operation Mark Type keys are trimmed (e.i. <DrawDataLabels, color>) */
const standardOperationTypesColorMapEntries: Array<[string, string]> = standardOperationEndMarkTypes.map(markType => [
    getOperationTypeFromEndMarkType(markType),
    performanceMarkColorMap[markType]
]);

const standardEventTypesColorMapEntries: Array<[string, string]> = standardEventMarkTypes.map(markType => [
    markType,
    performanceMarkColorMap[markType]
]);
export const markTypeColorMap = new Map(
    standardOperationTypesColorMapEntries.concat(standardEventTypesColorMapEntries)
);

export const getSeriesColor = (markType: TMarkType) => {
    const isStandardOperationType = standardOperationTypes.includes(markType);
    const isStandardMarkType = EPerformanceMarkType[markType] || isStandardOperationType;

    const isOperationEndMarkType = getIsOperationEndMarkType(markType);

    const parsedMarkType = isOperationEndMarkType ? getOperationTypeFromEndMarkType(markType) : markType;
    const hasPredefinedColor = markTypeColorMap.has(parsedMarkType);

    if (isStandardMarkType && !hasPredefinedColor) {
        console.warn(`Missing a color mapping for a standard mark type ${markType}.`);
    }

    return hasPredefinedColor
        ? markTypeColorMap.get(parsedMarkType)
        : colorPalette[(Math.random() * 10) % colorPalette.length];
};
