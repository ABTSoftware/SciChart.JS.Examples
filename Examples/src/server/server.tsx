import * as express from "express";
import * as compression from "compression";
import { Request, Response, NextFunction } from "express";
import * as fs from "fs";
import * as chalk from "chalk";
import * as cors from "cors";
import * as React from "react";
import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
import { StaticRouter } from "react-router-dom/server";
import * as defaultConfig from "../../config/default";
import App from "../components/App";
import { customTheme } from "../theme";
import { renderIndexHtml } from "./renderIndexHtml";
import * as http from "http";
import { createSocketServer } from "./websockets";
import { api } from "./api";
import { renderCodeSandBoxRedirect } from "./renderCodeSandboxRedirect";
import { oembed } from "./oembed";
import { findMissingExamples } from "./find-missing-examples";
// import { Websocket, WebsocketBuilder } from "websocket-ts";
import * as WebSocket from "ws";

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";
const targetDir = defaultConfig.buildConfig.targetDir;

function handleRender(req: Request, res: Response) {
    if (req.query["codesandbox"]) {
        if (renderCodeSandBoxRedirect(req, res)) return;
    }
    const sheets = new ServerStyleSheets();

    // Render the component to a string.
    const html = ReactDOMServer.renderToString(
        sheets.collect(
            <ThemeProvider theme={customTheme}>
                <StaticRouter location={req.url}>
                    <App />
                </StaticRouter>
            </ThemeProvider>
        )
    );

    // SEO tags
    const helmet = Helmet.renderStatic();

    // Grab the CSS from the sheets.
    const css = sheets.toString();

    // Send the rendered page back to the client.
    res.send(renderIndexHtml(html, css, helmet));
}

const app = express();
app.use(cors());
app.use(compression({ filter: shouldCompress }));

const server = http.createServer(app);
const io = createSocketServer(server);

function shouldCompress(req: Request, res: Response) {
    if (req.headers["x-no-compression"]) {
        // don't compress responses with this request header
        return false;
    }

    // fallback to standard filter function
    return compression.filter(req, res);
}

// Server static assets
app.use(
    express.static(targetDir, {
        etag: true,
        maxAge: 0
    })
);
app.use("/api", api);
app.use("/services/oembed", oembed);
app.use("/services/findMissingExamples", findMissingExamples);

// API to fetch and store some data locally
app.get("/data", (req: Request, res: Response) => {
    const endDate = new Date(Date.now());
    const startDate = new Date();
    startDate.setMinutes(endDate.getMinutes() - 300);
    getCandles("BTCUSDT", "1m", startDate, endDate);
    getTradeStream("BTCUSDT");
    getCandleStream("BTCUSDT", "1m");
    res.send(null)
});

app.get("/close", (req: Request, res: Response) => {
    wsCandle.close();
    wsTrade.close();
    res.send(null)
});
app.get("*", (req: Request, res: Response) => {
    handleRender(req, res);
});

let wsCandle: WebSocket;
let wsTrade: WebSocket;

const getCandleStream = (symbol: string, interval: string) => {
    console.log("Connecting to binance klines for ", symbol, interval);
    let messageCount = 0

   fs.writeFile("candleData.json", "[", function(err) {
        if (err) {
            console.error(err);
        }
    });
    wsCandle = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`);

    wsCandle.on("open", () => {
        console.warn("opened getCandleStream");
    });
    wsCandle.on("close", () => {
        console.warn("closed getCandleStream");
        fs.appendFile("candleData.json", "]", function(err) {
            if (err) {
                console.error(err);
            }
        });
    });
    wsCandle.on("error", (ws: WebSocket, args: any ) => {
        console.error("error getCandleStream");
    });
    wsCandle.on("message", (message: string) => {
        const dataToAppend = !messageCount ? message : `,\n${message}`
        ++messageCount
        console.log("WebsocketBuilder message getCandleStream");

        // console.log("WebsocketBuilder getCandleStream message", ev.data);
        fs.appendFile("candleData.json", dataToAppend, function(err) {
            if (err) {
                console.error(err);
            }
        });
        // subscriber.next(parseKline(JSON.parse(ev.data)));
    });
};

const getTradeStream = (symbol: string) => {
    console.log("Connecting to binance trades for ", symbol);
    let messageCount = 0
    fs.writeFile("tradeData.json", "[", function(err) {
        if (err) {
            console.error(err);
        }
    });
    wsTrade = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@aggTrade`);
    wsTrade.on("open", () => {
        console.warn("opened getTradeStream");
    });
    wsTrade.on("close", () => {
        console.warn("closed getTradeStream");
        fs.appendFile("tradeData.json", "]", function(err) {
            if (err) {
                console.error(err);
            }
        });
        
    });
    wsTrade.on("error", () => {
        console.error("error getTradeStream");
    });
    wsTrade.on("message", (message: string) => {
        console.log("WebsocketBuilder message getTradeStream");
        const dataToAppend = !messageCount ? message : `,\n${message}`
        ++messageCount
        // console.log("WebsocketBuilder message", ev.data);
        fs.appendFile("tradeData.json", dataToAppend, function(err) {
            if (err) {
                console.error(err);
            }
        });
        // subscriber.next(parseTrade(JSON.parse(ev.data)));
    });
};

const getCandles = async (symbol: string, interval: string, startTime?: Date, endTime?: Date, limit: number = 500) => {
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
        // console.log("data", data);

        fs.writeFile("historicalCandleData.json", JSON.stringify(data), function(err) {
            if (err) {
                console.error(err);
            }
        });

        // download(data, 'restJson.txt', 'text/plain');
        // return parseCandles(data);
    } catch (err) {
        console.error(err);
    }
};

server.listen(port, () => {
    console.log(
        `Serving at http://${host}:${port} ${chalk.green("✓")}. ${chalk.red("To run in dev mode: npm run dev")}`
    );
});
