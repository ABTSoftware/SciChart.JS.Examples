const assert = require("node:assert/strict");
const express = require("express");
const setupMiddleware = require("./devMiddleware.cjs");

async function main() {
    const app = express();
    setupMiddleware(app);
    const server = app.listen(0, "127.0.0.1");
    await new Promise((resolve) => server.once("listening", resolve));
    try {
        const response = await fetch(`http://127.0.0.1:${server.address().port}/api/lidarData`);
        assert(response.ok);
        assert.match(response.headers.get("content-type"), /text\/plain/);
        const text = await response.text();
        assert.equal(text, require("../src/server/Data/tq3080_DSM_2M.js").tq3080_DSM_2M);
        assert.match(text, /^ncols\s+\d+\s*\r?\nnrows\s+\d+/);
        console.log("LiDAR API serves raw ASCII data, preserving its line breaks.");
    } finally {
        await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
