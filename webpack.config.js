const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const config = require("./config/default");

module.exports = {
    entry: "./src/index.tsx",
    devtool: "inline-source-map",
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
                { from: "../wasm-build/SCRTSample2D.data", to: "" },
                { from: "../wasm-build/SCRTSample2D.wasm", to: "" },
                { from: "../wasm-build/SCRTSample3D.data", to: "" },
                { from: "../wasm-build/SCRTSample3D.wasm", to: "" }
            ]
        }),
        new webpack.IgnorePlugin(/(fs)/)
    ],
    devServer: {
        disableHostCheck: true,
        proxy: {
            "/": {
                target: "http://localhost:3000"
            }
        }
    }
};
