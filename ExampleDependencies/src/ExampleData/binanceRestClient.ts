/**
 * Defines a price bar with Open, High, Low, Close and Date encoded as number
 */
export type TPriceBar = {
    date: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

/**
 * Parses JSON candles into TPriceBar array
 * @param candles
 */
const parseCandles = (candles: any[]): TPriceBar[] => {
    const priceBars: TPriceBar[] = [];

    candles.forEach((candle: any) => {
        const [timestamp, open, high, low, close, volume] = candle;
        const openValue = parseFloat(open);
        const highValue = parseFloat(high);
        const lowValue = parseFloat(low);
        const closeValue = parseFloat(close);
        const volumeValue = parseFloat(volume);

        priceBars.push({
            date: timestamp / 1000,
            open: openValue,
            high: highValue,
            low: lowValue,
            close: closeValue,
            volume: volumeValue
        });
    });

    return priceBars;
};

/**
 * Fetches candles from Binance Rest API
 */
const getCandles = async (
    symbol: string,
    interval: string,
    startTime?: Date,
    endTime?: Date,
    limit: number = 500
): Promise<TPriceBar[]> => {
    let url = `https://api.binance.us/api/v3/klines?symbol=${symbol}&interval=${interval}`;
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
        return [];
    }
};

export const simpleBinanceRestClient = {
    getCandles
};
