import * as React from 'react';

import { FastLineRenderableSeries } from "scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries";
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { XyDataSeries } from "scichart/Charting/Model/XyDataSeries";

interface BasicChartProps {

}

export default function FullScreenChart (props: BasicChartProps) {
    console.log('Render');

    let [chartId] = React.useState('scichart-root');

    React.useEffect(() => {
        initSciChart(chartId);
    }, []);

    return (
        <>
            <div id={chartId} style={{height: '100%', width: '100%'}} />
        </>
    );
}

async function initSciChart(chartId: string) {
    // Create the SciChartSurface in the div with the given id
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChartSurface.create(chartId);
    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    // Declare a DataSeries
    const xyDataSeries = new XyDataSeries(wasmContext);
    xyDataSeries.append(1, 2);
    xyDataSeries.append(3,4);
    // Add a line series to the SciChartSurface
    const lineSeries = new FastLineRenderableSeries(wasmContext);
    lineSeries.strokeThickness = 2;
    lineSeries.stroke = "rgba(255,0,0,1)";
    lineSeries.dataSeries = xyDataSeries;

    sciChartSurface.renderableSeries.add(lineSeries);

    // zoom to fit
    sciChartSurface.zoomExtents();
}
