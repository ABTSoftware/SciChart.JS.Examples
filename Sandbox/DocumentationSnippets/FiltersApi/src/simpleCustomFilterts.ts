import { SciChartSurface } from 'scichart/Charting/Visuals/SciChartSurface';
import { NumericAxis } from 'scichart/Charting/Visuals/Axis/NumericAxis';
import { XyDataSeries } from 'scichart/Charting/Model/XyDataSeries';
import { XyScatterRenderableSeries } from 'scichart/Charting/Visuals/RenderableSeries/XyScatterRenderableSeries';
import { NumberRange } from 'scichart/Core/NumberRange';
import { EAutoRange } from "scichart/types/AutoRange";
import { IXyCustomFilterOptions, XyCustomFilter } from 'scichart/Charting/Model/Filters/XyCustomFilter';
import { BaseDataSeries } from 'scichart/Charting/Model/BaseDataSeries';

export async function initSciChart7() {

    const { sciChartSurface, wasmContext } = await SciChartSurface.create('scichart-div-id-7');

    sciChartSurface.xAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext, { growBy: new NumberRange(0.1, 0.1) }));
    
    // A function to get random data
    const getData = (start: number, count: number) => {
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

    // Create an instance, passing in parameters
    const rangeFilter = new RangeFilter(dataSeries, { upper: 0.5, lower: 0.1 });

    const filteredSeries = new XyScatterRenderableSeries(wasmContext, { dataSeries: rangeFilter });

    sciChartSurface.renderableSeries.add(filteredSeries);
}

// Options for the filter
interface IRangeFilterOptions extends IXyCustomFilterOptions {
    upper: number;
    lower: number;
}

// A Custom Filter that excludes data with a range
class RangeFilter extends XyCustomFilter {
    public upper = 0.66;
    public lower = 0.33;
    constructor(originalSeries: BaseDataSeries, options: IRangeFilterOptions) {
        super(originalSeries, options);
        this.upper = options?.upper ?? this.upper;
        this.lower = options?.lower ?? this.lower;
        // Using an arrow function ensures that 'this' is correct
        // Setting the property causes filterAll to be run.
        this.filterFunction = (index, y) => (y < this.lower || y > this.upper) ? y : NaN;
    }
}
