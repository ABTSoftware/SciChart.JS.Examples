import * as express from "express";
import * as compression from "compression";
import { Request, Response, NextFunction } from "express";
import * as bodyParser from "body-parser";

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
import { vanillaExamplesRouter } from "./vanillaDemo/vanillaExamplesRouter";
import { EXAMPLES_PAGES } from "../components/AppRouter/examplePages";
import { EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";

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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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
        maxAge: 0,
    })
);
app.use("/api", api);
app.use("/services/oembed", oembed);
app.use("/services/findMissingExamples", findMissingExamples);
app.use("/vanillaDemo", vanillaExamplesRouter);

const isValidFramework = (framework: EPageFramework) => Object.values(EPageFramework).includes(framework);
const getExamplePageKey = (examplePath: string) => {
    return Object.keys(EXAMPLES_PAGES).find((key) => {
        const pagePath = EXAMPLES_PAGES[key]?.path;
        return pagePath === examplePath;
    });
};

app.get("/codesandbox/:example", (req: Request, res: Response) => {
    handleRender(req, res);
});

app.get("/iframe/codesandbox/:example", (req: Request, res: Response) => {
    handleRender(req, res);
});

app.get("/iframe/javascript-:example", (req: Request, res: Response) => {
    const params = req.params;
    if (getExamplePageKey(params.example)) {
        return res.redirect(301, `iframe/${params.example}`);
    } else {
        handleRender(req, res);
    }
});

app.get("/iframe/:example?", (req: Request, res: Response) => {
    handleRender(req, res);
});

app.get("/javascript-:example", (req: Request, res: Response) => {
    const params = req.params;
    if (getExamplePageKey(params.example)) {
        return res.redirect(301, `javascript/${params.example}`);
    } else {
        handleRender(req, res);
    }
});

app.get("/:example?", (req: Request, res: Response) => {
    const params = req.params;
    const exampleKey = getExamplePageKey(req.params.example);
    if (isValidFramework(params.example as EPageFramework)) {
        handleRender(req, res);
    } else if (exampleKey) {
        const redirectUrl = `javascript/${params.example}`;
        res.redirect(301, redirectUrl);
    } else {
        res.redirect(301, `javascript`);
    }
});

app.get("*", (req: Request, res: Response) => {
    handleRender(req, res);
});

server.listen(port, () => {
    console.log(
        `Serving at http://${host}:${port} ${chalk.green("✓")}. ${chalk.red("To run in dev mode: npm run dev")}`
    );
});
