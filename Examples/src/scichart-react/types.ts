import { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";
import { ISciChartSurfaceBase, SciChartSurface, TSurfaceDefinition } from "scichart";

/** Describes the core return type of a chart initialization function */
export interface IInitResult<TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase> {
    sciChartSurface: TSurface;
}

/**
 * Describes the type of a chart initialization function
 * @param rootElement the internal element that should be used to create a chart
 * @returns a Promise with the initialization result object containing the created surface reference as `sciChartSurface` property
 */
export type TInitFunction<
    TSurface extends ISciChartSurfaceBase = SciChartSurface,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> = (rootElement: string | HTMLDivElement) => Promise<TInitResult>;

/** @ignore */
export type TDivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/** @ignore */
export type TCleanupCallback = () => void;

/** @ignore */
export interface IChartComponentPropsCore<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> extends TDivProps {
    /** a component that would be rendered while the chart is being initialized */
    fallback?: ReactNode | undefined;
    /** a callback function used after the chart is initialized */
    onInit?: (initResult: TInitResult) => TCleanupCallback | void;
    /** a callback function used when the component with initialized chart is unmounted */
    onDelete?: (initResult: TInitResult) => void;
    /** a callback function used when the initialization function has thrown an error */
    onInitError?: (err?: any) => void;
    /** props passed to the inner container of the chart */
    innerContainerProps?: TDivProps;
}

/** @ignore */
export type TChartComponentPropsWithInit<
    TSurface extends ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface>
> = IChartComponentPropsCore<TSurface, TInitResult> & {
    /**
     * An initialization function which should return surface instance created on the provided root element.
     */
    initChart: TInitFunction<TSurface, TInitResult>;
    config?: never;
};

type TChartComponentPropsWithConfig<TSurface extends ISciChartSurfaceBase> = IChartComponentPropsCore<
    TSurface,
    IInitResult<TSurface>
> & {
    initChart?: never;
    /**
     * A string with chart definition or configuration object acceptable by SciChart Builder API
     */
    config: string | TSurfaceDefinition;
};

/** Describes allowed properties for {@link SciChartReact} */
export type TChartComponentProps<
    TSurface extends ISciChartSurfaceBase = SciChartSurface,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
> = TChartComponentPropsWithInit<TSurface, TInitResult> | TChartComponentPropsWithConfig<TSurface>;

export type TResolvedReturnType<TFunc extends (...args: any) => any> = Awaited<ReturnType<TFunc>>;
