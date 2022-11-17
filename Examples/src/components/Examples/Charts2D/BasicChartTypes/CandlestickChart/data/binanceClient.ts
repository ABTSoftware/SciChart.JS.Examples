export type TBinanceCandleData = {
    xValues: number[];
    openValues: number[];
    highValues: number[];
    lowValues: number[];
    closeValues: number[];
    volumeValues: number[];
};

const parseCandles = (candles: any[]): TBinanceCandleData => {
    const xValues: number[] = [];
    const openValues: number[] = [];
    const highValues: number[] = [];
    const lowValues: number[] = [];
    const closeValues: number[] = [];
    const volumeValues: number[] = [];

    candles.forEach((candle: any) => {
        const [timestamp, open, high, low, close, volume] = candle;
        const openValue = parseFloat(open);
        const highValue = parseFloat(high);
        const lowValue = parseFloat(low);
        const closeValue = parseFloat(close);
        const volumeValue = parseFloat(volume);

        xValues.push(timestamp / 1000);
        openValues.push(openValue);
        highValues.push(highValue);
        lowValues.push(lowValue);
        closeValues.push(closeValue);
        volumeValues.push(volumeValue);
    });

    return { xValues, openValues, highValues, lowValues, closeValues, volumeValues };
};

const getCandles = async (
    symbol: string,
    interval: string,
    startTime?: Date,
    endTime?: Date,
    limit: number = 500
): Promise<TBinanceCandleData> => {
    let url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}`;
    if (startTime) {
        url += `&startTime=${startTime.getTime()}`;
    }
    if (endTime) {
        url += `&endTime=${endTime.getTime()}`;
    }
    if (limit) {
        url += `&limit=${limit}`;
    }
    try {
        console.log(`SimpleBinanceClient: Fetching ${symbol} ${interval} from ${startTime} to ${endTime}`);
        const response = await fetch(url);
        const data = await response.json();
        return parseCandles(data);
    } catch (err) {
        console.error(err);
        return { xValues: [], openValues: [], highValues: [], lowValues: [], closeValues: [], volumeValues: [] };
    }
};

export const simpleBinanceClient = {
    getCandles
};
