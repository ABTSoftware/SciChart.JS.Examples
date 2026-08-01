"use client";

import { useRef, useState, useEffect, useContext, JSX, CSSProperties } from "react";
import { ISciChartSurfaceBase, SciChart3DSurface, SciChartDefaults, SciChartSurface, generateGuid } from "scichart";
import { SciChartSurfaceContext } from "./SciChartSurfaceContext";
import { IInitResult, TChartComponentProps, TCleanupCallback, TInitFunction } from "./types";
import { useIsMountedRef, createChartRoot, createChartFromConfig } from "./utils";
import { SciChartGroupContext } from "./SciChartGroupContext";
import { DefaultFallback, fallbackWrapperStyle } from "./DefaultFallback";
import { conflictingConfigsMessage, wrongInitResultMessage } from "./constants";

// use base URL to resolve WASM module.
// One binary carries both the 2D and the 3D engine, so this single call serves both.
SciChartSurface.configure({
    wasmUrl: "/scichart.wasm",
});

// @ts-ignore this flag is not available in some versions
SciChartDefaults.defaultLoader = false;

// @ts-ignore this flag is not available in some versions
SciChartDefaults.disableAspect = true;

function validateArgs<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>>(
    props: TChartComponentProps<TSurface, TInitResult>
) {
    const { initChart, config } = props;

    if ((!initChart && !config) || (initChart && config)) {
        throw new Error(conflictingConfigsMessage);
    }
}

function validateResult<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>>(
    result: TInitResult
) {
    if (!result.sciChartSurface) {
        throw new Error(wrongInitResultMessage);
    }
    return result;
}

function getInitFunction<TSurface extends ISciChartSurfaceBase, TInitResult extends IInitResult<TSurface>>(
    props: TChartComponentProps<TSurface, TInitResult>
) {
    const { initChart, config } = props;

    const initializationFunction = initChart
        ? initChart
        : (createChartFromConfig<TSurface>(config) as TInitFunction<TSurface, TInitResult>);
    return (rootElement: HTMLDivElement) => initializationFunction(rootElement).then(validateResult);
}

function SciChartComponent<
    TSurface extends ISciChartSurfaceBase = ISciChartSurfaceBase,
    TInitResult extends IInitResult<TSurface> = IInitResult<TSurface>
>(props: TChartComponentProps<TSurface, TInitResult>): JSX.Element {
    const { initChart, config, fallback, onInit, onDelete, onInitError, innerContainerProps, ...divElementProps } =
        props;

    validateArgs(props);

    const isMountedRef = useIsMountedRef();
    const innerContainerRef = useRef<HTMLDivElement>(null);

    const initPromiseRef = useRef<Promise<TInitResult | IInitResult<TSurface>> | undefined>(undefined);
    const initResultRef = useRef<TInitResult | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // generate guid to distinguish between effect calls in StrictMode
        const chartId = generateGuid();
        groupContext?.addChartToGroup(chartId, false, null);

        const rootElement = innerContainerRef.current;

        const chartRoot = createChartRoot();
        rootElement!.appendChild(chartRoot);

        const initializationFunction = getInitFunction(props);

        let cancelled = false;
        let cleanupCallback: void | (() => void);
        const runInit = async () => {
            try {
                const result = await initializationFunction(chartRoot);

                // check if the component was unmounted before init finished
                if (isMountedRef.current) {
                    groupContext?.addChartToGroup(chartId, true, result);
                    initResultRef.current = result;
                    setIsInitialized(true);

                    if (onInit) {
                        cleanupCallback = onInit(result);
                    }
                } else {
                    cancelled = true;
                }

                return result;
            } catch (error: any) {
                if (onInitError) {
                    onInitError(error);
                }

                groupContext?.notifyError(error);
                throw error;
            }
        };

        // workaround to handle StrictMode
        const initPromise = initPromiseRef.current ? initPromiseRef.current.then(runInit) : runInit();
        initPromiseRef.current = initPromise;

        const performCleanup = (initResult: TInitResult) => {
            if (!cancelled && cleanupCallback) {
                cleanupCallback();
                cleanupCallback = undefined;
            }

            if (!cancelled) {
                onDelete?.(initResult);
            }

            // TODO check if this is needed at all
            if (isMountedRef.current) {
                initResultRef.current = null;
                setIsInitialized(false);
            }

            groupContext?.removeChartFromGroup(chartId);
            initResult.sciChartSurface!.delete();
        };

        return () => {
            rootElement!.removeChild(chartRoot);
            // wait for init to finish before deleting it
            initPromise.then(performCleanup);
        };
    }, []);

    const groupContext = useContext(SciChartGroupContext);

    const mergedInnerContainerProps = {
        ...innerContainerProps,
        style: { height: "100%", width: "100%", ...innerContainerProps?.style },
    };

    return (
        <SciChartSurfaceContext.Provider value={initResultRef.current}>
            <div {...divElementProps} style={{ position: "relative", ...divElementProps.style }}>
                <>
                    <div {...mergedInnerContainerProps} ref={innerContainerRef} />
                    {isInitialized ? props.children : null}
                </>
                {!isInitialized ? (
                    fallback ? (
                        <div style={fallbackWrapperStyle}>{fallback}</div>
                    ) : (
                        <DefaultFallback />
                    )
                ) : null}
            </div>
        </SciChartSurfaceContext.Provider>
    );
}

/**
 * The component for rendering a chart surface.
 * There are 2 ways to setup a chart.
 * It requires a chart configuration object passed via `config` or an initialization function passed via `initChart`
 * @param props {@link TChartComponentProps}
 * @returns a React wrapper component that contains a chart
 */
export const SciChartReact = SciChartComponent;
