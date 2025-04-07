import { Router, static as makeStaticRouter, Request, Response } from "express";
import * as defaultConfig from "../../../config/default";
import { api } from "../api";
import { oembed } from "./oembed";
import { getAvailableVariants } from "./variants";
import { exportExampleInfo } from "./exportExampleInfo";
import { vanillaExamplesRouter } from "../vanillaDemo/vanillaExamplesRouter";
import { EXAMPLES_PAGES } from "../../components/AppRouter/examplePages";
import { EPageFramework } from "../../helpers/shared/Helpers/frameworkParametrization";
import { getSourceFiles, renderSandBoxRedirect } from "../renderCodeSandboxRedirect";
import { handleRender } from "../services/pageRender";

const targetDir = defaultConfig.buildConfig.targetDir;

export const mainRouter = Router();

mainRouter.use(makeStaticRouter(targetDir, { etag: true, maxAge: 0 }));
mainRouter.use("/api", api);
mainRouter.use("/services/oembed", oembed);
mainRouter.use("/services/variants", getAvailableVariants);
mainRouter.use("/services/export", exportExampleInfo);
mainRouter.use("/vanillaDemo", vanillaExamplesRouter);

const isValidFramework = (framework: EPageFramework) => Object.values(EPageFramework).includes(framework);
const getExamplePageKey = (examplePath: string) => {
    return Object.keys(EXAMPLES_PAGES).find((key) => {
        const pagePath = EXAMPLES_PAGES[key]?.path;
        return pagePath === examplePath;
    });
};

mainRouter.get("/codesandbox/:example", (req: Request, res: Response) => {
    renderSandBoxRedirect(req, res, "codesandbox");
});

mainRouter.get("/stackblitz/:example", (req: Request, res: Response) => {
    renderSandBoxRedirect(req, res, "stackblitz");
});

// StackBlitz json endpoints
mainRouter.get("/json/list", (req: Request, res: Response) => {
    res.json({ files: [] });
});

mainRouter.get("/json/version", (req: Request, res: Response) => {
    res.json({ version: "1" });
});

mainRouter.get("/source/:example", (req: Request, res: Response) => {
    getSourceFiles(req, res);
});

mainRouter.get("/iframe/codesandbox/:example", (req: Request, res: Response) => {
    console.log("/iframe/codesandbox/:example");
    res.send(handleRender(req.url));
});

mainRouter.get("/iframe/javascript-:example", (req: Request, res: Response) => {
    const params = req.params;
    if (getExamplePageKey(params.example)) {
        return res.redirect(301, `${params.example}`);
    } else {
        console.log("/iframe/javascript-:example");
        res.send(handleRender(req.url));
    }
});

mainRouter.get("/iframe/:example?", (req: Request, res: Response) => {
    console.log("/iframe/:example?");
    res.send(handleRender(req.url));
});

mainRouter.get("/javascript-:example", (req: Request, res: Response) => {
    const params = req.params;
    if (getExamplePageKey(params.example)) {
        return res.redirect(301, `javascript/${params.example}`);
    } else {
        console.log("/javascript-:example");
        res.send(handleRender(req.url));
    }
});

// This is doing some useful things in handling framework defaults
mainRouter.get("/:example?", (req: Request, res: Response) => {
    const params = req.params;
    const exampleKey = getExamplePageKey(params.example);
    console.log(exampleKey);
    if (isValidFramework(params.example as EPageFramework)) {
        handleRender(req.url);
    } else if (exampleKey) {
        const redirectUrl = `react/${params.example}`;
        res.redirect(301, redirectUrl);
    } else {
        res.redirect(301, `react`);
    }
});

mainRouter.get("*", (req: Request, res: Response) => {
    res.send(handleRender(req.url));
});
