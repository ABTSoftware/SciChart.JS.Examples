import * as path from "path";
import * as fs from "fs";
import { htmlTemplate, templateWithNav } from "./vanillaExampleHtmlTemplate";
import express = require("express");
import { EXAMPLES_PAGES, TExamplePage } from "../../components/AppRouter/examplePages";

export const vanillaExamplesRouter = express.Router();

const availableFiles = [
    "index.html",
    "index.js",
    "drawExample.js",
    "common.js",
    "scichart.browser.js",
    "scichart.browser.mjs",
    "exampleDependencies.browser.mjs",
] as const;

const basePath = path.join(__dirname, "Examples");

vanillaExamplesRouter.get("/:example/:file", async (req, res) => {
    const examplePath = req.params.example;
    const filename = req.params.file as (typeof availableFiles)[number];

    if (!availableFiles.includes(filename)) {
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
                    fs.promises.readFile(htmlPath, "utf8").catch(() => null),
                    fs.promises.readFile(cssPath, "utf8").catch(() => null),
                ]);

                body = htmlSetup;
                styles = cssSetup;
            } catch {
                return res.sendStatus(500);
            }

            const showNav = req.query["nav"];
            const generatedHtml = showNav ? templateWithNav({ body, styles }) : htmlTemplate({ body, styles });

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
        case "scichart.browser.js":
            return path.join(__dirname, "scichart.browser.js");
        case "scichart.browser.mjs":
            return path.join(__dirname, "scichart.browser.mjs");
        case "exampleDependencies.browser.mjs":
            return path.join(__dirname, "exampleDependencies.browser.mjs");
        // TODO remove this, since HTML file is generated
        case "index.html":
            return path.join(basePath, currentExample.filepath, filename);
        case "index.js":
            return path.join(basePath, currentExample.filepath, "vanilla.js");
        case "drawExample.js":
            return path.join(basePath, currentExample.filepath, "drawExample.js");
        default: {
            const handleInvalidFilename = (filename: never): never => {
                throw new Error(`Invalid file ${filename}!`);
            };
            return handleInvalidFilename(filename);
        }
    }
};
