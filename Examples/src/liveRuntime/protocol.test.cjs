const assert = require("node:assert/strict");
const path = require("node:path");
require("ts-node").register({
    project: path.resolve(__dirname, "../../tsconfig.node.json"),
    transpileOnly: true,
    compilerOptions: { module: "commonjs", moduleResolution: "node" },
});
const { parsePageMessage, parseFrameMessage, isTrustedEvent } = require("./protocol.ts");

const run = { type: "run", runId: 3, framework: "react", files: [{ name: "src/App.tsx", content: "x" }], themeName: "navy", themeVars: { "--bg": "#000" } };
assert.deepEqual(parsePageMessage(run), run);
assert.deepEqual(parsePageMessage({ type: "dispose" }), { type: "dispose" });
for (const bad of [null, 5, "run", {}, { type: "nope" }, { ...run, files: "x" }, { ...run, files: [{ name: 1 }] }, { ...run, framework: "angular" }, { ...run, runId: "1" }, { ...run, themeVars: { a: 1 } }])
    assert.equal(parsePageMessage(bad), null, JSON.stringify(bad));

const ok = [{ type: "ready" }, { type: "run-ok", runId: 3, duration: 12.5 }, { type: "console", runId: 3, level: "warn", text: "hi" }, { type: "error", runId: 3, phase: "compile", message: "bad", file: "src/a.ts", line: 4 }, { type: "error", runId: 3, phase: "runtime", message: "bad" }, { type: "error", runId: 3, phase: "teardown", message: "bad" }];
for (const message of ok) assert.deepEqual(parseFrameMessage(message), message);
for (const bad of [{ type: "run-ok" }, { type: "console", runId: 1, level: "trace", text: "" }, { type: "error", runId: 1, phase: "x", message: "m" }, { type: "ready", extra: 1, runId: "x" } && undefined, "ready"])
    assert.equal(parseFrameMessage(bad), null, JSON.stringify(bad));

const win = {};
assert.equal(isTrustedEvent({ source: win, origin: "https://a.com" }, win, "https://a.com"), true);
assert.equal(isTrustedEvent({ source: {}, origin: "https://a.com" }, win, "https://a.com"), false);
assert.equal(isTrustedEvent({ source: win, origin: "https://evil.com" }, win, "https://a.com"), false);
assert.equal(isTrustedEvent({ source: win, origin: "https://a.com" }, null, "https://a.com"), false);
console.log("protocol tests passed");
