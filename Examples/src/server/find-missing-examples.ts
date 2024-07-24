import express = require("express");
var url = require("url");
import { EXAMPLES_PAGES } from "../components/AppRouter/examplePages";

const router = express.Router();

router.get("/", async (req, res) => {
    if (!req.path.includes("locahost")) {
        res.sendStatus(403);
    }
    const existing: any[] = [];
    const missing: any[] = [];
    const notChecked: any[] = [];
    for (const exampleKey in EXAMPLES_PAGES) {
        const exampleInfo = EXAMPLES_PAGES[exampleKey];
        if (!exampleInfo.onWebsite) {
            const scUrl = "https://scichart.com/example/javascript-chart" + exampleInfo.path;
            console.log("Checking " + exampleInfo.path);
            const result = await fetch(scUrl);
            if (result.ok) {
                console.log("exists");
                existing.push({ title: exampleInfo.title, path: exampleInfo.path, filePath: exampleInfo.filepath });
            } else {
                console.log("missing");
                missing.push({ title: exampleInfo.title, path: exampleInfo.path, filePath: exampleInfo.filepath });
            }
        } else {
            notChecked.push({ title: exampleInfo.title, path: exampleInfo.path, filePath: exampleInfo.filepath });
        }
    }
    res.send({ missing, existing, notChecked });
});

export { router as findMissingExamples };
