const assert = require("node:assert/strict");
const path = require("node:path");
require("ts-node").register({
    project: path.resolve(__dirname, "../../../tsconfig.node.json"),
    transpileOnly: true,
    compilerOptions: { module: "commonjs", moduleResolution: "node" },
});
const { isEditableFile, hasDraft, getLiveEditAvailability, LIVE_EDIT_MESSAGES, editableFiles, toRouterPath } = require("./liveEditing.ts");

for (const name of ["src/drawExample.ts", "src/App.tsx", "src/styles.css", "src/a/b.js"]) assert.equal(isEditableFile(name), true, name);
for (const name of ["package.json", "tsconfig.json", "index.html", "sandbox.config.json", ".codesandbox/tasks.json", "src/vite-env.d.ts.map", "src/data.csv", "README.md"])
    assert.equal(isEditableFile(name), false, name);

const base = [{ name: "src/a.ts", content: "a" }, { name: "src/b.ts", content: "b" }];
assert.equal(hasDraft(base, base), false);
assert.equal(hasDraft([...base].map((f) => ({ ...f })), base), false);
assert.equal(hasDraft([base[0], { ...base[1], content: "B" }], base), true);
assert.equal(hasDraft([base[0]], base), true);
assert.equal(hasDraft([...base, { name: "src/c.ts", content: "" }], base), true);

const ok = { framework: "react", liveEdit: undefined, narrow: false };
assert.deepEqual(getLiveEditAvailability(ok), { status: "available" });
assert.deepEqual(getLiveEditAvailability({ ...ok, framework: "javascript" }), { status: "available" });
assert.equal(getLiveEditAvailability({ ...ok, framework: "angular" }).status, "angular");
assert.equal(getLiveEditAvailability({ ...ok, liveEdit: false }).status, "readonly-example");
assert.equal(getLiveEditAvailability({ ...ok, narrow: true }).status, "narrow");
// an opted-out example says so even on Angular
assert.equal(getLiveEditAvailability({ ...ok, framework: "angular", liveEdit: false }).status, "readonly-example");
assert.match(LIVE_EDIT_MESSAGES["readonly-example"], /too complex to run in the in-page sandbox.*Clone the repository or download the project/);
assert.match(LIVE_EDIT_MESSAGES.angular, /React and JavaScript/);

// Only editable files go to the draft endpoint: package.json and friends would be rejected there.
assert.deepEqual(
    editableFiles([{ name: "package.json", content: "{}" }, { name: "src/a.ts", content: "a" }, { name: "index.html", content: "" }, { name: "src/s.css", content: "s" }]).map((f) => f.name),
    ["src/a.ts", "src/s.css"]
);
// The router adds its basename itself, so a link's pathname must lose it first.
assert.equal(toRouterPath("/demo/react/line-chart?x=1#h", "/demo"), "/react/line-chart?x=1#h");
assert.equal(toRouterPath("/demo", "/demo"), "/");
assert.equal(toRouterPath("/react/line-chart", ""), "/react/line-chart");
assert.equal(toRouterPath("/demonstration/x", "/demo"), "/demonstration/x");
console.log("liveEditing tests passed");
