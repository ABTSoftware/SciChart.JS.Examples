import { EPerformanceMarkType } from "scichart";
import { TMarkType } from "./typeAliases";
import { getOperationTypeFromEndMarkType, getIsEventMarkType, getIsOperationEndMarkType } from "./MarksParsing";

export const standardMarkTypes = Array.from(Object.keys(EPerformanceMarkType)) as EPerformanceMarkType[];
export const standardOperationEndMarkTypes = standardMarkTypes.filter(getIsOperationEndMarkType);

export const standardOperationTypes = standardOperationEndMarkTypes.map(getOperationTypeFromEndMarkType);

export const standardEventMarkTypes = standardMarkTypes.filter(getIsEventMarkType);

export const axisRenderingMarkTypes: TMarkType[] = [
    EPerformanceMarkType.GetTicksStart,
    EPerformanceMarkType.DrawAxisBorderStart,
    EPerformanceMarkType.DrawAxisBandsStart,
    EPerformanceMarkType.DrawMinorGridLinesStart,
    EPerformanceMarkType.DrawMajorGridLinesStart,
    EPerformanceMarkType.DrawAxisBackgroundStart,
    EPerformanceMarkType.DrawAxisLabelsStart,
    EPerformanceMarkType.DrawMinorTicksStart,
    EPerformanceMarkType.DrawMajorTicksStart,
    EPerformanceMarkType.GetTicksEnd,
    EPerformanceMarkType.DrawAxisBorderEnd,
    EPerformanceMarkType.DrawAxisBandsEnd,
    EPerformanceMarkType.DrawMinorGridLinesEnd,
    EPerformanceMarkType.DrawMajorGridLinesEnd,
    EPerformanceMarkType.DrawAxisBackgroundEnd,
    EPerformanceMarkType.DrawAxisLabelsEnd,
    EPerformanceMarkType.DrawMinorTicksEnd,
    EPerformanceMarkType.DrawMajorTicksEnd,
];

export const annotationRenderingMarkTypes: TMarkType[] = [
    EPerformanceMarkType.DrawAnnotationStart,
    EPerformanceMarkType.DrawAnnotationEnd,
];

export const seriesRenderingMarkTypes: TMarkType[] = [
    EPerformanceMarkType.ResampleSingleSeriesStart,
    EPerformanceMarkType.DrawSingleSeriesStart,
    EPerformanceMarkType.DrawCollectionSeriesStart,
    EPerformanceMarkType.DrawDataLabelsStart,
    EPerformanceMarkType.ResampleSingleSeriesEnd,
    EPerformanceMarkType.DrawSingleSeriesEnd,
    EPerformanceMarkType.DrawCollectionSeriesEnd,
    EPerformanceMarkType.DrawDataLabelsEnd,
    EPerformanceMarkType.GenerateDataLabelsStart,
    EPerformanceMarkType.GenerateDataLabelsEnd,
    EPerformanceMarkType.PaletteProviderStart,
    EPerformanceMarkType.PaletteProviderEnd,
    EPerformanceMarkType.DataFilterStart,
    EPerformanceMarkType.DataFilterEnd,
    EPerformanceMarkType.AccumulatedVectorStart,
    EPerformanceMarkType.AccumulatedVectorEnd,
    EPerformanceMarkType.RenderDataTransformStart,
    EPerformanceMarkType.RenderDataTransformEnd,
];

export const miscMarkTypes: TMarkType[] = [
    EPerformanceMarkType.GenericAnimationStart,
    EPerformanceMarkType.AutoRangeStart,
    EPerformanceMarkType.LayoutStart,
    EPerformanceMarkType.PerformTextLayoutStart,
    EPerformanceMarkType.DrawNativeTextStart,
    EPerformanceMarkType.PostDrawActionsStart,
    EPerformanceMarkType.CopyToCanvasStart,
    EPerformanceMarkType.GenericAnimationEnd,
    EPerformanceMarkType.AutoRangeEnd,
    EPerformanceMarkType.LayoutEnd,
    EPerformanceMarkType.PerformTextLayoutEnd,
    EPerformanceMarkType.DrawNativeTextEnd,
    EPerformanceMarkType.PostDrawActionsEnd,
    EPerformanceMarkType.CopyToCanvasEnd,
];

export const bulkMarkTypes: TMarkType[] = [
    EPerformanceMarkType.RenderStart,
    EPerformanceMarkType.RenderEnd,
    EPerformanceMarkType.DrawingLoopStart,
    EPerformanceMarkType.DrawingLoopEnd,
    EPerformanceMarkType.EngineInitStart,
    EPerformanceMarkType.EngineInitEnd,
    EPerformanceMarkType.CanvasInitializationStart,
    EPerformanceMarkType.CanvasInitializationEnd,
    EPerformanceMarkType.AllLayersDrawStart,
    EPerformanceMarkType.AllLayersDrawEnd,
    EPerformanceMarkType.SingleLayerDrawStart,
    EPerformanceMarkType.SingleLayerDrawEnd,
];

// upper level
export const summaryMarkTypes: TMarkType[] = [
    EPerformanceMarkType.RenderSurfaceDrawStart,
    EPerformanceMarkType.RenderSurfaceDrawEnd,
    EPerformanceMarkType.InitializationStart,
    EPerformanceMarkType.InitializationEnd,
    EPerformanceMarkType.DataUpdateStart,
    EPerformanceMarkType.DataUpdateEnd,
    EPerformanceMarkType.SetupStart,
    EPerformanceMarkType.SetupEnd,
    EPerformanceMarkType.PointerMoveStart,
    EPerformanceMarkType.PointerMoveEnd,
    EPerformanceMarkType.PointerDownStart,
    EPerformanceMarkType.PointerDownEnd,
    EPerformanceMarkType.PointerUpStart,
    EPerformanceMarkType.PointerUpEnd,
    EPerformanceMarkType.ScrollStart,
    EPerformanceMarkType.ScrollEnd,
    EPerformanceMarkType.DoubleClickStart,
    EPerformanceMarkType.DoubleClickEnd,
    EPerformanceMarkType.MouseLeaveStart,
    EPerformanceMarkType.MouseLeaveEnd,
    EPerformanceMarkType.MouseEnterStart,
    EPerformanceMarkType.MouseEnterEnd,
];

export const standardMarkTypeCategories = {
    standardOperationTypes,
    standardEventMarkTypes,
    axisRenderingMarkTypes,
    annotationRenderingMarkTypes,
    seriesRenderingMarkTypes,
    miscMarkTypes,
    bulkMarkTypes,
    summaryMarkTypes,
};

export const standardOperationMarkTypeCategories = {
    axisRenderingMarkTypes,
    annotationRenderingMarkTypes,
    seriesRenderingMarkTypes,
    miscMarkTypes,
    bulkMarkTypes,
    summaryMarkTypes,
};

export const standardEventMarkTypeCategories = {
    standardEventMarkTypes,
};
