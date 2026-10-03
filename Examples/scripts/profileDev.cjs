// npm run dev:profile: timings and sampled Node memory, no browser heap included.
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const config = require("../webpack.client.no_server.config.cjs");
const compiler = webpack({ ...config, stats: "errors-warnings" });
let peakRss = 0;
const sample = setInterval(() => {
    peakRss = Math.max(peakRss, process.memoryUsage().rss);
}, 250);
compiler.hooks.compile.tap("ProfileDev", () => {
    peakRss = process.memoryUsage().rss;
});
compiler.hooks.done.tap("ProfileDev", (stats) => {
    const memory = process.memoryUsage();
    const bundle = stats.compilation.getAsset("bundle.js");
    const mib = (value) => Math.round(value / 1024 / 1024);
    console.log(
        JSON.stringify({
            compileMs: stats.endTime - stats.startTime,
            modules: stats.compilation.modules.size,
            heapMiB: mib(memory.heapUsed),
            rssMiB: mib(memory.rss),
            sampledPeakRssMiB: mib(Math.max(peakRss, memory.rss)),
            mainBundleMiB: bundle ? +(bundle.source.size() / 1024 / 1024).toFixed(2) : null,
        })
    );
});
const server = new WebpackDevServer({ ...config.devServer, setupExitSignals: false }, compiler);
const stop = async () => {
    clearInterval(sample);
    await server.stop();
    await new Promise((resolve, reject) => compiler.close((error) => (error ? reject(error) : resolve())));
    process.exit(0);
};
process.once("SIGINT", stop);
process.once("SIGTERM", stop);
server.start().catch((error) => {
    clearInterval(sample);
    console.error(error);
    process.exitCode = 1;
});
