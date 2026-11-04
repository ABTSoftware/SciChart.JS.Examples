const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

require("ts-node").register({
    project: path.resolve(__dirname, "../../..", "tsconfig.node.json"),
    compilerOptions: { module: "commonjs", moduleResolution: "node" },
});
const { buildFileTree, createProjectZip, getDefaultSourceFile } = require("./projectFiles.ts");
const files = [
    { name: "package.json", content: '{"scripts":{"start":"vite"}}\n' },
    { name: "src/main.tsx", content: 'import "./styles.css";\n' },
    { name: "src/drawExample.ts", content: "// Editable chart — UTF-8\n" },
    { name: "src/styles.css", content: "/* 123456789 */\n.chart {\n    width: 100%;\n}\n" },
    { name: ".codesandbox/tasks.json", content: "{}\n" },
];
assert.equal(getDefaultSourceFile(files).name, "src/drawExample.ts");
assert.equal(
    getDefaultSourceFile([
        { name: "index.html", content: "" },
        { name: "src/App.tsx", content: "" },
    ]).name,
    "src/App.tsx"
);
assert.equal(getDefaultSourceFile([]), undefined);
const tree = buildFileTree(files);
assert.deepEqual(
    tree.map((node) => node.path),
    [".codesandbox", "src", "package.json"]
);
assert.deepEqual(
    tree[1].children.map((node) => node.path),
    ["src/drawExample.ts", "src/main.tsx", "src/styles.css"]
);
for (const name of ["../outside.ts", "/absolute.ts", "src/../outside.ts", "src\\outside.ts", "", "src//file.ts"]) {
    assert.throws(() => createProjectZip([{ name, content: "" }]));
}
assert.throws(() => createProjectZip([files[0], files[0]]));

const directory = fs.mkdtempSync(path.join(os.tmpdir(), "scichart-editor-"));
try {
    const zipPath = path.join(directory, "example.zip");
    fs.writeFileSync(zipPath, createProjectZip(files));
    execFileSync("unzip", ["-t", zipPath]);
    assert.deepEqual(
        execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" }).trim().split("\n"),
        files.map((file) => file.name)
    );
    for (const file of files) {
        assert.equal(execFileSync("unzip", ["-p", zipPath, file.name], { encoding: "utf8" }), file.content);
    }
} finally {
    fs.rmSync(directory, { recursive: true, force: true });
}
console.log("Editor project file selection, tree, ZIP paths, checksums and UTF-8 round trips passed.");
