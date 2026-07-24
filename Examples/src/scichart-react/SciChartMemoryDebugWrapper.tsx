"use client";

import { ChangeEventHandler, MouseEventHandler, PropsWithChildren, useState, JSX, useCallback } from "react";
import { SciChartSurface, MemoryUsageHelper } from "scichart";

/**
 * SciChartMemoryDebugWrapper is used to help checking memory leaks related to SciChart.
 * Rendering the component enables Memory Debug Mode and adds extra UI elements to allow easily mount/unmount the child components
 * @remarks Find more info at [Memory Leak Debugging docs](https://www.scichart.com/documentation/js/current/MemoryLeakDebugging.html)
 */
export function SciChartMemoryDebugWrapper(props: PropsWithChildren<any>): JSX.Element {
    useState(() => {
        MemoryUsageHelper.isMemoryUsageDebugEnabled = true;
        SciChartSurface.autoDisposeWasmContext = true;
        SciChartSurface.wasmContextDisposeTimeout = 0;
    });

    const [drawChart, setDrawChart] = useState(false);

    const handleCheckbox: ChangeEventHandler<HTMLInputElement> = e => {
        setDrawChart(e.target.checked);
    };

    const handleClick: MouseEventHandler<HTMLInputElement> = () => {
        // @ts-ignore force garbage collection in Chrome if enabled with --js-flags="--expose-gc"
        window.gc && window.gc();
        const state = MemoryUsageHelper.objectRegistry.getState();
        console.log("state", state);
    };

    return (
        <>
            <div style={{ position: "fixed", top: 0, left: 0 }}>
                <input type="checkbox" checked={drawChart} onChange={handleCheckbox} /> Render Child Components Tree
                <br />
                <input type="button" onClick={handleClick} value="Log Object Registry State"></input>
                <br />
                {drawChart ? props.children : null}
            </div>
        </>
    );
}
