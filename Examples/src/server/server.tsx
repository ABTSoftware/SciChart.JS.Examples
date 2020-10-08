import * as express from "express";
import { Request, Response, NextFunction } from "express";
import * as request from "request";
import * as path from "path";
import * as fs from "fs";
import * as chalk from "chalk";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import { ServerStyleSheets, ThemeProvider } from "@material-ui/core/styles";
import { StaticRouter } from "react-router-dom";
import * as defaultConfig from "../../config/default";
import App from "../components/App";
import { customTheme } from "../theme";
import { renderIndexHtml } from "./renderIndexHtml";

// const basicAuth = require("express-basic-auth");
const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.HOST || "localhost";
const targetDir = defaultConfig.buildConfig.targetDir;

console.log("Environment port: " + process.env.PORT);

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

    // Grab the CSS from the sheets.
    const css = sheets.toString();

    // Send the rendered page back to the client.
    res.send(renderIndexHtml(html, css));
}

const app = express();
// app.use(
//     basicAuth({
//         challenge: true,
//         users: { scichart: "31415926" }
//     })
// );

// Server static assets
app.use(express.static(targetDir));

app.get("/api/test", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.use("/api/thevirustracker", (req: Request, res: Response) => {
    const apiUrl = "https://thevirustracker.com";
    const url = apiUrl + req.url;
    req.pipe(request(url)).pipe(res);
});

app.get("*", (req: Request, res: Response) => {
    handleRender(req, res);
});

app.listen(port, () => {
    console.log(
        `Serving at http://${host}:${port} ${chalk.green("✓")}. ${chalk.red("To run in dev mode: npm run dev")}`
    );
});
