import { EPerformanceMarkType } from "scichart";
import {
    TSurfaceId,
    TSubSurfaceId,
    TCanvasId,
    TWasmContextId,
    TMarkType,
    TRenderableSeriesId,
    TDataSeriesId,
    TMark
} from "./typeAliases";

const delimiter = "_";

export const getEntryType = (entry: TMark) => {
    const [type] = entry.name.split(delimiter);
    return type as TMarkType;
};

export const getRelatedStartMarkType = (markType: TMarkType) => markType.replace("End", "Start") as TMarkType;

export const getIsOperationStartMarkType = (markType: TMarkType) => markType.endsWith("Start");
export const getIsOperationEndMarkType = (markType: TMarkType) => markType.endsWith("End");
export const getIsEventMarkType = (markType: TMarkType) => !markType.endsWith("End") && !markType.endsWith("Start");

export const getOperationTypeFromEndMarkType = (markType: TMarkType) => markType.replace("End", "");

export function getSurfacesFromData(marksByTypeMap: Map<TMarkType, TMark[]>) {
    // // TODO potentially check where custom ids or their absence may be an issue
    // const surfaceInitializationStartMarks = marksByTypeMap.get(EPerformanceMarkType.InitializationStart);
    // const surfacesCreatedWithId = surfaceInitializationStartMarks.filter((mark) => mark.detail.contextId);

    // At the initialization end a surface should definitely have an id (custom or generated)
    const surfaceInitializationEndMarks = marksByTypeMap.get(EPerformanceMarkType.InitializationEnd) ?? [];

    const renderSurfaceDrawEndMarks = marksByTypeMap.get(EPerformanceMarkType.RenderSurfaceDrawEnd) ?? [];

    // if (!surfaceInitializationEndMarks || surfaceInitializationEndMarks.length === 0) {
    //     throw new Error("Missing chart init data!");
    // }

    const surfaceIdsFromInitData = surfaceInitializationEndMarks.map(mark => mark.detail.contextId) as TSurfaceId[];
    const surfaceIdsFromRenderData = renderSurfaceDrawEndMarks.map(mark => mark.detail.contextId) as TSurfaceId[];

    const mainSurfaceIds = Array.from(new Set(surfaceIdsFromInitData.concat(surfaceIdsFromRenderData)));

    const subSurfaceInitializationEndMarks = marksByTypeMap.get(EPerformanceMarkType.AddSubSurfaceEnd) ?? [];
    const drawingLoopEndMarks = marksByTypeMap.get(EPerformanceMarkType.DrawingLoopEnd) ?? [];
    const subSurfaceDrawingLoopEndMarks = drawingLoopEndMarks.filter(
        mark => !mainSurfaceIds.includes(mark.detail.contextId)
    );

    const subSurfaceIdsFromInitData = subSurfaceInitializationEndMarks.map(mark => mark.detail.contextId);
    const subSurfaceIdsFromRenderData = subSurfaceDrawingLoopEndMarks.map(mark => mark.detail.contextId);

    const subSurfaceIds = Array.from(new Set(subSurfaceIdsFromInitData.concat(subSurfaceIdsFromRenderData)));

    // // At least types are more descriptive then "string, string[]" IMO
    // const surfaceIdsMap = new Map<TSurfaceId, TSubSurfaceId[]>(mainSurfaceIds.map((id) => [id, [] as TSubSurfaceId[]]));
    // subSurfaceInitializationEndMarks.forEach((mark) => {
    //     surfaceIdsMap.get(mark.detail.parentContextId).push(mark.detail.contextId);
    // });

    // At least types are more descriptive then "string, string" IMO
    const subSurfaceToParentMap = new Map<TSubSurfaceId, TSurfaceId>(
        subSurfaceInitializationEndMarks.map(mark => [mark.detail.contextId, mark.detail.parentContextId])
    );

    if (subSurfaceIds.length !== subSurfaceIdsFromInitData.length) {
        subSurfaceDrawingLoopEndMarks.forEach(mark => {
            if (!subSurfaceToParentMap.has(mark.detail.contextId)) {
                subSurfaceToParentMap.set(mark.detail.contextId, mark.detail.parentContextId);
            }
        });
    }

    const subChartsPerSurface = new Map<TSurfaceId, TSubSurfaceId[]>(
        mainSurfaceIds.map(surfaceId => [
            surfaceId,
            subSurfaceIds.filter(subSurfaceId => subSurfaceToParentMap.get(subSurfaceId) === surfaceId)
        ])
    );

    const canvasToSurfaceMap = new Map<TCanvasId, TSurfaceId>(
        surfaceInitializationEndMarks.map(mark => [mark.detail.parentContextId, mark.detail.contextId])
    );

    renderSurfaceDrawEndMarks.forEach(mark => {
        if (!canvasToSurfaceMap.has(mark.detail.parentContextId)) {
            canvasToSurfaceMap.set(mark.detail.parentContextId, mark.detail.contextId);
        }
    });

    const engineInitializationEndMarks = marksByTypeMap.get(EPerformanceMarkType.EngineInitEnd) ?? [];

    const allWasmContextIdsSet = new Set(engineInitializationEndMarks.map(mark => mark.detail.contextId));
    const allWasmContextIds = Array.from(allWasmContextIdsSet.values());

    const enginePreinitializationEndMarks = engineInitializationEndMarks.filter(mark => !mark.detail.parentContextId);

    const preinitializedWasmContextIdsSet = new Set(enginePreinitializationEndMarks.map(mark => mark.detail.contextId));
    const preinitializedWasmContextIds = Array.from(preinitializedWasmContextIdsSet.values());

    const marksWithCanvasId = engineInitializationEndMarks.filter(mark => mark.detail.parentContextId);

    // singleSurfaceIds are the same as their wasmContext IDs
    const singleSurfaceIds = marksWithCanvasId
        .filter(mark => canvasToSurfaceMap.get(mark.detail.parentContextId) === mark.detail.contextId)
        .map(({ detail }) => detail.contextId);

    const multiSurfaceSignatureMarks = marksWithCanvasId.filter(
        mark => canvasToSurfaceMap.get(mark.detail.parentContextId) !== mark.detail.contextId
    );

    const multiSurfaceIds = multiSurfaceSignatureMarks.map(({ detail }) => detail.contextId);

    const multiSurfaceWithWasmIdTuple = multiSurfaceSignatureMarks.map(({ detail }) => [
        detail.contextId,
        detail.parentContextId
    ]) as [TSurfaceId, TWasmContextId][];

    const surfaceToWasmContextMap = new Map<TSurfaceId, TWasmContextId>(
        multiSurfaceWithWasmIdTuple.concat(singleSurfaceIds.map(id => [id, id]))
    );

    const dataSeriesIdsSet = new Set<TDataSeriesId>();
    const dataSeriesUpdateStartMarks = marksByTypeMap.get(EPerformanceMarkType.DataUpdateStart) ?? [];
    dataSeriesUpdateStartMarks?.forEach(mark => {
        dataSeriesIdsSet.add(mark.detail.contextId);
    });

    const dataSeriesIds = Array.from(dataSeriesIdsSet.values());

    return {
        mainSurfaceIds,
        multiSurfaceIds,
        singleSurfaceIds,
        subSurfaceIds,
        allWasmContextIds,
        preinitializedWasmContextIds,
        subSurfaceToParentMap,
        subChartsPerSurface,
        canvasToSurfaceMap,
        surfaceToWasmContextMap,
        dataSeriesIds
    };
}
