import { generateGuid, SciChartSurface } from "scichart";
import { getPerformanceInfoChartInitFunction } from "../charts/Performance/PerformanceInfoChartConfig";
import { TResolvedReturnType } from "scichart-react";
import { standardEventMarkTypeCategories, standardOperationMarkTypeCategories } from "../data/markTypeCategories";
import { CollapsibleTreeList, DemoItem } from "./CollapsibleTreeList";
import { getIsEventMarkType, getIsOperationEndMarkType } from "../data/MarksParsing";
import { TMarkType } from "../data/typeAliases";
import { IRenderableSeries } from "scichart";
import { CheckedState } from "@headless-tree/core";

type TMarkTypesGroup = { [k: string]: TMarkType[] | TMarkTypesGroup };

export const CustomReactLegend = (props: {
    surface: SciChartSurface;
    data: TResolvedReturnType<TResolvedReturnType<typeof getPerformanceInfoChartInitFunction>>["processedData"];
}) => {
    const { surface, data } = props;
    const { customOperationMarkTypes, customEventMarkTypes } = data;

    const topLevelCategories = {
        standardOperationMarkTypeCategories,
        standardEventMarkTypeCategories,
        customOperationMarkTypes,
        customEventMarkTypes
    };

    const dataTree = parseMarkCategories(topLevelCategories, surface);

    const initialState = {
        expandedItems: Object.keys(topLevelCategories),
        checkedItems: Object.keys(dataTree)
    };

    const toggleSeriesVisibility = (item: string, checked: CheckedState) => {
        const getNodeMarks = (nodeId: string) => {
            const childNodes = dataTree[nodeId].children;
            return childNodes ? childNodes.flatMap(getNodeMarks) : [nodeId];
        };

        const seriesTypes = getNodeMarks(item);

        const [overviewSubSurface, absoluteAxisSubSurface, ...statsSubSurfaces] = surface.subCharts;
        statsSubSurfaces.forEach(subSurface => {
            subSurface.renderableSeries.asArray().forEach(series => {
                seriesTypes.forEach(seriesType => {
                    if (series.id.startsWith(seriesType)) {
                        series.isVisible = checked === CheckedState.Checked;
                    }
                });
            });
        });
    };

    const toggleSeriesHighlight = (item: string, highlight: boolean) => {
        const seriesTypes = findSeriesToToggleHighlight(item, dataTree);
        const [overviewSubSurface, absoluteAxisSubSurface, ...statsSubSurfaces] = surface.subCharts;
        statsSubSurfaces.forEach(subSurface => {
            subSurface.renderableSeries.asArray().forEach(series => {
                seriesTypes.forEach(seriesType => {
                    if (series.id.startsWith(seriesType)) {
                        series.opacity = highlight ? 0.8 : 0.5;
                    }
                });
            });
        });
    };

    return (
        <div
            style={{
                width: "100%",
                height: "90vh",
                maxHeight: "90vh",
                boxSizing: "border-box",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "16px",
                overflowY: "auto"
            }}
        >
            <CollapsibleTreeList
                initialState={initialState}
                dataTree={dataTree}
                onCheckedChanged={toggleSeriesVisibility}
                onShowButtonClick={toggleSeriesHighlight}
            />
        </div>
    );
};

const parseMarkCategories = (topLevelCategories: TMarkTypesGroup, surface: SciChartSurface) => {
    const allSeries = surface.subCharts
        .filter(sc => sc.id.startsWith("SubSurfaceForThread"))
        .flatMap(subSurface => subSurface.renderableSeries.asArray());

    const markTypeToSeriesMap = new Map<string, IRenderableSeries[]>();

    allSeries.forEach(series => {
        const markType = series.id.split("-").shift().replace("End", "");
        if (markTypeToSeriesMap.has(markType)) {
            markTypeToSeriesMap.get(markType).push(series);
        } else {
            markTypeToSeriesMap.set(markType, [series]);
        }
    });

    const getTotalDataPointsNumber = (seriesGroup: IRenderableSeries[]) =>
        seriesGroup.reduce((sum, series) => {
            const [seriesType] = series.id.split("-");
            const dataEntriesCount = getIsOperationEndMarkType(seriesType)
                ? series.dataSeries.count() / 2
                : series.dataSeries.count();
            return sum + dataEntriesCount;
        }, 0);

    const getMarksEntriesStats = (markTypes: string[]) => {
        const seriesInCategory = markTypes.flatMap(markType => markTypeToSeriesMap.get(markType) ?? []);

        const dataPointEntriesCount = getTotalDataPointsNumber(seriesInCategory);

        const seriesCount = seriesInCategory.length;

        return { seriesCount, dataPointEntriesCount };
    };

    const getStatsOfIntermediateNode = (children: string[], parsedDescendants: Record<string, DemoItem>) => {
        const leavesCount = children.reduce((acc, category) => acc + parsedDescendants[category].leavesCount, 0);
        const seriesCount = children.reduce((acc, category) => acc + parsedDescendants[category].seriesCount, 0);
        const dataPointEntriesCount = children.reduce(
            (acc, category) => acc + parsedDescendants[category].dataPointEntriesCount,
            0
        );

        return { leavesCount, seriesCount, dataPointEntriesCount };
    };

    const parseGroup = (group: TMarkTypesGroup) => {
        return Object.entries(group).reduce((acc, [key, markTypesCategory]) => {
            // Check if markTypesCategory is bottom level group (folder) with actual mark types as leaves.
            // Otherwise they are an intermediate group.
            // TODO I realized it would be actually better to have all markTypeCategories as Records instead of array
            if (Array.isArray(markTypesCategory)) {
                // parse mark types and dedupe operation Start&End into a single type
                const markOperationTypes = markTypesCategory
                    .filter(getIsOperationEndMarkType)
                    .map(v => v.replace("End", ""));
                const eventMarkTypes = markTypesCategory.filter(getIsEventMarkType);
                const children = markOperationTypes.concat(eventMarkTypes);

                // add this node as final folder
                acc[key] = { name: key, children, leavesCount: children.length, ...getMarksEntriesStats(children) };

                // and then add its leaves
                children.forEach(name => {
                    acc[name] = { name, ...getMarksEntriesStats([name]) };
                });
            } else {
                // Parse descendants of an intermediate group node
                const parsedDescendants = parseGroup(markTypesCategory);
                Object.assign(acc, parsedDescendants);

                const children = Object.keys(markTypesCategory);
                console.warn("children", children);

                // set node props
                acc[key] = { name: key, children, ...getStatsOfIntermediateNode(children, parsedDescendants) };
            }

            return acc;
        }, {} as Record<string, DemoItem>);
    };

    const topLevelCategoryKeys = Object.keys(topLevelCategories);
    const visibleNodes = parseGroup(topLevelCategories);

    const dataTree: Record<string, DemoItem> = {
        root: {
            name: "root",
            children: topLevelCategoryKeys,
            ...getStatsOfIntermediateNode(topLevelCategoryKeys, visibleNodes)
        },
        ...visibleNodes
    };

    return dataTree;
};

const findSeriesToToggleHighlight = (id: string, dataTree: Record<string, DemoItem>) => {
    const getAllRelatedSeriesTypes = (itemId: string): TMarkType[] => {
        const treeNode = dataTree[itemId];
        if (treeNode.children) {
            return treeNode.children.flatMap(getAllRelatedSeriesTypes);
        }

        return [itemId];
    };

    return getAllRelatedSeriesTypes(id);
};
