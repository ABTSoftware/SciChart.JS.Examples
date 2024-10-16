import express from "express";
import cors from "cors";
import compression from "compression";
import { Request, Response } from "express";
import * as bodyParser from "body-parser";
import chalk from "chalk";
import * as React from "react";
import { Helmet } from "react-helmet";
import * as ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { ThemeProvider } from "@mui/material/styles";
import App from "../components/App";
import { customTheme } from "../theme";
import { renderIndexHtml } from "./renderIndexHtml";
import * as defaultConfig from "../../config/default";
import * as http from "http";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import createEmotionServer from "@emotion/server/create-instance";
import { createSocketServer } from "./websockets";
import { api } from "./api";
import { getSourceFiles, renderCodeSandBoxRedirect } from "./renderCodeSandboxRedirect";
import { oembed } from "./oembed";
import { findMissingExamples } from "./find-missing-examples";
import { vanillaExamplesRouter } from "./vanillaDemo/vanillaExamplesRouter";
import { EXAMPLES_PAGES } from "../components/AppRouter/examplePages";
import { EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";
import { getAvailableVariants } from "./variants";

// Create an emotion cache for SSR
const cache = createCache({ key: "css" });
const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";
const targetDir = defaultConfig.buildConfig.targetDir;

function handleRender(req: Request, res: Response) {
    if (req.query["codesandbox"]) {
        if (renderCodeSandBoxRedirect(req, res, "codesandbox")) return;
    }

    // Render the component to a string.
    const appHtml = ReactDOMServer.renderToString(
        <CacheProvider value={cache}>
            <ThemeProvider theme={customTheme}>
                <StaticRouter location={req.url}>
                    <App />
                </StaticRouter>
            </ThemeProvider>
        </CacheProvider>
    );

    // Extract the critical CSS
    const emotionChunks = extractCriticalToChunks(appHtml);
    const emotionCss = constructStyleTagsFromChunks(emotionChunks);

    // SEO tags
    const helmet = Helmet.renderStatic();

    // Send the rendered page back to the client with the CSS.
    res.send(renderIndexHtml(appHtml, emotionCss, helmet));
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
        return false;
    }
    return compression.filter(req, res);
}

app.use(express.static(targetDir, { etag: true, maxAge: 0 }));
app.use("/api", api);
app.use("/services/oembed", oembed);
app.use("/services/findMissingExamples", findMissingExamples);
app.use("/services/variants", getAvailableVariants);
app.use("/vanillaDemo", vanillaExamplesRouter);

const isValidFramework = (framework: EPageFramework) => Object.values(EPageFramework).includes(framework);
const getExamplePageKey = (examplePath: string) => {
    return Object.keys(EXAMPLES_PAGES).find((key) => {
        const pagePath = EXAMPLES_PAGES[key]?.path;
        return pagePath === examplePath;
    });
};

app.get("/codesandbox/:example", (req: Request, res: Response) => {
    renderCodeSandBoxRedirect(req, res, "codesandbox");
});

app.get("/stackblitz/:example", (req: Request, res: Response) => {
    renderCodeSandBoxRedirect(req, res, "stackblitz");
});

app.get("/source/:example", (req: Request, res: Response) => {
    getSourceFiles(req, res);
});

app.get("/iframe/iframe/:example", (req: Request, res: Response) => {
    const params = req.params;
    if (getExamplePageKey(params.example)) {
        return res.redirect(301, `../${params.example}`);
    } else {
        handleRender(req, res);
    }
});

app.get("/iframe/codesandbox/:example", (req: Request, res: Response) => {
    handleRender(req, res);
});

app.get("/iframe/javascript-:example", (req: Request, res: Response) => {
    const params = req.params;
    if (getExamplePageKey(params.example)) {
        return res.redirect(301, `${params.example}`);
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
        const redirectUrl = `react/${params.example}`;
        res.redirect(301, redirectUrl);
    } else {
        res.redirect(301, `react`);
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
