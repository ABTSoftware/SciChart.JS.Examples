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
            tweetData: ["src/server/Data/tweetData.js", "TweetData"],
            multiPaneData: ["src/server/Data/multiPaneData.ts", "multiPaneData"],
            populationData: ["src/server/Data/populationData.ts", "mappedPopulationData"],
        };
        for (const [route, args] of Object.entries(mocks)) {
            app.get("/api/" + route, (req, res) => res.json(loadMock(...args)));
        }
        app.get("/api/lidarData", (req, res) =>
            res.type("text/plain").send(loadMock("src/server/Data/tq3080_DSM_2M.js", "tq3080_DSM_2M"))
        );
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
    // The live frame: a same-origin page that compiles and runs an example project (see LIVE-EDIT-PLAN.md).
    const frameHeaders = {
        "Cache-Control": "no-store",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "credentialless",
    };
    const buildLiveRuntime = require("./buildLiveRuntime.cjs").createLiveRuntimeBuilder();
    app.get(["/live-frame", "/demo/live-frame"], async (req, res, next) => {
        try {
            res.type("html").set(frameHeaders).send((await buildLiveRuntime()).html);
        } catch (error) {
            next(error);
        }
    });
    app.get(/^(?:\/demo)?\/live-runtime\.[0-9a-f]+\.js$/, async (req, res, next) => {
        try {
            const { code, scriptName } = await buildLiveRuntime();
            if (!req.path.endsWith(scriptName)) return res.sendStatus(404);
            res.type("js").set(frameHeaders).send(code);
        } catch (error) {
            next(error);
        }
    });
    app.use("/assets", express.static(path.join(root, "src/assets"), { index: false }));
    const images = new Map();
    const examplesRoot = path.join(root, "src/components/Examples");
    for (const entry of fs.readdirSync(examplesRoot, { recursive: true })) {
        if (/\.(?:png|jpe?g|gif|svg|webp|ico)$/i.test(entry))
            images.set(path.basename(entry), path.join(examplesRoot, entry));
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
                        examples.set(info.path, { folder: path.dirname(file), info });
                    }
                    sourceExamples = examples;
                }
                const example = sourceExamples.get(req.params.example);
                if (!example) return res.status(404).json({ error: "Example not found" });
                const framework = ["angular", "javascript", "react"].includes(req.query.framework)
                    ? req.query.framework
                    : "react";
                const { readSourceFiles } = loadMock("src/server/services/sandbox/readSourceFiles.ts");
                const source = await readSourceFiles(
                    framework,
                    example.folder,
                    req.protocol + "://" + req.get("host"),
                    path.join(examplesRoot, "styles"),
                    example.info
                );
                res.json(source);
            } catch (error) {
                next(error);
            }
        });
    }
    app.get(["/images/:name", "/demo/images/:name"], (req, res, next) => {
        const image = images.get(req.params.name);
        if (image) res.set("Access-Control-Allow-Origin", "*").sendFile(image);
        else next();
    });
};
