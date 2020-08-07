const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const config = require("./config/default");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
    mode: "production",
    entry: "./src/index.tsx",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.(jpg|png)$/,
                use: {
                    loader: "url-loader"
                }
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, config.buildConfig.targetDir)
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/static/", to: "" },
                // { from: "node_modules/scichart/_wasm/", to: "" },
                { from: "../wasm-build/scichart2d.data", to: "" },
                { from: "../wasm-build/scichart2d.wasm", to: "" }
            ]
        }),
        new webpack.IgnorePlugin(/(fs)/)
    ]
};
