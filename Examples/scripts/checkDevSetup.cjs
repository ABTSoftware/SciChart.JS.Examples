const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { createRequire } = require("node:module");
const ts = require("typescript");
const express = require("express");
const strip = require("./stripExampleMarkdown.cjs");
const root = path.resolve(__dirname, "..");
require("ts-node").register({
    project: path.join(root, "tsconfig.node.json"),
    transpileOnly: true,
    compilerOptions: { module: "commonjs", moduleResolution: "node" },
});

function evaluate(source, filename) {
    const exports = {};
    const code = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            jsx: ts.JsxEmit.ReactJSX,
            esModuleInterop: true,
        },
    }).outputText;
    vm.runInNewContext(code, { exports, require: createRequire(filename) }, { filename });
    return exports.default;
}

async function main() {
    const examplesRoot = path.join(root, "src/components/Examples");
    let count = 0,
        originalBytes = 0,
        galleryBytes = 0;
    for (const entry of fs.readdirSync(examplesRoot, { recursive: true })) {
        if (!/exampleInfo\.tsx?$/.test(entry)) continue;
        const file = path.join(examplesRoot, entry);
        const source = fs.readFileSync(file, "utf8");
        const gallery = strip(source);
        const fullInfo = evaluate(source, file),
            galleryInfo = evaluate(gallery, file);
        for (const key of Object.keys(fullInfo)) {
            if (key === "markdownContent") continue;
            if (typeof fullInfo[key] === "function") {
                for (const framework of ["React", "Angular", "JavaScript"]) {
                    assert.deepEqual(galleryInfo[key](framework), fullInfo[key](framework), `${entry}: ${key}`);
                }
            } else assert.equal(JSON.stringify(galleryInfo[key]), JSON.stringify(fullInfo[key]), `${entry}: ${key}`);
        }
        assert.equal(galleryInfo.markdownContent("React"), "");
        originalBytes += Buffer.byteLength(source);
        galleryBytes += Buffer.byteLength(gallery);
        count++;
    }
    assert(count >= 181, "all registered examples are checked");
    assert(galleryBytes < originalBytes * 0.5, "gallery metadata excludes long descriptions");
    const fixture = 'const markdownContent = "KEEP"; const metaData = { title: markdownContent, markdownContent };';
    assert(strip(fixture).includes('"KEEP"'), "a description reused by another property survives");
    assert(!strip('const markdownContent = "REMOVE"; const x = { markdownContent };').includes('"REMOVE"'));
    const { renderIndexHtml } = require("../src/server/renderIndexHtml.ts");
    const sourceState = { framework: "react", files: [{ name: "drawExample.ts", content: "</script><script>test</script>" }] };
    const emptyHelmet = Object.fromEntries(["htmlAttributes", "bodyAttributes", "title", "meta"].map((key) => [key, { toString: () => "" }]));
    const html = renderIndexHtml("", "", emptyHelmet, sourceState);
    const serialized = html.match(/<script id="example-source-state" type="application\/json">(.*?)<\/script>/s)[1];
    assert(!serialized.includes("<"), "source code cannot close the hydration state script");
    assert.deepEqual(JSON.parse(serialized), sourceState, "hydration starts with the server's source files");

    const app = express();
    const setup = require("./devMiddleware.cjs");
    setup(app);
    assert(!require.cache[require.resolve("../src/server/Data/tq3080_DSM_2M.js")], "mock data is lazy");
    const server = app.listen(0, "127.0.0.1");
    await new Promise((resolve, reject) => {
        server.once("listening", resolve);
        server.once("error", reject);
    });
    try {
        const base = `http://127.0.0.1:${server.address().port}`;
        for (const route of [
            "lidarData",
            "tweetData",
            "multiPaneData",
            "populationData",
            ...["ADAUSDT", "BTCUSDT", "DOGEUSDT", "ETHUSDT", "XRPUSDT"].map((s) => "get-binance-candles?symbol=" + s),
        ]) {
            const res = await fetch(base + "/api/" + route);
            assert.equal(res.status, 200, route);
            const data = await res.json();
            assert(data && Object.keys(data).length > 0, route);
        }
        assert.equal((await fetch(base + "/api/get-binance-candles?symbol=../../package")).status, 400);
        for (const asset of [
            "scichart.wasm",
            "scichart.browser.mjs",
            "Shale.csv",
            "worldConverted.json",
            "favicon.ico",
            "images/javascript-line-chart.jpg",
        ]) {
            const response = await fetch(base + "/" + asset);
            assert.equal(response.status, 200, asset);
            if (asset.endsWith(".wasm")) assert(response.headers.get("content-type").includes("application/wasm"));
            assert((await response.arrayBuffer()).byteLength > 0, asset);
        }
        for (const framework of ["react", "angular", "javascript"]) {
            const response = await fetch(`${base}/source/line-chart?framework=${framework}`);
            assert.equal(response.status, 200, framework);
            const source = await response.json();
            assert.equal(source.framework, framework);
            assert(source.files.some((f) => f.name === "drawExample.ts"));
            assert(source.files.some((f) => f.name === "index.css"));
        }
        assert.equal((await fetch(base + "/source/does-not-exist")).status, 404);
        const { getReactSandBoxConfig } = require("../src/server/services/sandbox/reactConfig.ts");
        const demo = path.join(examplesRoot, "Charts2D/BasicChartTypes/LineChart");
        const info = require(path.join(demo, "exampleInfo.tsx")).default;
        const sandbox = await getReactSandBoxConfig(demo, info, base);
        const content = sandbox.files["package.json"].content;
        const dependencies = typeof content === "string" ? JSON.parse(content) : content;
        assert.equal(dependencies.dependencies.typescript, require("../package.json").dependencies.typescript,
            "exported React projects retain their compiler dependency");
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
    console.log(
        `Checked ${count} examples: metadata ${originalBytes} -> ${galleryBytes} bytes; mock APIs, assets and source previews passed.`
    );
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
