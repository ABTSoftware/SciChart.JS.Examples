const assert = require("node:assert/strict");
const path = require("node:path");
const { decompressFromBase64 } = require("lz-string");
require("ts-node").register({
    project: path.resolve(__dirname, "../../tsconfig.node.json"),
    compilerOptions: { module: "commonjs", moduleResolution: "node" },
});
const { getParameters } = require("./codeSandboxLib.ts");
const decode = (input) => JSON.parse(decompressFromBase64(input.replace(/-/g, "+").replace(/_/g, "/")));
for (const angular of [false, true]) {
    const files = {
        "sandbox.config.json": { content: '{"template":"node","infiniteLoopProtection":false}', isBinary: false },
        "package.json": { content: '{"scripts":{"start":"vite"}}', isBinary: false },
        ...(angular
            ? {
                  "angular.json": { content: "{}", isBinary: false },
                  "src/main.ts": { content: "bootstrapApplication(App);", isBinary: false },
                  "src/index.html": { content: "<app-root></app-root>", isBinary: false },
              }
            : {}),
    };
    const project = decode(getParameters({ files, template: "node" }));
    assert.equal(project.template, angular ? "angular-cli" : "parcel");
    const config = JSON.parse(project.files["sandbox.config.json"].content);
    assert.equal(config.template, project.template);
    assert.equal(config.infiniteLoopProtection, false);
    if (angular) {
        assert.ok(project.files["src/main.ts"].content.startsWith('import "@angular/compiler";'));
        assert.ok(project.files["src/main.ts"].content.includes('import "./styles.css";'));
        assert.equal(project.files["index.html"].content, files["src/index.html"].content);
    }
    assert.equal(project.files["package.json"].content, files["package.json"].content);
    assert.equal(
        JSON.parse(files["sandbox.config.json"].content).template,
        "node",
        "Other exports retain Node/Vite config"
    );
}
const project = { files: {}, template: "static" };
assert.deepEqual(decode(getParameters(project)), project);
console.log("CodeSandbox uses browser templates without changing shared runnable exports.");
