import * as React from "react";

import { ISciChartSurfaceBase, generateGuid } from "scichart";

interface IChartComponentProps {
    initFunction: (rootElementId: string) => Promise<{ sciChartSurface: ISciChartSurfaceBase }>;
    className?: string;
    style?: React.CSSProperties;
}

// React component needed as our examples app is react.
// SciChart can be used in Angular, Vue, Blazor and vanilla JS! See our Github repo for more info
export function SciChartComponent(props: IChartComponentProps) {
    const sciChartSurfaceRef = React.useRef<ISciChartSurfaceBase>();

    const rootElementId = "chart";

    // A better approach is to generate or provide a unique root element id to avoid chart rendering collisions
    // TODO: In React 18 `useId` makes sure the same id is generated when using SSR
    // const rootElementId = React.useId();

    React.useEffect(() => {
        const chartInitializationPromise = props.initFunction(rootElementId).then(({ sciChartSurface }) => {
            sciChartSurfaceRef.current = sciChartSurface;
            return sciChartSurface;
        });

        const performCleanup = () => {
            sciChartSurfaceRef.current.delete();
            sciChartSurfaceRef.current = undefined;
        };

        return () => {
            // check if chart is already initialized or wait init to finish before deleting it
            sciChartSurfaceRef.current ? performCleanup() : chartInitializationPromise.then(performCleanup);
        };
    }, []);

    return <div id={rootElementId} className={props.className} style={props.style}/>;
}
