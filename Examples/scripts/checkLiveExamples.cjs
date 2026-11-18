// Checks that every example project runs in the live frame, in React and JavaScript.
//
//   npm run dev                                   (in another terminal)
//   npm run checkLiveExamples                     all examples
//   npm run checkLiveExamples -- <path> [...]     e.g. line-chart
//
// Options: --framework=react|javascript   one framework only
//          --dev=<origin>                 dev server origin (default http://localhost:8080)
//          --workers=<n>                  parallel pages (default 3)
//
// For each example the unmodified project is sent to /live-frame exactly as the page does. It expects `run-ok`,
// no errors and a canvas, then runs it a second time to prove teardown. It also lists bare imports that the
// runtime does not provide: those examples need `liveEdit: false`.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright-core");

const root = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const option = (name, fallback) => (args.find((arg) => arg.startsWith(`--${name}=`)) ?? "").split("=")[1] || fallback;
const dev = option("dev", "http://localhost:8080");
const workers = Number(option("workers", "3"));
const frameworks = option("framework", "") ? [option("framework")] : ["react", "javascript"];
const selected = args.filter((arg) => !arg.startsWith("--"));
const PROVIDED =
    /^(react|react-dom|react-dom\/client|react\/jsx-runtime|scichart|scichart\/.+|scichart-react|scichart-financial-tools|rxjs|zustand|zustand\/vanilla)$/;

const examplePaths = () => {
    require("ts-node").register({
        project: path.join(root, "tsconfig.node.json"),
        transpileOnly: true,
        compilerOptions: { module: "commonjs", moduleResolution: "node" },
    });
    const examplesRoot = path.join(root, "src/components/Examples");
    const result = [];
    for (const entry of fs.readdirSync(examplesRoot, { recursive: true })) {
        if (!/exampleInfo\.tsx?$/.test(entry)) continue;
        const info = require(path.join(examplesRoot, entry)).default;
        if (info?.path && info.liveEdit !== false) result.push(info.path);
        else if (info?.path) skipped.push(info.path);
    }
    return result.sort();
};
const skipped = [];

/** Runs inside the page: hosts the frame the way the example page will, and runs one project in it. */
const harness = () => {
    let frame,
        runId = 0,
        runsInFrame = 0;
    const events = [];
    window.addEventListener("message", (e) => {
        if (e.source === frame?.contentWindow && e.origin === location.origin) events.push(e.data);
    });
    const waitFor = (test, ms) =>
        new Promise((resolve, reject) => {
            const end = Date.now() + ms;
            const tick = () => {
                const hit = events.find(test);
                if (hit) return resolve(hit);
                if (Date.now() > end) return reject(new Error("timeout"));
                setTimeout(tick, 20);
            };
            tick();
        });
    window.__live = {
        async open() {
            runsInFrame = 0;
            frame = document.createElement("iframe");
            frame.style.cssText = "width:1200px;height:800px;border:0";
            frame.src = "/live-frame";
            document.body.append(frame);
            await waitFor((m) => m.type === "ready", 20000);
        },
        async run(files, framework) {
            const result = await this.runOnce(files, framework);
            // Same rule as the page: a frame that has run before is replaced when the run says it is stale.
            if (!result.ok && result.errors.some((e) => e.phase === "teardown") && runsInFrame > 1) {
                frame.remove();
                await this.open();
                return this.runOnce(files, framework);
            }
            return result;
        },
        async runOnce(files, framework) {
            runsInFrame++;
            const id = ++runId;
            events.length = 0;
            const sent = performance.now();
            frame.contentWindow.postMessage(
                { type: "run", runId: id, framework, files, themeName: "navy", themeVars: {} },
                location.origin
            );
            try {
                const done = await waitFor((m) => m.runId === id && (m.type === "run-ok" || m.type === "error"), 30000);
                const ms = Math.round(performance.now() - sent);
                await new Promise((r) => setTimeout(r, 400));
                const doc = frame.contentDocument;
                const canvases = [...doc.querySelectorAll("canvas")].filter((c) => c.width > 0 && c.height > 0).length;
                const errors = events.filter((m) => m.type === "error");
                return { ok: done.type === "run-ok" && !errors.length, canvases, ms, errors };
            } catch (e) {
                return {
                    ok: false,
                    canvases: 0,
                    ms: Math.round(performance.now() - sent),
                    errors: [{ message: "no run-ok within 30 s" }, ...events.filter((m) => m.type === "error")],
                };
            }
        },
        close() {
            frame?.contentWindow.postMessage({ type: "dispose" }, location.origin);
            frame?.remove();
        },
    };
};

const main = async () => {
    const paths = selected.length ? selected : examplePaths();
    const browser = await chromium.launch({ channel: "chrome", headless: true });
    const jobs = paths.flatMap((p) => frameworks.map((f) => [p, f]));
    const failures = [];
    const missingImports = new Map();
    const times = [];
    let done = 0;
    const JOB_TIMEOUT_MS = 90000;
    const withTimeout = (promise, label) =>
        Promise.race([
            promise,
            new Promise((_, reject) =>
                setTimeout(() => reject(new Error("hung: no result within 90 s")), JOB_TIMEOUT_MS)
            ),
        ]);
    const openPage = async () => {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
        const page = await ctx.newPage();
        // A real same-origin document to host the frame.
        await page.goto(dev + "/robots.txt");
        await page.evaluate(harness);
        await page.evaluate(() => window.__live.open());
        return { ctx, page };
    };
    const runJob = async (page, example, framework) => {
        const label = `${example} (${framework})`;
        const response = await fetch(`${dev}/source/${example}?framework=${framework}`);
        if (!response.ok) throw new Error(`source ${response.status}`);
        const { files } = await response.json();
        for (const file of files.filter((f) => /^src\/.*\.tsx?$/.test(f.name)))
            for (const m of file.content.matchAll(/(?:from|import)\s*["']([^"'.][^"']*)["']/g))
                if (!PROVIDED.test(m[1])) missingImports.set(example, [...(missingImports.get(example) ?? []), m[1]]);
        const first = await page.evaluate(([f, fw]) => window.__live.run(f, fw), [files, framework]);
        const second = first.ok
            ? await page.evaluate(([f, fw]) => window.__live.run(f, fw), [files, framework])
            : first;
        times.push({ label, first: first.ms, second: second.ms });
        const problem = !first.ok
            ? first
            : !second.ok
            ? second
            : !first.canvases
            ? { errors: [{ message: "no canvas" }] }
            : null;
        if (problem)
            failures.push(
                `${label}: ${problem.errors
                    .map((e) => (e.file ? `${e.file}:${e.line ?? "?"} ` : "") + e.message)
                    .join("; ")}`
            );
    };
    const worker = async () => {
        let session = await openPage();
        while (jobs.length) {
            const [example, framework] = jobs.shift();
            try {
                await withTimeout(runJob(session.page, example, framework));
            } catch (error) {
                failures.push(`${example} (${framework}): ${error.message}`);
                // The page may be wedged by the example: start over with a fresh one.
                await session.ctx.close().catch(() => {});
                session = await openPage();
            }
            process.stdout.write(`\r${++done}/${paths.length * frameworks.length}`);
        }
        await session.ctx.close();
    };
    await Promise.all(Array.from({ length: workers }, worker));
    await browser.close();
    const sorted = (key) => times.map((t) => t[key]).sort((a, b) => a - b);
    const pct = (a, p) => a[Math.min(a.length - 1, Math.floor(a.length * p))];
    console.log(`\n\nfirst run  p50 ${pct(sorted("first"), 0.5)} ms, p95 ${pct(sorted("first"), 0.95)} ms`);
    console.log(`second run p50 ${pct(sorted("second"), 0.5)} ms, p95 ${pct(sorted("second"), 0.95)} ms`);
    if (skipped.length) console.log(`opted out (liveEdit: false): ${skipped.length}`);
    for (const [example, names] of missingImports)
        console.log(`not provided by the runtime: ${example}: ${[...new Set(names)].join(", ")}`);
    console.log(failures.length ? `\n${failures.length} FAILED:\n${failures.join("\n")}` : "\nall passed");
    process.exit(failures.length ? 1 : 0);
};
main();
