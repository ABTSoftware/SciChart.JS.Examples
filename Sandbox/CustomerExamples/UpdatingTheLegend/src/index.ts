import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { EAxisAlignment } from 'scichart/types/AxisAlignment';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { LegendModifier } from 'scichart/Charting/ChartModifiers/LegendModifier';

async function initSciChart() {
    // LICENSING //
    // Set your license code here
    // You can get a trial license key from https://www.scichart.com/licensing-scichart-js/
    // Purchased license keys can be viewed at https://www.scichart.com/profile
    //
    // e.g.
    //
    // SciChartSurface.setRuntimeLicenseKey("YOUR_RUNTIME_KEY");
    //
    // Also, once activated (trial or paid license) having the licensing wizard open on your machine
    // will mean any or all applications you run locally will be fully licensed.

    // Create the SciChartSurface in the div 'scichart-root'
    // The SciChartSurface, and webassembly context 'wasmContext' are paired. This wasmContext
    // instance must be passed to other types that exist on the same surface.
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-root');

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) });

    const yAxis1 = new NumericAxis(wasmContext, {
        axisAlignment: EAxisAlignment.Left,
        labelStyle: { color: 'white' },
        visibleRange: new NumberRange(0, 8)
    });

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis1);

    const lineSeries1 = new FastLineRenderableSeries(wasmContext, {
        stroke: 'white',
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5],
            yValues: [3, 4, 3, 4, 3],
            dataSeriesName: 'white'
        })
    });

    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        stroke: 'red',
        dataSeries: new XyDataSeries(wasmContext, {
            xValues: [1, 2, 3, 4, 5],
            yValues: [5, 6, 5, 5, 4],
            dataSeriesName: 'red'
        })
    });

    sciChartSurface.renderableSeries.add(lineSeries1, lineSeries2);
    // To place the Legend outside of the canvas uncomment this line
    // sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: true, placementDivId: "place-for-legend" }));
    sciChartSurface.chartModifiers.add(new LegendModifier({ showCheckboxes: true }));

    setTimeout(() => {
        console.log('hide the white series');
        const checkbox1 = document.getElementById(lineSeries1.id) as HTMLInputElement;
        checkbox1.click();
        setTimeout(() => {
            console.log('show the white series back');
            checkbox1.click();
        }, 2000);
    }, 2000);
}

initSciChart();
