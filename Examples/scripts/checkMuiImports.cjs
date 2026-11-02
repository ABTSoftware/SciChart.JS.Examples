const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const project = path.resolve(__dirname, "..");
function checkSource(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const file = path.join(dir, entry.name);
        if (entry.isDirectory()) checkSource(file);
        else if (/\.[cm]?[jt]sx?$/.test(entry.name)) {
            const source = fs.readFileSync(file, "utf8");
            assert(
                !/["'](?:@mui\/(?!icons-material(?:[\/"']))|@material-ui\/(?!icons(?:[\/"']))|@emotion\/)/.test(source),
                `Non-icon MUI or Emotion import in ${path.relative(project, file)}`
            );
        }
    }
}
checkSource(path.join(project, "src"));
const pkg = JSON.parse(fs.readFileSync(path.join(project, "package.json"), "utf8"));
assert(!pkg.dependencies["@emotion/server"], "Unused Emotion SSR dependency remains");
console.log("Examples/src verified: MUI icons are the only permitted MUI imports; no Emotion imports remain.");
