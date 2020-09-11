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
                { from: "node_modules/scichart3d/_wasm/scichart3d.data", to: "" },
                { from: "node_modules/scichart3d/_wasm/scichart3d.wasm", to: "" }
            ]
        }),
        new webpack.IgnorePlugin(/(fs)/)
    ]
};
