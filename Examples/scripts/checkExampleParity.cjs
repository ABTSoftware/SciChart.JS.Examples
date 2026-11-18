// Checks that every example's exported JavaScript project renders the same UI as its React version.
//
//   npm run dev                                   (in another terminal; the React side is read from it)
//   npm run checkExampleParity                    all examples
//   npm run checkExampleParity -- <path> [...]    e.g. trading-drawing-tools
//
// Options: --framework=react   compare the exported React project instead (isolates CSS-only differences)
//          --mobile            390px wide viewport instead of 1600px
//          --dev=<origin>      dev server origin (default http://localhost:8080)
//          --workers=<n>       parallel browsers when checking many examples (default 3)
//
// Each example is exported exactly as the download button does, bundled with esbuild and loaded in headless
// Chrome next to /iframe/<path>. The two DOM trees are compared (elements, order, classes, attributes, inline
// styles, text), then, when the structure matches, computed styles and geometry. Chart surfaces are opaque.
// Because createExample.ts is shared by vanilla.ts and angular.ts, the JavaScript export covers Angular too.
const fs = require("fs");
const os = require("os");
const path = require("path");
const express = require("express");
const esbuild = require("esbuild");
const { chromium } = require("playwright-core");
const { createProxyMiddleware } = require("http-proxy-middleware");

const root = path.resolve(__dirname, "..");
const examplesRoot = path.join(root, "src/components/Examples");
const args = process.argv.slice(2);
const option = (name, fallback) => (args.find((arg) => arg.startsWith(`--${name}=`)) ?? "").split("=")[1] || fallback;
const dev = option("dev", "http://localhost:8080");
const framework = option("framework", "javascript");
const workers = Number(option("workers", "3"));
const viewport = args.includes("--mobile") ? { width: 390, height: 800 } : { width: 1600, height: 900 };

/** Serves each exported project at /export/<path>/ and proxies everything else to the dev server. */
const startServer = async () => {
    require("ts-node").register({
        project: path.join(root, "tsconfig.node.json"),
        transpileOnly: true,
        compilerOptions: { module: "commonjs", moduleResolution: "node" },
    });
    const { readSourceFiles } = require(path.join(root, "src/server/services/sandbox/readSourceFiles.ts"));
    const examples = new Map();
    for (const entry of fs.readdirSync(examplesRoot, { recursive: true })) {
        if (!/exampleInfo\.tsx?$/.test(entry)) continue;
        const file = path.join(examplesRoot, entry);
        const info = require(file).default;
        examples.set(info.path, { folder: path.dirname(file), info });
    }
    const workDir = fs.mkdtempSync(path.join(os.tmpdir(), "sc-parity-"));
    const bundles = new Map();
    const app = express();
    let origin = "";
    app.get("/export/:example/:file", async (request, response) => {
        try {
            const { example, file } = request.params;
            if (file !== "index.html") {
                const output = bundles.get(example)?.[file];
                // Data files that examples fetch relative to the page live at the dev server root.
                return output === undefined ? response.redirect(307, "/" + file) : response.type(file).send(output);
            }
            const found = examples.get(example);
            if (!found) return response.status(404).send("Unknown example");
            const project = await readSourceFiles(
                framework,
                found.folder,
                origin,
                path.join(examplesRoot, "styles"),
                found.info
            );
            const folder = path.join(workDir, example);
            fs.rmSync(folder, { recursive: true, force: true });
            for (const { name, content } of project.files) {
                if (typeof content !== "string") continue;
                fs.mkdirSync(path.dirname(path.join(folder, name)), { recursive: true });
                fs.writeFileSync(path.join(folder, name), content);
            }
            const entry = fs.existsSync(path.join(folder, "src/main.tsx")) ? "src/main.tsx" : "src/main.ts";
            const build = await esbuild.build({
                entryPoints: [path.join(folder, entry)],
                bundle: true,
                format: "esm",
                jsx: "automatic",
                write: false,
                outdir: path.join(folder, "out"),
                entryNames: "bundle",
                nodePaths: [path.join(root, "node_modules")],
                loader: Object.fromEntries(
                    [".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp"].map((extension) => [extension, "dataurl"])
                ),
                define: { "process.env.NODE_ENV": '"development"' },
                logLevel: "silent",
            });
            const outputs = Object.fromEntries(build.outputFiles.map((file) => [path.basename(file.path), file.text]));
            bundles.set(example, outputs);
            while (bundles.size > 8) bundles.delete(bundles.keys().next().value);
            const styles = outputs["bundle.css"] === undefined ? "" : '<link rel="stylesheet" href="./bundle.css" />';
            response.send(
                fs
                    .readFileSync(path.join(folder, "index.html"), "utf8")
                    .replace(/<script type="module" src="\/src\/main\.tsx?"><\/script>/, "")
                    .replace("</head>", `${styles}<script type="module" src="./bundle.js"></script></head>`)
            );
        } catch (error) {
            response.status(500).send(`<pre>${String(error?.stack ?? error)}</pre>`);
        }
    });
    app.get(/^\/export\/[^/]+\/(.+\/.+)$/, (request, response) => response.redirect(307, "/" + request.params[0]));
    app.use("/", createProxyMiddleware({ target: dev, changeOrigin: true, logLevel: "silent" }));
    const server = await new Promise((resolve) => {
        const listening = app.listen(0, () => resolve(listening));
    });
    origin = `http://localhost:${server.address().port}`;
    return {
        origin,
        paths: [...examples.keys()].sort(),
        close: () => {
            server.close();
            fs.rmSync(workDir, { recursive: true, force: true });
        },
    };
};

/** Runs in the page: serialises the example UI, treating chart surfaces as opaque leaves. */
function snapshot() {
    const exportedRoot = document.querySelector("body > #chart") ?? document.querySelector("body > #root > *");
    const shell = document.querySelector(".sc-app-iframe");
    const root =
        exportedRoot ??
        (shell
            ? shell.children.length === 1
                ? shell.firstElementChild
                : shell
            : document.body.querySelector(":scope > div") ?? document.body);
    const hosts = new Set();
    for (const canvas of document.querySelectorAll("canvas")) {
        if (!root.contains(canvas)) continue;
        // The SciChart root owns the generated .div-root / .svg-root layers.
        let host = canvas.parentElement;
        while (host && host !== root && ![...host.children].some((child) => child.matches(".div-root, .svg-root")))
            host = host.parentElement;
        if (!host || host === root) host = canvas.parentElement;
        // SciChartReact renders an outer div around the chart root; a port uses one div.
        while (host.parentElement !== root && host.parentElement.children.length === 1) host = host.parentElement;
        hosts.add(host);
    }
    const properties = [
        "display",
        "position",
        "flexDirection",
        "flexWrap",
        "justifyContent",
        "alignItems",
        "columnGap",
        "rowGap",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
        "fontSize",
        "fontWeight",
        "lineHeight",
        "color",
        "backgroundColor",
        "textAlign",
        "borderTopWidth",
        "borderTopColor",
        "borderTopLeftRadius",
        "overflowX",
        "overflowY",
        "opacity",
        "gridTemplateColumns",
    ];
    const attributes = [
        "type",
        "role",
        "title",
        "placeholder",
        "aria-label",
        "aria-pressed",
        "aria-haspopup",
        "aria-hidden",
        "aria-labelledby",
        "aria-expanded",
        "aria-checked",
        "aria-selected",
        "disabled",
        "min",
        "max",
        "step",
        "for",
        "open",
        "href",
        "name",
    ];
    const origin = root.getBoundingClientRect();
    const nodes = [];
    const visit = (element, depth) => {
        if (["SCRIPT", "STYLE", "LINK"].includes(element.tagName)) return;
        // A hidden element and one that is not rendered are equivalent.
        if (element !== root && element.hidden) return;
        const tag = element.tagName.toLowerCase();
        let label = hosts.has(element) ? "CHART" : tag === "svg" ? "svg" : "";
        const opaque = label !== "";
        if (!opaque) {
            const classes = [...element.classList].sort().join(".");
            const attrs = attributes
                .filter((name) => element.hasAttribute(name))
                .map((name) => `${name}=${JSON.stringify(element.getAttribute(name))}`)
                .join(" ");
            const style = element === root ? "" : element.style.cssText.replace(/\s+/g, " ").trim();
            const text = [...element.childNodes]
                .filter((node) => node.nodeType === Node.TEXT_NODE)
                .map((node) => node.textContent.replace(/\s+/g, " ").trim())
                .filter(Boolean)
                .join(" | ");
            const value = ["input", "select", "textarea"].includes(tag)
                ? ` value=${JSON.stringify(
                      ["checkbox", "radio"].includes(element.type) ? element.checked : element.value
                  )}`
                : "";
            label =
                tag +
                (classes ? "." + classes : "") +
                (attrs ? ` [${attrs}]` : "") +
                value +
                (style ? ` {${style}}` : "") +
                (text ? ` "${text}"` : "");
        }
        const rect = element.getBoundingClientRect();
        const computed = getComputedStyle(element);
        nodes.push({
            line: "  ".repeat(depth) + label,
            opaque,
            rect: [rect.left - origin.left, rect.top - origin.top, rect.width, rect.height].map(Math.round),
            computed: Object.fromEntries(properties.map((name) => [name, computed[name]])),
        });
        if (!opaque) for (const child of element.children) visit(child, depth + 1);
    };
    visit(root, 0);
    return { nodes, charts: hosts.size };
}

const diffLines = (a, b) => {
    const table = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
    for (let i = a.length - 1; i >= 0; i--)
        for (let j = b.length - 1; j >= 0; j--)
            table[i][j] = a[i] === b[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
    const output = [];
    let i = 0;
    let j = 0;
    while (i < a.length || j < b.length) {
        if (i < a.length && j < b.length && a[i] === b[j]) output.push("  " + a[i++]) && j++;
        else if (j >= b.length || (i < a.length && table[i + 1][j] >= table[i][j + 1])) output.push("- " + a[i++]);
        else output.push("+ " + b[j++]);
    }
    return output;
};

const load = async (context, url) => {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(String(error).slice(0, 300)));
    await page.goto(url, { waitUntil: "load", timeout: 60000 }).catch((error) => errors.push(error.message));
    await page.waitForSelector("canvas", { timeout: 30000 }).catch(() => errors.push("No chart after 30s"));
    await page
        .waitForFunction(() => !document.querySelector(".scichart_loader"), null, { timeout: 45000 })
        .catch(() => errors.push("Chart still loading after 45s"));
    // Controls created after chart initialisation: wait until the tree stops changing.
    let previous;
    let result;
    for (let attempt = 0; attempt < 12; attempt++) {
        await page.waitForTimeout(700);
        result = await page.evaluate(snapshot);
        const current = result.nodes.map((node) => node.line).join("\n");
        if (current === previous && attempt >= 2) break;
        previous = current;
    }
    await page.close();
    return { ...result, errors };
};

const compare = async (context, origin, example) => {
    const sides = {};
    for (const [side, url] of [
        ["react", `${origin}/iframe/${example}`],
        ["exported", `${origin}/export/${example}/index.html`],
    ]) {
        sides[side] = await load(context, url);
        // The dev server occasionally fails a lazy chunk under load.
        if (!sides[side].charts) sides[side] = await load(context, url);
    }
    const { react, exported } = sides;
    const report = [];
    if (!react.charts) {
        return { status: "skipped", report: ["React version did not load:", ...react.errors.map((e) => "  " + e)] };
    }
    if (exported.errors.length) report.push("Exported project errors:", ...exported.errors.map((e) => "  " + e));
    const lines = (side) => side.nodes.map((node) => node.line);
    // Live readouts (timings, frame rates, progress) differ between two page loads.
    const withoutNumbers = (side) =>
        lines(side).map((line) => line.replace(/"[^"]*"$/, (text) => text.replace(/[\d.,]+/g, "N")));
    const structure = diffLines(lines(react), lines(exported));
    if (diffLines(withoutNumbers(react), withoutNumbers(exported)).some((line) => !line.startsWith("  "))) {
        report.push("Structure differs (- React only, + exported only):", ...structure);
        return { status: "different", report };
    }
    react.nodes.forEach((node, index) => {
        const other = exported.nodes[index];
        const notes = [];
        if (node.rect.some((value, side) => Math.abs(value - other.rect[side]) > 2))
            notes.push(`rect: React ${node.rect} / exported ${other.rect}`);
        if (index > 0 && !node.opaque) {
            for (const [name, value] of Object.entries(node.computed))
                if (value !== other.computed[name])
                    notes.push(`${name}: React ${value} / exported ${other.computed[name]}`);
        }
        if (notes.length) report.push(node.line.trim(), ...notes.map((note) => "    " + note));
    });
    if (report.length > (exported.errors.length ? exported.errors.length + 1 : 0)) {
        report.unshift("Same structure, different styles or layout:");
        return { status: "different", report };
    }
    return { status: "ok", nodes: react.nodes.length, report };
};

const main = async () => {
    await fetch(dev).catch(() => {
        throw new Error(`Dev server not reachable at ${dev}. Start it with "npm run dev".`);
    });
    const server = await startServer();
    const requested = args.filter((arg) => !arg.startsWith("--"));
    const unknown = requested.filter((example) => !server.paths.includes(example));
    if (unknown.length) throw new Error(`Unknown example path: ${unknown.join(", ")}`);
    const queue = requested.length ? [...requested] : [...server.paths];
    const total = queue.length;
    const counts = { ok: 0, different: 0, skipped: 0 };
    const different = [];
    const worker = async () => {
        // One browser per worker: background tabs are throttled, which stalls chart start-up.
        const launch = (options) => chromium.launch({ headless: true, ...options });
        const browser = await launch({ channel: "chrome" }).catch(() => launch({}));
        const context = await browser.newContext({ viewport });
        await context.addInitScript(() => localStorage.setItem("scichart-demo-theme", "navy"));
        try {
            while (queue.length) {
                const example = queue.shift();
                const result = await compare(context, server.origin, example).catch((error) => ({
                    status: "different",
                    report: [String(error?.stack ?? error)],
                }));
                counts[result.status]++;
                if (result.status === "different") different.push(example);
                console.log(`${result.status.padEnd(9)} ${example}${result.nodes ? ` (${result.nodes} nodes)` : ""}`);
                if (result.status !== "ok" || total === 1) for (const line of result.report) console.log("    " + line);
            }
        } finally {
            await browser.close();
        }
    };
    try {
        await Promise.all(Array.from({ length: Math.min(workers, total) }, worker));
    } finally {
        server.close();
    }
    console.log(
        `\n${counts.ok} of ${total} examples match React (${framework} export); ` +
            `${counts.different} differ, ${counts.skipped} skipped.`
    );
    if (different.length) {
        console.log("Different: " + different.sort().join(", "));
        process.exitCode = 1;
    }
};

main().catch((error) => {
    console.error(error.message ?? error);
    process.exitCode = 1;
});
