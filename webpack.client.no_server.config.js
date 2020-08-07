const { merge } = require("webpack-merge");
const webpackClientConfig = require("./webpack.client.config.js");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = merge(webpackClientConfig, {
    mode: "development",
    devtool: "inline-source-map",
    watch: true,
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/static/favicon.ico", to: "" },
                { from: "src/static/no_server.index.html", to: "index.html" },
                { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
            ],
        }),
        new webpack.IgnorePlugin(/(fs)/),
    ],
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
    },
});
