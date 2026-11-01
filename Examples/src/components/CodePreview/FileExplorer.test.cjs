const assert = require("node:assert/strict");
const path = require("node:path");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

require("ts-node").register({
    project: path.resolve(__dirname, "../../..", "tsconfig.node.json"),
    compilerOptions: { module: "commonjs", moduleResolution: "node", jsx: "react-jsx" },
});
const { FileExplorer } = require("./FileExplorer.tsx");
const files = [
    { name: ".codesandbox/tasks.json", content: "{}" },
    { name: "sandbox.config.json", content: "{}" },
    { name: "src/drawExample.ts", content: "// example" },
    { name: "package.json", content: "{}" },
    { name: "tsconfig.json", content: "{}" },
];
const markup = renderToStaticMarkup(
    React.createElement(FileExplorer, {
        files,
        selectedName: "src/drawExample.ts",
        modifiedNames: new Set(),
        onSelect: () => {},
    })
);
assert(!markup.includes(".codesandbox"));
assert(!markup.includes("sandbox.config.json"));
assert(!markup.includes("sc-editor-explorer-title"));
for (const name of ["src/drawExample.ts", "package.json", "tsconfig.json"]) {
    assert(markup.includes(`data-path="${name}"`));
}
assert.equal(files.length, 5, "Hidden sandbox files remain available to project downloads");
console.log("Explorer hides sandbox metadata and its heading while retaining project files.");
