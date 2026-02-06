import { EPerformanceMarkType, TPerformanceDetail, TSciChartPerformanceMark } from "scichart";
import { getEntryType, getSurfacesFromData } from "./MarksParsing";
import { TMark, TSurfaceId } from "./typeAliases";

export function getRelatedSurfaceId(mark: TMark, contextInfo: ReturnType<typeof getSurfacesFromData>) {
    const { canvasToSurfaceMap } = contextInfo;

    const entryType = getEntryType(mark) as EPerformanceMarkType;

    switch (entryType) {
        case EPerformanceMarkType.SingleLayerDrawStart:
        case EPerformanceMarkType.SingleLayerDrawEnd:
        case EPerformanceMarkType.AllLayersDrawStart:
        case EPerformanceMarkType.AllLayersDrawEnd:
        case EPerformanceMarkType.CopyToCanvasStart:
        case EPerformanceMarkType.CopyToCanvasEnd:
        case EPerformanceMarkType.EngineInitStart:
        case EPerformanceMarkType.EngineInitEnd: {
            return canvasToSurfaceMap.get(mark.detail.parentContextId);
        }
        case EPerformanceMarkType.DrawNativeTextStart:
        case EPerformanceMarkType.DrawNativeTextEnd:
        // TODO this mark actually has no context data
        case EPerformanceMarkType.CanvasInitializationStart:
        case EPerformanceMarkType.CanvasInitializationEnd: {
            return canvasToSurfaceMap.get(mark.detail.contextId);
        }
        case EPerformanceMarkType.DataUpdateStart:
        case EPerformanceMarkType.DataUpdateEnd: {
            // data series could be detached and/or referenced in multiple entities
            // probably the only relation worth considering is wasmContext
            return null;
        }

        case EPerformanceMarkType.DataFilterStart:
        case EPerformanceMarkType.DataFilterEnd:
        case EPerformanceMarkType.AccumulatedVectorStart:
        case EPerformanceMarkType.AccumulatedVectorEnd:
        case EPerformanceMarkType.RenderDataTransformStart:
        case EPerformanceMarkType.RenderDataTransformEnd:
        case EPerformanceMarkType.GenerateDataLabelsStart:
        case EPerformanceMarkType.GenerateDataLabelsEnd:
        case EPerformanceMarkType.PaletteProviderStart:
        case EPerformanceMarkType.PaletteProviderEnd:
        case EPerformanceMarkType.AddSubSurfaceStart:
        case EPerformanceMarkType.AddSubSurfaceEnd:
        case EPerformanceMarkType.DrawCollectionSeriesStart:
        case EPerformanceMarkType.DrawCollectionSeriesEnd:
        case EPerformanceMarkType.ResampleSingleSeriesStart:
        case EPerformanceMarkType.ResampleSingleSeriesEnd:
        case EPerformanceMarkType.DrawSingleSeriesStart:
        case EPerformanceMarkType.DrawSingleSeriesEnd:
        case EPerformanceMarkType.DrawDataLabelsStart:
        case EPerformanceMarkType.DrawDataLabelsEnd:
        case EPerformanceMarkType.GetTicksStart:
        case EPerformanceMarkType.GetTicksEnd:
        case EPerformanceMarkType.DrawAnnotationStart:
        case EPerformanceMarkType.DrawAnnotationEnd:
        case EPerformanceMarkType.DrawAxisBorderStart:
        case EPerformanceMarkType.DrawAxisBorderEnd:
        case EPerformanceMarkType.DrawAxisBandsStart:
        case EPerformanceMarkType.DrawAxisBandsEnd:
        case EPerformanceMarkType.DrawMinorGridLinesStart:
        case EPerformanceMarkType.DrawMinorGridLinesEnd:
        case EPerformanceMarkType.DrawMajorGridLinesStart:
        case EPerformanceMarkType.DrawMajorGridLinesEnd:
        case EPerformanceMarkType.DrawAxisBackgroundStart:
        case EPerformanceMarkType.DrawAxisBackgroundEnd:
        case EPerformanceMarkType.DrawAxisLabelsStart:
        case EPerformanceMarkType.DrawAxisLabelsEnd:
        case EPerformanceMarkType.DrawMinorTicksStart:
        case EPerformanceMarkType.DrawMinorTicksEnd:
        case EPerformanceMarkType.DrawMajorTicksStart:
        case EPerformanceMarkType.DrawMajorTicksEnd: {
            return mark.detail.parentContextId;
        }

        case EPerformanceMarkType.RenderSurfaceDrawStart:
        case EPerformanceMarkType.RenderSurfaceDrawEnd:
        case EPerformanceMarkType.DrawingLoopStart:
        case EPerformanceMarkType.DrawingLoopEnd:
        case EPerformanceMarkType.GenericAnimationStart:
        case EPerformanceMarkType.GenericAnimationEnd:
        case EPerformanceMarkType.AutoRangeStart:
        case EPerformanceMarkType.AutoRangeEnd:
        case EPerformanceMarkType.LayoutStart:
        case EPerformanceMarkType.LayoutEnd:
        case EPerformanceMarkType.PerformTextLayoutStart:
        case EPerformanceMarkType.PerformTextLayoutEnd:
        case EPerformanceMarkType.PostDrawActionsStart:
        case EPerformanceMarkType.PostDrawActionsEnd:
        case EPerformanceMarkType.PointerMoveStart:
        case EPerformanceMarkType.PointerMoveEnd:
        case EPerformanceMarkType.PointerDownStart:
        case EPerformanceMarkType.PointerDownEnd:
        case EPerformanceMarkType.PointerUpStart:
        case EPerformanceMarkType.PointerUpEnd:
        case EPerformanceMarkType.ScrollStart:
        case EPerformanceMarkType.ScrollEnd:
        case EPerformanceMarkType.DoubleClickStart:
        case EPerformanceMarkType.DoubleClickEnd:
        case EPerformanceMarkType.MouseLeaveStart:
        case EPerformanceMarkType.MouseLeaveEnd:
        case EPerformanceMarkType.MouseEnterStart:
        case EPerformanceMarkType.MouseEnterEnd:
        case EPerformanceMarkType.InitializationStart:
        case EPerformanceMarkType.InitializationEnd:
        case EPerformanceMarkType.LeadingInvalidate:
        case EPerformanceMarkType.Invalidate:
        case EPerformanceMarkType.RenderStart:
        case EPerformanceMarkType.RenderEnd:
        case EPerformanceMarkType.Rendered:
        case EPerformanceMarkType.FullStateRendered:
        case EPerformanceMarkType.Painted:
        case EPerformanceMarkType.Resize:
        case EPerformanceMarkType.DpiChange:
        case EPerformanceMarkType.SetupStart:
        case EPerformanceMarkType.SetupEnd: {
            return mark.detail.contextId;
        }

        default: {
            // return false;
            const handleInvalidType = (type: never): never => {
                throw new Error(`Invalid Entry type: "${type}"!`);
            };

            return handleInvalidType(entryType);
        }
    }
}
