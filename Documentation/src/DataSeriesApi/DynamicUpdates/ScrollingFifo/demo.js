import * as SciChart from "scichart";

async function dataSeriesScrollingFifo(divElementId) {
    const {
        SciChartSurface,
        NumericAxis,
        FastLineRenderableSeries,
        XyDataSeries,
        SciChartJsNavyTheme,
        EAutoRange,
        libraryVersion
    } = SciChart;

    // or for npm import { SciChartSurface, ... } from "scichart"

    // Create a chart surface
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId, {
        theme: new SciChartJsNavyTheme(),
        title: "Scrolling Data using fifoCapacity",
        titleStyle: { fontSize: 16 }
    });

    // For the example to work, axis must have EAutoRange.Always
    sciChartSurface.xAxes.add(
        new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, axisTitle: "X Axis autoranged" })
    );
    sciChartSurface.yAxes.add(
        new NumericAxis(wasmContext, { autoRange: EAutoRange.Always, axisTitle: "Y Axis autoranged" })
    );

    // Start off with N X,Y values in the series
    const xValues = [];
    const yValues = [];
    let i = 0;
    for (; i < 1000; i++) {
        xValues.push(i);
        yValues.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
    }

    // #region ExampleA
    // Create a DataSeries
    const xyDataSeries = new XyDataSeries(wasmContext, {
        xValues,
        yValues,
        fifoCapacity: 1200 // set fifoCapacity to 1200. Requires scichart.js v3.2 or later
    });

    console.log(`version is ${libraryVersion}`);
    console.log(`dataSeries.fifoCapacity is ${xyDataSeries.fifoCapacity}`);

    // Create a renderableSeries and assign the dataSeries
    sciChartSurface.renderableSeries.add(
        new FastLineRenderableSeries(wasmContext, {
            dataSeries: xyDataSeries,
            strokeThickness: 3,
            stroke: "#50C7E0"
        })
    );

    // Now let's use a timeout to appendRange() new values every 20ms.
    // using removeRange() causes the number of points in the series to remain fixed and the chart to scroll
    const updateCallback = () => {
        const xUpdate = [];
        const yUpdate = [];
        for (let j = 0; j < 5; i++, j++) {
            xUpdate.push(i);
            yUpdate.push(0.2 * Math.sin(i * 0.1) - Math.cos(i * 0.01));
        }
        // With fifoCapacity set, just append new points.
        xyDataSeries.appendRange(xUpdate, yUpdate);
        // result: dataSeries length remains the same. point counts > fifoCapacity are discarded.
        // as x-value increases, and xAxis.autoRange zooms to fit, the chart scrolls
    };

    setTimeout(() => {
        updateCallback();
        setInterval(updateCallback, 20);
    }, 20);
    // #endregion
}

dataSeriesScrollingFifo("scichart-root");
