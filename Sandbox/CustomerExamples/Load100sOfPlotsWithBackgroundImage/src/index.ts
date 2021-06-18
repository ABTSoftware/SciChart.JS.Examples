import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { Thickness } from 'scichart/Core/Thickness';
import { NumberRange } from 'scichart/Core/NumberRange';
import { HeatmapColorMap } from 'scichart/Charting/Visuals/RenderableSeries/HeatmapColorMap';
import { UniformHeatmapDataSeries } from 'scichart/Charting/Model/UniformHeatmapDataSeries';
import { UniformHeatmapRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/UniformHeatmapRenderableSeries';

function makeRows(container: HTMLElement, rows: number, cols: number) {
    container.style.setProperty('--grid-rows', rows.toString());
    container.style.setProperty('--grid-cols', cols.toString());
    for (let c = 0; c < rows * cols; c++) {
        const cell = document.createElement('div');
        const chartNumber = (c + 1).toString();
        cell.id = 'chart' + chartNumber;
        cell.style.setProperty('background-image', `url("/hatchback.jpg")`);
        cell.style.setProperty('background-size', 'contain');
        container.appendChild(cell).className = 'grid-item';
    }
}

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

    const rows = 100;
    const cols = 3;
    const container = document.getElementById('container');
    makeRows(container, rows, cols);

    for (let c = 0; c < rows * cols; c++) {
        const chartNumber = c + 1;

        console.log('Creating chart ' + chartNumber);
        const { sciChartSurface, wasmContext } = await SciChartSurface.create(`chart${chartNumber}`);

        // Sets the chart to have a transparent background, to make the background image visible
        sciChartSurface.backgroundCompletelyTransparentEnabled = false;
        sciChartSurface.background = 'rgba(0,0,0,0)';

        sciChartSurface.padding = new Thickness(0, 0, 0, 0);

        // Add Axes
        sciChartSurface.xAxes.add(
            new NumericAxis(wasmContext, {
                isVisible: false,
                growBy: new NumberRange(0.4, 0.7)
            })
        );
        sciChartSurface.yAxes.add(
            new NumericAxis(wasmContext, {
                isVisible: false,
                growBy: new NumberRange(1, 2.5)
            })
        );

        // Add the Heatmap Chart
        const gradientStops = [
            { offset: 0, color: '#FFFF00' },
            { offset: 1, color: '#FF0000' }
        ];

        const colorMap = new HeatmapColorMap({
            minimum: 1,
            maximum: 9,
            gradientStops
        });

        const initialZValues = [
            [NaN, NaN, 1, 9],
            [9, 9, 9, 1]
        ];

        const dataSeries = new UniformHeatmapDataSeries(wasmContext, 0, 1, 0, 1, initialZValues);
        // Treat NaN values as transparent tiles
        dataSeries.hasNaNs = true;

        const heatmapSeries = new UniformHeatmapRenderableSeries(wasmContext, {
            opacity: 1,
            dataSeries,
            colorMap
        });

        sciChartSurface.renderableSeries.add(heatmapSeries);
    }
}

initSciChart();
