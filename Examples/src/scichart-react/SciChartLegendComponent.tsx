"use client";

import { useContext, useRef, JSX, useEffect } from "react";
import { SciChartSurface, LegendModifier, ILegendModifierOptions } from "scichart";
import { TDivProps } from "./types";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";

export interface ISciChartNestedLegendProps extends TDivProps {
    options?: Omit<ILegendModifierOptions, "placementDivId">;
}

/**
 * @experimental This is a draft version of the component. Recommended to use only as a reference.
 *
 * A component for placing an external placement Legend within {@link SciChartReact}.
 * Adds a corresponding {@link LegendModifier} to the surface.
 *
 * @remarks The component is intended to be used as a child component of {@link SciChartReact}
 *
 * @param props {@link ISciChartNestedLegendProps} - are propagated to the underlying div element which which will be used as root for the legend
 * @returns legend {@link JSX.Element}
 */
export const SciChartNestedLegend = (props: ISciChartNestedLegendProps): JSX.Element | null => {
    const { options, ...divProps } = props;
    const legendPlacementDivRef = useRef<HTMLDivElement>(null);
    const initResult = useContext(SciChartSurfaceContext);
    const parentSurface = initResult?.sciChartSurface as SciChartSurface;
    useEffect(() => {
        const legendModifier = new LegendModifier({
            ...props?.options,
            placementDivId: legendPlacementDivRef.current as HTMLDivElement
        });

        parentSurface.chartModifiers.add(legendModifier);

        return () => {
            parentSurface.chartModifiers.remove(legendModifier, true);
        };
    }, [parentSurface]);

    return <div {...divProps} ref={legendPlacementDivRef}></div>;
};
