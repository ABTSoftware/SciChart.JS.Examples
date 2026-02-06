import React, { useMemo } from "react";
import {
    checkboxesFeature,
    CheckedState,
    FeatureImplementation,
    hotkeysCoreFeature,
    selectionFeature,
    syncDataLoaderFeature,
    TreeInstance,
    TreeState
} from "@headless-tree/core";
import { useTree } from "@headless-tree/react";
import cx from "classnames";
import "./TreeStyles.css";

import { getSeriesColor } from "../PerformanceMarkColors";
import ShowEyeButton from "./EyeIconButton";
export type DemoItem = {
    name: string;
    children?: string[];
    leavesCount?: number;
    seriesCount: number;
    dataPointEntriesCount: number;
    // number of data points of this specific type
};

const wait = (ms: number) =>
    new Promise(resolve => {
        setTimeout(resolve, ms);
    });

export const createDemoData = (data: Record<string, DemoItem>) => {
    const syncDataLoader = {
        getItem: (id: string) => data[id],
        getChildren: (id: string) => data[id]?.children ?? []
    };

    const asyncDataLoader = {
        getItem: (itemId: string) => wait(500).then(() => data[itemId]),
        getChildren: (itemId: string) => wait(800).then(() => data[itemId]?.children ?? [])
    };

    return { data, syncDataLoader, asyncDataLoader };
};

const getAllLoadedDescendants = <T,>(tree: TreeInstance<T>, itemId: string): string[] => {
    if (!tree.getConfig().isItemFolder(tree.getItemInstance(itemId))) {
        return [itemId];
    }
    return tree
        .retrieveChildrenIds(itemId)
        .map(child => [itemId, ...getAllLoadedDescendants(tree, child)])
        .flat();
};

export const CollapsibleTreeList = (props: {
    initialState?: Partial<TreeState<DemoItem>>;
    dataTree: Record<string, DemoItem>;
    onCheckedChanged: (itemId: string, checked: CheckedState) => void;
    onShowButtonClick: (itemName: string, higlighted: boolean) => void;
}) => {
    const { initialState, dataTree, onCheckedChanged } = props;

    const { syncDataLoader } = createDemoData(dataTree);

    const checkboxOverride: FeatureImplementation<DemoItem> = {
        itemInstance: {
            getCheckedState: ({ item, tree }) => {
                const { checkedItems } = tree.getState();
                const itemId = item.getId();

                if (item.isFolder()) {
                    const descendants = getAllLoadedDescendants(tree, itemId);
                    if (descendants.every(d => checkedItems.includes(d))) {
                        return CheckedState.Checked;
                    }
                    if (descendants.some(d => checkedItems.includes(d))) {
                        return CheckedState.Indeterminate;
                    }
                }

                if (checkedItems.includes(itemId)) {
                    return CheckedState.Checked;
                }

                return CheckedState.Unchecked;
            },
            toggleCheckedState: ({ item, tree }) => {
                const itemId = item.getId();
                if (item.getCheckedState() === CheckedState.Checked) {
                    if (!item.isFolder()) {
                        item.setUnchecked();
                    } else {
                        const descendants = getAllLoadedDescendants(tree, itemId);
                        tree.applySubStateUpdate("checkedItems", items =>
                            items.filter(id => !descendants.includes(id))
                        );
                    }
                } else if (!item.isFolder()) {
                    item.setChecked();
                } else {
                    tree.applySubStateUpdate("checkedItems", items =>
                        Array.from(new Set([...items, ...getAllLoadedDescendants(tree, itemId)]))
                    );
                }
                onCheckedChanged(itemId, item.getCheckedState());
            }
        }
    };

    const tree = useTree<DemoItem>({
        rootItemId: "root",
        initialState,
        getItemName: item => item.getItemData().name,
        isItemFolder: item => !!item.getItemData().children,
        dataLoader: syncDataLoader,
        canCheckFolders: true,
        propagateCheckedState: false, // we implement our own propagation logic in the override feature
        indent: 20,
        features: [syncDataLoaderFeature, selectionFeature, checkboxesFeature, hotkeysCoreFeature, checkboxOverride]
    });

    const { leavesCount, seriesCount, dataPointEntriesCount } = dataTree["root"];

    return (
        <>
            <div style={{ fontStyle: "bold", fontSize: "1.5em" }}>Mark types selector</div>
            <div>
                Total number of leaves/series/marks: {[leavesCount, seriesCount, dataPointEntriesCount].join("/")}
            </div>
            <div {...tree.getContainerProps()} className="tree">
                {tree.getItems().map(item => {
                    const itemId = item.getId();
                    const { leavesCount, seriesCount, dataPointEntriesCount } = dataTree[itemId];

                    return (
                        <div className="outeritem" key={item.getId()}>
                            <button {...item.getProps()} style={{ paddingLeft: `${item.getItemMeta().level * 20}px` }}>
                                <div
                                    style={{ display: "flex" }}
                                    className={cx("treeitem", {
                                        focused: item.isFocused(),
                                        expanded: item.isExpanded(),
                                        selected: item.isSelected(),
                                        folder: item.isFolder()
                                    })}
                                >
                                    {!item.isFolder() ? (
                                        <div
                                            style={{
                                                aspectRatio: "1 / 1",
                                                height: "100%",
                                                marginRight: "4px",
                                                backgroundColor: getSeriesColor(itemId)
                                            }}
                                        ></div>
                                    ) : null}
                                    {`${item.getItemName()} (${[leavesCount, seriesCount, dataPointEntriesCount].join(
                                        "/"
                                    )})`}
                                </div>
                            </button>

                            <ShowEyeButton
                                onClick={(highlighted: boolean) => props.onShowButtonClick(itemId, highlighted)}
                            />
                            <input type="checkbox" {...item.getCheckboxProps()} />
                        </div>
                    );
                })}
            </div>
        </>
    );
};
