import { ChangeEventHandler, MouseEventHandler, PropsWithChildren, useState } from 'react';
import { SciChartSurface, MemoryUsageHelper } from 'scichart';

export default function SciChartMemoryDebugWrapper(props: PropsWithChildren<any>) {
    SciChartSurface.autoDisposeWasmContext = true;
    SciChartSurface.wasmContextDisposeTimeout = 0;
    MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

    const [drawChart, setDrawChart] = useState(false);

    const handleCheckbox: ChangeEventHandler<HTMLInputElement> = (e) => {
        setDrawChart(e.target.checked);
    };

    const handleClick: MouseEventHandler<HTMLInputElement> = () => {
        // @ts-ignore
        window.gc && window.gc();
        const state = MemoryUsageHelper.objectRegistry.getState();
        console.log('state', state);
    };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <input type='checkbox' checked={drawChart} onChange={handleCheckbox} /> Show Chart
            <br />
            <input type='button' onClick={handleClick} value='Log Object Registry State'></input>
            <br />
            {drawChart ? props.children : null}
        </div>
    );
}
