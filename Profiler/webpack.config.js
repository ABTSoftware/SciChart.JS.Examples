const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "development",
    entry: "./src/index.tsx",
    performance: {
        hints: false
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.svg$/,
                type: "asset/resource"
            }
        ]
    },
    resolve: {
        extensions: [".js", ".ts", ".tsx"],
        alias: {}
    },
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "build"),
        clean: true
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "src/index.html", to: "" },
                { from: "node_modules/scichart/_wasm/scichart2d.wasm", to: "" },
                { from: "node_modules/scichart/_wasm/scichart3d.wasm", to: "" }
            ]
        })
    ],
    devServer: {
        client: {
            overlay: {
                warnings: false,
                errors: true
            }
        },
        // static: "./dist",
        headers: {
            "Cross-Origin-Embedder-Policy": "require-corp",
            "Cross-Origin-Opener-Policy": "same-origin"
        }
    }
};
