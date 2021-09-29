import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { FastLineRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/FastLineRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { CategoryAxis } from "scichart/Charting/Visuals/Axis/CategoryAxis";

export async function initSciChart4() {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id-4');
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0, 0.1) }));

    const xAxis = new CategoryAxis(wasmContext, { 
        // Rotation is in degrees clockwise
        rotation: 90, 
        // Turn up the number of major ticks (default is 10)
        maxAutoTicks: 30, 
        // Turn off minor gridlines, since majors are now closer together
        drawMinorGridLines: false 
    });
    sciChartSurface.xAxes.add(xAxis);

    const dataSeries = new XyDataSeries(wasmContext);
    const startTime = new Date(2020,0,1).getTime() / 1000;
    for (let y = 0; y < 50; y++) {
        const x = startTime + y * 24 * 60 * 60;
        dataSeries.append(x, y);
    }
    
    const lineSeries = new FastLineRenderableSeries(wasmContext, { dataSeries });
    sciChartSurface.renderableSeries.add(lineSeries);
    
}
