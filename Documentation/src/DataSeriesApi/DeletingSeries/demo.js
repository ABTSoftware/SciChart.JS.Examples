import * as SciChart from "scichart";

const { SciChartSurface, NumericAxis, FastLineRenderableSeries, XyDataSeries, SciChartJsNavyTheme } = SciChart;

// or for npm import { SciChartSurface, ... } from "scichart"

async function dataSeriesApi(divElementId) {
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme()
    });

    sciChartSurface.title = "This example purely outputs to console";
    sciChartSurface.xAxes.add(new NumericAxis(wasmContext));
    sciChartSurface.yAxes.add(new NumericAxis(wasmContext));

    const xValues = [];
    const yValues = [];
    for (let i = 0; i < 100; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
    }

    // #region ExampleA
    // Create a DataSeries
    console.log(`Example A: Creating, clearing and deleting a dataseries`);
    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues
    });
    // Clear it - does not delete memory, just removes all data-points
    xyDataSeries.clear();
    console.log(`xyDataSeries is cleared but retains memory: ${xyDataSeries.getNativeXValues().capacity()} Datapoints`);
    // Frees memory - the data-series cannot be re-used after this
    xyDataSeries.delete();
    console.log(`xyDataSeries is deleted: ${xyDataSeries.getIsDeleted()}`);
    // #endregion

    // Create a renderableSeries and assign a dataSeries
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues
        })
    });

    // #region ExampleB
    // When re-assigning a dataseries, make sure to delete the old series
    const oldSeries = lineSeries.dataSeries;
    oldSeries.delete();
    lineSeries.dataSeries = new XyDataSeries(wasmContext, {
        xValues: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        yValues: [2.5, 3.5, 3.7, 4.0, 5.0, 5.5, 5.0, 4.0, 3.0]
    });

    console.log(`oldSeries is deleted: ${oldSeries.getIsDeleted()}`);
    console.log(`lineSeries.dataSeries is deleted: ${lineSeries.dataSeries.getIsDeleted()}`);
    // #endregion

    // #region ExampleC
    // Calling delete on a RenderableSeries will delete both the RenderableSeries and its DataSeries
    // The series is no longer usable
    lineSeries.delete();
    console.log(`lineSeries.dataSeries is now deleted`);
    // #endregion

    // Create and add a series to a chart
    const lineSeries2 = new FastLineRenderableSeries(wasmContext, {
        dataSeries: new XyDataSeries(wasmContext, {
            xValues,
            yValues
        })
    });
    sciChartSurface.renderableSeries.add(lineSeries2);

    // #region ExampleD
    // Calling Delete on a SciChartSurface will delete and free memory on all elements in this chart
    // This chart is no longer usable
    sciChartSurface.delete();
    console.log(`sciChartSurface is deleted: ${sciChartSurface.isDeleted}`);
    // #endregion
}

dataSeriesApi("scichart-root");
