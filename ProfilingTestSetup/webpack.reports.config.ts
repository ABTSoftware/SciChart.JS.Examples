import * as path from "path";
import { Configuration } from "webpack";
const CopyPlugin = require("copy-webpack-plugin");
import { InlineResourcesPlugin } from "./webpack-plugins/inline-resources-plugin";
import "webpack-dev-server";

const config = (env: any, argv: any): Configuration => {
    const isProduction = argv.mode === "production";

    // Get previous results file path from environment variable or use default
    const previousResultsFile =
        process.env.PREVIOUS_RESULTS_FILE || "test-results-archive/results.previous.json";

    return {
        mode: argv.mode || "development",
        devtool: isProduction ? false : "source-map",
        entry: "./reports/index.ts",
        performance: {
            hints: false
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"]
                }
            ]
        },
        resolve: {
            extensions: [".js", ".ts"],
            alias: {
                "scichart-addons": path.resolve(__dirname, "../Addons")
            }
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "build-reports"),
            publicPath: "/"
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: "reports/index.html", to: "index.html" },
                    { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                    {
                        from: "test-results/results.json",
                        to: "results.json",
                        noErrorOnMissing: false
                    },
                    {
                        from: previousResultsFile,
                        to: "results.previous.json",
                        noErrorOnMissing: true
                    }
                ]
            }),
            new InlineResourcesPlugin({
                inlineJs: isProduction,
                inlineJson: isProduction,
                inlineWasm: isProduction,
                wasmFiles: [{ path: "node_modules/scichart/_wasm/scichart2d.wasm", name: "scichart2d.wasm" }],
                jsonFiles: [
                    { path: "./test-results/results.json", name: "results" },
                    { path: previousResultsFile, name: "results.previous" }
                ]
            })
        ],
        devServer: {
            static: [
                {
                    directory: path.join(__dirname, "build-reports")
                },
                {
                    directory: path.join(__dirname, "test-results"),
                    publicPath: "/",
                    watch: true
                }
            ],
            port: 8081,
            open: true,
            headers: {
                "Cross-Origin-Opener-Policy": "unsafe-none"
            }
            // watchFiles: {
            //     paths: [path.join(__dirname, "test-results", "results.json")],
            //     options: {
            //         usePolling: true,
            //         interval: 1000
            //     }
            // }
        }
    };
};

export default config;
