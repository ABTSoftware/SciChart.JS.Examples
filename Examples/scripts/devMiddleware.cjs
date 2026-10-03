const fs = require("fs");
const path = require("path");
const express = require("express");
const root = path.resolve(__dirname, "..");

let registered = false;
function loadMock(modulePath, name) {
    if (/\.tsx?$/.test(modulePath) && !registered) {
        require("ts-node").register({
            project: path.join(root, "tsconfig.node.json"),
            transpileOnly: true,
            compilerOptions: { module: "commonjs", moduleResolution: "node" },
        });
        registered = true;
    }
    const exports = require(path.join(root, modulePath));
    return name === undefined ? exports : exports[name];
}

module.exports = function setupMiddleware(app, { withApi = true } = {}) {
    if (withApi) {
        const mocks = {
            lidarData: ["src/server/Data/tq3080_DSM_2M.js", "tq3080_DSM_2M"],
            tweetData: ["src/server/Data/tweetData.js", "TweetData"],
            multiPaneData: ["src/server/Data/multiPaneData.ts", "multiPaneData"],
            populationData: ["src/server/Data/populationData.ts", "mappedPopulationData"],
        };
        for (const [route, args] of Object.entries(mocks)) {
            app.get("/api/" + route, (req, res) => res.json(loadMock(...args)));
        }
        app.get("/api/get-binance-candles", (req, res) => {
            const symbol = req.query.symbol;
            if (!["ADAUSDT", "BTCUSDT", "DOGEUSDT", "ETHUSDT", "XRPUSDT"].includes(symbol)) {
                return res.status(400).json({ error: "Unsupported symbol" });
            }
            res.json(loadMock(`src/server/BinanceData/candles${symbol}.js`, `candles${symbol}`));
        });
    }
    // Serve unchanged datasets and WASM directly; don't copy or watch them on each compilation.
    for (const pattern of require("../webpack.assets.cjs")) {
        const filename = path.join(root, pattern.from);
        if (fs.statSync(filename).isDirectory()) {
            app.use("/", express.static(filename, { index: false }));
        } else {
            const url = "/" + (pattern.to || path.basename(filename));
            app.get(url, (req, res) => res.sendFile(filename));
        }
    }
    app.use("/assets", express.static(path.join(root, "src/assets"), { index: false }));
    const images = new Map();
    const examplesRoot = path.join(root, "src/components/Examples");
    for (const entry of fs.readdirSync(examplesRoot, { recursive: true })) {
        if (/\.jpg$/i.test(entry)) images.set(path.basename(entry), path.join(examplesRoot, entry));
    }
    if (withApi) {
        let sourceExamples;
        app.get("/source/:example", async (req, res, next) => {
            try {
                if (!sourceExamples) {
                    const examples = new Map();
                    for (const entry of fs.readdirSync(examplesRoot, { recursive: true })) {
                        if (!/exampleInfo\.tsx?$/.test(entry)) continue;
                        const file = path.join(examplesRoot, entry);
                        const info = loadMock(path.relative(root, file), "default");
                        examples.set(info.path, path.dirname(file));
                    }
                    sourceExamples = examples;
                }
                const folder = sourceExamples.get(req.params.example);
                if (!folder) return res.status(404).json({ error: "Example not found" });
                const framework = ["angular", "javascript", "react"].includes(req.query.framework)
                    ? req.query.framework
                    : "react";
                const { readSourceFiles } = loadMock("src/server/services/sandbox/readSourceFiles.ts");
                const source = await readSourceFiles(
                    framework,
                    folder,
                    req.protocol + "://" + req.get("host"),
                    path.join(examplesRoot, "styles")
                );
                res.json(source);
            } catch (error) {
                next(error);
            }
        });
    }
    app.get("/images/:name", (req, res, next) => {
        const image = images.get(req.params.name);
        if (image) res.sendFile(image);
        else next();
    });
};
