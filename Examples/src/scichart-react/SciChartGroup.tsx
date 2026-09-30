"use client";

import { PropsWithChildren, useEffect, useState, JSX } from "react";
import { SciChartGroupContext } from "./SciChartGroupContext";
import { IInitResult } from "./types";

export type TSciChartGroupProps = PropsWithChildren<{
    onInit?: (chartInitResults: IInitResult[]) => void;
    onDelete?: (chartInitResults: IInitResult[]) => void;
    onInitError?: (error: any) => void;
}>;

/**
 * Provides a common context for multiple wrapped {@link SciChartReact} elements.
 * Accepts callbacks used after all of chart within group are initialized and when they are unmounted.
 */
export const SciChartGroup = (props: TSciChartGroupProps): JSX.Element => {
    const { onInit, onDelete } = props;

    const [groupState, setGroupState] = useState<{
        groupInitialized: boolean;
        charts: Map<any, { isInitialized: boolean; initResult: IInitResult | null }>;
    }>({
        groupInitialized: false,
        charts: new Map()
    });

    const addChartToGroup = (chart: any, isInitialized: boolean, initResult: IInitResult | null) => {
        groupState.charts.set(chart, { isInitialized, initResult });
        const groupInitialized =
            groupState.charts.size > 0 &&
            Array.from(groupState.charts.values()).every(({ isInitialized }) => isInitialized);
        setGroupState({ groupInitialized, charts: groupState.charts });
    };

    const removeChartFromGroup = (chart: any) => {
        groupState.charts.delete(chart);
        const groupInitialized =
            groupState.charts.size > 0 &&
            Array.from(groupState.charts.values()).every(({ isInitialized }) => isInitialized);
        setGroupState({ groupInitialized, charts: groupState.charts });
    };

    const notifyError = (error: any) => {
        return props?.onInitError?.(error);
    }

    const contextState = { ...groupState, addChartToGroup, removeChartFromGroup, notifyError };

    useEffect(() => {
        if (onInit && groupState.groupInitialized) {
            const initResults = Array.from(groupState.charts.values()).map(
                ({ initResult }) => initResult
            ) as IInitResult[];
            onInit(initResults);
        }
    }, [groupState.groupInitialized]);

    useEffect(() => {
        if (onDelete && groupState.groupInitialized) {
            const initResults = Array.from(groupState.charts.values()).map(
                ({ initResult }) => initResult
            ) as IInitResult[];

            return () => {
                onDelete(initResults);
            };
        }
        return undefined;
    }, [groupState.groupInitialized]);

    return <SciChartGroupContext.Provider value={contextState}>{props.children}</SciChartGroupContext.Provider>;
};
