import { ChangeEventHandler, MouseEventHandler, useRef, useState } from 'react';
import SciChart, { SciChartComponentAPI } from './SciChart';
import { createChart } from './chart-configurations';
import { ISciChartSurfaceBase, MemoryUsageHelper, SciChartSurface } from 'scichart';

// SciChartSurface.autoDisposeWasmContext = true;
MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

//Awaited<ReturnType<TInitFunction>>['sciChartSurface']  extends ISciChartSurfaceBase
// type TChartAPI<TInitFunction> = 'sciChartSurface' keyof Awaited<ReturnType<TInitFunction>>
// ? SciChartComponentAPI<
//     Awaited<ReturnType<TInitFunction>>['sciChartSurface'],
//     Awaited<ReturnType<TInitFunction>>
//     : never
// >;
type TChartAPI = SciChartComponentAPI<
    Awaited<ReturnType<typeof createChart>>['sciChartSurface'],
    Awaited<ReturnType<typeof createChart>>
>;
function App() {
    // const chartRef = useRef<SciChartComponentAPI<TSurf, TInitResult>>(null);
    const chartRef = useRef<any>(null);
    const [drawChart, setDrawChart] = useState(true);

    const handleCheckbox: ChangeEventHandler<HTMLInputElement> = (e) => {
        setDrawChart(e.target.checked);
    };

    const handleClick: MouseEventHandler<HTMLInputElement> = () => {
        // @ts-ignore
        window.gc && window.gc();
        const state = MemoryUsageHelper.objectRegistry.getState();
        console.log('state', state);
        // chartRef.current.sciChartSurface;
        // chartRef.current.customChartProperties.startDemo();
    };

    return (
        <div className='App'>
            <header className='App-header'>
                <h1>SciChart.js with React</h1>
                <p>In this example we setup webpack, scichart, react and create a simple chart with one X and Y axis</p>
            </header>
            <input type='checkbox' checked={drawChart} onChange={handleCheckbox} /> Show Chart
            <br />
            <input type='button' onClick={handleClick} value='Log Object Registry State'></input>
            {drawChart ? <SciChart ref={chartRef} initChart={createChart} style={{ width: 800, height: 600 }} /> : null}
            {/* {drawChart ? <SciChart initChart={createChart} style={{ width: 800, height: 600 }} /> : null} */}
        </div>
    );
}

export default App;
