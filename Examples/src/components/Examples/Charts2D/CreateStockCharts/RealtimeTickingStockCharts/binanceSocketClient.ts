import { WebsocketBuilder } from "websocket-ts";
import { combineLatest, map, Observable, scan, skipWhile, take } from "rxjs";

// NOTE: THIS IS NOT PRODUCTION CODE, FOR DEMONSTRATION PURPOSE ONLY
//       IF USING IN PRODUCTION, USE A FULL OR OFFICIAL BINANCE / EXCHANGE LIBRARY

export type TRealtimePriceBar = {
    symbol: string;
    interval: string;
    eventTime: number;
    openTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number; // Total volume
    closeTime: number;
    lastTradeSize: number; // Last trade size
    lastTradeBuyOrSell: boolean; // When true, buy, else sell
};

export type TTrade = {
    eventTime: number;
    symbol: string;
    price: number;
    quantity: number;
    maker: boolean;
    isBuyerMaker: boolean;
    tradeId: number;
};

export const tradeToCandle = (candle: TRealtimePriceBar, curr: { trade: TTrade; firstCandle: TRealtimePriceBar }): TRealtimePriceBar => {
    candle = candle ?? curr.firstCandle;
    const trade = curr.trade;
    const price = trade.price;
    candle.lastTradeSize = trade.quantity;
    candle.lastTradeBuyOrSell = trade.isBuyerMaker;
    if (candle.closeTime > trade.eventTime) {
        // update existing candle
        candle.close = price;
        candle.volume += candle.lastTradeSize;
        if (price > candle.high) {
            candle.high = price;
        }
        if (price < candle.low) {
            candle.low = price;
        }
    } else {
        // new candle
        const candleSpan = candle.closeTime - candle.openTime;
        candle = {
            symbol: candle.symbol,
            interval: candle.interval,
            eventTime: trade.eventTime,
            openTime: candle.closeTime + 1,
            closeTime: candle.closeTime + 1 + candleSpan,
            open: price,
            high: price,
            low: price,
            close: price,
            volume: candle.lastTradeSize,
            lastTradeSize: candle.lastTradeSize,
            lastTradeBuyOrSell: candle.lastTradeBuyOrSell
        };
    }
    return candle;
};

export const parseTrade = (trade: any) => {
    // {
    //     "e": "aggTrade",  // Event type
    //     "E": 123456789,   // Event time
    //     "s": "BNBBTC",    // Symbol
    //     "a": 12345,       // Aggregate trade ID
    //     "p": "0.001",     // Price
    //     "q": "100",       // Quantity
    //     "f": 100,         // First trade ID
    //     "l": 105,         // Last trade ID
    //     "T": 123456785,   // Trade time
    //     "m": true,        // Is the buyer the market maker?
    //     "M": true         // Ignore
    //   }
    const t: TTrade = {
        symbol: trade.s,
        eventTime: trade.E,
        price: parseFloat(trade.p),
        quantity: parseFloat(trade.q),
        maker: false,
        isBuyerMaker: trade.m,
        tradeId: trade.a
    };
    return t;
};

const parseKline = (kline: any) => {
    // {
    //     "e": "kline",     // Event type
    //     "E": 123456789,   // Event time
    //     "s": "BNBBTC",    // Symbol
    //     "k": {
    //       "t": 123400000, // Kline start time
    //       "T": 123460000, // Kline close time
    //       "s": "BNBBTC",  // Symbol
    //       "i": "1m",      // Interval
    //       "f": 100,       // First trade ID
    //       "L": 200,       // Last trade ID
    //       "o": "0.0010",  // Open price
    //       "c": "0.0020",  // Close price
    //       "h": "0.0025",  // High price
    //       "l": "0.0015",  // Low price
    //       "v": "1000",    // Base asset volume
    //       "n": 100,       // Number of trades
    //       "x": false,     // Is this kline closed?
    //       "q": "1.0000",  // Quote asset volume
    //       "V": "500",     // Taker buy base asset volume
    //       "Q": "0.500",   // Taker buy quote asset volume
    //       "B": "123456"   // Ignore
    //     }
    //   }
    const pb: TRealtimePriceBar = {
        symbol: kline.s,
        eventTime: kline.E,
        openTime: kline.k.t,
        interval: kline.k.i,
        open: parseFloat(kline.k.o),
        high: parseFloat(kline.k.h),
        low: parseFloat(kline.k.l),
        close: parseFloat(kline.k.c),
        volume: parseFloat(kline.k.v),
        closeTime: kline.k.T,
        lastTradeSize: parseFloat(kline.k.v),
        lastTradeBuyOrSell: undefined,
    };
    return pb;
};

/**
 * Super simple binance websocket client.  No connection sharing or connection recovery
 * Usage:
 * const subscription = getCandleStream("BTCUSDT", "1m").subscribe(priceBar => { // do something });
 * // when finished
 * subscription.unsubscribe();
 * Valid intervals are 1s, 1m, 3m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d, 3d, 1w, 1M
 */
const getCandleStream = (symbol: string, interval: string) => {
    const obs = new Observable<TRealtimePriceBar>(subscriber => {
        console.log("Connecting to binance klines for ", symbol, interval);
        const ws = new WebsocketBuilder(`wss://stream.binance.us:9443/ws/${symbol.toLowerCase()}@kline_${interval}`)
            // .onOpen((i, ev) => { console.log("opened") })
            // .onClose((i, ev) => { console.log("closed") })
            // .onError((i, ev) => { console.log("error") })
            .onMessage((i, ev) => {
                subscriber.next(parseKline(JSON.parse(ev.data)));
            })
            .build();

        return () => ws.close();
    });
    return obs;
};

const getTradeStream = (symbol: string) => {
    const obs = new Observable<TTrade>(subscriber => {
        console.log("Connecting to binance trades for ", symbol);
        const ws = new WebsocketBuilder(`wss://stream.binance.us:9443/ws/${symbol.toLowerCase()}@aggTrade`)
            // .onOpen((i, ev) => { console.log("opened") })
            // .onClose((i, ev) => { console.log("closed") })
            // .onError((i, ev) => { console.log("error") })
            .onMessage((i, ev) => {
                subscriber.next(parseTrade(JSON.parse(ev.data)));
            })
            .build();

        return () => ws.close();
    });
    return obs;
};

const getRealtimeCandleStream = (symbol: string, interval: string) => {
    const trade$ = getTradeStream(symbol);
    const latestCandle$ = getCandleStream(symbol, interval).pipe(take(1));
    // TODO add a timer continuation to latestCandle$ so it keeps emmitting empty candles on openTime
    // Use these to create new candles from previous in tradeToCandle
    return combineLatest([trade$, latestCandle$]).pipe(
        skipWhile(([trade, candle]) => trade.eventTime < candle.eventTime),
        scan(
            (acc: TRealtimePriceBar, cur: [TTrade, TRealtimePriceBar]) => tradeToCandle(acc, { trade: cur[0], firstCandle: cur[1] }),
            null
        )
    );
};

export const binanceSocketClient = {
    getCandleStream,
    getTradeStream,
    getRealtimeCandleStream
};
