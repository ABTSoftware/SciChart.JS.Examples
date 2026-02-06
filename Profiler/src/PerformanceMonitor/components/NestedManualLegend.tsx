import { useRef, useEffect, useContext } from "react";
import { IManualLegendOptions } from "scichart";
import { SciChartSurface, LegendModifier, ELegendOrientation, ManualLegend } from "scichart";
import { ISciChartNestedLegendProps, SciChartSurfaceContext, SciChartGroupContext } from "scichart-react";
import { TDivProps } from "scichart-react/types";
export interface ISciChartNestedManualLegendProps extends TDivProps {
    options?: Omit<IManualLegendOptions, "placementDivId">;
}
export const SciChartNestedManualLegend = (props: ISciChartNestedManualLegendProps): JSX.Element | null => {
    const { options, ...divProps } = props;
    const legendPlacementDivRef = useRef<HTMLDivElement>(null);
    const initResult = useContext(SciChartSurfaceContext);
    const parentSurface = initResult?.sciChartSurface as SciChartSurface;
    useEffect(() => {
        const ml = new ManualLegend(
            {
                placementDivId: legendPlacementDivRef.current as HTMLDivElement,
                ...props?.options
            },
            parentSurface
        );
        parentSurface.invalidateElement();
        return () => {
            ml.detach();
        };
    }, [parentSurface]);

    return <div {...divProps} ref={legendPlacementDivRef}></div>;
};

export interface ISciChartExternalManualLegendProps extends TDivProps {
    options?: Omit<IManualLegendOptions, "placementDivId">;
}
export const SciChartExternalManualLegend = (props: ISciChartExternalManualLegendProps): JSX.Element | null => {
    const { options, ...divProps } = props;
    const legendPlacementDivRef = useRef<HTMLDivElement>(null);
    const context = useContext(SciChartGroupContext);
    const [initResult] = Array.from(context.charts.values()).map(({ initResult }) => initResult);
    const parentSurface = initResult?.sciChartSurface as SciChartSurface;
    useEffect(() => {
        if (parentSurface) {
            const ml = new ManualLegend(
                {
                    placementDivId: legendPlacementDivRef.current as HTMLDivElement,
                    ...props?.options
                },
                parentSurface
            );
            parentSurface.invalidateElement();
            return () => {
                ml.detach();
            };
        }

        return undefined;
    }, [parentSurface]);

    return <div {...divProps} ref={legendPlacementDivRef}></div>;
};
