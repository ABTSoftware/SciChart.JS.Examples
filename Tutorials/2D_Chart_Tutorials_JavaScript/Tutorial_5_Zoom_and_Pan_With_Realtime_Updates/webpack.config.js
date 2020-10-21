const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: "./src/index.js",
    module: {
        rules: []
    },
    resolve: {
        extensions: [".js"]
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build")
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" }
            ]
        }),
        new webpack.IgnorePlugin(/(fs)/)
    ]
};
