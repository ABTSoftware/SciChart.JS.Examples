import * as path from "path";
import { Configuration } from "webpack";
const CopyPlugin = require("copy-webpack-plugin");
import "webpack-dev-server";

const config: Configuration = {
    mode: "development",
    devtool: "source-map",
    entry: "./src/index.ts",
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
        extensions: [".js", ".ts"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "" },
                { from: "src/scichart-logo.svg", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" }
            ]
        })
    ],
    devServer: {
        headers: {
            "Cross-Origin-Opener-Policy": "unsafe-none"
        }
    },
    optimization: {}
};

export default config;
