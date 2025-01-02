import {
    SciChartSurface,
    NumericAxis,
    XyDataSeries,
    FastLineRenderableSeries,
    XyScatterRenderableSeries,
    EllipsePointMarker,
    NumberRange
} from "scichart";

async function initSciChart() {
    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const {sciChartSurface, wasmContext} = await SciChartSurface.create("scichart-root");

    // Create an X,Y Axis and add to the chart
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    // Create a Scatter series, and Line series and add to chart
    const scatterSeries = new XyScatterRenderableSeries(wasmContext, { 
        pointMarker: new EllipsePointMarker(wasmContext, { width: 7, height: 7, fill: "White", stroke: "SteelBlue" }),
    });
    const lineSeries = new FastLineRenderableSeries(wasmContext, { stroke: "#4083B7", strokeThickness: 2 });
    sciChartSurface.renderableSeries.add(lineSeries, scatterSeries);

    // Create and populate some XyDataSeries with static data
    // Note: you can pass xValues, yValues arrays to constructors, and you can use appendRange for bigger datasets
    const scatterData = new XyDataSeries(wasmContext, { dataSeriesName: "Cos(x)" });
    const lineData = new XyDataSeries(wasmContext, { dataSeriesName: "Sin(x)" });

    for(let i = 0; i < 1000; i++) {
        lineData.append(i, Math.sin(i*0.1));
        scatterData.append(i, Math.cos(i*0.1));
    }

    // Assign these dataseries to the line/scatter renderableseries
    scatterSeries.dataSeries = scatterData;
    lineSeries.dataSeries = lineData;

    // SciChart will now redraw with static data
    // 

    // #region ExampleA
    // Scrolling the chart by appending and manipulating xAxis.visibleRange
    
    const updateDataFunc = () => {

        // Append another data-point to the chart. We use dataSeries.count()
        // to determine the current length before appending
        const i = lineData.count();
        lineData.append(i, Math.sin(i * 0.1));
        scatterData.append(i, Math.cos(i * 0.1));

        // Apply scrolling to the chart by updating xAxis.visibleRange
        // Also see dataSeries.fifoCapacity and dataSeries.fifoSweeping for more options
        const xAxis = sciChartSurface.xAxes.get(0);
        xAxis.visibleRange = new NumberRange(i-1000, i);
    };

    // Repeat at 60Hz
    setInterval(updateDataFunc, 1000/60);
    // #endregion
}

initSciChart();
