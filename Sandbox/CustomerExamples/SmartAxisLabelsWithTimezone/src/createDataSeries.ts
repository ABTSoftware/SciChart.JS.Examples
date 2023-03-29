import { IXyDataSeriesOptions, XyDataSeries, TSciChart } from 'scichart';

export const createDataSeries = (wasmContext2: TSciChart, index: number, options?: IXyDataSeriesOptions) => {
    const sigma = Math.pow(0.6, index);
    const dataSeries = new XyDataSeries(wasmContext2, options);
    for (let i = 0; i < 100; i++) {
        // 5 minutes interval from 	Sat Jan 01 2022 00:00:00 GMT+0000
        const t = 1640995200 + i * 60 * 5;
        const grow = 1 + i / 99;
        dataSeries.append(t, Math.sin((Math.PI * i) / 15) * grow * sigma);
    }
    return dataSeries;
};
