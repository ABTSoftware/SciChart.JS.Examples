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
                { from: "src/static/no_server.index.html", to: "index.html" }
            ],
        })
    ],
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
    },
});
