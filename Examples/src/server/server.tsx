import * as express from "express";
import * as compression from "compression";
import { Request, Response, NextFunction } from "express";
import * as request from "request";
import * as chalk from "chalk";
import * as cors from "cors";
import * as React from "react";
import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
import { StaticRouter } from "react-router-dom";
import * as defaultConfig from "../../config/default";
import App from "../components/App";
import { customTheme } from "../theme";
import { renderIndexHtml } from "./renderIndexHtml";
import * as http from "http";
import { createSocketServer } from "./websockets";
import { tq3080_DSM_2M } from "./Data/tq3080_DSM_2M";
import { candlesADAUSDT } from "./BinanceData/candlesADAUSDT";
import { TBinanceQueryParams } from "./types/TBinanceQueryParams";
import { candlesBTCUSDT } from "./BinanceData/candlesBTCUSDT";
import { TBinanceCandleData } from "../commonTypes/TBinanceCandleData";
import { candlesDOGEUSDT } from "./BinanceData/candlesDOGEUSDT";
import { candlesETHUSDT } from "./BinanceData/candlesETHUSDT";
import { candlesXRPUSDT } from "./BinanceData/candlesXRPUSDT";

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";
const targetDir = defaultConfig.buildConfig.targetDir;

function handleRender(req: Request, res: Response) {
    const sheets = new ServerStyleSheets();
    const context = {};

    // Render the component to a string.
    const html = ReactDOMServer.renderToString(
        sheets.collect(
            <ThemeProvider theme={customTheme}>
                <StaticRouter location={req.url} context={context}>
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

app.get("/api/license", (req, res) => {
    const domainLicense = process.env.SCLICENSE;
    console.log("returning license: " + domainLicense);
    res.send(domainLicense);
});

app.get("/api/lidarData", (req, res) => {
    console.log("returning lidar data");
    res.send(tq3080_DSM_2M);
});

app.get("/api/get-binance-candles", (req, res) => {
    const params = req.query as TBinanceQueryParams;
    let data: TBinanceCandleData;
    switch (params.symbol) {
        case "ADAUSDT":
            data = candlesADAUSDT;
            break;
        case "BTCUSDT":
            data = candlesBTCUSDT;
            break;
        case "DOGEUSDT":
            data = candlesDOGEUSDT;
            break;
        case "ETHUSDT":
            data = candlesETHUSDT;
            break;
        case "XRPUSDT":
            data = candlesXRPUSDT;
            break;
    }
    res.send(data);
});

app.use("/api/thevirustracker", (req: Request, res: Response) => {
    const apiUrl = "https://thevirustracker.com";
    const url = apiUrl + req.url;
    req.pipe(request(url)).pipe(res);
});

app.get("*", (req: Request, res: Response) => {
    handleRender(req, res);
});

server.listen(port, () => {
    console.log(
        `Serving at http://${host}:${port} ${chalk.green("✓")}. ${chalk.red("To run in dev mode: npm run dev")}`
    );
});
