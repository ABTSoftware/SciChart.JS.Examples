const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    mode: "development",
    entry: "./src/index.js",
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            // Serve .ttf files
            {
                test: /\.ttf$/,
                use: {
                    loader: "url-loader",
                    options: { mimetype: "application/font-ttf" }
                }
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
                // Copy the font to the root of the output location
                { from: "src/jokerman.ttf", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.data", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" }
            ]
        }),
    ],
    devServer: {
        client: {
            overlay: {
                warnings: false,
                errors: true
            }
        }
    }
};
