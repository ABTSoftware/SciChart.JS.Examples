import { NumberRange, NumericAxis, SciChartSurface } from 'scichart';

export const createChart = async (divElementId: string | HTMLDivElement) => {
    await new Promise((resolve) => {
        setTimeout(resolve, 3000);
    });
    // await new Promise((resolve) => {
    //     setTimeout(resolve, 3000);
    // });

    console.log('SciChartSurface.create');
    const { sciChartSurface, wasmContext } = await SciChartSurface.create(divElementId);

    // Create an X,Y Axis and add to the chart
    const xAxis = new NumericAxis(wasmContext);
    const yAxis = new NumericAxis(wasmContext);

    sciChartSurface.xAxes.add(xAxis);
    sciChartSurface.yAxes.add(yAxis);

    setTimeout(() => {
        xAxis.visibleRange = new NumberRange(0, 1000);
    }, 2000);

    return { sciChartSurface, startDemo: () => {} };
};
