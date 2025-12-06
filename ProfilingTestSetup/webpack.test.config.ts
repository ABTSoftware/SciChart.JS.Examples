import * as path from "path";
import { Configuration } from "webpack";
const CopyPlugin = require("copy-webpack-plugin");
import { InlineResourcesPlugin } from "./webpack-plugins/inline-resources-plugin";
import "webpack-dev-server";

const config = (env: any, argv: any): Configuration => {
    const testMode = process.env.TEST_MODE || "url";
    const isProduction = testMode === "file";

    return {
        mode: argv.mode || "development",
        devtool: isProduction ? false : "source-map",
        entry: "./src/indexForTests.ts",
        performance: {
            hints: false
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".js", ".ts"],
            alias: {
            }
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "build"),
            publicPath: "/"
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: "src/testIndex.html", to: "index.html" },
                    { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                    { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" }
                ]
            }),
            new InlineResourcesPlugin({
                inlineJs: isProduction,
                inlineJson: isProduction,
                inlineWasm: isProduction,
                wasmFiles: [{ path: "./node_modules/scichart/_wasm/scichart2d.wasm", name: "scichart2d.wasm" }]
            })
        ],
        devServer: {
            headers: {
                "Cross-Origin-Opener-Policy": "unsafe-none"
            }
        },
        optimization: {}
    };
};

export default config;
