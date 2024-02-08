import { resolve, join } from "path";
import type { Configuration } from "webpack";
const CopyPlugin = require("copy-webpack-plugin");

const config: Configuration = {
    mode: "production",
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".css"]
    },
    output: {
        filename: "bundle.js",
        path: resolve(__dirname, "./dist"),
        clean: true
    },
    entry: "./client/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: "client/tsconfig.json"
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "./client/index.html", to: "" },
                { from: "./node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "./node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "./node_modules/scichart/_wasm/scichart3d.data", to: "" },
                { from: "./node_modules/scichart/_wasm/scichart3d.wasm", to: "" }
            ]
        })
    ]
};

export default config;
