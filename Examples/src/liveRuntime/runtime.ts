/**
 * Entry of the live frame. Receives example projects from the page, compiles them in the browser and runs
 * them. See docs/adr/0001-live-preview-runs-in-a-same-origin-frame.md.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as ReactDOMClient from "react-dom/client";
import * as JsxRuntime from "react/jsx-runtime";
import * as SciChart from "scichart";
import * as Pen2DCacheModule from "scichart/Charting/Drawing/Pen2DCache";
import * as SciChartReact from "scichart-react";
import * as FinancialTools from "scichart-financial-tools";
import * as Rxjs from "rxjs";
import * as Zustand from "zustand";
import * as ZustandVanilla from "zustand/vanilla";
import { transform } from "sucrase";
import { createCompiler, createModuleLoader, ProjectError, ProjectFile } from "./moduleLoader";
import { FrameMessage, LiveFramework, parsePageMessage, isTrustedEvent, PageMessage } from "./protocol";
import { RUNTIME_LICENSE_KEY } from "./runtimeLicense";

const externals: Record<string, unknown> = {
    react: React,
    "react-dom": ReactDOM,
    "react-dom/client": ReactDOMClient,
    "react/jsx-runtime": JsxRuntime,
    scichart: SciChart,
    "scichart-react": SciChartReact,
    "scichart-financial-tools": FinancialTools,
    rxjs: Rxjs,
    zustand: Zustand,
    "zustand/vanilla": ZustandVanilla,
};
const deepModules = { "scichart/Charting/Drawing/Pen2DCache": Pen2DCacheModule };

/** Files that exist only to start a standalone project; the runtime starts the example itself. */
const ENTRY_FILES = new Set(["src/main.ts", "src/main.tsx"]);
const FIRST_CHART_TIMEOUT_MS = 3000;
/** Script names carry the run that created them, so a late error from an earlier run is not blamed on this one. */
const RUN_URL_PREFIX = "live-run-";
const STALE_FRAME_ERROR = /already registered/i;

const post = (message: FrameMessage) => window.parent.postMessage(message, window.location.origin);

SciChart.SciChartSurface.configure({ wasmUrl: new URL("scichart.wasm", window.location.href).href });
if (window.location.hostname.includes("scichart.com"))
    SciChart.SciChartSurface.setRuntimeLicenseKey(RUNTIME_LICENSE_KEY);

const compile = createCompiler(
    (file: ProjectFile) =>
        transform(file.content, {
            transforms: ["typescript", "jsx", "imports"],
            jsxRuntime: "automatic",
            production: true,
            filePath: file.name,
        }).code
);

let currentRun = 0;
let reactRoot: ReactDOMClient.Root | null = null;
let styleElement: HTMLStyleElement | null = null;

const lineOf = (error: unknown) => {
    const match = /\((\d+):\d+\)/.exec(error instanceof Error ? error.message : "");
    return match ? Number(match[1]) : undefined;
};

const report = (phase: "compile" | "runtime" | "teardown", error: unknown, runId = currentRun) => {
    const file = error instanceof ProjectError ? error.file : undefined;
    const message = error instanceof Error ? error.message : String(error);
    post({ type: "error", runId, phase, message, file, line: lineOf(error) });
};

const patchConsole = () => {
    for (const level of ["log", "info", "warn", "error"] as const) {
        const original = console[level].bind(console);
        console[level] = (...args: unknown[]) => {
            original(...args);
            const text = args.map((a) => (typeof a === "string" ? a : safeStringify(a))).join(" ");
            post({ type: "console", runId: currentRun, level, text });
        };
    }
};
const safeStringify = (value: unknown) => {
    if (value instanceof Error) return value.stack ?? value.message;
    try {
        return JSON.stringify(value) ?? String(value);
    } catch {
        return String(value);
    }
};

const teardown = (framework: LiveFramework | null) => {
    try {
        if (reactRoot) {
            reactRoot.unmount();
            reactRoot = null;
        }
        // The JavaScript project's app.ts registers its own dispose on pagehide.
        if (framework !== "react") window.dispatchEvent(new Event("pagehide"));
        return true;
    } catch (error) {
        report("teardown", error);
        return false;
    }
};

let lastFramework: LiveFramework | null = null;

const dispose = () => {
    teardown(lastFramework);
    document.body.replaceChildren();
    if (styleElement) styleElement.textContent = "";
};

const applyTheme = (themeName: string, themeVars: Record<string, string>) => {
    const root = document.documentElement;
    root.dataset.theme = themeName;
    for (const [name, value] of Object.entries(themeVars)) root.style.setProperty(name, value);
};

const waitForFirstChart = () =>
    new Promise<void>((resolve) => {
        const deadline = performance.now() + FIRST_CHART_TIMEOUT_MS;
        const tick = () => {
            if (document.querySelector("canvas") || performance.now() > deadline) resolve();
            else requestAnimationFrame(tick);
        };
        tick();
    });

const run = async (message: Extract<PageMessage, { type: "run" }>) => {
    const started = performance.now();
    currentRun = message.runId;
    // Compile everything before touching the running example: a syntax error is reported with its file and line,
    // and the last working chart stays on screen.
    try {
        for (const file of message.files)
            if (/^src\/.*\.tsx?$/.test(file.name) && !ENTRY_FILES.has(file.name)) compileOrThrow(file);
    } catch (error) {
        report("compile", error instanceof CompileError ? error.projectError : error, message.runId);
        return;
    }
    if (!teardown(lastFramework)) return;
    lastFramework = message.framework;
    applyTheme(message.themeName, message.themeVars);
    document.body.replaceChildren();
    document.body.style.cssText = "margin:0;height:100vh";
    if (!styleElement) {
        styleElement = document.createElement("style");
        document.head.append(styleElement);
    }
    styleElement.textContent = "";

    const loader = createModuleLoader({
        files: message.files,
        compile,
        externals,
        deepModules,
        onStyle: (file) => (styleElement!.textContent += file.content + "\n"),
        sourceUrlPrefix: `${RUN_URL_PREFIX}${message.runId}/`,
    });
    const container = document.createElement("div");
    try {
        if (message.framework === "react") {
            container.id = "root";
            container.style.height = "100%";
            document.body.append(container);
            const App = loader.require(
                findFile(message.files, ["src/App.tsx", "src/App.ts", "src/App.jsx", "src/App.js"])
            ).default;
            reactRoot = ReactDOMClient.createRoot(container);
            reactRoot.render(React.createElement(App));
        } else {
            const html = message.files.find((file) => file.name === "index.html")?.content;
            if (html) {
                const body = new DOMParser().parseFromString(html, "text/html").body;
                body.querySelectorAll("script").forEach((script) => script.remove());
                document.body.append(...Array.from(body.childNodes));
            } else {
                container.id = "chart";
                document.body.append(container);
            }
            loader.require(findFile(message.files, ["src/app.ts", "src/app.js"]));
        }
    } catch (error) {
        if (error instanceof CompileError) report("compile", error.projectError, message.runId);
        // SciChart's type registries live as long as the frame; running the same example again collides with
        // itself. Ask the page for a fresh frame (it does so only if this frame has already run something).
        else
            report(
                STALE_FRAME_ERROR.test(String((error as Error)?.message)) ? "teardown" : "runtime",
                error,
                message.runId
            );
        return;
    }
    await waitForFirstChart();
    if (currentRun === message.runId)
        post({ type: "run-ok", runId: message.runId, duration: performance.now() - started });
};

class CompileError extends Error {
    constructor(public projectError: ProjectError) {
        super(projectError.message);
    }
}
const compileOrThrow = (file: ProjectFile) => {
    try {
        compile(file);
    } catch (error) {
        throw new CompileError(new ProjectError(error instanceof Error ? error.message : String(error), file.name));
    }
};
const findFile = (files: ProjectFile[], candidates: string[]) => {
    const found = candidates.find((name) => files.some((file) => file.name === name));
    if (!found) throw new ProjectError(`The project has no ${candidates[0]}`);
    return found;
};

const isFromEarlierRun = (...sources: unknown[]) => {
    const match = new RegExp(`${RUN_URL_PREFIX}(\\d+)/`).exec(sources.map((source) => String(source ?? "")).join("\n"));
    return match !== null && Number(match[1]) !== currentRun;
};
window.addEventListener("error", (event) => {
    if (isFromEarlierRun(event.filename, event.error?.stack)) return;
    if (event.error || event.message) report("runtime", event.error ?? new Error(event.message));
});
window.addEventListener("unhandledrejection", (event) => {
    if (isFromEarlierRun(event.reason?.stack)) return;
    report("runtime", event.reason);
});
window.addEventListener("message", (event) => {
    if (!isTrustedEvent(event, window.parent, window.location.origin)) return;
    const message = parsePageMessage(event.data);
    if (!message) return;
    if (message.type === "dispose") dispose();
    else void run(message);
});
patchConsole();
post({ type: "ready" });
