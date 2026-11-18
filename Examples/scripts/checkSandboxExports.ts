import * as assert from "node:assert/strict";
import * as postcss from "postcss";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { EPageFramework } from "../src/helpers/shared/Helpers/frameworkTypes";
import { getSandboxConfig } from "../src/server/services/sandbox";
import { IFiles, moduleReferences, getSourceFilesForPath } from "../src/server/services/sandbox/sandboxDependencyUtils";
import { getExampleDependencies, getPackageJson } from "../src/server/services/sandbox/sandboxPackages";
import { useSingleExampleStylesheet } from "../src/server/services/sandbox/sandboxStyles";
import { createExampleStylesheet } from "../src/server/services/sandbox/exampleCss";
import type { TExampleInfo } from "../src/components/AppRouter/examplePages";

const root = path.resolve("src/components/Examples");
const entryFiles = { react: "index.tsx", javascript: "vanilla.ts", angular: "angular.ts" };

let readmeSteps: string;
const checkProject = (files: IFiles, expectedTitle: string) => {
    const readme = files["README.md"].content;
    assert.ok(readme.startsWith(`# ${expectedTitle}\n`));
    assert.ok(readme.includes("npm install\nnpm run dev"));
    assert.ok(readme.split(/\s+/).length < 60, "Setup instructions stay short");
    const steps = readme.slice(readme.indexOf("\n"));
    if (readmeSteps) assert.equal(steps, readmeSteps, "Only README titles vary");
    readmeSteps = steps;
    assert.equal(Object.keys(files).filter((name) => name.endsWith(".css")).length, 1);
    assert.ok(files["src/styles.css"]);
    for (const [name, file] of Object.entries(files)) {
        if (!file.isBinary) assert.ok(!file.content.includes("--sc-font-size-"), `${name}: Inline font sizes directly`);
    }
    assert.ok(
        !/prefers-color-scheme|data-theme/.test(files["src/styles.css"].content),
        "Standalone styles are fixed to navy"
    );
    const stylesheet = postcss.parse(files["src/styles.css"].content);
    assert.equal(
        stylesheet.nodes.filter((node) => node.type === "rule" && node.selector === ":root").length,
        1,
        "Standalone CSS has one root rule"
    );
    assert.ok(
        stylesheet.nodes.filter((node) => node.type === "rule" && node.selector === ".sc-chart-wrapper").length <= 1,
        "Standalone CSS has at most one chart wrapper rule"
    );
    stylesheet.walkRules(":root", (rule) => {
        const parent = rule.parent;
        if (parent?.type === "atrule" && parent.name === "media" && /^\(min-width:\s*\d+px\)$/.test(parent.params)) {
            assert.ok(
                !rule.nodes.some((node) => node.type === "decl" && node.prop === "font-size"),
                "Standalone CSS must not scale root typography at gallery breakpoints"
            );
        }
    });
    assert.equal(
        Object.values(files).reduce(
            (count, file) => count + (file.content.match(/import ["']\.\/styles\.css["']/g) ?? []).length,
            0
        ),
        files["angular.json"] ? 0 : 1
    );
    const pkg = getPackageJson(files);
    assert.ok(pkg.scripts.dev, "Every generated project supports the README dev command");
    if (files["src/App.tsx"]) assert.ok(pkg.dependencies.react, "JSX runtime requires React explicitly");
    const imported = getExampleDependencies(files, pkg.dependencies);
    for (const [name, version] of Object.entries(imported)) assert.equal(pkg.dependencies[name], version);
    for (const [name, file] of Object.entries(files)) {
        assert.equal(typeof file.content, "string", name);
        assert.ok(!name.includes("_shared/"), name);
        if (!/\.[jt]sx?$/.test(name)) continue;
        for (const ref of moduleReferences(file.content, name)) {
            if (!ref.text.startsWith(".")) continue;
            const target = path.posix.join(path.posix.dirname(name), ref.text);
            assert.ok(
                [target, ...[".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"].map((ext) => target + ext)].some(
                    (target) => files[target]
                ),
                `${name}: ${ref.text}`
            );
        }
    }
};

const checkFixtures = async () => {
    const buttonCss = createExampleStylesheet(
        '<button className="sc-button" />',
        await fs.promises.readFile(path.join(root, "styles/sc-ui.css"), "utf8")
    );
    assert.ok(!buttonCss.includes("--sc-font-size-"), "Downloads do not need typography tokens");
    assert.match(buttonCss, /font: 500 0\.875rem\s*\/\s*1\b/, "Keep the original button font size");
    const standaloneCss = createExampleStylesheet(
        '<div className="sc-chart-wrapper flex gap-2"><button className="sc-button sc-button-outline"><svg /></button></div>',
        `:root { --sc-text: white; --sc-background: black; --sc-theme-bg: navy; color-scheme: dark; }
        [data-theme="navy"] { --sc-theme-bg: navy; color-scheme: dark; }
        [data-theme="navy"] .sc-chart-wrapper, .sc-chart-wrapper[data-theme="navy"] { --sc-background: #0b162a; }
        .sc-chart-wrapper { background: var(--sc-theme-bg); color: var(--sc-background); }
        .sc-button { color: var(--sc-text); &:hover { opacity: .8; }
            &.sc-button-outline, &.sc-button-icon { border: 1px solid; }
            &.sc-button-danger { color: red; } svg { width: 1rem; } img { width: 2rem; }
            @media (max-width: 600px) { .sc-unused-child { display: none; } }
        }
        .flex { display: flex !important; } .gap-2 { gap: .5rem !important; } .unused { display: none; }`
    );
    const standaloneRules = postcss.parse(standaloneCss).nodes.filter((node) => node.type === "rule");
    assert.equal(standaloneRules.filter((rule) => rule.selector === ":root").length, 1, "One navy root rule");
    assert.equal(
        standaloneRules.filter((rule) => rule.selector === ".sc-chart-wrapper").length,
        1,
        "Navy overrides belong in the component rule"
    );
    assert.deepEqual(
        standaloneRules.slice(0, 3).map((rule) => rule.selector),
        [":root", ".flex", ".gap-2"]
    );
    assert.ok(standaloneCss.includes("--sc-background: #0b162a"));
    assert.ok(standaloneCss.includes("&:hover") && standaloneCss.includes("&.sc-button-outline"));
    assert.ok(standaloneCss.includes("svg"));
    assert.ok(!/sc-button-icon|sc-button-danger|sc-unused-child|\.unused|img|max-width/.test(standaloneCss));
    const css = createExampleStylesheet(
        '<div className="sc-chart-wrapper flex"><button className="sc-button" /></div>; // className="sc-select"',
        ":root{--used:red;--unused:blue}.sc-chart-wrapper{display:block}.flex{display:flex}.sc-button{color:var(--used);&:focus-visible{outline:1px solid}}.sc-select{display:none}",
        "/* Local demo */\n.special { animation: pulse 1s; }\n@keyframes pulse { to { opacity: 0; } }"
    );
    assert.ok(css.includes("    display: flex;"));
    assert.ok(css.includes("--used: red"));
    assert.ok(!css.includes("--unused"));
    assert.ok(!css.includes("sc-select"));
    assert.ok(css.includes("@keyframes pulse"));
    assert.ok(css.includes("/* Local demo */"));
    const nativeCss = createExampleStylesheet(
        'const generic = <T>(value: T) => value; element("button", root, "flex"); root.classList.add("gap-2"); root.className = "relative"; function chart(className = "h-full") {}',
        ".flex{display:flex}.gap-2{gap:0.5rem}.relative{position:relative}.h-full{height:100%}button{font:inherit}.unused{display:none}"
    );
    for (const selector of [".flex", ".gap-2", ".relative", ".h-full", "button"])
        assert.ok(nativeCss.includes(selector));
    assert.ok(!nativeCss.includes(".unused"));
    const navyCss = createExampleStylesheet(
        '<button className="sc-button" />',
        `:root { --tone: black; } .sc-button { color: var(--tone); }
        @media (prefers-color-scheme: light) { :root { --tone: white; } }
        [data-theme="light"] { --tone: yellow; }
        [data-theme="dark"] { --tone: gray; }
        [data-theme="navy"] { --tone: navy; }
        [data-theme="navy"] .sc-button, .sc-button[data-theme="navy"] { background: blue; }
        @media (max-width: 600px) { .sc-button { width: 100%; } }`
    );
    assert.ok(navyCss.includes("--tone: navy"));
    assert.ok(navyCss.includes("background: blue"));
    assert.ok(!/prefers-color-scheme|data-theme|black|white|yellow|gray/.test(navyCss));
    assert.ok(navyCss.includes("max-width: 600px"), "Responsive layout media queries remain");
    const resources = createExampleStylesheet(
        '<button className="sc-button" />',
        '@font-face { font-family: UnusedFont; src: url("unused.woff2"); } @keyframes unused { to { opacity: 0; } } .sc-button { color: red; }'
    );
    assert.ok(!resources.includes("UnusedFont"));
    assert.ok(!resources.includes("@keyframes unused"));
    const responsiveCss = createExampleStylesheet(
        '<button className="sc-button" />',
        `
        :root { font-size: 87.5%; }
        @media (min-width: 600px) { :root { font-size: 93.75%; } .sc-button { width: 50%; } }
        @media (min-width: 960px) { :root { font-size: 96.875%; } }
        @media (min-width: 1460px) { :root { font-size: 100%; } }
    `
    );
    assert.ok(responsiveCss.includes("font-size: 87.5%"));
    assert.ok(responsiveCss.includes("width: 50%"), "Responsive demo layouts are preserved");
    assert.ok(
        !responsiveCss.includes("93.75%") && !responsiveCss.includes("96.875%") && !responsiveCss.includes("100%")
    );
    assert.ok(
        !responsiveCss.includes("960px") && !responsiveCss.includes("1460px"),
        "Empty font-size media queries are removed"
    );
    const merged = useSingleExampleStylesheet(
        {
            "src/App.tsx": {
                content: 'import "./local.css"; /* Demo CSS */\nexport default () => null;',
                isBinary: false,
            },
            "src/local.css": { content: ".local {}", isBinary: false },
        },
        css,
        "src/App.tsx"
    );
    assert.equal(Object.keys(merged).filter((key) => key.endsWith(".css")).length, 1);
    assert.equal((merged["src/App.tsx"].content.match(/import "\.\/styles\.css"/g) ?? []).length, 1);
    assert.deepEqual(
        Object.keys(
            getExampleDependencies(
                {
                    "src/helper.ts": {
                        content:
                            'import { io } from "socket.io-client";\nconst dates = import("date-fns/format");\n// import "scichart-financial-tools";',
                        isBinary: false,
                    },
                },
                { zustand: "unused" }
            )
        ),
        ["date-fns", "socket.io-client"]
    );
    const temp = await fs.promises.mkdtemp(path.join(os.tmpdir(), "sandbox-graph-"));
    try {
        await fs.promises.mkdir(path.join(temp, "a"));
        await fs.promises.mkdir(path.join(temp, "b"));
        await fs.promises.writeFile(
            path.join(temp, "index.tsx"),
            'export { a } from "./a/helper";\nexport const lazy = () => import("./b/helper");'
        );
        await fs.promises.writeFile(
            path.join(temp, "a/helper.ts"),
            'export const a = 1;\nexport { lazy } from "../index";'
        );
        await fs.promises.writeFile(path.join(temp, "b/helper.ts"), "export const b = 2;");
        const files = await getSourceFilesForPath(temp, "index.tsx", "", "App.tsx");
        assert.equal(Object.keys(files).length, 3);
        assert.equal(new Set(Object.keys(files)).size, 3);
        assert.ok(Object.values(files).some((file) => file.content.includes('from "./App"')));
        await fs.promises.writeFile(path.join(temp, "image.ts"), 'import logo from "./logo.png"; export { logo };');
        const imageFiles = await getSourceFilesForPath(temp, "image.ts", "https://www.scichart.com");
        assert.equal(Object.keys(imageFiles).length, 1);
        assert.ok(
            imageFiles["src/image.ts"].content.includes('const logo = "https://www.scichart.com/demo/images/logo.png"')
        );
        await fs.promises.mkdir(path.join(temp, "icons"));
        await fs.promises.writeFile(
            path.join(temp, "icons/index.tsx"),
            "export const PlayIcon = () => <svg />;\nexport const StopIcon = () => <svg />;\nexport const UnusedIcon = () => <svg />;"
        );
        await fs.promises.writeFile(
            path.join(temp, "index.tsx"),
            'import { PlayIcon, StopIcon as Pause, UnusedIcon } from "./icons";\nexport default () => <><PlayIcon /><Pause /></>;'
        );
        const iconFiles = await getSourceFilesForPath(temp, "index.tsx", "", "App.tsx");
        assert.ok(iconFiles["src/icons.tsx"], "The icon module has a descriptive filename");
        assert.ok(iconFiles["src/icons.tsx"].content.includes("PlayIcon"));
        assert.ok(iconFiles["src/icons.tsx"].content.includes("StopIcon"));
        assert.ok(!iconFiles["src/icons.tsx"].content.includes("UnusedIcon"));
        assert.ok(!iconFiles["src/App.tsx"].content.includes("UnusedIcon"));
    } finally {
        await fs.promises.rm(temp, { recursive: true, force: true });
    }
};

const main = async () => {
    await checkFixtures();
    let projects = 0;
    let examples = 0;
    const failures: string[] = [];
    const visit = async (folder: string): Promise<void> => {
        const entries = await fs.promises.readdir(folder, { withFileTypes: true });
        if (!entries.some((entry) => /^exampleInfo\.tsx?$/.test(entry.name))) {
            for (const entry of entries) if (entry.isDirectory()) await visit(path.join(folder, entry.name));
            return;
        }
        examples++;
        for (const framework of Object.values(EPageFramework)) {
            assert.ok(
                entries.some((entry) => entry.name === entryFiles[framework]),
                `${folder}: Missing ${entryFiles[framework]}`
            );
            try {
                const config = await getSandboxConfig(
                    folder,
                    {
                        path: "sandbox-check",
                        title: framework === EPageFramework.React ? "Sandbox check" : (name) => `${name} Sandbox check`,
                    } as TExampleInfo,
                    framework,
                    "",
                    path.join(root, "styles")
                );
                assert.equal(config.actualFramework, framework, "Existing variants must not silently fall back");
                checkProject(
                    config.files,
                    framework === EPageFramework.React
                        ? "Sandbox check"
                        : `${framework === EPageFramework.Vanilla ? "JavaScript" : "Angular"} Sandbox check`
                );
                projects++;
            } catch (error) {
                failures.push(
                    `${path.relative(root, folder)} (${framework}): ${error instanceof Error ? error.message : error}`
                );
            }
        }
    };
    await visit(root);
    assert.equal(failures.length, 0, failures.join("\n"));
    console.log(
        `Validated ${projects} runnable projects across ${examples} examples, plus CSS and import-graph fixtures.`
    );
};
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
