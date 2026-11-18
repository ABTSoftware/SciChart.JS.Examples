// Builds the live frame runtime (src/liveRuntime/runtime.ts) with esbuild.
//
//   node scripts/buildLiveRuntime.cjs        writes build/live-runtime.<hash>.js and build/live-frame.html
//
// The dev middleware calls createLiveRuntimeBuilder() and serves the same output from memory.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const esbuild = require("esbuild");

const root = path.resolve(__dirname, "..");

const options = (minify) => ({
    entryPoints: [path.join(root, "src/liveRuntime/runtime.ts")],
    bundle: true,
    format: "iife",
    minify,
    write: false,
    sourcemap: false,
    nodePaths: [path.join(root, "node_modules")],
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "error",
});

const frameHtml = (scriptName) =>
    `<!doctype html>\n<html><head><meta charset="utf-8"><title>Live preview</title></head><body><script src="${scriptName}"></script></body></html>\n`;

const toOutput = (result) => {
    const code = Buffer.from(result.outputFiles[0].contents);
    const hash = crypto.createHash("sha256").update(code).digest("hex").slice(0, 10);
    const scriptName = `live-runtime.${hash}.js`;
    return { code, scriptName, html: frameHtml(scriptName) };
};

const buildOnce = async (minify = true) => toOutput(await esbuild.build(options(minify)));

/** Incremental builder for the dev server: rebuilds are cheap and only run when asked for. */
const createLiveRuntimeBuilder = () => {
    let context;
    return async () => {
        context ||= await esbuild.context(options(false));
        return toOutput(await context.rebuild());
    };
};

module.exports = { buildOnce, createLiveRuntimeBuilder };

if (require.main === module) {
    buildOnce().then(({ code, scriptName, html }) => {
        const dir = path.join(root, require("../config/default").buildConfig.targetDir);
        fs.mkdirSync(dir, { recursive: true });
        for (const old of fs.readdirSync(dir)) if (/^live-runtime\..*\.js$/.test(old)) fs.rmSync(path.join(dir, old));
        fs.writeFileSync(path.join(dir, scriptName), code);
        fs.writeFileSync(path.join(dir, "live-frame.html"), html);
        console.log(`${scriptName} ${(code.length / 1e6).toFixed(2)} MB`);
    });
}
