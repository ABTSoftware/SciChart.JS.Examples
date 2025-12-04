import { IPointMetadata, EPerformanceMarkType, TSciChartPerformanceData } from "scichart";
import {
    getEntryType,
    getSurfacesFromData,
    getIsEventMarkType,
    getIsOperationEndMarkType,
    getIsOperationStartMarkType
} from "./MarksParsing";
import { TMark, TMarkType, TSurfaceId } from "./typeAliases";
import { ProfilerConfigurator } from "../ProfilerConfigurator";
import { standardEventMarkTypes, standardMarkTypes } from "./markTypeCategories";

export type TCustomMetadata = IPointMetadata & {
    isHovered: boolean;
    name: string;
    duration: number;
};

export type StatsRangeDataEntry = {
    start: number;
    end: number;
};

export type StatsEventDataEntry = {
    start: number;
};

export type StatsDataEntry = StatsRangeDataEntry | StatsEventDataEntry;

type ResultData = {
    [key in EPerformanceMarkType]: StatsRangeDataEntry[] | StatsEventDataEntry[];
};

const configurator = new ProfilerConfigurator();

export function getAllData(rawPerformanceData: TSciChartPerformanceData[]) {
    const data = rawPerformanceData.map(calculatePerformanceData);
    const mergedMarkTypes = data.reduce((acc, data) => acc.concat(data.markTypes), []) as EPerformanceMarkType[];
    const markTypesSet = new Set(mergedMarkTypes);
    const markTypes = Array.from(markTypesSet);

    // here we define an operation to be described by 2 instants
    const operationStartMarkTypes = markTypes.filter(getIsOperationStartMarkType);
    const operationEndMarkTypes = markTypes.filter(getIsOperationEndMarkType);
    const operationMarkTypes = [...operationStartMarkTypes, ...operationEndMarkTypes];

    // while an event is a single instant
    const eventMarkTypes = markTypes.filter(getIsEventMarkType);

    const customOperationMarkTypes = operationMarkTypes.filter(markType => !standardMarkTypes.includes(markType));
    const customEventMarkTypes = eventMarkTypes.filter(markType => !standardEventMarkTypes.includes(markType));

    if (markTypes.some(markType => !EPerformanceMarkType[markType])) {
        console.warn("Dataset has custom mark types!");
    }
    return {
        data,
        markTypes,
        operationMarkTypes,
        eventMarkTypes,
        operationStartMarkTypes,
        operationEndMarkTypes,
        customOperationMarkTypes,
        customEventMarkTypes
    };
}
export type TAllData = ReturnType<typeof getAllData>;
export type TDataEntry = TAllData["data"][number];

const calculatePerformanceData = (rawData: TSciChartPerformanceData) => {
    const { marks: allMarks, timeOrigin } = rawData;
    const marksByTypeMap = new Map<TMarkType, TMark[]>();
    allMarks.forEach(mark => {
        const markType = getEntryType(mark);

        if (marksByTypeMap.has(markType)) {
            marksByTypeMap.get(markType).push(mark);
        } else {
            marksByTypeMap.set(markType, [mark]);
        }
    });

    const markTypes = Array.from(marksByTypeMap.keys()) as TMarkType[];

    // here we define an operation to be described by 2 instants
    const operationStartMarkTypes = markTypes.filter(getIsOperationStartMarkType);
    const operationEndMarkTypes = markTypes.filter(getIsOperationEndMarkType);
    const operationMarkTypes = [...operationStartMarkTypes, ...operationEndMarkTypes];

    // while an event is a single instant
    const eventMarkTypes = markTypes.filter(getIsEventMarkType);

    if (operationMarkTypes.length + eventMarkTypes.length !== markTypes.length) {
        throw new Error("Mark type categorization error!");
    }

    if (operationStartMarkTypes.length !== operationEndMarkTypes.length) {
        throw new Error("Odd operation mark types number!");
    }

    const statsContextInfo = getSurfacesFromData(marksByTypeMap);

    console.log(
        "statsContextInfo.canvasToSurfaceMap.keys()",
        statsContextInfo.canvasToSurfaceMap.size,
        Array.from(statsContextInfo.canvasToSurfaceMap.entries())
    );

    const statsBySurfaceAndMarkType = new Map<TSurfaceId, Map<TMarkType, StatsDataEntry[]>>(
        statsContextInfo.mainSurfaceIds
            .concat(statsContextInfo.subSurfaceIds)
            .map(id => [
                id,
                new Map(
                    operationEndMarkTypes.concat(eventMarkTypes).map(markType => [markType, [] as StatsDataEntry[]])
                )
            ])
    );

    const otherStatsByMarkType = new Map<TMarkType, StatsDataEntry[]>();

    operationEndMarkTypes.forEach(markType => {
        const relatedMarkType = markType.replace("End", "Start") as TMarkType;

        const endMarks = marksByTypeMap.get(markType);
        const startMarks = marksByTypeMap.get(relatedMarkType);

        const startMarksByIdMap = new Map<string, TMark>(
            startMarks.map(mark => {
                if (!mark.detail) {
                    console.log("mark", mark);
                }
                return [mark.detail.relatedId, mark];
            })
        );

        if (endMarks.length !== startMarks.length) {
            throw new Error("Odd operation marks number!");
        }

        endMarks.forEach(endMark => {
            const startMark = startMarksByIdMap.get(endMark.detail.relatedId);
            if (!startMark) {
                throw new Error(`Missing startMark entry: ${markType}!`);
            }

            const statsEntry = {
                start: timeOrigin + startMark.startTime,
                end: timeOrigin + endMark.startTime,
                detail: endMark.detail
            };

            const surfaceId = configurator.getRelatedSurfaceId(endMark, statsContextInfo);
            if (surfaceId) {
                const mainSurfaceId = statsContextInfo.subSurfaceToParentMap.get(surfaceId) ?? surfaceId;
                statsBySurfaceAndMarkType.get(mainSurfaceId).get(markType).push(statsEntry);
            } else if (otherStatsByMarkType.has(markType)) {
                otherStatsByMarkType.get(markType).push(statsEntry);
            } else {
                otherStatsByMarkType.set(markType, [statsEntry]);
            }
        });
    });

    eventMarkTypes.forEach(markType => {
        const marks = marksByTypeMap.get(markType);

        marks.forEach(mark => {
            const statsEntry = {
                start: timeOrigin + mark.startTime,
                detail: mark.detail
            };

            const surfaceId = configurator.getRelatedSurfaceId(mark, statsContextInfo);
            if (surfaceId) {
                const mainSurfaceId = statsContextInfo.subSurfaceToParentMap.get(surfaceId) ?? surfaceId;
                statsBySurfaceAndMarkType.get(mainSurfaceId).get(markType).push(statsEntry);
            } else if (otherStatsByMarkType.has(markType)) {
                otherStatsByMarkType.get(markType).push(statsEntry);
            } else {
                otherStatsByMarkType.set(markType, [statsEntry]);
            }
        });
    });

    return {
        timeOrigin,
        statsBySurfaceAndMarkType,
        otherStatsByMarkType,
        markTypes,
        operationStartMarkTypes,
        operationEndMarkTypes,
        operationMarkTypes,
        eventMarkTypes,
        statsContextInfo
    };
};
