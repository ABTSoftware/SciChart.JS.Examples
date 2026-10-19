const assert = require("node:assert/strict");
const LZString = require("lz-string");
const origin = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const example = "/demo/react/column-chart";
const unescape = (text) =>
    text.replace(
        /&(amp|lt|gt|quot|#x27|#39);/g,
        (_, name) => ({ amp: "&", lt: "<", gt: ">", quot: '"', "#x27": "'", "#39": "'" }[name])
    );
const read = async (path) => {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    return response.text();
};
const inputs = (html) =>
    Object.fromEntries(
        Array.from(html.matchAll(/<input[^>]*name="([^"]+)"[^>]*value="([^"]*)"/g), (match) => [
            unescape(match[1]),
            unescape(match[2]),
        ])
    );

(async () => {
    let baseline;
    for (const suffix of ["", "/", "?source=ssr-check"]) {
        const html = await read(example + suffix);
        const script = html.match(/<script id="example-source-state" type="application\/json">([\s\S]*?)<\/script>/);
        assert.ok(script, "SSR source state is present");
        const state = JSON.parse(script[1]);
        assert.ok(state.files.length > 1, "SSR must include the real project, not the loading placeholder");
        assert.ok(state.files.some((file) => file.name === "src/main.tsx"));
        assert.ok(!html.includes('class="sc-editor-source-index"'));
        assert.ok(!html.includes(">Copy file</button>"));
        assert.ok(!html.includes(">Download file</button>"));
        const renderedCode = html.match(/<div id="EXAMPLE_CODE"[^>]*>[\s\S]*?<code[^>]*>([\s\S]*?)<\/code>/);
        assert.ok(renderedCode, "Selected file has semantic source before hydration");
        const selectedFile = state.files.find((file) => /(^|\/)drawExample\.(ts|js)$/.test(file.name));
        assert.equal(unescape(renderedCode[1].replace(/<[^>]*>/g, "")), selectedFile.content);
        if (baseline) assert.deepEqual(state, baseline, "URL suffixes preserve the same source");
        baseline = state;
    }
    const sdk = JSON.parse(await read("/demo/api/stackblitz/files/column-chart?framework=react"));
    assert.equal(sdk.template, "node");
    assert.equal(typeof sdk.files["package.json"], "string");
    assert.ok(sdk.dependencies.react);
    for (const name of ["date-fns", "socket.io", "socket.io-client", "scichart-financial-tools"])
        assert.ok(!sdk.dependencies[name], `${name} is not required by this example`);
    const form = inputs(await read("/demo/stackblitz/column-chart?framework=react"));
    for (const [name, content] of Object.entries(sdk.files))
        assert.equal(form[`project[files][${name}]`], content, `StackBlitz form preserves ${name}`);
    const csForm = inputs(await read("/demo/codesandbox/column-chart?framework=react"));
    const decoded = LZString.decompressFromBase64(csForm.parameters.replace(/-/g, "+").replace(/_/g, "/"));
    const csProject = JSON.parse(decoded);
    assert.equal(csProject.template, "node");
    assert.equal(csForm.environment, "server");
    for (const [name, content] of Object.entries(sdk.files))
        assert.equal(csProject.files[name].content, content, `CodeSandbox form preserves ${name}`);
    console.log(`SSR sources, URL variants and both sandbox transports verified against ${origin}.`);
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
