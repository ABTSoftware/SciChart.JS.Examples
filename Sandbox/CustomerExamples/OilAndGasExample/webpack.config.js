const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: "production",
    entry: "./src/charts/VerticalCharts/initVerticalCharts.ts",
    // entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
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
                // { from: "src/index.html", to: "" },
                { from: "src/indexVerticalCharts.html", to: "index.html" },
                { from: "src/Data/Shale.csv", to: "" },
                { from: "src/Data/Density.csv", to: "" },
                { from: "src/Data/Resistivity.csv", to: "" },
                { from: "src/Data/PoreSpace.csv", to: "" },
                { from: "src/Data/Sonic.csv", to: "" },
                { from: "src/Data/Texture.csv", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" }
            ]
        })
    ]
};
