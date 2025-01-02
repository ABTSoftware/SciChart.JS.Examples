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
import {
    getCachedSourceFiles,
    getSourceFiles,
    populateSourceFilesCache,
    renderSandBoxRedirect,
} from "./renderCodeSandboxRedirect";
import { oembed } from "./oembed";
import { vanillaExamplesRouter } from "./vanillaDemo/vanillaExamplesRouter";
import { EXAMPLES_PAGES } from "../components/AppRouter/examplePages";
import { EPageFramework } from "../helpers/shared/Helpers/frameworkParametrization";
import { getAvailableVariants } from "./variants";
import createEmotionCache from "../createEmotionCache";
import { exportExampleInfo } from "./exportExampleInfo";
import {
    defaultSourceFilesVariant,
    SourceFilesContext,
} from "../components/AppDetailsRouters/SourceFilesLoading/SourceFilesContext";
import { SourceFilesVariant } from "../helpers/types/types";

const port = parseInt(process.env.PORT || "3000", 10);
const host = process.env.HOST || "localhost";
const targetDir = defaultConfig.buildConfig.targetDir;

function renderPage(url: string, sourceFilesInfo: SourceFilesVariant = defaultSourceFilesVariant) {
    // Create an emotion cache for SSR
    const cache = createEmotionCache();
    const { extractCriticalToChunks, constructStyleTagsFromChunks } = createEmotionServer(cache);

    // Render the component to a string.
    const appHtml = ReactDOMServer.renderToString(
        <CacheProvider value={cache}>
            <ThemeProvider theme={customTheme}>
                <SourceFilesContext.Provider value={sourceFilesInfo}>
                    <StaticRouter location={url}>
                        <App />
                    </StaticRouter>
                </SourceFilesContext.Provider>
            </ThemeProvider>
        </CacheProvider>
    );

    // Extract the critical CSS
    const emotionChunks = extractCriticalToChunks(appHtml);
    const emotionCss = constructStyleTagsFromChunks(emotionChunks);

    // SEO tags
    const helmet = Helmet.renderStatic();

    return renderIndexHtml(appHtml, emotionCss, helmet);
}

// Prerendered pages cache structure of URL/HTML pairs
const pageHtmlCache = new Map<string, string>();

function populatePrerenderedPageCache() {
    for (let framework of Object.values(EPageFramework)) {
        // generate homepage
        const url = `/${framework}`;
        const pageHtml = renderPage(url);
        pageHtmlCache.set(url, pageHtml);

        // generate example pages
        for (let key in EXAMPLES_PAGES) {
            const exampleRoute = EXAMPLES_PAGES[key].path;
            const url = `/${framework}/${exampleRoute}`;
            const sourceFileInfo = getCachedSourceFiles(key, framework);
            const pageHtml = renderPage(url, sourceFileInfo);
            pageHtmlCache.set(url, pageHtml);

            const iFrameUrl = `/iframe/${exampleRoute}`;
            const fullScreenExampleHtml = renderPage(iFrameUrl, sourceFileInfo);
            pageHtmlCache.set(iFrameUrl, fullScreenExampleHtml);
        }
    }
}

function handleRender(req: Request, res: Response) {
    const cachedPageHtml = pageHtmlCache.get(req.url);
    if (cachedPageHtml) {
        res.send(cachedPageHtml);
    } else {
        console.log("render on demand", req.url);
        const pageHtml = renderPage(req.url);
        res.send(pageHtml);
    }
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
app.use("/services/variants", getAvailableVariants);
app.use("/services/export", exportExampleInfo);
app.use("/vanillaDemo", vanillaExamplesRouter);

const isValidFramework = (framework: EPageFramework) => Object.values(EPageFramework).includes(framework);
const getExamplePageKey = (examplePath: string) => {
    return Object.keys(EXAMPLES_PAGES).find((key) => {
        const pagePath = EXAMPLES_PAGES[key]?.path;
        return pagePath === examplePath;
    });
};

app.get("/codesandbox/:example", (req: Request, res: Response) => {
    renderSandBoxRedirect(req, res, "codesandbox");
});

// StackBlitz json endpoints
app.get("/json/list", (req: Request, res: Response) => {
    res.json({ files: [] });
});

app.get("/json/version", (req: Request, res: Response) => {
    res.json({ version: "1" });
});

app.get("/source/:example", (req: Request, res: Response) => {
    getSourceFiles(req, res);
});

app.get("/iframe/codesandbox/:example", (req: Request, res: Response) => {
    console.log("/iframe/codesandbox/:example");
    handleRender(req, res);
});

app.get("/iframe/javascript-:example", (req: Request, res: Response) => {
    const params = req.params;
    if (getExamplePageKey(params.example)) {
        return res.redirect(301, `${params.example}`);
    } else {
        console.log("/iframe/javascript-:example");
        handleRender(req, res);
    }
});

app.get("/iframe/:example?", (req: Request, res: Response) => {
    console.log("/iframe/:example?");
    handleRender(req, res);
});

app.get("/javascript-:example", (req: Request, res: Response) => {
    const params = req.params;
    if (getExamplePageKey(params.example)) {
        return res.redirect(301, `javascript/${params.example}`);
    } else {
        console.log("/javascript-:example");
        handleRender(req, res);
    }
});

// This is doing some useful things in handling framework defaults
app.get("/:example?", (req: Request, res: Response) => {
    const params = req.params;
    const exampleKey = getExamplePageKey(params.example);
    console.log(exampleKey);
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

populateSourceFilesCache()
    .then(populatePrerenderedPageCache)
    .then(() => {
        server.listen(port, () => {
            console.log(
                `Serving at http://${host}:${port} ${chalk.green("✓")}. ${chalk.red("To run in dev mode: npm run dev")}`
            );
        });
    });
