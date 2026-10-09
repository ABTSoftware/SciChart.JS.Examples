const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const postcss = require("postcss");
const selectorParser = require("postcss-selector-parser");
const ts = require("typescript");

const project = path.resolve(__dirname, "..");
const styleDir = path.join(project, "src/components/Examples/styles");
const names = ["main", "app", "gallery", "content", "editor"];
const classes = new Set();
const definitions = new Set();
const references = new Set();
const demoClasses = new Set();
const appClass = /^sc-(app|gallery|content|editor)(-|$)/;

for (const name of [...names, "ui"]) {
    const css = fs.readFileSync(path.join(styleDir, `sc-${name}.css`), "utf8");
    assert(!/@(?:use|extend|include|mixin)\b|:global\(/.test(css), `Sass syntax in sc-${name}.css`);
    const ast = postcss.parse(css);
    ast.walkDecls((decl) => {
        if (decl.prop.startsWith("--")) definitions.add(decl.prop);
        if (name !== "ui") {
            for (const match of decl.value.matchAll(/var\((--[\w-]+)\s*\)/g)) references.add(match[1]);
        }
    });
    ast.walkRules((rule) => {
        if (name !== "ui") assert(rule.nodes.length, `Empty rule in sc-${name}.css: ${rule.selector}`);
        if (rule.parent.type === "atrule" && rule.parent.name.endsWith("keyframes")) return;
        if (name !== "ui") assert(rule.parent.type !== "rule", `Nested rule in sc-${name}.css`);
        selectorParser((selectors) =>
            selectors.walkClasses((node) => {
                if (name === "ui") demoClasses.add(node.value);
                else {
                    assert(
                        appClass.test(node.value) || node.value === "scichart__legend",
                        `Unscoped application class .${node.value} in sc-${name}.css`
                    );
                    classes.add(node.value);
                }
            })
        ).processSync(rule.selector);
    });
}
for (const token of references) assert(definitions.has(token), `Undefined CSS variable ${token}`);

const files = (dir) =>
    fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        return entry.isDirectory() ? files(full) : [full];
    });
const sourceFiles = files(path.join(project, "src"));
assert(!sourceFiles.some((file) => file.endsWith(".scss")), "SCSS source remains");
let checkedClasses = 0;
for (const file of sourceFiles.filter((file) => file.endsWith(".tsx"))) {
    const relative = path.relative(project, file);
    const isDemo =
        relative.startsWith("src/components/Examples/") &&
        relative !== "src/components/Examples/ExampleRootDetails.tsx";
    if (isDemo) continue;
    const source = fs.readFileSync(file, "utf8");
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const checkClass = (value) => {
        if (!appClass.test(value) || value.endsWith("-")) return;
        assert(classes.has(value), `${relative} uses undefined application class ${value}`);
        checkedClasses++;
    };
    const visit = (node) => {
        if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
            for (const value of node.text.split(/\s+/)) checkClass(value);
        }
        if (ts.isTemplateExpression(node)) {
            for (const literal of [node.head, ...node.templateSpans.map((span) => span.literal)]) {
                for (const value of literal.text.split(/\s+/)) checkClass(value);
            }
        }
        if (ts.isJsxAttribute(node) && node.name.text === "className" && node.initializer) {
            const initializer = node.initializer;
            const literal = ts.isStringLiteral(initializer)
                ? initializer
                : ts.isJsxExpression(initializer)
                ? initializer.expression
                : undefined;
            if (literal && (ts.isStringLiteral(literal) || ts.isNoSubstitutionTemplateLiteral(literal))) {
                for (const value of literal.text.split(/\s+/)) {
                    assert(!demoClasses.has(value), `${relative} uses demo-only class ${value}`);
                }
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(ast);
}
const pkg = JSON.parse(fs.readFileSync(path.join(project, "package.json"), "utf8"));
for (const section of [pkg.dependencies, pkg.devDependencies]) {
    assert(!section?.sass && !section?.["sass-loader"], "Sass dependency remains");
}
console.log(
    `Application styles verified: ${names.length} CSS files, ${classes.size} classes, ${checkedClasses} references.`
);
