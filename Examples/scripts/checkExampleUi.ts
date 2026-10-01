import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import * as ts from "typescript";
import * as vm from "node:vm";
import { processFiles } from "../src/components/AppDetailsRouters/utils";
import { createExampleStylesheet, useSingleExampleStylesheet } from "../src/server/services/sandbox/sandboxStyles";
import {
    getSourceFilesForPath,
    includeExternalModules,
    IFiles,
} from "../src/server/services/sandbox/sandboxDependencyUtils";

import { getReactSandBoxConfig } from "../src/server/services/sandbox/reactConfig";
import { getAngularSandBoxConfig } from "../src/server/services/sandbox/angularConfig";
import { getVanillaTsSandBoxConfig } from "../src/server/services/sandbox/vanillaTsConfig";

const postcss: typeof import("postcss") = require("postcss");
const selectors: typeof import("postcss-selector-parser") = require("postcss-selector-parser");

const walk = async (folder: string): Promise<string[]> => {
    const entries = await fs.readdir(folder, { withFileTypes: true });
    return (
        await Promise.all(
            entries.map((entry) => {
                const name = path.join(folder, entry.name);
                return entry.isDirectory() ? walk(name) : [name];
            })
        )
    ).flat();
};

const main = async () => {
    const css = `:root { --radius: 6px; --tone: var(--ink); --ink: white; --unused: red; }
        .sc-button { color: var(--tone); border-radius: var(--radius);
            &:not(.unused) { opacity: .9; } svg { width: 16px; }
            &.sc-button-outline { border: 1px solid; } }
        :is(.sc-button, .unused):hover { color: black; }
        .wrapper { &:has(> .toolbar) { display: flex; > :not(.toolbar) { flex: 1; } } }
        .unused { color: red; }
        @media (width < 600px) { .unused { color: blue; } }
        @supports (appearance: base-select) { .sc-select { color: white; } }
        .sc-input { &::-webkit-slider-thumb { border: 0; } }`;
    const files: IFiles = {
        "src/App.tsx": { content: '<div className="wrapper"><Toolbar /></div>', isBinary: false },
        "src/Toolbar.tsx": {
            content:
                '<header className="toolbar"><button className="sc-button sc-button-outline"><Icon /></button></header>',
            isBinary: false,
        },
        "src/Icon.tsx": { content: "<svg><path /></svg>", isBinary: false },
        "src/local.css": { content: ".local { border-radius: var(--radius); }", isBinary: false },
    };
    const result = useSingleExampleStylesheet(files, css, "src/App.tsx", "./index.css");
    const output = result["src/index.css"].content;
    assert(output.includes("&:not(.unused)"), "negative selectors are not requirements");
    assert(output.includes("svg {"), "helper SVG sizing survives");
    assert(output.includes("&.sc-button-outline"), "helper classes survive");
    assert(output.includes(":is(.sc-button):hover"), "selector alternatives are pruned independently");
    assert(output.includes("&:has(> .toolbar)"), "toolbar layout survives");
    assert(output.includes("--ink:"), "transitive tokens survive");
    assert(!output.includes("--unused:"));
    assert(!output.includes("@media"));
    assert(!output.includes("@supports"));
    assert(!output.includes(".unused {"));
    assert(!files["src/App.tsx"].content.includes("import"), "input files are not mutated");
    assert.equal(
        (
            useSingleExampleStylesheet(result, css, "src/App.tsx", "./index.css")["src/App.tsx"].content.match(
                /import "\.\/index.css"/g
            ) ?? []
        ).length,
        1
    );
    assert(
        !createExampleStylesheet('<div className="wrapper" />', css).includes(":has"),
        "unused toolbar layout is omitted"
    );
    assert(
        createExampleStylesheet("<div />", css, ".local { color: var(--tone); }").includes("--ink:"),
        "local CSS token dependencies survive"
    );
    assert(
        createExampleStylesheet('<input className="sc-input" />', css).includes("::-webkit-slider-thumb"),
        "native pseudo-elements survive"
    );

    // Folder modules, nested relative imports, cycles and two styles.css files must remain distinct.
    const fixture = await fs.mkdtemp(path.join(os.tmpdir(), "sc-ui-"));
    try {
        const demo = path.join(fixture, "demo");
        const helper = path.join(fixture, "Panel");
        await fs.mkdir(demo);
        await fs.mkdir(helper);
        await fs.writeFile(path.join(demo, "styles.css"), ".demo {}\n");
        await fs.writeFile(path.join(helper, "styles.css"), ".panel {}\n");
        await fs.writeFile(
            path.join(helper, "index.tsx"),
            'import "./styles.css";\nexport { nested } from "./nested";\n'
        );
        await fs.writeFile(path.join(helper, "nested.ts"), 'import "./index";\nexport const nested = 1;\n');
        const copied: IFiles = {};
        const code = await includeExternalModules(
            demo,
            demo,
            copied,
            'import "./styles.css";\nimport { nested } from "../Panel";',
            false,
            true
        );
        assert(code.includes("./_shared/Panel/index"));
        assert.equal(copied["src/styles.css"].content, ".demo {}\n");
        assert.equal(copied["src/_shared/Panel/styles.css"].content, ".panel {}\n");
        assert(copied["src/_shared/Panel/index.tsx"].content.includes('from "./nested"'));
        const withImage: IFiles = {};
        await includeExternalModules(
            demo,
            demo,
            withImage,
            'import image from "./nokia.png";',
            true,
            true,
            "https://www.scichart.com"
        );
        assert.equal(withImage["src/nokia.png"].content, "https://www.scichart.com/demo/images/nokia.png");
        assert.deepEqual(
            processFiles([{ name: "index.tsx" }, { name: "_shared/Panel/index.tsx" }]).map((file) => file.name),
            ["index.tsx", "_shared/Panel/index.tsx"]
        );
        await assert.rejects(includeExternalModules(demo, demo, {}, 'import "./missing";', false, true), /not found/);
    } finally {
        await fs.rm(fixture, { recursive: true, force: true });
    }

    const root = path.resolve(__dirname, "../src/components/Examples");
    const uiCss = await fs.readFile(path.join(root, "styles/sc-ui.css"), "utf8");
    // Check automatic streaming at the React chart's initialization/cleanup seam.
    {
        const source = await fs.readFile(path.join(root, "FeaturedApps/ShowCases/WebsocketBigData/index.tsx"), "utf8");
        const compiled = ts.transpileModule(source, {
            compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
        }).outputText;
        const exports: Record<string, any> = {};
        const stateUpdates: unknown[] = [];
        const controlsRef: { current: unknown } = { current: undefined };
        vm.runInNewContext(compiled, {
            exports,
            require: () => ({
                useRef: () => controlsRef,
                useState: (value: unknown) => [value, (next: unknown) => stateUpdates.push(next)],
                jsx: (type: unknown, props: unknown) => ({ type, props }),
                jsxs: (type: unknown, props: unknown) => ({ type, props }),
                ESeriesType: { LineSeries: "LineSeries" },
                drawExample: () => () => {},
                SciChartReact: "chart",
                ChartGroupLoader: "loader",
            }),
        });
        const chart = exports.default().props.children.find((child: any) => child.type === "chart");
        const events: string[] = [];
        const cleanup = chart.props.onInit({
            controls: {
                updateSettings: (settings: Record<string, number>) => {
                    assert.equal(settings.initialPoints, 10000);
                    assert.equal(settings.pointsPerUpdate, 10);
                    events.push("settings");
                },
                startUpdate: () => events.push("start"),
                stopUpdate: () => events.push("stop"),
            },
        });
        assert.deepEqual(events, ["settings", "start"], "chart starts after applying initial settings");
        assert(stateUpdates.includes(true), "playback button reflects automatic start");
        cleanup();
        assert.equal(controlsRef.current, undefined, "cleanup releases disposed chart controls");
        assert.deepEqual(events, ["settings", "start", "stop"], "unmount stops streaming");
    }

    // Exercise exported Angular playback handlers without bootstrapping a chart or Angular runtime.
    for (const demo of [
        "Charts2D/BasicChartTypes/HeatmapChart",
        "FeaturedApps/PerformanceDemos/RealtimePerformanceDemo",
        "FeaturedApps/ShowCases/HeatmapInteractions",
        "FeaturedApps/ShowCases/WebsocketBigData",
    ]) {
        const events: string[] = [];
        const controls = {
            startUpdate: () => events.push("start"),
            stopUpdate: () => events.push("stop"),
            twoPoint: () => events.push("basic"),
            interference: () => events.push("doubleSlit"),
        };
        const source = await fs.readFile(path.join(root, demo, "angular.ts"), "utf8");
        const compiled = ts.transpileModule(source, {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2020,
                experimentalDecorators: true,
            },
        }).outputText;
        const exports: Record<string, any> = {};
        vm.runInNewContext(compiled, {
            exports,
            require: () => ({
                Component: () => (component: unknown) => component,
                drawExample: () => () => {},
                getChartsInitializationApi: () => ({}),
                ESeriesType: { LineSeries: "LineSeries" },
            }),
        });
        const Component = exports.AppComponent ?? exports.RealtimeBigDataShowcaseComponent;
        const app = new Component({});
        app.initResult = { controls };
        app.controlsRef = controls;
        app.controls = controls;
        const toggle = () => (app.togglePlayback ?? app.toggleStreaming).call(app);
        assert.equal(app.isRunning, false, `${demo}: initially stopped`);
        toggle();
        assert.equal(app.isRunning, true, `${demo}: starts`);
        toggle();
        assert.equal(app.isRunning, false, `${demo}: stops`);
        assert.deepEqual(events, ["start", "stop"], `${demo}: one operation per click`);
        if (app.loadBasicExample) {
            app.loadBasicExample();
            assert.equal(app.isRunning, true, `${demo}: loading a preset starts playback`);
            toggle();
            assert.equal(events[events.length - 1], "stop", `${demo}: preset playback can stop`);
        }
    }
    const entries = (await walk(root)).filter(
        (name) =>
            /\/(?:Charts2D|Charts3D|FeaturedApps|BuilderApi)\//.test(name) &&
            /\/(?:index\.tsx|angular\.ts|vanilla\.ts)$/.test(name)
    );
    let demos = 0;
    const sizes: number[] = [];
    const controlSizes: number[] = [];
    const missing = new Set<string>();
    for (const entry of entries) {
        if (entry.endsWith("index.tsx")) demos++;
        const sources = await getSourceFilesForPath(path.dirname(entry), path.basename(entry), "");
        const htmlPath = path.join(path.dirname(entry), "index.html");
        if (entry.endsWith("vanilla.ts")) {
            try {
                sources[htmlPath] = { content: await fs.readFile(htmlPath, "utf8"), isBinary: false };
            } catch (error) {
                if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
            }
        }
        const configure = entry.endsWith("index.tsx")
            ? getReactSandBoxConfig
            : entry.endsWith("angular.ts")
            ? getAngularSandBoxConfig
            : getVanillaTsSandBoxConfig;
        const metadata = { path: "example", title: "Example" } as Parameters<typeof configure>[1];
        const copied = (await configure(path.dirname(entry), metadata, "https://www.scichart.com")).files;
        for (const [name, file] of Object.entries(copied)) {
            if (file.isBinary || !/\.[jt]sx?$/.test(name)) continue;
            const ast = ts.createSourceFile(name, file.content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
            for (const statement of ast.statements) {
                if (!ts.isImportDeclaration(statement) && !ts.isExportDeclaration(statement)) continue;
                const specifier = statement.moduleSpecifier;
                if (!specifier || !ts.isStringLiteral(specifier) || !specifier.text.startsWith(".")) continue;
                const target = path.posix.normalize(path.posix.join(path.posix.dirname(name), specifier.text));
                assert(
                    ["", ".ts", ".tsx", ".js", ".jsx", "/index.ts", "/index.tsx"].some(
                        (suffix) => copied[target + suffix]
                    ),
                    `${entry}: missing exported import ${name} → ${specifier.text}`
                );
            }
        }
        const exported = useSingleExampleStylesheet(sources, uiCss, entry)["src/index.css"].content;
        sizes.push(Buffer.byteLength(exported));
        if (/sc-(?:button|switch|select|range|input|checkbox)\b/.test(exported))
            controlSizes.push(Buffer.byteLength(exported));
        const source = Object.entries(sources)
            .filter(([name]) => /\.[jt]sx?$|\.html$/.test(name))
            .map(([, file]) => file.content)
            .join("\n");
        const required = new Set(Array.from(source.matchAll(/(?<![\w-])sc-[\w-]+/g), (match) => match[0]));
        const retained = new Set<string>();
        const parsed = postcss.parse(exported);
        parsed.walkRules((rule) => {
            selectors((ast) =>
                ast.walkClasses((node) => {
                    retained.add(node.value);
                })
            ).processSync(rule.selector);
        });
        const localCss = Object.entries(sources)
            .filter(([name]) => name.endsWith(".css"))
            .map(([, file]) => file.content)
            .join("\n");
        postcss.parse(localCss).walkRules((rule) => {
            selectors((ast) =>
                ast.walkClasses((node) => {
                    retained.add(node.value);
                })
            ).processSync(rule.selector);
        });
        for (const name of required) {
            if (!retained.has(name)) missing.add(`${path.relative(root, entry)}: ${name}`);
        }
        assert(!/@mui\/|\.scss["']/.test(source), `${entry}: exported UI dependencies`);
        assert(
            !/sc-button-(?:primary|secondary|danger)\b|sc-select-standard/.test(source),
            `${entry}: obsolete controls`
        );
    }
    assert.deepEqual([...missing], [], "All control classes need shared or local CSS");
    assert.equal(demos, 181);
    sizes.sort((a, b) => a - b);
    controlSizes.sort((a, b) => a - b);
    console.log(
        `Checked ${demos} demos / ${entries.length} framework entries. Shared CSS: ${Buffer.byteLength(
            uiCss
        )} bytes; exported CSS median ${sizes[Math.floor(sizes.length / 2)]}, max ${
            sizes[sizes.length - 1]
        } bytes; demos with controls median ${controlSizes[Math.floor(controlSizes.length / 2)]} bytes.`
    );
};

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
