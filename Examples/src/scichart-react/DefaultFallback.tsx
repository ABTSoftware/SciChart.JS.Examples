"use client";

import { useEffect, useRef, JSX, CSSProperties } from "react";
import { DefaultSciChartLoader, SciChartSurfaceBase } from "scichart";

export const DefaultFallback = (): JSX.Element => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const rootElement = rootRef.current as HTMLDivElement;
        const loader = new DefaultSciChartLoader();
        const loaderDiv = loader.addChartLoader(rootElement, SciChartSurfaceBase.DEFAULT_THEME);

        return () => {
            if (rootElement) {
                loader.removeChartLoader(rootElement, loaderDiv);
            }
        };
    }, []);

    return (
        <div
            ref={rootRef}
            style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                top: 0,
                left: 0,
                textAlign: "center",
                background: SciChartSurfaceBase.DEFAULT_THEME.sciChartBackground
            }}
        />
    );
};


/** @ignore */
export const fallbackWrapperStyle: CSSProperties = {
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 0,
    left: 0,
    zIndex: 12
};
