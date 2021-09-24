import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { XyScatterRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { EAutoRange } from "scichart/types/AutoRange";
import { XyCustomFilter } from 'scichart/Charting/Model/Filters/XyCustomFilter';

export async function initSciChart6() {

    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id-6');

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    
    // A function to get random data
    const getData = (start, count) => {
        let xValues = [];
        let yValues = [];
        for (let i = start; i < start + count; i++) {
            xValues.push(i);
            yValues.push(Math.random());       
        }
        return { xValues, yValues };
    };

    // Original Data
    const dataSeries = new XyDataSeries(wasmContext, getData(0, 1000));

    // A function to exclude the middle thrid of the data
    // Return NaN for data you want to exclude
    const midRangeFilter = (index, y) => (y < 0.33 || y > 0.66) ? y : NaN;
    //const myFilter = new RangeFilter(dataSeries, { upper: 0.5, lower: 0.1 });

    // Create the filter, passing in the original series
    const customFilter = new XyCustomFilter(dataSeries, { filterFunction: midRangeFilter });
    const filteredSeries = new XyScatterRenderableSeries(wasmContext, { dataSeries: customFilter });

    sciChartSurface.renderableSeries.add(filteredSeries);
}

class RangeFilter extends XyCustomFilter {
    constructor(originalSeries, options) {
        super(originalSeries, options);
        this.upper = options.upper ?? 0.66;
        this.lower = options.lower ?? 0.33;
        // Using an arrow function ensures that 'this' is correct
        // Setting the property causes filterAll to be run.
        this.filterFunction = (index, y) => (y < this.lower || y > this.upper) ?  y : NaN;
    }
}
