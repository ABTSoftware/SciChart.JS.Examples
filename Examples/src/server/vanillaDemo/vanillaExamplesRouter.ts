import * as path from "path";
import * as fs from "fs";
import { htmlTemplate } from "./vanillaExampleHtmlTemplate";
import express = require("express");
import { EXAMPLES_PAGES, TExamplePage } from "../../components/AppRouter/examplePages";

export const vanillaExamplesRouter = express.Router();

const availableFiles = [
    "index.html",
    "index.js",
    "drawExample.js",
    "common.js",
    "theme.js",
    "scichart.browser.mjs",
    "DepthCursorModifier.js",
    "data.js",
] as const;

const basePath = path.join(__dirname, "Examples");

const isValidFilePath = (requestedPath: string) => {
    const absoluteRootFolderPath = path.resolve(basePath);
    const absoluteRequestedFilePath = path.resolve(path.join(basePath, requestedPath));

    return absoluteRequestedFilePath.startsWith(absoluteRootFolderPath);
};

vanillaExamplesRouter.get("/:example/:file", async (req, res) => {
    const examplePath = req.params.example;
    const filename = req.params.file as (typeof availableFiles)[number];

    if (!isValidFilePath(filename)) {
        res.sendStatus(400);
        return;
    }

    const currentExampleKey = Object.keys(EXAMPLES_PAGES).find((key) => EXAMPLES_PAGES[key].path === examplePath);
    const currentExample = EXAMPLES_PAGES[currentExampleKey];

    if (currentExample) {
        const vanillaJsSetupPath = path.join(basePath, currentExample.filepath, "vanilla.js");

        // check if vanilla example exists
        try {
            const vanillaJsSetup = await fs.promises.readFile(vanillaJsSetupPath, "utf8");
        } catch {
            return res.sendStatus(404);
        }

        if (filename === "index.html") {
            const htmlPath = path.join(basePath, currentExample.filepath, filename);
            const cssPath = path.join(basePath, currentExample.filepath, "vanilla.css");
            let body = "";
            let styles = "";
            try {
                const [htmlSetup, cssSetup] = await Promise.all([
                    fs.promises.readFile(htmlPath, "utf8").catch((): string => ""),
                    fs.promises.readFile(cssPath, "utf8").catch((): string => ""),
                ]);

                body = htmlSetup;
                styles = cssSetup;
            } catch {
                return res.sendStatus(500);
            }

            const renderNav = !!req.query["nav"];
            const generatedHtml = htmlTemplate({ body, styles, renderNav });

            return res.send(generatedHtml);
        } else {
            const file = getExampleSourceFile(filename, currentExample);

            return res.sendFile(file);
        }
    } else {
        return res.sendStatus(404);
    }
});

const getExampleSourceFile = (filename: (typeof availableFiles)[number], currentExample: TExamplePage) => {
    switch (filename) {
        case "common.js":
            return path.join(__dirname, "common.js");
        case "theme.js":
            return path.join(__dirname, "Examples/theme.js");
        case "scichart.browser.mjs":
            return path.join(__dirname, "scichart.browser.mjs");
        case "index.js":
            return path.join(basePath, currentExample.filepath, "vanilla.js");
        case "drawExample.js":
            return path.join(basePath, currentExample.filepath, "drawExample.js");
        default:
            return path.join(basePath, currentExample.filepath, filename);
    }
};
