import Binance, { CandleChartResult, CandleChartInterval_LT, CandlesOptions } from "binance-api-node";

const client = Binance();

const parseCandles = (candles: CandleChartResult[]) => {
    const xValues: number[] = [];
    const openValues: number[] = [];
    const highValues: number[] = [];
    const lowValues: number[] = [];
    const closeValues: number[] = [];

    candles.forEach((candle: CandleChartResult) => {
        const { openTime, open, high, low, close } = candle;
        const openValue = parseFloat(open);
        const highValue = parseFloat(high);
        const lowValue = parseFloat(low);
        const closeValue = parseFloat(close);

        xValues.push(openTime / 1000);
        openValues.push(openValue);
        highValues.push(highValue);
        lowValues.push(lowValue);
        closeValues.push(closeValue);
    });

    return { xValues, openValues, highValues, lowValues, closeValues };
};

export const getBinanceCandles = async (symbol: string, interval: CandleChartInterval_LT, startDate: Date, endDate: Date) => {
    const options: CandlesOptions = {
        symbol,
        interval,
        limit: 500
    }
    if (startDate) {
        options.startTime = startDate.getTime();
    }
    if (endDate) {
        options.endTime = endDate.getTime();
    }
    const candles = await client.candles(options);

    return parseCandles(candles);
};