const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Exercise the real CSS/asset rules without rebuilding every chart or copying example sources.
async function check() {
    const output = await fs.mkdtemp(path.join(os.tmpdir(), "scichart-css-assets-"));
    try {
        for (const name of ["client", "server"]) {
            const config = require(`../webpack.${name}.config.js`);
            const outputPath = path.join(output, name);
            await new Promise((resolve, reject) => {
                webpack(
                    {
                        ...config,
                        context: path.resolve(__dirname, ".."),
                        entry: "./src/components/Examples/styles/sc-editor.css",
                        output: { path: outputPath, filename: "bundle.js" },
                        plugins: [new MiniCssExtractPlugin({ filename: "style.css" })],
                    },
                    (error, stats) => {
                        if (error) reject(error);
                        else if (stats.hasErrors()) reject(new Error(stats.toString({ all: false, errors: true })));
                        else resolve();
                    }
                );
            });
            const css = await fs.readFile(path.join(outputPath, "style.css"), "utf8");
            const urls = [...css.matchAll(/url\(["']?([^\s"')]+\.svg)["']?\)/g)].map((match) => match[1]);
            assert(urls.length > 0, `${name}: no SVG URLs found`);
            for (const url of urls) {
                for (const base of ["/", "/demo/"]) {
                    assert.equal(
                        new URL(url, `http://localhost${base}style.css`).pathname,
                        `${base}images/${path.basename(url)}`,
                        `${name}: SVG escaped the application base`
                    );
                }
                if (name === "client") await fs.access(path.join(outputPath, url));
            }
            console.log(`${name}: extracted SVG URLs resolve under the application base`);
        }
    } finally {
        await fs.rm(output, { recursive: true, force: true });
    }
}

check().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
