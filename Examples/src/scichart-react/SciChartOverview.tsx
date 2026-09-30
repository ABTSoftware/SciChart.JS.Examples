"use client";

import { useContext, useRef, JSX } from "react";
import { SciChartSurface, IOverviewOptions, SciChartOverview } from "scichart";
import { IChartComponentPropsCore, IInitResult } from "./types";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";
import { SciChartReact } from "./SciChart";

/**
 * A component that creates a {@link SciChartOverview} for a chart within the parent {@link SciChartReact}
 * @remarks Should be rendered as a child of {@link SciChartReact}
 */
export const SciChartNestedOverview = (
    props: IChartComponentPropsCore<SciChartSurface, IInitResult<SciChartSurface>> & { options?: IOverviewOptions }
): JSX.Element | null => {
    const { options, ...chartComponentProps } = props;
    const initResult = useContext(SciChartSurfaceContext);
    const parentSurface = initResult?.sciChartSurface as SciChartSurface;
    const overviewRef = useRef<SciChartOverview | null>(null);
    const overviewCreatePromiseRef = useRef<Promise<SciChartOverview> | null>(null);

    const initChart = async (divElementId: string | HTMLDivElement): Promise<IInitResult<SciChartSurface>> => {
        overviewCreatePromiseRef.current = SciChartOverview.create(parentSurface, divElementId, options);
        const overview = await overviewCreatePromiseRef.current;
        overviewRef.current = overview;
        return { sciChartSurface: overview.overviewSciChartSurface };
    };

    return parentSurface ? (
        <SciChartReact
            {...chartComponentProps}
            initChart={initChart}
            onDelete={() => {
                overviewRef.current!.delete();
            }}
        />
    ) : null;
};
