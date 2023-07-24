import { CSSProperties, ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react';
import { ISciChartSurfaceBase, MemoryUsageHelper, NumericAxis, SciChartSurface, generateGuid } from 'scichart';

const createChart = async (divElementId: string) => {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    return { sciChartSurface };
};

interface IChartComponentProps {
    initChart: (rootElementId: string) => Promise<{ sciChartSurface: ISciChartSurfaceBase }>;
    className?: string;
    style?: CSSProperties;
}

function SciChart(props: IChartComponentProps) {
    const sciChartSurfaceRef = useRef<ISciChartSurfaceBase>();
    const [rootElementId] = useState(`chart-root-${generateGuid()}`);

    useEffect(() => {
        const chartInitializationPromise = props.initChart(rootElementId).then((initResult) => {
            sciChartSurfaceRef.current = initResult.sciChartSurface;
            return initResult.sciChartSurface;
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

    return <div id={rootElementId} className={props.className} style={props.style} />;
}

SciChartSurface.autoDisposeWasmContext = true;
MemoryUsageHelper.isMemoryUsageDebugEnabled = true;

function App() {
    const [drawChart, setDrawChart] = useState(true);

    const handleCheckbox: ChangeEventHandler<HTMLInputElement> = (e) => {
        setDrawChart(e.target.checked);
    };

    const handleClick: MouseEventHandler<HTMLInputElement> = () => {
        // @ts-ignore Forcing garbage collection. Could be enabled on Chromium with --js-flags="--expose-gc"
        window.gc && window.gc();

        const state = MemoryUsageHelper.objectRegistry.getState();
        console.log('state', state);
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
            {drawChart ? <SciChart initChart={createChart} style={{ width: 800, height: 600 }} /> : null}
        </div>
    );
}

export default App;
