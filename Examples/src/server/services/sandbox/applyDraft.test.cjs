const assert = require("node:assert/strict");
const path = require("node:path");
require("ts-node").register({ project: path.resolve(__dirname, "../../../../tsconfig.node.json"), transpileOnly: true, compilerOptions: { module: "commonjs", moduleResolution: "node" } });
const { applyDraft, DraftError, MAX_DRAFT_BYTES } = require("./applyDraft.ts");

const base = {
    "package.json": { content: "{}", isBinary: false },
    "src/App.tsx": { content: "original", isBinary: false },
    "src/styles.css": { content: "css", isBinary: false },
};
// replaces content of known editable files and leaves everything else alone
const merged = applyDraft(base, [{ name: "src/App.tsx", content: "edited" }]);
assert.equal(merged["src/App.tsx"].content, "edited");
assert.equal(merged["src/styles.css"].content, "css");
assert.equal(merged["package.json"].content, "{}");
assert.equal(base["src/App.tsx"].content, "original", "input is not mutated");

// a draft file equal to the original is accepted
assert.equal(applyDraft(base, [{ name: "src/styles.css", content: "css" }])["src/styles.css"].content, "css");

const rejects = (files, pattern) => assert.throws(() => applyDraft(base, files), (e) => e instanceof DraftError && pattern.test(e.message));
rejects([{ name: "src/new.ts", content: "x" }], /src\/new\.ts/);                 // not in the example project
rejects([{ name: "package.json", content: "{\"scripts\":{}}" }], /package\.json/); // read-only file
rejects([{ name: "../etc/passwd", content: "x" }], /passwd/);
rejects([{ name: "src/App.tsx", content: 5 }], /content/);
rejects("nope", /files/);
rejects([{ name: "src/App.tsx", content: "x".repeat(MAX_DRAFT_BYTES + 1) }], /too large/);
rejects([{ name: "src/App.tsx", content: "a" }, { name: "src/App.tsx", content: "b" }], /twice/);
console.log("applyDraft tests passed");
